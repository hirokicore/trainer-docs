import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { stripe, resolvePlan } from '@/lib/stripe';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { STANDARD_PLAN_PRICE, PRO_PLAN_PRICE } from '@/types';
import BillingActions from './BillingActions';
import { CreditCard, ArrowUpRight } from 'lucide-react';

export const runtime = 'edge';

export const metadata = { title: 'プラン・お支払い — TrainerDocs' };

function formatDateJP(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, subscription_status, stripe_subscription_id, stripe_customer_id')
    .eq('id', session.user.id)
    .single();

  const isFree = !profile?.stripe_subscription_id || profile?.plan === 'free';

  // ── フリープランの場合 ──
  if (isFree) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">プラン・お支払い</h1>
        <Card>
          <CardBody className="py-10 text-center">
            <CreditCard size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-1">現在フリープランをご利用中です</p>
            <p className="text-sm text-gray-500 mb-5">
              有料プランにアップグレードすると、無制限で書類を生成できます。
            </p>
            <Link
              href="/dashboard/upgrade"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              プランを見る
              <ArrowUpRight size={15} />
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ── 有料プランの場合：Stripe から最新情報を取得 ──
  const sub = await stripe.subscriptions.retrieve(profile.stripe_subscription_id!);
  const priceId = sub.items.data[0]?.price.id;
  const itemId = sub.items.data[0]?.id ?? '';
  const plan = resolvePlan(priceId) as 'standard' | 'pro';
  const cancelAtPeriodEnd = sub.cancel_at_period_end;
  const periodEnd = new Date(sub.current_period_end * 1000);
  const periodEndLabel = formatDateJP(periodEnd);
  const planPrice = plan === 'pro' ? PRO_PLAN_PRICE : STANDARD_PLAN_PRICE;
  const planLabel = plan === 'pro' ? 'Pro プラン' : 'Standard プラン';
  const statusLabel = cancelAtPeriodEnd
    ? `${periodEndLabel} に終了予定`
    : sub.status === 'trialing'
    ? 'トライアル中'
    : `次回更新日：${periodEndLabel}`;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">プラン・お支払い</h1>

      {/* 現在のプラン */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-sm font-medium text-gray-500">現在のプラン</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl font-bold text-gray-900">{planLabel}</span>
                {cancelAtPeriodEnd && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                    解約予定
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{statusLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ¥{planPrice.toLocaleString('ja-JP')}
              </p>
              <p className="text-xs text-gray-400">/ 月</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 操作（Client Component） */}
      <BillingActions
        plan={plan}
        cancelAtPeriodEnd={cancelAtPeriodEnd}
        periodEndLabel={periodEndLabel}
        subscriptionItemId={itemId}
      />

      {/* Stripe カスタマーポータルへのリンク */}
      <p className="mt-8 text-xs text-gray-400 text-center">
        お支払い方法の変更や領収書の確認は
        <Link
          href="/api/stripe/portal"
          className="ml-1 underline underline-offset-2 hover:text-gray-600"
        >
          カスタマーポータル
        </Link>
        をご利用ください。
      </p>
    </div>
  );
}
