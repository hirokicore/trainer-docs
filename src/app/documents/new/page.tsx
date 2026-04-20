import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TrainerForm from '@/components/documents/TrainerForm';
import LegalNotice from '@/components/layout/LegalNotice';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { FREE_TOTAL_LIMIT } from '@/types';

export const runtime = 'edge';

export const metadata = {
  title: '書類を新規作成 — TrainerDocs',
};

export default async function NewDocumentPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) redirect('/auth/login');

  // フリープランの上限チェック
  const [{ data: profile }, { count }] = await Promise.all([
    supabase.from('profiles').select('subscription_status, plan').eq('id', user.id).single(),
    supabase
      .from('documents')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id),
  ]);

  const isSubscribed =
    profile?.subscription_status === 'active' ||
    profile?.subscription_status === 'trialing';
  const isPro = profile?.plan === 'pro';
  const documentCount = count ?? 0;

  if (!isSubscribed && documentCount >= FREE_TOTAL_LIMIT) {
    redirect('/dashboard?limit=true');
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} />
          ダッシュボードに戻る
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">書類を新規作成</h1>
        <p className="text-gray-500 text-sm mt-1">
          情報を入力すると、AIが書類を自動生成します。
        </p>
      </div>

      <TrainerForm isSubscribed={isSubscribed} isPro={isPro} />

      <div className="mt-8">
        <LegalNotice />
      </div>
    </div>
  );
}
