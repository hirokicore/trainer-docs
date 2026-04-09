'use client';

import { useState } from 'react';
import { Zap, X } from 'lucide-react';

export default function SubscriptionBanner({ documentCount }: { documentCount: number }) {
  const [dismissed, setDismissed] = useState(false);
  const remaining = Math.max(0, 3 - documentCount);

  if (dismissed) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl p-4 flex items-start gap-4">
      <div className="flex-shrink-0 mt-0.5">
        <Zap size={20} className="text-yellow-300" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">
          フリープランをご利用中 — 残り{remaining}件無料で生成できます
        </p>
        <p className="text-blue-100 text-xs mt-1">
          プロプランにアップグレードすると無制限で書類を生成できます（¥2,980/月）
        </p>
        <a
          href="/api/stripe/checkout"
          className="inline-block mt-2 bg-yellow-400 hover:bg-yellow-300 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
        >
          プロにアップグレード →
        </a>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-blue-200 hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}
