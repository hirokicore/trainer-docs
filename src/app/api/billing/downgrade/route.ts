import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSubscription, downgradeToStandard, resolvePlan } from '@/lib/stripe';

export const runtime = 'edge';

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_subscription_id, plan')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_subscription_id) {
    return NextResponse.json({ error: 'サブスクリプションが見つかりません' }, { status: 404 });
  }

  if (profile.plan !== 'pro') {
    return NextResponse.json({ error: 'Proプランのみダウングレードできます' }, { status: 400 });
  }

  const sub = await getSubscription(profile.stripe_subscription_id);
  const itemId = sub.items.data[0]?.id;
  if (!itemId) {
    return NextResponse.json({ error: 'サブスクリプションアイテムが見つかりません' }, { status: 500 });
  }

  const updated = await downgradeToStandard(profile.stripe_subscription_id, itemId);

  // Webhook 到達前に Supabase を先行更新（Webhook でも上書きされる）
  const newPriceId = updated.items.data[0]?.price.id;
  const newPlan = resolvePlan(newPriceId);
  await supabase
    .from('profiles')
    .update({ plan: newPlan })
    .eq('id', user.id);

  return NextResponse.json({ ok: true, plan: newPlan });
}
