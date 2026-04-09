'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { FileText } from 'lucide-react';

type Mode = 'login' | 'signup';

export default function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;
        setSuccess(
          '確認メールを送信しました。メールボックスをご確認ください。'
        );
      } else {
        const { data: loginData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        // サーバーサイドのcookieにセッションをセット（Cloudflare Pages edge runtime対応）
        if (loginData.session) {
          await fetch('/api/auth/set-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              access_token: loginData.session.access_token,
              refresh_token: loginData.session.refresh_token,
            }),
          });
        }
        window.location.href = redirect;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'エラーが発生しました';
      if (message.includes('Invalid login credentials')) {
        setError('メールアドレスまたはパスワードが正しくありません。');
      } else if (message.includes('User already registered')) {
        setError('このメールアドレスはすでに登録されています。');
      } else if (message.includes('Password should be at least')) {
        setError('パスワードは6文字以上で入力してください。');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-700 font-bold text-2xl mb-2"
          >
            <FileText size={28} />
            TrainerDocs
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">
            {mode === 'login' ? 'ログイン' : 'アカウント作成'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login'
              ? 'アカウントにサインインしてください'
              : '無料でアカウントを作成'}
          </p>
        </div>

        <Card>
          <CardBody>
            {success ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-700 font-medium">{success}</p>
                <Link href="/auth/login" className="text-brand-600 text-sm mt-4 inline-block hover:underline">
                  ログインページへ
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <Input
                    label="お名前"
                    type="text"
                    placeholder="山田 太郎"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                )}
                <Input
                  label="メールアドレス"
                  type="email"
                  placeholder="trainer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <Input
                  label="パスワード"
                  type="password"
                  placeholder={mode === 'signup' ? '6文字以上' : '••••••••'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  hint={mode === 'signup' ? 'パスワードは6文字以上で設定してください' : undefined}
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full"
                >
                  {mode === 'login' ? 'ログイン' : 'アカウントを作成'}
                </Button>
              </form>
            )}
          </CardBody>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-6">
          {mode === 'login' ? (
            <>
              アカウントをお持ちでない方は{' '}
              <Link href="/auth/signup" className="text-brand-600 hover:underline font-medium">
                新規登録
              </Link>
            </>
          ) : (
            <>
              すでにアカウントをお持ちの方は{' '}
              <Link href="/auth/login" className="text-brand-600 hover:underline font-medium">
                ログイン
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
