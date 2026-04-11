import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  let body: {
    name: string;
    email: string;
    activity_status: string;
    message: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'リクエストデータが不正です' }, { status: 400 });
  }

  const { name, email, activity_status, message } = body;

  if (!name || !email || !activity_status || !message) {
    return NextResponse.json({ error: '必須項目をすべて入力してください' }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'メールアドレスの形式が正しくありません' }, { status: 400 });
  }

  const supabase = await createClient();

  const { error: existingError, data: existing } = await supabase
    .from('monitor_applications')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingError) {
    console.error('Monitor application lookup error:', existingError);
    return NextResponse.json({ error: '申請の確認中にエラーが発生しました' }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json({ error: 'このメールアドレスはすでに応募済みです' }, { status: 409 });
  }

  const { error } = await supabase.from('monitor_applications').insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    activity_status: activity_status.trim(),
    message: message.trim(),
    status: 'pending',
  });

  if (error) {
    console.error('Monitor application insert error:', error);
    return NextResponse.json({ error: '応募の送信に失敗しました。しばらく時間をおいて再度お試しください。' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
