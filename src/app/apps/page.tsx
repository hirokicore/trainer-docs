import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const apps = [
  {
    slug: 'trainerdocs',
    name: 'TrainerDocs',
    status: 'β版公開中',
    statusColor: 'bg-green-100 text-green-700',
    description:
      'パーソナルトレーナー向けの契約書類をAIで自動生成。トレーニング委託契約書・免責同意書・健康状態確認書などを瞬時に作成してPDFダウンロード。',
    tags: ['AI', 'PDF生成', 'SaaS', 'パーソナルトレーナー'],
  },
];

export default function AppsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">プロダクト一覧</h1>
          <p className="text-blue-100 text-lg">
            リリース済みおよび開発中のSaaSプロダクトです。
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            {apps.map((app) => (
              <Link
                key={app.slug}
                href={`/apps/${app.slug}`}
                className="group flex gap-5 p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-300 transition-all"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center">
                  <Layers className="text-brand-600" size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="font-bold text-gray-900 text-lg">{app.name}</h2>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${app.statusColor}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">
                    {app.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {app.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight
                  size={18}
                  className="text-gray-300 group-hover:text-brand-500 flex-shrink-0 self-center transition-colors"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
