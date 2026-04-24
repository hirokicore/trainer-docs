import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateDocument, getGenerationEngine, formatFreeTextNotes, formatFallbackNotes } from '@/lib/gemini';
import { saveGenerationLog } from '@/lib/generation-log';
import { buildStructuredNotesText } from '@/lib/special-terms';
import { DOCUMENT_TYPE_LABELS, PRO_ONLY_DOCUMENT_TYPES, FREE_TOTAL_LIMIT, type TrainerFormData } from '@/types';

// Edge runtime は最大 25 秒のため、Gemini 生成（training_contract 等）がタイムアウトする。
// Node.js runtime に変更し、最大 60 秒を確保する。
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // 未認証は user_id がないためログ対象外
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  // サブスクリプション & 利用制限チェック
  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from('profiles').select('subscription_status, plan').eq('id', user.id).single(),
    supabase
      .from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ]);

  const isSubscribed =
    profile?.subscription_status === 'active' ||
    profile?.subscription_status === 'trialing';
  const documentCount = count ?? 0;

  if (!isSubscribed && documentCount >= FREE_TOTAL_LIMIT) {
    // 利用上限超過はテンプレート選択前のため、ここではログしない
    return NextResponse.json(
      { error: `フリープランの生成上限（累計${FREE_TOTAL_LIMIT}件）に達しました。有料プランにアップグレードしてください。` },
      { status: 403 }
    );
  }

  let formData: TrainerFormData;
  try {
    formData = await request.json();
  } catch {
    // リクエストパース失敗は書類種別が不明なためログしない
    return NextResponse.json({ error: 'リクエストデータが不正です' }, { status: 400 });
  }

  // ── ここから document_type が確定したので、以降の全パスでログを記録する ──

  const isProTemplate = PRO_ONLY_DOCUMENT_TYPES.has(formData.documentType);
  const engine = getGenerationEngine(formData.documentType);
  const start = Date.now();

  const isPro = profile?.plan === 'pro';

  // ── Proプラン専用テンプレートのアクセス制御 ──
  if (!isPro && isProTemplate) {
    await saveGenerationLog(supabase, {
      user_id: user.id,
      document_type: formData.documentType,
      template_id: formData.documentType,
      is_subscribed: isSubscribed,
      is_pro_template: isProTemplate,
      status: 'error',
      error_code: 'FORBIDDEN_PRO_TEMPLATE',
      duration_ms: Date.now() - start,
      engine,
      request_origin: 'web',
    });
    return NextResponse.json(
      { error: 'このテンプレートはProプラン専用です。アップグレードしてご利用ください。' },
      { status: 403 }
    );
  }

  // ── バリデーション ──
  // 入会申込書・キャンセルポリシー同意書はクライアント名を書類固有データから取得するため commonRequired から除外
  const skipClientName = ['membership_form', 'cancellation_policy', 'termination_coolingoff_policy', 'effect_non_guarantee_policy', 'health_check'].includes(formData.documentType);
  const commonRequired: (keyof TrainerFormData)[] = [
    'trainerName', 'businessName', 'address', 'phone', 'email',
    'documentType',
    ...(skipClientName ? [] : ['clientName' as const]),
  ];
  // 免責同意書・入会申込書・キャンセルポリシー同意書は契約固有フィールドを使わないためスキップ
  const contractRequired: (keyof TrainerFormData)[] =
    ['liability_waiver', 'membership_form', 'cancellation_policy', 'termination_coolingoff_policy', 'effect_non_guarantee_policy', 'health_check'].includes(formData.documentType)
      ? []
      : ['contractStartDate', 'contractEndDate', 'sessionFee', 'sessionCount'];

  for (const field of [...commonRequired, ...contractRequired]) {
    if (!formData[field]) {
      return NextResponse.json({ error: `${field} は必須項目です` }, { status: 400 });
    }
  }

  // ── 特記事項のマージ ──
  // 1. 選択式特記事項 → テンプレ文に変換
  const structuredText = formData.specialTerms
    ? buildStructuredNotesText(formData.specialTerms)
    : '';

  // 2. 自由入力 → Gemini で条文整形（エラーは無視してそのまま使用）
  let formattedFreeText = '';
  if (formData.freeTextNotes?.trim()) {
    try {
      formattedFreeText = await formatFreeTextNotes(formData.freeTextNotes);
    } catch {
      formattedFreeText = formatFallbackNotes(formData.freeTextNotes);
    }
  }

  // 3. 統合して formData.notes に書き込む
  const mergedParts = [structuredText, formattedFreeText].filter(Boolean);
  const processedFormData: TrainerFormData = {
    ...formData,
    notes: mergedParts.length > 0 ? mergedParts.join('\n\n') : 'なし',
  };

  // ── 生成処理 ──
  try {
    const content = await generateDocument(processedFormData);
    const durationMs = Date.now() - start;

    const clientDisplayName =
      processedFormData.documentType === 'membership_form'
        ? (processedFormData.membershipFormData?.client_name ?? processedFormData.clientName)
        : processedFormData.documentType === 'cancellation_policy'
        ? (processedFormData.cancellationPolicyData?.client_name ?? processedFormData.clientName)
        : processedFormData.documentType === 'termination_coolingoff_policy'
        ? (processedFormData.terminationCoolingOffData?.client_name ?? processedFormData.clientName)
        : processedFormData.documentType === 'effect_non_guarantee_policy'
        ? (processedFormData.effectNonGuaranteeData?.client_name ?? processedFormData.clientName)
        : processedFormData.documentType === 'health_check'
        ? (processedFormData.healthCheckData?.client_name ?? processedFormData.clientName)
        : processedFormData.clientName;
    const title =
      processedFormData.documentType === 'termination_coolingoff_policy'
        ? `途中解約・クーリングオフ同意書（${clientDisplayName}様）`
        : `${DOCUMENT_TYPE_LABELS[processedFormData.documentType]}（${clientDisplayName}）`;

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        document_type: processedFormData.documentType,
        title,
        content,
        form_data: processedFormData,
      })
      .select('id')
      .single();

    if (error) throw error;

    // 成功ログ（ログ失敗はレスポンスに影響しない）
    await saveGenerationLog(supabase, {
      user_id: user.id,
      document_type: processedFormData.documentType,
      template_id: processedFormData.documentType,
      is_subscribed: isSubscribed,
      is_pro_template: isProTemplate,
      status: 'success',
      duration_ms: durationMs,
      engine,
      request_origin: 'web',
    });

    return NextResponse.json({ id: data.id });
  } catch (err: unknown) {
    console.error('Document generation error:', err);

    // Gemini API エラーの判定（503 / 429 / API キーエラーなど）
    const errMsg = err instanceof Error ? err.message : '';
    const isGeminiError =
      errMsg.includes('503') ||
      errMsg.includes('429') ||
      errMsg.includes('GOOGLE') ||
      errMsg.includes('GoogleGenerativeAI') ||
      (typeof err === 'object' && err !== null && 'status' in err &&
        ((err as { status: number }).status === 503 || (err as { status: number }).status === 429));

    // 失敗ログ（ログ失敗はレスポンスに影響しない）
    await saveGenerationLog(supabase, {
      user_id: user.id,
      document_type: formData.documentType,
      template_id: formData.documentType,
      is_subscribed: isSubscribed,
      is_pro_template: isProTemplate,
      status: 'error',
      error_code: isGeminiError ? 'GEMINI_ERROR' : 'UNKNOWN_ERROR',
      duration_ms: Date.now() - start,
      engine,
      request_origin: 'web',
    });

    const message = err instanceof Error ? err.message : '書類の生成に失敗しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
