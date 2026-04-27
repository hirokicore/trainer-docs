'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  MessageSquare,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const feedbackItems = [
  {
    icon: MessageSquare,
    title: 'こんな契約書が欲しい',
    description:
      '「初回体験 → 継続コースへの切り替え時」「オンライン指導のキャンセルポリシー」など、実際の場面を教えてください。',
  },
  {
    icon: Lightbulb,
    title: '困っていること・不安なこと',
    description:
      'トラブル対応に迷った経験や、契約書まわりで不安に感じることがあれば、気軽に教えてもらえると助かります。',
  },
  {
    icon: CheckCircle,
    title: '使ってみた感想',
    description:
      '「ここが使いやすかった」「この部分が分かりづらかった」どちらも歓迎です。開発の参考にします。',
  },
];

const usageOptions = [
  { value: '', label: '選択してください（任意）' },
  { value: 'not_used', label: 'まだ使っていない' },
  { value: 'tried', label: '少し触ってみた' },
  { value: 'in_use', label: '実務で使っている' },
];

export default function FeedbackPage() {
  const [form, setForm] = useState({
    message: '',
    contact: '',
    usage_status: '',
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

    if (!form.message.trim()) {
      setError('ご意見・ご要望を入力してください');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback/submit', {
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
          <span className="inline-block bg-brand-200 text-brand-900 text-sm font-bold px-4 py-1.5 rounded-full mb-6">
            ご意見・ご要望
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            TrainerDocsを、
            <br />
            一緒に育ててもらえませんか？
          </h1>
          <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            サービス改善のためのご意見・ご要望をお待ちしています。
            <br />
            不具合のご報告や、欲しい機能など、何でもお気軽にお知らせください。
          </p>
          <a
            href="#feedback-form"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-brand-700 font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-lg"
          >
            意見を送る
            <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* What we'd like to hear */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              こんなことを教えてもらえると助かります
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              ひとりで開発しているので、現場の声がとても参考になります。
              1行だけでも、思いついたことをそのまま書いてもらえれば大丈夫です。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {feedbackItems.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-brand-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* What to write guide */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <h3 className="text-base font-semibold text-gray-800 mb-4">書いてみてほしいこと（全部じゃなくても大丈夫）</h3>
            <ul className="space-y-3">
              {[
                'こんなタイミングで契約書を使いたい（例：初回体験 → 2ヶ月コースへの切り替え）',
                'いま困っていること、不安に感じていること',
                '実際に使ってみた感想（良かった点・気になった点）',
                '欲しい機能やフォーマット',
                '「これがあったら現場で役立つ」というアイデア',
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 text-gray-600 text-sm">
                  <CheckCircle size={16} className="text-brand-400 flex-shrink-0 mt-0.5" />
                  {text}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-brand-700 font-medium">
              すべてを書かなくても、1行だけでも大歓迎です。
            </p>
          </div>
        </div>
      </section>

      {/* Feedback Form */}
      <section id="feedback-form" className="bg-gray-50 py-20 px-4">
        <div className="max-w-xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">ご意見・ご要望フォーム</h2>
            <div className="bg-white border border-gray-200 rounded-2xl px-6 py-5 text-sm text-gray-700 leading-relaxed space-y-3">
              <p className="font-medium text-gray-900">TrainerDocsに関するご意見・ご要望をお聞かせください。</p>
              <ul className="space-y-1.5 text-gray-600">
                <li>・「ここが分かりにくい」「こういう機能が欲しい」など</li>
                <li>・不具合の報告や画面表示の乱れ など</li>
              </ul>
              <p className="text-gray-500 text-xs">
                いただいた内容は、今後の改善の参考にさせていただきます。
                個別の回答が必要な場合は、返信用メールアドレスのご入力もお願いします。
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
              <CheckCircle className="text-green-500 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">送ってくれてありがとうございます</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                いただいた内容は必ず目を通し、優先度を見ながら機能改善に反映していきます。
                <br />
                すべてに返信はできないことがありますが、どんな意見もちゃんと届いています。
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
              {/* Main feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  ご意見・ご要望 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={'例：初回体験から2ヶ月コースに切り替えるときの契約書を増やしてほしい\n例：オンライン指導のキャンセルポリシーをどう書けばいいか分からない\n例：使ってみたけど項目が多すぎて迷った'}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition resize-none"
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  思いついたことをそのまま書いてもらえれば大丈夫です。
                </p>
              </div>

              {/* Usage status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  TrainerDocs の利用状況
                  <span className="ml-1.5 text-xs text-gray-400 font-normal">任意</span>
                </label>
                <select
                  name="usage_status"
                  value={form.usage_status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition bg-white"
                >
                  {usageOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  連絡先（メール or X アカウント）
                  <span className="ml-1.5 text-xs text-gray-400 font-normal">任意</span>
                </label>
                <input
                  type="text"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="trainer@example.com または @your_x_handle"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                />
                <p className="mt-1.5 text-xs text-gray-400">
                  返信が必要な方だけ入力してください。入力しなくてもフィードバックは届きます。
                </p>
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
                    送る
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                ご入力いただいた情報は、サービス改善のためにのみ使用します。
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
