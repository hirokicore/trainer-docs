# TrainerDocs

パーソナルトレーナー向け契約書類 AI 自動生成 SaaS

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **認証 / DB**: Supabase
- **AI 生成**: Google Gemini 1.5 Flash
- **決済**: Stripe（月額サブスクリプション）
- **ホスティング**: Cloudflare Pages

---

## クイックスタート

### 1. 依存パッケージをインストール

```bash
cd trainer-docs
npm install
```

### 2. 環境変数を設定

```bash
cp .env.local.example .env.local
# .env.local を編集して各 API キーを設定
```

### 3. Supabase セットアップ

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. SQL Editor で `supabase/migrations/001_initial.sql` を実行
3. Authentication > URL Configuration で Site URL と Redirect URLs を設定:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 4. Stripe セットアップ

1. [Stripe](https://dashboard.stripe.com) でアカウント作成
2. 月額サブスクリプションの Product & Price を作成
3. Price ID を `NEXT_PUBLIC_STRIPE_PRICE_ID` に設定
4. Webhook エンドポイントを設定:
   - URL: `https://your-domain.pages.dev/api/stripe/webhook`
   - イベント: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
5. Webhook Secret を `STRIPE_WEBHOOK_SECRET` に設定

### 5. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 で確認

---

## Cloudflare Pages へのデプロイ

### 初回セットアップ

```bash
# Wrangler でログイン
npx wrangler login

# ビルド & デプロイ
npm run deploy
```

### 環境変数の設定

Cloudflare Dashboard > Pages > プロジェクト > Settings > Environment Variables に
`.env.local.example` の各変数を設定してください。

### wrangler.toml の設定

`wrangler.toml` の `name` をプロジェクト名に合わせて変更してください。

---

## プロジェクト構成

```
src/
├── app/
│   ├── page.tsx                    # ランディングページ
│   ├── auth/
│   │   ├── login/page.tsx          # ログイン
│   │   ├── signup/page.tsx         # 新規登録
│   │   └── callback/route.ts       # OAuth コールバック
│   ├── dashboard/
│   │   ├── layout.tsx              # サイドバーレイアウト
│   │   └── page.tsx                # ダッシュボード
│   ├── documents/
│   │   ├── new/page.tsx            # 書類新規作成フォーム
│   │   └── [id]/page.tsx           # 書類詳細 & PDF ダウンロード
│   └── api/
│       ├── documents/generate/     # Gemini API で書類生成
│       └── stripe/                 # Stripe チェックアウト / Webhook
├── components/
│   ├── ui/                         # Button, Input, Card
│   ├── layout/                     # Header, Footer
│   ├── auth/                       # AuthForm
│   └── documents/                  # TrainerForm, DocumentList, PdfDownload
├── lib/
│   ├── supabase/                   # client.ts / server.ts
│   ├── gemini.ts                   # Gemini 書類生成
│   └── stripe.ts                   # Stripe ユーティリティ
├── types/index.ts                  # 型定義
└── middleware.ts                   # 認証ルートガード
supabase/migrations/001_initial.sql # DB スキーマ
wrangler.toml                       # Cloudflare Pages 設定
```

---

## 対応書類

| 種別 | 内容 |
|------|------|
| トレーニング委託契約書 | トレーナーとクライアント間の基本契約 |
| 健康状態確認書 | クライアントの健康・既往歴確認 |
| 免責同意書 | リスク説明と免責事項への同意 |
| 入会申込書 | 会員登録申込フォーム |

---

## 注意事項

- 生成された書類はAIによるものであり、法的効力を完全に保証するものではありません
- 重要な契約には必ず弁護士等の法律専門家への確認をお勧めします
- PDF の日本語フォントは jsPDF のデフォルトフォントを使用しているため文字化けする場合があります。本番運用では日本語フォントファイルの組み込みを推奨します
