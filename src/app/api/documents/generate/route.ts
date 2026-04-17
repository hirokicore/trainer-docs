import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateDocument } from '@/lib/gemini';
import { DOCUMENT_TYPE_LABELS, PRO_ONLY_DOCUMENT_TYPES, type TrainerFormData } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
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

  if (!isSubscribed && documentCount >= 3) {
    return NextResponse.json(
      { error: 'フリープランの生成上限（3件）に達しました。プロプランにアップグレードしてください。' },
      { status: 403 }
    );
  }

  let formData: TrainerFormData;
  try {
    formData = await request.json();
  } catch {
    return NextResponse.json({ error: 'リクエストデータが不正です' }, { status: 400 });
  }

  // Proプラン専用テンプレートへのアクセスをFreeユーザーから保護
  if (!isSubscribed && PRO_ONLY_DOCUMENT_TYPES.has(formData.documentType)) {
    return NextResponse.json(
      { error: 'このテンプレートはProプラン専用です。アップグレードしてご利用ください。' },
      { status: 403 }
    );
  }

  // バリデーション
  const required: (keyof TrainerFormData)[] = [
    'trainerName', 'businessName', 'address', 'phone', 'email',
    'clientName', 'contractStartDate', 'contractEndDate',
    'sessionFee', 'sessionCount', 'documentType',
  ];

  for (const field of required) {
    if (!formData[field]) {
      return NextResponse.json({ error: `${field} は必須項目です` }, { status: 400 });
    }
  }

  try {
    const content = await generateDocument(formData);

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

    return NextResponse.json({ id: data.id });
  } catch (err: unknown) {
    console.error('Document generation error:', err);
    const message = err instanceof Error ? err.message : '書類の生成に失敗しました';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
