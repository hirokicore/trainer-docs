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

  try {
    const url = await createCheckoutSession(
      user.id,
      user.email!,
      profile?.stripe_customer_id ?? undefined
    );
    return NextResponse.redirect(url);
  } catch (err) {
    console.error('Stripe checkout error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.redirect(new URL(`/dashboard?error=checkout&message=${encodeURIComponent(errorMessage)}`, request.url));
  }
}
