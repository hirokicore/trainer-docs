/** キャンセル・返金ポリシー同意書のフォームフィールド定義型 */
export interface CancellationPolicyFieldDef {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'date';
  options: string[];
  required: boolean;
  description?: string;
}

/**
 * キャンセル・返金ポリシー同意書のフォームフィールド定義。
 * フロントエンドのフォームレンダリングおよびバリデーションに使用する。
 */
export const CANCELLATION_POLICY_FIELDS: CancellationPolicyFieldDef[] = [
  {
    id: 'client_name',
    label: '氏名（フルネーム）',
    type: 'text',
    options: [],
    required: true,
    description: '姓と名の間にスペースを入れてください。',
  },
  {
    id: 'signed_date',
    label: '同意日',
    type: 'date',
    options: [],
    required: true,
  },
  {
    id: 'cancellation_policy_read_status',
    label: 'キャンセル・返金ポリシーの確認',
    type: 'checkbox',
    options: ['キャンセル・返金ポリシーの内容を読み、理解しました。'],
    required: true,
  },
  {
    id: 'cancellation_deadline_detail',
    label: 'キャンセル受付期限のルール',
    type: 'textarea',
    options: [],
    required: false,
    description: '例：予約日時の24時間前までのご連絡でキャンセル料無料',
  },
  {
    id: 'cancellation_fee_detail',
    label: 'キャンセル料に関するルール',
    type: 'textarea',
    options: [],
    required: false,
    description: '例：前日は料金の50％、当日は100％、無断キャンセルは1回分消化',
  },
  {
    id: 'refund_policy_status',
    label: '返金に関する基本方針',
    type: 'radio',
    options: [
      '原則として返金は行いません',
      '所定の条件を満たす場合のみ一部返金を行います',
    ],
    required: true,
  },
  {
    id: 'refund_policy_detail',
    label: '返金対象となるケース（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: '例：長期プランの途中解約、病気や怪我による継続不能など、返金が認められるケースを記載してください。',
  },
  {
    id: 'exception_cases_items',
    label: 'キャンセル料が免除される例外条件（任意）',
    type: 'checkbox',
    options: [
      '医師の診断書がある病気・怪我の場合',
      '天災・交通機関の大幅な乱れの場合',
      'その他、当社がやむを得ないと認める場合',
    ],
    required: false,
    description: '免除の対象となる例外条件をすべて選択してください。',
  },
  {
    id: 'exception_cases_detail',
    label: '例外条件の補足（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: '具体例や運営の裁量について補足がある場合はご記入ください。',
  },
  {
    id: 'policy_scope_items',
    label: '本ポリシーの適用対象（任意）',
    type: 'checkbox',
    options: [
      '単発セッション',
      '回数券・パッケージプラン',
      'オンライン指導',
    ],
    required: false,
    description: '本ポリシーが適用されるサービス種別をすべて選択してください。',
  },
  {
    id: 'consent_confirmed',
    label: '最終同意',
    type: 'checkbox',
    options: ['上記キャンセル・返金ポリシーを理解し、同意します。'],
    required: true,
    description: '同意される場合はチェックを入れてください。',
  },
];
