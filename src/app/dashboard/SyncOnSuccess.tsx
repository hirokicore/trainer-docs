'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type SyncState =
  | { status: 'running' }
  | { status: 'ok'; plan: string }
  | { status: 'error'; message: string };

export default function SyncOnSuccess() {
  const router = useRouter();
  const [state, setState] = useState<SyncState>({ status: 'running' });

  useEffect(() => {
    fetch('/api/stripe/sync')
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          setState({ status: 'error', message: `HTTP ${res.status}: ${JSON.stringify(json)}` });
          return;
        }
        setState({ status: 'ok', plan: json.plan });
        // 2秒後にリダイレクト（結果を一瞬見せる）
        setTimeout(() => router.replace('/dashboard'), 2000);
      })
      .catch((err) => {
        setState({ status: 'error', message: String(err) });
      });
  }, [router]);

  if (state.status === 'running') {
    return (
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-800">
        プラン情報を同期中...
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-800 font-mono break-all">
        [sync error] {state.message}
      </div>
    );
  }

  return (
    <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800">
      同期完了: plan = <strong>{state.plan}</strong>（画面を更新します）
    </div>
  );
}
