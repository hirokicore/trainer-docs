import Link from 'next/link';
import {
  FileText,
  Zap,
  Shield,
  Download,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const features = [
  {
    icon: Zap,
    title: 'AIで即時生成',
    description:
      'Gemini AIが情報を入力するだけで、AIが生成する契約書ひな形を数秒で自動生成します。',
  },
  {
    icon: FileText,
    title: '4種類の書類に対応',
    description:
      'トレーニング委託契約書・健康状態確認書・免責同意書・入会申込書をカバー。',
  },
  {
    icon: Download,
    title: 'PDFダウンロード',
    description:
      '生成した書類はそのままPDFでダウンロード。印刷してすぐに使えます。',
  },
  {
    icon: Shield,
    title: '安全なクラウド保存',
    description:
      '過去に生成した書類はダッシュボードでいつでも確認・再ダウンロード可能。',
  },
];

const plans = [
  {
    name: 'フリー',
    price: '¥0',
    period: '',
    description: '試しに使ってみたい方向け',
    features: ['書類生成 月3件まで', '4種類の書類対応', 'PDFダウンロード'],
    cta: '無料で始める',
    href: '/auth/signup',
    highlight: false,
  },
  {
    name: 'プロ',
    price: '¥2,980',
    period: '/ 月',
    description: '現役トレーナーの方に最適',
    features: [
      '書類生成 無制限',
      '4種類の書類対応',
      'PDFダウンロード',
      '過去書類のクラウド保存',
      'カスタムテンプレート（近日公開）',
    ],
    cta: '14日間無料トライアル',
    href: '/auth/signup',
    highlight: true,
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            AIで書類作成を10倍速く
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            パーソナルトレーナーの
            <br />
            <span className="text-yellow-300">契約書類を自動生成</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
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
              href="#features"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-lg px-8 py-4 rounded-xl border border-white/30 transition-colors"
            >
              詳しく見る
            </Link>
          </div>
          <p className="text-blue-200 text-sm mt-6">
            クレジットカード不要・月3件まで無料
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 py-8 px-4 border-y border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          <div>
            <p className="text-2xl font-bold text-brand-600">β版提供中</p>
            <p className="text-sm text-gray-500 mt-1">フィードバックをお待ちしています</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              なぜ TrainerDocs が選ばれるのか
            </h2>
            <p className="text-gray-500 text-lg">
              書類作成の手間を省いて、トレーニングに集中できる環境を。
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                  <f.icon className="text-brand-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {f.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              使い方はとても簡単
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: '情報を入力',
                desc: 'トレーナーとクライアントの情報、契約内容を入力します。',
              },
              {
                step: '2',
                title: 'AIが自動生成',
                desc: 'Gemini AIが契約書ひな形を数秒で作成します。',
              },
              {
                step: '3',
                title: 'PDFで完成',
                desc: '生成された書類をPDFでダウンロードして使用します。',
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              シンプルな料金プラン
            </h2>
            <p className="text-gray-500 text-lg">
              まずは無料で体験。気に入ったらプロにアップグレード。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border-2 ${
                  plan.highlight
                    ? 'border-brand-500 shadow-xl shadow-brand-100'
                    : 'border-gray-200'
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    おすすめ
                  </span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {plan.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-500">{plan.period}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle
                        size={16}
                        className="text-green-500 flex-shrink-0"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full text-center py-3 rounded-xl font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-brand-600 hover:bg-brand-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 text-white py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            今すぐ書類作成を自動化しよう
          </h2>
          <p className="text-blue-100 mb-8">
            無料でアカウントを作成して、AIによる書類自動生成を体験してください。
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-10 py-4 rounded-xl transition-colors shadow-lg"
          >
            無料アカウントを作成
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
