import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  let body: { message: string; contact?: string; usage_status?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'リクエストデータが不正です' }, { status: 400 });
  }

  const { message, contact = '', usage_status = '' } = body;

  if (!message || !message.trim()) {
    return NextResponse.json({ error: 'ご意見・ご要望を入力してください' }, { status: 400 });
  }

  const supabase = await createClient();

  // contact は任意項目。email カラムは NOT NULL のため未入力時は匿名識別子を格納する。
  // feedback_submissions.email に UNIQUE 制約はないため、同一アドレスの複数送信も可。
  const emailValue = contact.trim() || `anon_${crypto.randomUUID()}`;

  const { error } = await supabase.from('feedback_submissions').insert({
    name: '匿名',
    email: emailValue,
    activity_status: usage_status.trim() || '未回答',
    message: message.trim(),
    status: 'pending',
  });

  if (error) {
    console.error('[feedback/submit] Supabase insert error:', {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    return NextResponse.json(
      { error: '送信に失敗しました。しばらく時間をおいて再度お試しください。' },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
