import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { STANDARD_PLAN_PRICE, PRO_PLAN_PRICE } from '@/types';

export const runtime = 'edge';

export const metadata = {
  title: 'プランを選択 — TrainerDocs',
};

const plans = [
  {
    id: 'standard' as const,
    name: 'スタンダード',
    price: STANDARD_PLAN_PRICE,
    tagline: '個人トレーナー向け',
    description: '標準テンプレートを商用利用可能',
    features: [
      '標準テンプレートを商用利用可能',
      '書類生成：通常利用であれば実質無制限',
      'PDFダウンロード（商用利用OK）',
      'メールサポート（平日）',
    ],
    highlight: false,
    badge: null,
  },
  {
    id: 'pro' as const,
    name: 'プロ',
    price: PRO_PLAN_PRICE,
    tagline: '案件数の多いトレーナー・小規模事業者向け',
    description: '標準＋階層構造テンプレートを商用利用可能',
    features: [
      '標準テンプレ＋階層構造テンプレートを商用利用可能',
      '書類生成：実質無制限',
      'PDFダウンロード（商用利用OK）',
      '優先サポート',
    ],
    highlight: true,
    badge: 'おすすめ',
  },
];

export default function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  // searchParams は非同期だが、表示用なので同期コンポーネントでも edge 上は問題なし
  // （cancelled フラグは JSX 外でのみ参照するため、use() ではなく静的に処理）
  void searchParams; // 将来の cancelled バナー用に受け取りだけ保持

  return (
    <div className="max-w-3xl mx-auto">
      {/* 戻るボタン */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={16} />
        ダッシュボードに戻る
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">プランを選択</h1>
        <p className="text-gray-500 text-sm mt-1">
          商用利用・無制限生成を開始するプランをお選びください。
        </p>
      </div>

      {/* プランカード */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-7 border-2 flex flex-col ${
              plan.highlight
                ? 'border-brand-500 bg-white shadow-xl shadow-brand-100'
                : 'border-gray-200 bg-white'
            }`}
          >
            {plan.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                {plan.badge}
              </span>
            )}

            {/* プラン名 */}
            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
              <p className="text-xs text-gray-400">{plan.tagline}</p>
            </div>

            {/* 料金 */}
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  ¥{plan.price.toLocaleString('ja-JP')}
                </span>
                <span className="text-sm text-gray-500">/ 月（税込）</span>
              </div>
            </div>

            {/* 機能一覧 */}
            <ul className="space-y-2.5 flex-1 mb-7">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            {/* 選択ボタン → Stripe Checkout へ */}
            <Link
              href={`/api/stripe/checkout?plan=${plan.id}`}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-colors ${
                plan.highlight
                  ? 'bg-brand-600 hover:bg-brand-700 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {plan.name}を選択
              <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>

      {/* 補足 */}
      <p className="text-xs text-gray-400 text-center mt-8 leading-relaxed">
        お支払いはStripeのセキュアな決済フォームで処理されます。
        <br />
        いつでもダッシュボードからプランの変更・解約ができます。
      </p>
    </div>
  );
}
