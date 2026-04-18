import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCheckoutSession } from '@/lib/stripe';

// Cloudflare Pages は全ルートが Workers (Edge) 実行のため maxDuration は参考値
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const debugMode = request.nextUrl.searchParams.get('debug') === '1';

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

  // プランに対応する Stripe Price ID を解決する
  const standardPriceId = process.env.STRIPE_STANDARD_PRICE_ID;
  const proPriceId = process.env.STRIPE_PRO_PRICE_ID;
  const legacyPriceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
  const secretKeyHead = process.env.STRIPE_SECRET_KEY
    ? process.env.STRIPE_SECRET_KEY.slice(0, 7) + '...'
    : 'MISSING';

  const priceId =
    plan === 'standard'
      ? (standardPriceId ?? legacyPriceId)
      : (proPriceId ?? legacyPriceId);

  console.log('[checkout] plan:', plan);
  console.log('[checkout] STRIPE_STANDARD_PRICE_ID:', standardPriceId ?? 'MISSING');
  console.log('[checkout] STRIPE_PRO_PRICE_ID:', proPriceId ?? 'MISSING');
  console.log('[checkout] NEXT_PUBLIC_STRIPE_PRICE_ID (legacy):', legacyPriceId ?? 'MISSING');
  console.log('[checkout] resolved priceId:', priceId ?? 'UNDEFINED');
  console.log('[checkout] STRIPE_SECRET_KEY head:', secretKeyHead);
  console.log('[checkout] userId:', user.id);
  console.log('[checkout] customerId:', profile?.stripe_customer_id ?? 'none');

  if (!priceId) {
    const reason = 'priceId が解決できませんでした。Cloudflare Pages の環境変数に STRIPE_STANDARD_PRICE_ID / STRIPE_PRO_PRICE_ID を設定してください。';
    console.error('[checkout] FATAL:', reason);
    if (debugMode) {
      return NextResponse.json({ error: reason, plan, standardPriceId, proPriceId, legacyPriceId }, { status: 500 });
    }
    return NextResponse.redirect(
      new URL(`/dashboard?error=checkout&message=${encodeURIComponent(reason)}`, request.url)
    );
  }

  try {
    console.log('[checkout] calling createCheckoutSession...');
    const url = await createCheckoutSession(
      user.id,
      user.email!,
      profile?.stripe_customer_id ?? undefined,
      priceId
    );
    console.log('[checkout] session.url:', url ? url.slice(0, 60) + '...' : 'NULL');

    if (!url) {
      throw new Error('Stripe returned null session URL');
    }

    if (debugMode) {
      return NextResponse.json({ ok: true, redirectTo: url });
    }
    return NextResponse.redirect(url);
  } catch (err: unknown) {
    // Stripe SDK エラーは StripeError を継承しており message/type/code/raw を持つ
    const stripeErr = err as {
      message?: string;
      type?: string;
      code?: string;
      statusCode?: number;
      raw?: { message?: string; type?: string; code?: string; decline_code?: string; param?: string };
    };

    const errorMessage  = stripeErr.message  ?? String(err);
    const errorType     = stripeErr.type     ?? null;
    const errorCode     = stripeErr.code     ?? null;
    const errorStatus   = stripeErr.statusCode ?? null;
    const rawMessage    = stripeErr.raw?.message    ?? null;
    const rawType       = stripeErr.raw?.type       ?? null;
    const rawCode       = stripeErr.raw?.code       ?? null;
    const rawDecline    = stripeErr.raw?.decline_code ?? null;
    const rawParam      = stripeErr.raw?.param      ?? null;

    console.error('[checkout] Stripe checkout error ----');
    console.error('[checkout]   message    :', errorMessage);
    console.error('[checkout]   type       :', errorType);
    console.error('[checkout]   code       :', errorCode);
    console.error('[checkout]   statusCode :', errorStatus);
    console.error('[checkout]   raw.message:', rawMessage);
    console.error('[checkout]   raw.type   :', rawType);
    console.error('[checkout]   raw.code   :', rawCode);
    console.error('[checkout]   raw.decline:', rawDecline);
    console.error('[checkout]   raw.param  :', rawParam);
    console.error('[checkout] ---------------------------');

    if (debugMode) {
      return NextResponse.json(
        {
          ok: false,
          message:    errorMessage,
          type:       errorType,
          code:       errorCode,
          statusCode: errorStatus,
          raw: {
            message:      rawMessage,
            type:         rawType,
            code:         rawCode,
            decline_code: rawDecline,
            param:        rawParam,
          },
          context: { plan, priceId, secretKeyHead },
        },
        { status: 500 }
      );
    }

    return NextResponse.redirect(
      new URL(`/dashboard?error=checkout&message=${encodeURIComponent(errorMessage)}`, request.url)
    );
  }
}
