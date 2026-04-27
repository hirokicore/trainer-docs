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
  // ── 1. リクエスト body パース ──────────────────────────────────
  let body: { message: string; contact?: string; usage_status?: string };
  try {
    body = await request.json();
  } catch (parseErr) {
    console.error('[monitors/apply] JSON parse error:', parseErr);
    return NextResponse.json({ error: 'リクエストデータが不正です' }, { status: 400 });
  }
  console.log('[monitors/apply] request body:', JSON.stringify(body));

  const { message, contact = '', usage_status = '' } = body;

  if (!message || !message.trim()) {
    return NextResponse.json({ error: 'ご意見・ご要望を入力してください' }, { status: 400 });
  }

  // ── 2. insert payload 組み立て ─────────────────────────────────
  // email は UNIQUE 制約あり。未入力時は衝突しにくい一意な値を生成。
  const emailValue =
    contact.trim() || `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  const payload = {
    name: '匿名',
    email: emailValue,
    activity_status: usage_status.trim() || '未回答',
    message: message.trim(),
    // status の CHECK 制約: ('pending', 'approved', 'rejected')
    status: 'pending',
  };
  console.log('[monitors/apply] insert payload:', JSON.stringify(payload));

  // ── 3. Supabase insert ─────────────────────────────────────────
  let supabaseErr: { code?: string; message?: string; details?: string; hint?: string } | null =
    null;
  try {
    const supabase = await createClient();

    // .select() なし → PostgREST は Prefer: return=minimal で 204 を返す。
    // SELECT policy が anon に付いていないので .select() を追加すると 406 になる可能性あり。
    const { data, error } = await supabase.from('monitor_applications').insert(payload);

    console.log('[monitors/apply] supabase data:', JSON.stringify(data));
    console.log('[monitors/apply] supabase error:', JSON.stringify(error));

    if (error) {
      supabaseErr = {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: (error as { hint?: string }).hint ?? undefined,
      };
      console.error('[monitors/apply] Supabase insert failed:', supabaseErr);

      return NextResponse.json(
        {
          error: 'apply failed',
          message: error.message,
          supabaseError: supabaseErr,
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error('[monitors/apply] unexpected exception:', err);
    return NextResponse.json(
      {
        error: 'apply failed',
        message: err instanceof Error ? err.message : String(err),
        supabaseError: null,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
