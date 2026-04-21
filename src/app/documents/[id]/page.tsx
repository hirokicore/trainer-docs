import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import PdfDownload from '@/components/documents/PdfDownload';
import { DOCUMENT_TYPE_LABELS } from '@/types';
import { formatDate } from '@/lib/utils';
import { resolvePlanType } from '@/lib/plan';
import type { Document } from '@/types';

export const runtime = 'edge';

export async function generateMetadata() {
  return { title: `書類詳細 — TrainerDocs` };
}

export default async function DocumentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ download?: string }>;
}) {
  const { id } = await params;
  const { download } = await searchParams;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/auth/login');

  const [{ data: document, error }, { data: profile }] = await Promise.all([
    supabase.from('documents').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('profiles').select('plan').eq('id', user.id).single(),
  ]);

  if (error || !document) notFound();

  const doc = document as Document;
  const plan = resolvePlanType(profile?.plan);
  const autoDownload = download === 'true';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} />
          ダッシュボードに戻る
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900">{doc.title}</h1>
              {plan === 'free' && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                  サンプル
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User size={14} />
                {doc.form_data.clientName}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(doc.created_at)}
              </span>
              <span className="bg-brand-50 text-brand-700 text-xs font-medium px-2 py-0.5 rounded-full">
                {DOCUMENT_TYPE_LABELS[doc.document_type]}
              </span>
            </div>
          </div>
          <PdfDownload document={doc} autoDownload={autoDownload} plan={plan} />
        </div>
      </div>

      {/* Document Preview */}
      <Card>
        <CardHeader>
          <h2 className="text-sm font-medium text-gray-500">書類プレビュー</h2>
        </CardHeader>
        <CardBody>
          {plan === 'free' && (
            <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <span className="mt-0.5 shrink-0 font-semibold">サンプル表示</span>
              <span>
                この書類はサンプルです。商用利用・正式書類としての使用はできません。
                <Link href="/dashboard/upgrade" className="ml-1 font-medium underline underline-offset-2 hover:text-amber-900">
                  Standard 以上にアップグレード
                </Link>
                すると正式出力が可能になります。
              </span>
            </div>
          )}
          <div className="bg-white border border-gray-100 rounded-lg p-8 min-h-96 shadow-sm">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans leading-relaxed">
              {doc.content}
            </pre>
          </div>
        </CardBody>
      </Card>

      {/* Form Data Summary */}
      <Card className="mt-6">
        <CardHeader>
          <h2 className="text-sm font-medium text-gray-500">入力情報</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: 'トレーナー名', value: doc.form_data.trainerName },
              { label: '事業者名', value: doc.form_data.businessName },
              { label: 'クライアント名', value: doc.form_data.clientName },
              { label: '契約期間', value: `${doc.form_data.contractStartDate} 〜 ${doc.form_data.contractEndDate}` },
              {
                label: 'セッション料金',
                value: `${doc.form_data.sessionFee.toLocaleString('ja-JP')}円 × ${doc.form_data.sessionCount}回`,
              },
              { label: '支払方法', value: doc.form_data.paymentMethod },
            ].map((item) => (
              <div key={item.label} className="flex gap-2">
                <span className="text-gray-500 flex-shrink-0 w-28">{item.label}</span>
                <span className="text-gray-900 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
