'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Gift,
  Users,
  Star,
  ArrowRight,
  FileText,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const benefits = [
  {
    icon: Gift,
    title: 'プロプラン相当を無料で利用',
    description:
      'ご利用中、書類生成無制限・クラウド保存など、すべてのプロ機能を無償で使えます。',
  },
  {
    icon: Star,
    title: 'サービス改善に参加',
    description:
      'フィードバックをもとに機能追加・改善を優先的に行います。実際に使う現場の声を大切にしています。',
  },
  {
    icon: Users,
    title: '少人数の限定募集',
    description:
      '初回は10名程度の少人数で募集。一人ひとりのフィードバックを丁寧にサービスへ反映します。',
  },
];

const conditions = [
  '現役のパーソナルトレーナー（資格の有無は問いません）',
  '実際に使ってみた感想をお送りいただける方',
  'TrainerDocs を実際の業務で試してみる意欲のある方',
];

const activityOptions = [
  { value: '', label: '選択してください' },
  { value: 'gym', label: 'フィットネスジム・スタジオ勤務' },
  { value: 'freelance', label: 'フリーランス（個人宅・貸しスタジオ）' },
  { value: 'online', label: 'オンラインパーソナルトレーニング' },
  { value: 'both', label: 'オフライン＋オンライン両方' },
  { value: 'other', label: 'その他' },
];

export default function MonitorsPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    activity_status: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.activity_status || !form.message.trim()) {
      setError('すべての項目を入力してください');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/monitors/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '送信に失敗しました。再度お試しください。');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('ネットワークエラーが発生しました。接続を確認して再度お試しください。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-yellow-400 text-gray-900 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            モニター募集中 — 先着10名限定
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            プロプランを
            <span className="text-yellow-300">無料</span>で体験
            <br />
            モニタートレーナー募集
          </h1>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            TrainerDocs をより良いサービスにするために、現役パーソナルトレーナーの方に
            サービスを実際に試して、感想をお送りいただける方を募集しています。
          </p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg"
          >
            今すぐ応募する
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">モニター特典</h2>
            <p className="text-gray-500 text-lg">
              ご協力いただいた方には、以下の特典をご用意しています。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <b.icon className="text-brand-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pro plan details */}
          <div className="mt-12 bg-brand-50 rounded-2xl p-8 border border-brand-100">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-brand-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">プロプランに含まれる機能</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                '書類生成 無制限',
                '7種類の書類対応（委託契約書・同意書・確認書など）',
                'PDFダウンロード',
                '過去書類のクラウド保存',
                'カスタムテンプレート（近日公開）',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-brand-700 font-medium">
              通常 ¥2,980/月 のプロプランが、1ヶ月間無料でご利用いただけます。
            </p>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">応募条件</h2>
            <p className="text-gray-500">以下の条件に当てはまる方のご応募をお待ちしています。</p>
          </div>
          <ul className="space-y-4">
            {conditions.map((c) => (
              <li key={c} className="flex items-start gap-3 text-gray-700">
                <CheckCircle size={20} className="text-brand-600 flex-shrink-0 mt-0.5" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">応募フォーム</h2>
            <p className="text-gray-500">
              内容を確認の上、数日以内にメールでご連絡いたします。
            </p>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">応募を受け付けました</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                ご応募ありがとうございます。
                <br />
                内容を確認の上、数日以内にご登録のメールアドレスへご連絡いたします。
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 mt-8 text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                トップページに戻る
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  お名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="山田 太郎"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="trainer@example.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  現在の活動状況 <span className="text-red-500">*</span>
                </label>
                <select
                  name="activity_status"
                  value={form.activity_status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition bg-white"
                >
                  {activityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  応募メッセージ <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="現在の業務での課題や、TrainerDocsに期待することを教えてください（例：契約書作成に時間がかかっている、統一したフォーマットがほしい など）"
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition resize-none"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    送信中...
                  </>
                ) : (
                  <>
                    応募する
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                ご入力いただいた情報は、モニター選考およびご連絡のみに使用します。
                <br />
                第三者への提供は行いません。
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
