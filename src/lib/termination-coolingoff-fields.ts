/** 途中解約・クーリングオフ同意書のフォームフィールド定義型 */
export interface TerminationCoolingOffFieldDef {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'date';
  options: string[];
  required: boolean;
  description?: string;
}

/**
 * 途中解約・クーリングオフ同意書のフォームフィールド定義。
 * フロントエンドのフォームレンダリングおよびバリデーションに使用する。
 */
export const TERMINATION_COOLINGOFF_FIELDS: TerminationCoolingOffFieldDef[] = [
  {
    id: 'client_name',
    label: '氏名（フルネーム）',
    type: 'text',
    options: [],
    required: true,
    description: '姓と名の間にスペースを入れてください。',
  },
  {
    id: 'contract_date',
    label: '契約日',
    type: 'date',
    options: [],
    required: true,
    description: '',
  },
  {
    id: 'signed_date',
    label: '同意日',
    type: 'date',
    options: [],
    required: true,
    description: '',
  },
  {
    id: 'cooling_off_applicability_status',
    label: 'クーリングオフの適用可能性',
    type: 'radio',
    options: [
      '本契約は、条件を満たす場合にクーリングオフ制度の対象となる可能性があります',
      '本契約は、クーリングオフ制度の対象外となる場合があります',
    ],
    required: true,
    description: '契約形態・契約場所・契約内容により異なります。',
  },
  {
    id: 'cooling_off_period_detail',
    label: 'クーリングオフ期間・条件の説明（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: '例：契約書面受領日を含め8日以内に、書面または法令上認められる方法で通知する必要があります。',
  },
  {
    id: 'midterm_cancellation_status',
    label: '中途解約に関する基本方針',
    type: 'radio',
    options: [
      '契約期間中は、条件に従って中途解約が可能です',
      '中途解約の可否および精算方法は契約内容に従います',
    ],
    required: true,
    description: '',
  },
  {
    id: 'refund_calculation_detail',
    label: '返金・精算方法の説明（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: '例：提供済みサービス相当額および所定の事務手数料等を差し引いた残額を返金します。',
  },
  {
    id: 'penalty_detail',
    label: '違約金・事務手数料等の説明（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: '上限・計算方法・発生条件があれば記載してください。',
  },
  {
    id: 'cancellation_procedure_detail',
    label: '解約手続きの方法（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: '例：書面、メール、所定フォーム等でお申し出ください。',
  },
  {
    id: 'special_notes',
    label: '特記事項（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: 'その他、伝えておきたい事項があればご記入ください。',
  },
  {
    id: 'policy_read_status',
    label: '説明内容の確認',
    type: 'checkbox',
    options: ['途中解約・クーリングオフに関する説明を読み、理解しました。'],
    required: true,
    description: '',
  },
  {
    id: 'consent_confirmed',
    label: '最終同意',
    type: 'checkbox',
    options: ['上記内容を確認のうえ、同意します。'],
    required: true,
    description: '',
  },
];
