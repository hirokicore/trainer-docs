import Link from 'next/link';
import Image from 'next/image';
import { FileText, Zap, Shield, Download, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LegalNotice from '@/components/layout/LegalNotice';
import { STANDARD_PLAN_PRICE, PRO_PLAN_PRICE } from '@/types';

const features = [
  {
    icon: Zap,
    title: 'AIで即時生成',
    description: '情報を入力するだけで、契約書ひな形をGemini AIが数秒で生成します。',
  },
  {
    icon: FileText,
    title: '7種類の書類に対応',
    description: 'トレーニング委託契約書・健康状態確認書・免責同意書・入会申込書をカバー。',
  },
  {
    icon: Download,
    title: 'PDFダウンロード',
    description: '生成した書類はそのままPDFでダウンロード。印刷してすぐに使えます。',
  },
  {
    icon: Shield,
    title: '安全なクラウド保存',
    description: '過去に生成した書類はダッシュボードでいつでも確認・再ダウンロード可能。',
  },
];

/**
 * 料金プラン定義
 *  - フリー：お試し・サンプル用（商用不可）
 *  - スタンダード：個人トレーナー向け商用プラン
 *  - プロ：案件数の多いトレーナー・小規模事業者向け
 */
const plans = [
  {
    name: 'フリー',
    price: '¥0',
    period: null,
    tagline: 'お試し・サンプル確認用',
    badge: null,
    highlight: false,
    features: [
      '書類生成3件まで（累計上限）',
      '標準テンプレ（サンプル版）',
      'PDFダウンロード（透かし入り）',
      'ご意見・ご要望フォームのみ',
    ],
    // Freeプラン専用の注意文（商用不可）
    restriction: '商用利用・実務利用はできません',
  },
  {
    name: 'スタンダード',
    price: `¥${STANDARD_PLAN_PRICE.toLocaleString('ja-JP')}`,
    period: '/ 月（税込）',
    tagline: '個人トレーナー向け',
    badge: null,
    highlight: false,
    features: [
      '書類生成：通常利用であれば実質無制限',
      '標準テンプレ（商用利用OK）',
      'PDFダウンロード（商用利用OK）',
      'メールサポート（平日）',
    ],
    restriction: null,
  },
  {
    name: 'プロ',
    price: `¥${PRO_PLAN_PRICE.toLocaleString('ja-JP')}`,
    period: '/ 月（税込）',
    tagline: '案件数の多いトレーナー・小規模事業者向け',
    badge: 'おすすめ',
    highlight: true,
    features: [
      '書類生成：実質無制限',
      '標準テンプレ＋階層構造テンプレ',
      'PDFダウンロード（商用利用OK）',
      '優先サポート',
    ],
    restriction: null,
  },
];

export default function TrainerDocsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-gray-500 flex items-center gap-1.5">
            <Link href="/" className="hover:text-gray-700">ホーム</Link>
            <span>/</span>
            <Link href="/apps" className="hover:text-gray-700">プロダクト</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">TrainerDocs</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            AIで書類作成を10倍速く
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            パーソナルトレーナーの
            <br />
            <span className="text-yellow-300">契約書類を自動生成</span>
          </h1>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            クライアント情報を入力するだけで、AIが生成する契約書ひな形を瞬時に作成。
            もう書類作成に時間を取られない。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              無料で始める
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/monitors"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-lg px-8 py-4 rounded-xl border border-white/30 transition-colors"
            >
              ご意見・ご要望を送る
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-6">クレジットカード不要・月3件まで無料</p>
        </div>
      </section>

      {/* Screenshot */}
      <section className="bg-gradient-to-b from-brand-700 to-white px-4 pb-0 pt-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-sm font-medium text-brand-200 mb-6 tracking-wide uppercase">
            実際の画面
          </p>
          <div className="rounded-2xl overflow-hidden shadow-2xl shadow-brand-900/30 border border-white/10">
            <Image
              src="/screenshot-document.png"
              alt="TrainerDocs 契約書生成画面"
              width={960}
              height={540}
              className="w-full h-auto block"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">主な機能</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                  <f.icon className="text-brand-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">料金プラン</h2>
            <p className="text-gray-500">すべてのプランでクレジットカード不要で登録できます。</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border-2 flex flex-col ${
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
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                  <p className="text-xs text-gray-400">{plan.tagline}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-3 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                {plan.restriction && (
                  <p className="mt-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 leading-relaxed">
                    ※{plan.restriction}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Free プランの詳細注意書き */}
          <div className="mt-8 bg-white border border-gray-200 rounded-xl px-6 py-5">
            <p className="text-sm font-semibold text-gray-700 mb-2">フリープランについて</p>
            <ul className="space-y-1.5 text-sm text-gray-600 leading-relaxed">
              <li>・生成した契約書は、商用利用・実務利用はできません。</li>
              <li>・書類生成は累計3件までご利用いただけます。</li>
              <li>・過度な連続利用が見られた場合、一時的に利用を制限することがあります。</li>
            </ul>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg px-10 py-4 rounded-xl transition-colors shadow-lg"
            >
              無料アカウントを作成
              <ArrowRight size={20} />
            </Link>
            <p className="text-sm text-gray-400 mt-3">クレジットカード不要・無料プランあり</p>
          </div>
        </div>
      </section>

      {/* Legal notice */}
      <section className="py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <LegalNotice />
        </div>
      </section>

      <Footer />
    </div>
  );
}
