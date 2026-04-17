import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateDocument, getGenerationEngine } from '@/lib/gemini';
import { saveGenerationLog } from '@/lib/generation-log';
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
    supabase.from('profiles').select('subscription_status').eq('id', user.id).single(),
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

  // ── Proプラン専用テンプレートのアクセス制御 ──
  if (!isSubscribed && isProTemplate) {
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
  const required: (keyof TrainerFormData)[] = [
    'trainerName', 'businessName', 'address', 'phone', 'email',
    'clientName', 'contractStartDate', 'contractEndDate',
    'sessionFee', 'sessionCount', 'documentType',
  ];

  for (const field of required) {
    if (!formData[field]) {
      // 入力不足はバリデーションエラー。生成を試みていないためログしない。
      return NextResponse.json({ error: `${field} は必須項目です` }, { status: 400 });
    }
  }

  // ── 生成処理 ──
  try {
    const content = await generateDocument(formData);
    const durationMs = Date.now() - start;

    const title = `${DOCUMENT_TYPE_LABELS[formData.documentType]}（${formData.clientName}）`;

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        document_type: formData.documentType,
        title,
        content,
        form_data: formData,
      })
      .select('id')
      .single();

    if (error) throw error;

    // 成功ログ（ログ失敗はレスポンスに影響しない）
    await saveGenerationLog(supabase, {
      user_id: user.id,
      document_type: formData.documentType,
      template_id: formData.documentType,
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
