import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@supabase/ssr';
import Stripe from 'stripe';

function resolvePlan(priceId: string | undefined): 'standard' | 'pro' | 'free' {
  if (!priceId) return 'free';
  const ids = {
    standard: [process.env.STRIPE_STANDARD_PRICE_ID, process.env.STRIPE_STANDARD_TEST_PRICE_ID],
    pro:      [process.env.STRIPE_PRO_PRICE_ID,      process.env.STRIPE_PRO_TEST_PRICE_ID],
  };
  if (ids.standard.includes(priceId)) return 'standard';
  if (ids.pro.includes(priceId))      return 'pro';
  return 'free';
}

export const runtime = 'edge';

// Supabase admin client（webhook ルートではクッキー不要）
function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId || session.mode !== 'subscription') break;

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const plan = resolvePlan(subscription.items.data[0]?.price.id);

        await supabase.from('profiles').update({
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          subscription_status: 'active',
          plan,
          active: true,
        }).eq('id', userId);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const isActive = subscription.status === 'active';
        const plan = isActive ? resolvePlan(subscription.items.data[0]?.price.id) : 'free';

        await supabase.from('profiles').update({
          subscription_status: subscription.status as string,
          plan,
          active: isActive,
        }).eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase.from('profiles').update({
          subscription_status: 'inactive',
          stripe_subscription_id: null,
          plan: 'free',
          active: false,
        }).eq('stripe_subscription_id', subscription.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription?.id;

        if (subscriptionId) {
          await supabase.from('profiles').update({
            subscription_status: 'inactive',
            plan: 'free',
            active: false,
          }).eq('stripe_subscription_id', subscriptionId);
        }
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
