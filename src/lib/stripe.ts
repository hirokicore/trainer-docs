import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

/**
 * Stripe Checkout セッションを生成して URL を返す。
 *
 * @param priceId - 呼び出し元（checkout route）が解決した Stripe Price ID。
 *   省略時は STRIPE_PRO_PRICE_ID → NEXT_PUBLIC_STRIPE_PRICE_ID（廃止予定）の順でフォールバック。
 *
 * Price ID の設定場所: .env.local
 *   STRIPE_STANDARD_PRICE_ID=price_xxx  ← Standard プラン（月額 1,480円）
 *   STRIPE_PRO_PRICE_ID=price_xxx       ← Pro プラン（月額 2,980円）
 */
export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  customerId?: string,
  priceId?: string
): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  // priceId は checkout route が ?plan= から解決して渡す。
  // 省略時は STRIPE_PRO_PRICE_ID → 廃止予定フォールバックの順。
  const resolvedPriceId =
    priceId ??
    process.env.STRIPE_PRO_PRICE_ID ??
    process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer: customerId || undefined,
    customer_email: customerId ? undefined : userEmail,
    line_items: [
      {
        price: resolvedPriceId,
        quantity: 1,
      },
    ],
    metadata: {
      userId,
    },
    success_url: `${appUrl}/dashboard?subscription=success`,
    cancel_url: `${appUrl}/dashboard/upgrade?cancelled=1`,
    subscription_data: {
      metadata: { userId },
    },
  });

  return session.url!;
}

export async function createPortalSession(customerId: string): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${appUrl}/dashboard`,
  });

  return session.url;
}
