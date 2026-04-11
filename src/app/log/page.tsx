import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function LogPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">開発ログ</h1>
          <p className="text-blue-100 text-lg">
            プロダクトを作りながら学んだこと、詰まったこと、意思決定の記録。
          </p>
        </div>
      </section>

      <section className="flex-1 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          {/* 記事が増えたらここに追加する */}
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
            <BookOpen size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-500 mb-2">記事を準備中です</p>
            <p className="text-sm">近日公開予定。お楽しみに。</p>
          </div>
        </div>
      </section>

      {/* ログ記事テンプレート（コメントアウト）
      <article className="max-w-3xl mx-auto py-10 px-4 border-b border-gray-100">
        <time className="text-xs text-gray-400">2026-XX-XX</time>
        <h2 className="text-xl font-bold text-gray-900 mt-1 mb-2">
          記事タイトル
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">概要テキスト</p>
        <Link href="/log/slug" className="text-sm text-brand-600 hover:text-brand-700 mt-3 inline-block">
          続きを読む →
        </Link>
      </article>
      */}

      <Footer />
    </div>
  );
}
