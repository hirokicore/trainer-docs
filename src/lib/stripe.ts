import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

/**
 * Stripe Checkout セッションを生成して URL を返す。
 *
 * @param priceId - プランの Stripe Price ID。
 *   省略した場合は STRIPE_PRO_PRICE_ID → NEXT_PUBLIC_STRIPE_PRICE_ID の優先順でフォールバック。
 *   Standard プランは STRIPE_STANDARD_PRICE_ID を設定すること（未設定時は Pro 価格 ID で代用）。
 *   TODO: Stripe ダッシュボードで Standard / Pro それぞれの Price を作成し、
 *         STRIPE_STANDARD_PRICE_ID と STRIPE_PRO_PRICE_ID を .env.local に追加する。
 */
export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  customerId?: string,
  priceId?: string
): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
  // priceId が渡されなければ Pro / 既存デフォルトへフォールバック
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
