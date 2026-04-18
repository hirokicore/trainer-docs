import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/stripe';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', '/api/stripe/checkout');
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  // ?plan=standard | pro（省略時は pro へフォールバック）
  const plan = request.nextUrl.searchParams.get('plan') ?? 'pro';

  // プランに対応する Stripe Price ID を解決する。
  // .env.local に STRIPE_STANDARD_PRICE_ID / STRIPE_PRO_PRICE_ID を設定すること。
  // 未設定時は廃止予定の NEXT_PUBLIC_STRIPE_PRICE_ID へフォールバック。
  const priceId =
    plan === 'standard'
      ? (process.env.STRIPE_STANDARD_PRICE_ID ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!)
      : (process.env.STRIPE_PRO_PRICE_ID ?? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!);

  try {
    const url = await createCheckoutSession(
      user.id,
      user.email!,
      profile?.stripe_customer_id ?? undefined,
      priceId
    );
    return NextResponse.redirect(url);
  } catch (err) {
    console.error('Stripe checkout error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.redirect(new URL(`/dashboard?error=checkout&message=${encodeURIComponent(errorMessage)}`, request.url));
  }
}
