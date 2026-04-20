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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  console.log('[webhook] supabase url:', url ? url.slice(0, 30) + '...' : 'MISSING');
  console.log('[webhook] service_role key head:', key ? key.slice(0, 20) + '...' : 'MISSING');
  return createServerClient(url, key, { cookies: { getAll: () => [], setAll: () => {} } });
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
        console.log('[webhook] checkout.session.completed');
        console.log('[webhook]   session.id        :', session.id);
        console.log('[webhook]   metadata.userId   :', userId ?? 'MISSING');
        console.log('[webhook]   session.customer  :', session.customer);
        console.log('[webhook]   session.subscription:', session.subscription);
        console.log('[webhook]   session.mode      :', session.mode);
        if (!userId || session.mode !== 'subscription') {
          console.log('[webhook]   → skipped (no userId or not subscription mode)');
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0]?.price.id;
        const plan = resolvePlan(priceId);
        console.log('[webhook]   subscription.id   :', subscription.id);
        console.log('[webhook]   priceId           :', priceId ?? 'MISSING');
        console.log('[webhook]   resolved plan     :', plan);

        const { data, error } = await supabase.from('profiles').update({
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          subscription_status: 'active',
          plan,
          active: true,
        }).eq('id', userId).select();
        console.log('[webhook]   update data       :', JSON.stringify(data));
        console.log('[webhook]   update error      :', error ? JSON.stringify(error) : 'null');
        console.log('[webhook]   rows updated      :', Array.isArray(data) ? data.length : 'unknown');
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const isActive = subscription.status === 'active';
        const priceId = subscription.items.data[0]?.price.id;
        const plan = isActive ? resolvePlan(priceId) : 'free';
        console.log('[webhook] customer.subscription.updated');
        console.log('[webhook]   subscription.id   :', subscription.id);
        console.log('[webhook]   status            :', subscription.status);
        console.log('[webhook]   isActive          :', isActive);
        console.log('[webhook]   priceId           :', priceId ?? 'MISSING');
        console.log('[webhook]   resolved plan     :', plan);
        console.log('[webhook]   eq condition      : stripe_subscription_id =', subscription.id);

        const { data, error } = await supabase.from('profiles').update({
          subscription_status: subscription.status as string,
          plan,
          active: isActive,
        }).eq('stripe_subscription_id', subscription.id).select();
        console.log('[webhook]   update data       :', JSON.stringify(data));
        console.log('[webhook]   update error      :', error ? JSON.stringify(error) : 'null');
        console.log('[webhook]   rows updated      :', Array.isArray(data) ? data.length : 'unknown');
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('[webhook] customer.subscription.deleted');
        console.log('[webhook]   subscription.id   :', subscription.id);
        console.log('[webhook]   eq condition      : stripe_subscription_id =', subscription.id);

        const { data, error } = await supabase.from('profiles').update({
          subscription_status: 'inactive',
          stripe_subscription_id: null,
          plan: 'free',
          active: false,
        }).eq('stripe_subscription_id', subscription.id).select();
        console.log('[webhook]   update data       :', JSON.stringify(data));
        console.log('[webhook]   update error      :', error ? JSON.stringify(error) : 'null');
        console.log('[webhook]   rows updated      :', Array.isArray(data) ? data.length : 'unknown');
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
