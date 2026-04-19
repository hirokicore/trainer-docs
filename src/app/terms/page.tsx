import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約 — TrainerDocs',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5 py-16">

        <h1 className="text-2xl font-bold text-gray-900 mb-2 pb-4 border-b border-gray-200">
          TrainerDocs 利用規約
        </h1>

        {/* 第1条 */}
        <section className="mt-10 mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第1条（適用）</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            本規約は、{'{{businessName}}'}（以下「当社」）が提供するTrainerDocs（以下「本サービス」）の利用に関する条件を定めるものです。本サービスをご利用いただくことで、本規約に同意したものとみなします。
          </p>
        </section>

        {/* 第2条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第2条（利用登録）</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            本サービスへの利用登録は、当社の定める方法により行うものとします。
            <br />
            当社は、以下に該当すると判断した場合、利用登録を拒否することがあります。
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 pl-1">
            <li>登録内容に虚偽の情報が含まれる場合</li>
            <li>過去に本規約違反等により利用停止・登録抹消の措置を受けた場合</li>
            <li>反社会的勢力に該当する場合</li>
            <li>その他、当社が不適切と判断した場合</li>
          </ul>
        </section>

        {/* 第3条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第3条（アカウント管理）</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>利用者は、自己の責任においてアカウント情報を管理するものとします。</li>
            <li>アカウントの第三者への貸与・譲渡・共有はできません。</li>
            <li>アカウント情報の不正利用により生じた損害について、当社は責任を負いません。</li>
            <li>アカウントへの不正アクセス等が発生した場合、速やかに当社までご連絡ください。</li>
          </ul>
        </section>

        {/* 第4条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第4条（サービス内容）</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>本サービスは、パーソナルトレーナー向けの契約書類作成をAIで支援するWebサービスです。</li>
            <li>本サービスが生成する書類はAIによる補助出力であり、法的妥当性・正確性を保証するものではありません。生成された書類の最終確認および利用判断は、利用者自身の責任において行うものとします。</li>
            <li>本サービスの内容は、将来予告なく変更される場合があります。</li>
          </ul>
        </section>

        {/* 第5条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第5条（Freeプランおよび有料プランの取扱い）</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Freeプランは、本サービスの試用・機能確認を目的としたプランです。Freeプランで生成した書類は、商用利用・実務利用を禁止します。参考・確認目的のみでご使用ください。</li>
            <li>現在、Freeプランでは画面上での閲覧のみが可能であり、PDF等のダウンロード機能は提供されません。</li>
            <li>Standard・Proプランは有料プランであり、実務利用を想定しています。ただし、第4条第2項に定めるとおり、出力内容の最終確認は利用者の責任において行うものとします。</li>
            <li>各プランの機能・制限・価格については、本サービス上に掲載する内容を基準とします。サービスの改良および市場環境の変化等により、将来、プラン内容および価格を変更する場合があります。</li>
          </ul>
        </section>

        {/* 第6条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第6条（料金、支払方法、更新）</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            有料プランの料金は以下のとおりです（税込）。
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 pl-1 mb-3">
            <li>Standard：月額1,480円</li>
            <li>Pro：月額2,980円</li>
          </ul>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>支払いはクレジットカード決済（Stripe）により行うものとします。</li>
            <li>有料プランは月単位の自動更新とし、利用者が解約手続きを行わない限り自動的に更新されます。</li>
            <li>利用者が更新日前に解約手続きを完了した場合、当該請求期間の末日まで本サービスをご利用いただけます。日割りによる返金は行いません。</li>
          </ul>
        </section>

        {/* 第7条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第7条（禁止事項）</h2>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">
            利用者は、以下の行為を行ってはなりません。
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-700 pl-1">
            <li>虚偽の情報による登録または他人へのなりすまし</li>
            <li>Freeプランで生成した書類の商用利用・実務利用</li>
            <li>本サービスの不正アクセス・リバースエンジニアリング・複製・改ざん</li>
            <li>本サービスへの過剰なリクエストや、サーバーに過負荷をかける行為</li>
            <li>反社会的勢力への利用または反社会的勢力と関係する者への提供</li>
            <li>違法行為または公序良俗に反する行為</li>
            <li>その他、当社が不適切と判断する行為</li>
          </ul>
        </section>

        {/* 第8条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第8条（利用停止・登録抹消）</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>当社は、利用者が本規約に違反した場合、または不正・過剰利用が確認された場合、事前通知なく利用停止・登録抹消の措置を取ることができます。</li>
            <li>前項の措置により利用者に生じた損害について、当社は責任を負いません。</li>
          </ul>
        </section>

        {/* 第9条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第9条（解約）</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>利用者は、当社の定める方法により解約手続きを行うことができます。</li>
            <li>解約手続きが完了した場合でも、当該請求期間の末日までは本サービスをご利用いただけます。</li>
            <li>解約後のアカウント情報およびデータの取扱いについては、当社のプライバシーポリシーに従うものとします。</li>
          </ul>
        </section>

        {/* 第10条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第10条（知的財産権）</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>本サービスに関する著作権・商標権その他の知的財産権は、当社または正当な権利者に帰属します。</li>
            <li>利用者が本サービスを通じて作成した書類の著作権は、利用者に帰属します。ただし、当社はサービス改善を目的として、個人を特定しない統計情報・利用傾向の分析に利用することがあります。</li>
          </ul>
        </section>

        {/* 第11条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第11条（免責事項）</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>本サービスが生成する書類はAIによる補助出力であり、法的効力・正確性を保証するものではありません。実務利用の際は、必要に応じて専門家への確認を推奨します。</li>
            <li>当社は、本サービスの利用により利用者または第三者に生じた損害について、当社の故意または重大な過失による場合を除き、責任を負いません。</li>
            <li>当社の損害賠償責任は、当該損害発生時点において利用者が直近1か月間に本サービスに対して支払った利用料金の総額を上限とします。</li>
          </ul>
        </section>

        {/* 第12条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第12条（サービス内容の変更・中断・終了）</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>当社は、サービス改善・保守・障害対応・その他の事由により、予告なく本サービスの一部または全部を変更・中断・終了することがあります。</li>
            <li>前項の措置により利用者に生じた損害について、当社は責任を負いません。</li>
            <li>本サービスを終了する場合、当社は利用者に対して事前に通知するよう努めます。</li>
          </ul>
        </section>

        {/* 第13条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第13条（規約変更）</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>当社は、必要に応じて本規約を変更することがあります。</li>
            <li>重要な変更がある場合は、本サービス上またはメールにて事前に通知します。</li>
            <li>変更後の規約は、本サービス上に掲載した時点で効力を生じるものとします。変更後も本サービスを継続してご利用いただいた場合、変更後の規約に同意したものとみなします。</li>
          </ul>
        </section>

        {/* 第14条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第14条（通知または連絡）</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            当社から利用者への通知は、本サービス上への掲載または登録メールアドレスへの送信により行います。メールアドレスの変更等により通知が届かなかった場合であっても、当社は責任を負いません。
          </p>
        </section>

        {/* 第15条 */}
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-3">第15条（権利義務の譲渡禁止）</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            利用者は、本規約上の地位または権利義務を、当社の事前の書面による同意なく第三者に譲渡・承継・担保に提供することはできません。
          </p>
        </section>

        {/* 第16条 */}
        <section className="mb-12">
          <h2 className="text-base font-bold text-gray-900 mb-3">第16条（準拠法および裁判管轄）</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            本規約は日本法に準拠します。本サービスに関する一切の紛争については、{'{{courtLocation}}'}地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>

        {/* 制定日・お問い合わせ */}
        <div className="border-t border-gray-200 pt-6 text-sm text-gray-500 space-y-1">
          <p>制定日：{'{{establishedDate}}'}</p>
          <p>最終改定日：{'{{lastUpdatedDate}}'}</p>
          <p className="mt-3">事業者名：{'{{businessName}}'}</p>
          <p>お問い合わせ：{'{{email}}'}</p>
        </div>

      </div>
    </div>
  );
}

// =============================================================
// TODO: 以下のプレースホルダを実データに置き換える
// =============================================================
// - {{businessName}}     : 事業者名（第1条・末尾の2か所）
// - {{courtLocation}}    : 管轄裁判所の所在地（例: 津、東京）
// - {{email}}            : お問い合わせ用メールアドレス（末尾）
// - {{establishedDate}}  : 制定日（例: 2025年○月○日）
// - {{lastUpdatedDate}}  : 最終改定日（例: 2026年○月○日）
// =============================================================
