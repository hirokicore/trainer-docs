import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PlusCircle, FileText, CreditCard, AlertCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import DocumentList from '@/components/documents/DocumentList';
import SubscriptionBanner from './SubscriptionBanner';
import type { Document } from '@/types';

export const runtime = 'edge';

export const metadata = {
  title: 'ダッシュボード — TrainerDocs',
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ subscription?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/auth/login');

  const [{ data: profile }, { data: documents, count }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
  ]);

  const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing';
  const documentCount = count ?? 0;
  const canCreate = isSubscribed || documentCount < 3;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-gray-500 text-sm mt-1">
            ようこそ、{profile?.full_name || user?.email} さん
          </p>
        </div>
        {canCreate ? (
          <Link
            href="/documents/new"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <PlusCircle size={16} />
            書類を新規作成
          </Link>
        ) : (
          <Link
            href="/api/stripe/checkout"
            className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <CreditCard size={16} />
            プロにアップグレード
          </Link>
        )}
      </div>

      {params.subscription === 'success' && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <AlertCircle size={18} className="text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-800 font-medium">
            サブスクリプションの登録が完了しました！無制限で書類を生成できます。
          </p>
        </div>
      )}

      {!isSubscribed && (
        <SubscriptionBanner documentCount={documentCount} />
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: '生成済み書類',
            value: documentCount,
            icon: FileText,
            color: 'text-brand-600 bg-brand-50',
          },
          {
            label: 'プラン',
            value: isSubscribed ? 'プロ' : 'フリー',
            icon: CreditCard,
            color: isSubscribed ? 'text-green-600 bg-green-50' : 'text-gray-600 bg-gray-50',
          },
          {
            label: '今月の作成数',
            value: documents?.filter((d) => {
              const date = new Date(d.created_at);
              const now = new Date();
              return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            }).length ?? 0,
            icon: PlusCircle,
            color: 'text-purple-600 bg-purple-50',
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardBody className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Documents */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">過去の書類</h2>
        </CardHeader>
        <CardBody className="p-0">
          <DocumentList
            documents={(documents as Document[]) ?? []}
            canCreate={canCreate}
          />
        </CardBody>
      </Card>
    </div>
  );
}
