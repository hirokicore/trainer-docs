'use client';

import { useState } from 'react';
import { Zap, X } from 'lucide-react';

export default function SubscriptionBanner({ documentCount }: { documentCount: number }) {
  const [dismissed, setDismissed] = useState(false);
  const remaining = Math.max(0, 3 - documentCount);

  if (dismissed) return null;

  return (
    <div className="mb-6 bg-brand-50 border border-brand-100 rounded-xl p-4 flex items-start gap-4">
      <div className="flex-shrink-0 mt-0.5">
        <Zap size={20} className="text-brand-500" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-brand-800">
          フリープランをご利用中 — 残り{remaining}件無料で生成できます
        </p>
        <p className="text-brand-600 text-xs mt-1">
          プロプランにアップグレードすると無制限で書類を生成できます（¥2,980/月）
        </p>
        <a
          href="/api/stripe/checkout"
          className="inline-block mt-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
        >
          プロにアップグレード →
        </a>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-brand-300 hover:text-brand-500 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}
