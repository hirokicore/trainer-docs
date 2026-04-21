import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { FileText, LayoutDashboard, PlusCircle, CreditCard } from 'lucide-react';
import SignOutButton from './SignOutButton';

export const runtime = 'edge';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user;

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 hidden lg:flex">
        <div className="p-6 border-b border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-brand-700"
          >
            <FileText size={22} />
            TrainerDocs
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LayoutDashboard size={18} />
            ダッシュボード
          </Link>
          <Link
            href="/documents/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <PlusCircle size={18} />
            書類を新規作成
          </Link>
          <Link
            href="/dashboard/billing"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <CreditCard size={18} />
            プラン・お支払い
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-brand-700 text-sm font-semibold">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {user.email}
              </p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-brand-700">
            <FileText size={20} />
            TrainerDocs
          </Link>
          <Link
            href="/documents/new"
            className="text-sm bg-brand-600 text-white px-3 py-1.5 rounded-lg font-medium"
          >
            新規作成
          </Link>
        </div>
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
