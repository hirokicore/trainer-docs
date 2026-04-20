'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FileText, Menu, X } from 'lucide-react';

export default function Header() {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-brand-700">
          <FileText size={24} />
          TrainerDocs
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/#features" className="text-gray-600 hover:text-gray-900 text-sm">
            機能
          </Link>
          <Link href="/#pricing" className="text-gray-600 hover:text-gray-900 text-sm">
            料金
          </Link>
          <Link href="/monitors" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg font-medium transition-colors hover:bg-gray-50">
            ご意見・ご要望
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                ダッシュボード
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                ログイン
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                無料で始める
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          <Link
            href="/#features"
            className="block text-gray-600 text-sm py-2"
            onClick={() => setMenuOpen(false)}
          >
            機能
          </Link>
          <Link
            href="/#pricing"
            className="block text-gray-600 text-sm py-2"
            onClick={() => setMenuOpen(false)}
          >
            料金
          </Link>
          <Link
            href="/monitors"
            className="block text-gray-600 text-sm px-4 py-2 rounded-lg font-medium text-center hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            ご意見・ご要望
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block text-gray-600 text-sm py-2"
                onClick={() => setMenuOpen(false)}
              >
                ダッシュボード
              </Link>
              <button
                onClick={handleSignOut}
                className="block text-sm text-gray-600 py-2"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="block text-gray-600 text-sm py-2"
                onClick={() => setMenuOpen(false)}
              >
                ログイン
              </Link>
              <Link
                href="/auth/signup"
                className="block bg-brand-600 text-white text-sm px-4 py-2 rounded-lg font-medium text-center"
                onClick={() => setMenuOpen(false)}
              >
                無料で始める
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
