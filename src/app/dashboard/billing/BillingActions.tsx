'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { AlertCircle } from 'lucide-react';

interface BillingActionsProps {
  plan: 'standard' | 'pro';
  cancelAtPeriodEnd: boolean;
  periodEndLabel: string; // "◯年◯月◯日" 形式
  subscriptionItemId: string;
}

export default function BillingActions({
  plan,
  cancelAtPeriodEnd,
  periodEndLabel,
  subscriptionItemId,
}: BillingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmDowngrade, setConfirmDowngrade] = useState(false);

  const call = async (endpoint: string, key: string) => {
    setLoading(key);
    setError('');
    try {
      const res = await fetch(endpoint, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '処理に失敗しました');
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      setLoading(null);
      setConfirmCancel(false);
      setConfirmDowngrade(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── 解約予約済みの場合 ── */}
      {cancelAtPeriodEnd && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 space-y-3">
          <p className="text-sm font-medium text-amber-800">
            このプランは <strong>{periodEndLabel}</strong> に終了します。
            それまでは引き続きすべての機能をご利用いただけます。
          </p>
          <Button
            variant="primary"
            loading={loading === 'reactivate'}
            onClick={() => call('/api/billing/reactivate', 'reactivate')}
          >
            解約をやめる
          </Button>
        </div>
      )}

      {/* ── 通常状態（解約予約なし）── */}
      {!cancelAtPeriodEnd && (
        <>
          {/* Pro → Standard ダウングレード */}
          {plan === 'pro' && (
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">スタンダードにダウングレード</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  次回更新日（{periodEndLabel}）から ¥1,480/月 に変更されます。
                  Pro 専用テンプレートは次回更新後に利用できなくなります。
                </p>
              </div>
              {confirmDowngrade ? (
                <div className="flex items-center gap-3">
                  <Button
                    variant="primary"
                    loading={loading === 'downgrade'}
                    onClick={() => call('/api/billing/downgrade', 'downgrade')}
                  >
                    ダウングレードを確定する
                  </Button>
                  <Button
                    variant="outline"
                    disabled={loading !== null}
                    onClick={() => setConfirmDowngrade(false)}
                  >
                    キャンセル
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setConfirmDowngrade(true)}>
                  スタンダードにダウングレード
                </Button>
              )}
            </div>
          )}

          {/* 解約 */}
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">プランを解約する</p>
              <p className="text-xs text-gray-500 mt-0.5">
                今解約しても、<strong>{periodEndLabel}</strong> まではすべての機能をご利用いただけます。
                期間終了後はフリープランに移行します。
              </p>
            </div>
            {confirmCancel ? (
              <div className="flex items-center gap-3">
                <Button
                  variant="danger"
                  loading={loading === 'cancel'}
                  onClick={() => call('/api/billing/cancel', 'cancel')}
                >
                  解約を確定する
                </Button>
                <Button
                  variant="outline"
                  disabled={loading !== null}
                  onClick={() => setConfirmCancel(false)}
                >
                  キャンセル
                </Button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmCancel(true)}
                className="text-sm text-gray-400 hover:text-red-500 underline underline-offset-2 transition-colors"
              >
                解約する
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
