import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe, resolvePlan } from '@/lib/stripe';

export const runtime = 'edge';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized', step: 'auth' }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message, step: 'profile_fetch' }, { status: 500 });
  }

  // stripe_customer_id が未保存の場合はメールで検索
  let customerId = profile?.stripe_customer_id as string | undefined;
  if (!customerId) {
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    customerId = customers.data[0]?.id;
  }

  if (!customerId) {
    return NextResponse.json({ plan: 'free', synced: false, step: 'no_customer', email: user.email });
  }

  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  const subscription = subscriptions.data[0];

  if (!subscription) {
    const { error: updateError } = await supabase.from('profiles').update({
      stripe_customer_id: customerId,
      plan: 'free',
      active: false,
      subscription_status: 'inactive',
    }).eq('id', user.id);

    return NextResponse.json({
      plan: 'free',
      synced: true,
      step: 'no_active_subscription',
      customerId,
      updateError: updateError?.message ?? null,
    });
  }

  const priceId = subscription.items.data[0]?.price.id;
  const plan = resolvePlan(priceId);

  const { error: updateError } = await supabase.from('profiles').update({
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    plan,
    active: true,
  }).eq('id', user.id);

  return NextResponse.json({
    plan,
    synced: true,
    step: 'updated',
    customerId,
    subscriptionId: subscription.id,
    priceId,
    updateError: updateError?.message ?? null,
  });
}
