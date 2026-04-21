import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cancelSubscription } from '@/lib/stripe';

export const runtime = 'edge';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_subscription_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_subscription_id) {
    return NextResponse.json({ error: 'サブスクリプションが見つかりません' }, { status: 404 });
  }

  await cancelSubscription(profile.stripe_subscription_id);
  return NextResponse.json({ ok: true });
}
