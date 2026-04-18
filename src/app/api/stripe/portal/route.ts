import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPortalSession } from '@/lib/stripe';

// Stripe SDK は Node.js ランタイムで実行する
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  try {
    const url = await createPortalSession(profile.stripe_customer_id);
    return NextResponse.redirect(url);
  } catch (err) {
    console.error('Portal session error:', err);
    return NextResponse.redirect(new URL('/dashboard?error=portal', request.url));
  }
}
