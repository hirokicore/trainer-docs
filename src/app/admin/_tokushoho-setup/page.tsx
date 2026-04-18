/**
 * 管理者専用ページ：特定商取引法 事業者情報 設定フォーム
 *
 * ⚠️  このページは認証なしでアクセスできます。
 *     本番運用前に middleware または layout で管理者認証を追加してください。
 *     例: Supabase Auth + profiles.role === 'admin' チェック
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import {
  getTokushohoSettings,
  upsertTokushohoSettings,
} from '@/lib/tokushohoSettingsRepo';

export const metadata: Metadata = {
  title: '特商法 設定 — TrainerDocs 管理画面',
};

// HTML5 バリデーションで賄えないサーバー側必須チェック
function validatePayload(data: Record<string, string>): string | null {
  const required: [string, string][] = [
    ['businessName', '事業者名'],
    ['representativeName', '運営責任者氏名'],
    ['businessAddress', '所在地'],
    ['phoneNumber', '電話番号'],
    ['phoneAvailableHours', '電話対応時間'],
    ['email', 'メールアドレス'],
  ];
  for (const [key, label] of required) {
    if (!data[key]?.trim()) return `${label} は必須です。`;
  }
  // email 形式チェック（簡易）
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data['email'])) {
    return 'メールアドレスの形式が正しくありません。';
  }
  return null;
}

export default async function TokushohoSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const settings = await getTokushohoSettings();

  async function handleSave(formData: FormData) {
    'use server';

    const payload = {
      businessName:        (formData.get('businessName')        as string) ?? '',
      representativeName:  (formData.get('representativeName')  as string) ?? '',
      businessAddress:     (formData.get('businessAddress')     as string) ?? '',
      phoneNumber:         (formData.get('phoneNumber')         as string) ?? '',
      phoneAvailableHours: (formData.get('phoneAvailableHours') as string) ?? '',
      email:               (formData.get('email')               as string) ?? '',
    };

    const validationError = validatePayload(payload);
    if (validationError) {
      redirect(
        `/admin/tokushoho-setup?error=${encodeURIComponent(validationError)}`,
      );
    }

    await upsertTokushohoSettings(payload);
    redirect('/legal/tokushoho');
  }

  const fieldClass =
    'mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';
  const labelClass = 'block text-sm font-medium text-gray-700';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-5 py-14">
        {/* ヘッダー */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            管理画面
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            特定商取引法 事業者情報 設定
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            保存後、<code className="text-xs bg-gray-100 px-1 rounded">/legal/tokushoho</code> に反映されます。
          </p>
        </div>

        {/* バリデーションエラー */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={handleSave} className="space-y-6 bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
          {/* 事業者名 */}
          <div>
            <label htmlFor="businessName" className={labelClass}>
              事業者名 <span className="text-red-500">*</span>
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              required
              defaultValue={settings?.businessName ?? ''}
              placeholder="例: 〇〇フィットネス / 山田 太郎"
              className={fieldClass}
            />
          </div>

          {/* 運営責任者氏名 */}
          <div>
            <label htmlFor="representativeName" className={labelClass}>
              運営責任者氏名 <span className="text-red-500">*</span>
            </label>
            <input
              id="representativeName"
              name="representativeName"
              type="text"
              required
              defaultValue={settings?.representativeName ?? ''}
              placeholder="例: 山田 太郎"
              className={fieldClass}
            />
          </div>

          {/* 所在地 */}
          <div>
            <label htmlFor="businessAddress" className={labelClass}>
              所在地 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="businessAddress"
              name="businessAddress"
              required
              rows={2}
              defaultValue={settings?.businessAddress ?? ''}
              placeholder="例: 東京都渋谷区〇〇1-2-3"
              className={fieldClass}
            />
          </div>

          {/* 電話番号 */}
          <div>
            <label htmlFor="phoneNumber" className={labelClass}>
              電話番号 <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              required
              defaultValue={settings?.phoneNumber ?? ''}
              placeholder="例: 03-XXXX-XXXX　または「開示請求があった場合は遅滞なく開示します」"
              className={fieldClass}
            />
          </div>

          {/* 電話対応時間 */}
          <div>
            <label htmlFor="phoneAvailableHours" className={labelClass}>
              電話対応時間 <span className="text-red-500">*</span>
            </label>
            <input
              id="phoneAvailableHours"
              name="phoneAvailableHours"
              type="text"
              required
              defaultValue={settings?.phoneAvailableHours ?? ''}
              placeholder="例: 平日10:00〜18:00"
              className={fieldClass}
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className={labelClass}>
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={settings?.email ?? ''}
              placeholder="例: support@example.com"
              className={fieldClass}
            />
          </div>

          {/* 保存ボタン */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white hover:bg-brand-700 transition-colors"
            >
              保存して特商法ページを確認
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
