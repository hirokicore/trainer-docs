import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー — TrainerDocs',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5 py-16">

        <h1 className="text-2xl font-bold text-gray-900 mb-2 pb-4 border-b border-gray-200">
          プライバシーポリシー
        </h1>

        <p className="text-gray-700 text-sm leading-relaxed mt-8 mb-10">
          TrainerDocs（大家 博輝）（以下「当社」）は、TrainerDocs（以下「本サービス」）をご利用いただくお客様の個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。
        </p>

        {/* 1 */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-3">1. 取得する情報</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            本サービスでは、以下の情報を取得する場合があります。
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 pl-1">
            <li>氏名・メールアドレス（アカウント登録時）</li>
            <li>決済に関する情報（クレジットカード情報は当社では保持せず、決済代行サービスのStripeが管理します）</li>
            <li>本サービス内で作成・入力された契約書類の情報</li>
            <li>アクセスログ・利用履歴（IPアドレス、ブラウザ種別、操作履歴等）</li>
            <li>お問い合わせ内容</li>
          </ul>
        </section>

        {/* 2 */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-3">2. 情報の利用目的</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            取得した情報は、以下の目的に利用します。
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 pl-1">
            <li>本サービスのアカウント管理および提供</li>
            <li>決済処理および請求管理</li>
            <li>サービスの改善・新機能開発のための分析</li>
            <li>お問い合わせへの対応</li>
            <li>利用規約違反等への対処</li>
            <li>法令に基づく対応</li>
          </ul>
        </section>

        {/* 3 */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-3">3. 決済情報の取扱い（Stripe利用）</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            本サービスの決済は、Stripe, Inc. が提供する決済サービス「Stripe」を利用しています。クレジットカード番号等の決済情報は、当社のサーバーには送信・保存されず、Stripe が直接管理します。Stripe のプライバシーポリシーについては、
            <a
              href="https://stripe.com/jp/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
            >
              https://stripe.com/jp/privacy
            </a>
            をご参照ください。
          </p>
        </section>

        {/* 4 */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-3">4. 外部サービスの利用（決済・インフラ・AI・データ管理等）</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            本サービスでは、以下の外部サービスを利用しています。これらのサービスに提供される情報については、各サービスのプライバシーポリシーをご確認ください。
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 pl-1">
            <li>
              Stripe（決済処理）：
              <a href="https://stripe.com/jp/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-800">
                https://stripe.com/jp/privacy
              </a>
            </li>
            <li>
              Supabase（データ管理）：
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-800">
                https://supabase.com/privacy
              </a>
            </li>
            <li>
              Vercel（サービス提供基盤）：
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-800">
                https://vercel.com/legal/privacy-policy
              </a>
            </li>
            <li>
              Google（AIモデル利用：Gemini API 等）：
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2 hover:text-blue-800">
                https://policies.google.com/privacy
              </a>
            </li>
          </ul>
        </section>

        {/* 5 */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-3">5. AIサービスの利用について</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            本サービスでは、契約書類の生成補助等のために外部のAIサービス（例：Google Gemini API）を利用する場合があります。その際、本サービスに入力された情報のうち、生成処理に必要な範囲の情報が当該サービス提供者に送信されることがあります。
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            当社は、これらのサービスにおけるプライバシー設定や利用条件を確認し、可能な範囲で学習データとして利用されない設定を選択する、または利用する情報を最小限に留めるなど、利用者のプライバシーに配慮した運用を行うよう努めます。ただし、各サービス提供者のポリシー変更等により、利用条件が変更される可能性があることをご了承ください。
          </p>
        </section>

        {/* 6 */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-3">6. 第三者提供</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            当社は、以下の場合を除き、お客様の個人情報を第三者に提供しません。
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 pl-1">
            <li>お客様本人の同意がある場合</li>
            <li>法令に基づく場合（捜査機関等からの法的要請等）</li>
            <li>人の生命・身体・財産の保護のために必要な場合</li>
          </ul>
        </section>

        {/* 7 */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-3">7. Cookie・アクセス解析等の利用</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            本サービスでは、サービスの利便性向上および利用状況の把握を目的として、Cookie およびアクセス解析ツールを使用する場合があります。Cookie はブラウザの設定により無効にすることができますが、その場合、本サービスの一部機能がご利用いただけなくなる場合があります。
            <br />
            （Google Analytics 等のアクセス解析ツールは現時点では使用していません。）
          </p>
        </section>

        {/* 8 */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-3">8. 安全管理措置</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            当社は、取得した個人情報への不正アクセス・紛失・破壊・改ざん・漏洩等を防止するため、適切な技術的・組織的安全管理措置を講じます。ただし、インターネットを通じた通信の完全な安全性を保証するものではありません。
          </p>
        </section>

        {/* 9 */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-3">9. 開示、訂正、削除等の請求</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            お客様は、当社が保有するご自身の個人情報について、開示・訂正・削除・利用停止等を請求することができます。ご希望の場合は、下記お問い合わせ窓口までご連絡ください。本人確認のうえ、合理的な範囲で対応いたします。
          </p>
        </section>

        {/* 10 */}
        <section className="mb-10">
          <h2 className="text-base font-bold text-gray-900 mb-3">10. プライバシーポリシーの変更</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            本プライバシーポリシーは、法令の改正やサービス内容の変更に伴い、予告なく改定する場合があります。重要な変更がある場合は、本サービス上でお知らせします。変更後のポリシーは、本ページに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        {/* 11 */}
        <section className="mb-12">
          <h2 className="text-base font-bold text-gray-900 mb-3">11. お問い合わせ窓口</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            個人情報の取扱いに関するお問い合わせは、下記までご連絡ください。
          </p>
          <dl className="text-sm text-gray-700 space-y-1.5">
            <div className="flex gap-2">
              <dt className="text-gray-500 shrink-0">事業者名</dt>
              <dd>TrainerDocs（大家 博輝）</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-500 shrink-0">運営責任者</dt>
              <dd>大家 博輝</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-500 shrink-0">所在地</dt>
              <dd>〒510-0263 三重県鈴鹿市郡山町2074-6 (9-24-6)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-gray-500 shrink-0">メールアドレス</dt>
              <dd>hiroki.oie.core@gmail.com</dd>
            </div>
          </dl>
        </section>

        {/* 制定日・改定日 */}
        <div className="border-t border-gray-200 pt-6 text-sm text-gray-500 space-y-1">
          <p>制定日：2026年4月20日</p>
          <p>最終改定日：2026年4月20日</p>
        </div>

      </div>
    </div>
  );
}

// =============================================================
// TODO: 以下のプレースホルダを実データに置き換える
// =============================================================
// - {{businessName}}       : 事業者名（冒頭と11節の2か所）
// - {{representativeName}} : 運営責任者の氏名
// - {{address}}            : 所在地
// - {{email}}              : お問い合わせ用メールアドレス
// - {{establishedDate}}    : 制定日（例: 2025年○月○日）
// - {{lastUpdatedDate}}    : 最終改定日（例: 2026年○月○日）
// =============================================================
