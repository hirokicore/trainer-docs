import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// TODO: DBスキーマ migration が可能になったら monitor_applications テーブルを
//       feedback_submissions などに置き換え、カラムも整理する。
//       現状は既存テーブルに以下のようにマッピングして保存:
//         name          ← '匿名'（固定）
//         email         ← contact（任意入力）
//         activity_status ← usage_status（任意選択）
//         message       ← message（必須）

export async function POST(request: NextRequest) {
  let body: {
    message: string;
    contact?: string;
    usage_status?: string;
  };

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

  // email は UNIQUE 制約があるため、未入力時は衝突しにくい一意な値を生成
  const emailValue = contact.trim() || `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const { error } = await supabase.from('monitor_applications').insert({
    name: '匿名',
    email: emailValue,
    activity_status: usage_status.trim() || '未回答',
    message: message.trim(),
    // status の CHECK 制約: ('pending', 'approved', 'rejected')
    status: 'pending',
  });

  if (error) {
    console.error('[monitors/apply] Supabase insert error:', {
      code: error.code,
      message: error.message,
      details: error.details,
    });
    return NextResponse.json({ error: '送信に失敗しました。しばらく時間をおいて再度お試しください。' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
