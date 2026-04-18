import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 — TrainerDocs',
};

export default function TokushohoPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-5 py-16">
        <h1 className="text-2xl font-bold text-gray-900 mb-10 pb-4 border-b border-gray-200">
          特定商取引法に基づく表記
        </h1>

        <dl className="space-y-8">
          {/* 事業者名 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              事業者名
            </dt>
            <dd className="text-gray-900">{`{{businessName}}`}</dd>
          </div>

          {/* 運営責任者 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              運営責任者
            </dt>
            <dd className="text-gray-900">{`{{representativeName}}`}</dd>
          </div>

          {/* 所在地 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              所在地
            </dt>
            <dd className="text-gray-900">{`{{businessAddress}}`}</dd>
          </div>

          {/* 電話番号 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              電話番号
            </dt>
            <dd className="text-gray-900">
              {`{{phoneNumber}}`}
              <span className="text-gray-500 text-sm ml-2">
                ※お問い合わせはメールにて優先的に受け付けております。電話でのお問い合わせは{`{{phoneAvailableHours}}`}に対応しております。
              </span>
            </dd>
          </div>

          {/* メールアドレス */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              メールアドレス
            </dt>
            <dd className="text-gray-900">{`{{email}}`}</dd>
          </div>

          {/* 販売価格 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              販売価格
            </dt>
            <dd>
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-2 border border-gray-200 font-semibold text-gray-700">
                      プラン
                    </th>
                    <th className="text-left px-4 py-2 border border-gray-200 font-semibold text-gray-700">
                      月額料金（税込）
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-900">
                  <tr>
                    <td className="px-4 py-2 border border-gray-200">Free</td>
                    <td className="px-4 py-2 border border-gray-200">無料</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border border-gray-200">Standard</td>
                    <td className="px-4 py-2 border border-gray-200">1,480円</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border border-gray-200">Pro</td>
                    <td className="px-4 py-2 border border-gray-200">2,980円</td>
                  </tr>
                </tbody>
              </table>
            </dd>
          </div>

          {/* 商品代金以外の必要料金 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              商品代金以外の必要料金
            </dt>
            <dd className="text-gray-900 text-sm leading-relaxed">
              インターネット接続に必要な通信料・機器費用等は、お客様のご負担となります。
              <br />
              当サービス自体に、上記以外の追加料金は発生しません。
            </dd>
          </div>

          {/* 支払方法 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              支払方法
            </dt>
            <dd className="text-gray-900 text-sm leading-relaxed">
              クレジットカード決済（Visa・Mastercard・American Express・JCB）
              <br />
              <span className="text-gray-500">
                ※決済代行サービスにはStripeを使用しています。
              </span>
            </dd>
          </div>

          {/* 支払時期 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              支払時期
            </dt>
            <dd className="text-gray-900 text-sm leading-relaxed">
              ご契約月の決済日に自動で課金されます。以降、毎月同日に自動更新されます。
            </dd>
          </div>

          {/* サービス提供時期 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              サービス提供時期
            </dt>
            <dd className="text-gray-900 text-sm leading-relaxed">
              お支払い完了後、即時ご利用いただけます。
            </dd>
          </div>

          {/* 動作環境 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              動作環境
            </dt>
            <dd className="text-gray-900 text-sm leading-relaxed">
              本サービスはWebブラウザ上で動作します。
              <br />
              推奨環境：Google Chrome・Safari・Firefox・Microsoft Edgeの最新バージョン
              <br />
              <span className="text-gray-500">
                ※Internet Explorerには対応しておりません。
                <br />
                ※スマートフォン・タブレットからもご利用いただけますが、一部機能はPC環境を推奨します。
              </span>
            </dd>
          </div>

          {/* キャンセル・解約 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              キャンセル・解約について
            </dt>
            <dd className="text-gray-900 text-sm leading-relaxed">
              解約はマイページの「プラン設定」からいつでも手続きいただけます。
              <br />
              解約手続きを行った場合、当該請求期間の末日までサービスをご利用いただけます。
              <br />
              期間の途中での解約であっても、残り期間分の日割り返金は行っておりません。
              <br />
              無料プランへのダウングレードも同様の手順で行えます。
            </dd>
          </div>

          {/* 返金 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              返金について
            </dt>
            <dd className="text-gray-900 text-sm leading-relaxed">
              デジタルコンテンツ・SaaSサービスの性質上、原則として返金には対応しておりません。
              <br />
              ただし、当サービス側の重大な不具合等によりサービスが提供できない場合は、個別にご相談のうえ対応いたします。
              <br />
              ご不明な点は {`{{email}}`} までお問い合わせください。
            </dd>
          </div>

          {/* その他 */}
          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              その他
            </dt>
            <dd className="text-gray-900 text-sm leading-relaxed">
              本表記は予告なく変更される場合があります。変更後の内容は本ページに掲載した時点で効力を生じるものとします。
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

// =============================================================
// TODO: 以下のプレースホルダを実データに置き換える
// =============================================================
// - {{businessName}}        : 事業者名（屋号または法人名）
// - {{representativeName}}  : 運営責任者の氏名（フルネーム）
// - {{businessAddress}}     : 事業所の住所（都道府県から番地まで）
// - {{phoneNumber}}         : 電話番号（例: 03-XXXX-XXXX）
// - {{phoneAvailableHours}} : 電話対応時間（例: 平日10:00〜18:00）
// - {{email}}               : お問い合わせ用メールアドレス（2か所に出現）
// =============================================================
