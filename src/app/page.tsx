import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            個人開発
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            現場の課題を
            <br />
            <span className="text-yellow-300">プロダクトで解決する</span>
          </h1>
          <p className="text-lg text-blue-100 mb-10 max-w-xl mx-auto leading-relaxed">
            パーソナルトレーナーや小規模事業者が抱える
            「地味だけど面倒な業務」をAIとSaaSで自動化します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apps"
              className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg"
            >
              プロダクト一覧
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/log"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-lg px-8 py-4 rounded-xl border border-white/30 transition-colors"
            >
              開発ログ
            </Link>
          </div>
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
              src="/screenshot-dashboard.png"
              alt="TrainerDocs ダッシュボード画面"
              width={1456}
              height={816}
              className="w-full h-auto block"
              priority
            />
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">プロダクト</h2>
            <p className="text-gray-500">現在リリース中のSaaSです。</p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {/* TrainerDocs カード */}
            <div className="flex flex-col sm:flex-row gap-6 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center">
                <Layers className="text-brand-600" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">
                    パーソナルトレーナー向け契約書作成ツール TrainerDocs
                  </h3>
                  <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full flex-shrink-0">
                    β版公開中
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  パーソナルトレーナー専用の契約書・同意書を、テンプレートから簡単に作成できるサービスです。
                  トレーニング委託契約書・免責同意書・キャンセルポリシーなど7種類に対応。
                </p>
                <Link
                  href="/apps/trainerdocs"
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
                >
                  TrainerDocs の詳細を見る
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dev Log teaser */}
      <section className="bg-gray-50 py-20 px-4 border-y border-gray-200">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center">
            <BookOpen className="text-brand-600" size={28} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">開発ログ</h2>
            <p className="text-gray-500 leading-relaxed">
              プロダクトを作りながら学んだこと、詰まったこと、意思決定の記録を残しています。
            </p>
          </div>
          <Link
            href="/log"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            ログを読む
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
