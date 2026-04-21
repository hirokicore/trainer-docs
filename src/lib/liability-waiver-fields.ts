/** 免責同意書のフォームフィールド定義型 */
export interface LiabilityWaiverFieldDef {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'date';
  options: string[];
  required: boolean;
  description?: string;
}

/**
 * 免責同意書のフォームフィールド定義。
 * フロントエンドのフォームレンダリングおよびバリデーションに使用する。
 */
export const LIABILITY_WAIVER_FIELDS: LiabilityWaiverFieldDef[] = [
  {
    id: 'service_items',
    label: '提供されるサービス内容',
    type: 'checkbox',
    options: [
      'パーソナルトレーニング（対面）',
      'パーソナルトレーニング（オンライン）',
      '食事指導・栄養サポート',
      '姿勢・動作分析',
      'ストレッチ・コンディショニング',
      'その他',
    ],
    required: true,
    description: '今回のご契約に含まれるサービスをすべて選択してください。',
  },
  {
    id: 'delivery_mode_status',
    label: '実施形態',
    type: 'radio',
    options: ['対面のみ', 'オンラインのみ', '対面・オンライン両方'],
    required: true,
    description: 'トレーニングの実施形態を選択してください。',
  },
  {
    id: 'risk_understanding_status',
    label: '運動・指導に伴うリスクの理解',
    type: 'radio',
    options: ['理解しました', '確認が必要です'],
    required: true,
    description:
      '筋肉痛・疲労・転倒・筋損傷・既往症の悪化など、運動や指導に伴う一般的なリスクがあることを理解していますか？',
  },
  {
    id: 'health_disclosure_status',
    label: '健康状態申告の重要性の理解',
    type: 'radio',
    options: ['理解しました', '確認が必要です'],
    required: true,
    description:
      '健康状態確認書または口頭での申告内容が、安全な指導のために重要であることを理解していますか？',
  },
  {
    id: 'symptom_report_status',
    label: '体調不良時の申告義務の理解',
    type: 'radio',
    options: ['理解しました', '確認が必要です'],
    required: true,
    description:
      'トレーニング前・中・後に体調の異変を感じた場合は、速やかにトレーナーへ申告することを理解していますか？',
  },
  {
    id: 'medical_consultation_status',
    label: '医師への相談が必要な場合があることの理解',
    type: 'radio',
    options: ['理解しました', '確認が必要です'],
    required: true,
    description:
      '持病・妊娠・服薬中などの場合は、トレーニング開始前に医師へ相談する必要があることを理解していますか？',
  },
  {
    id: 'liability_consent_status',
    label: '免責条項への同意',
    type: 'radio',
    options: ['同意します', '同意しません'],
    required: true,
    description:
      '運動に伴う一般的なリスクを理解したうえで自らの意思で参加し、通常想定される範囲の事故や体調不良について、事業者・トレーナーに対して過度な責任追及を行わないことに同意しますか？（事業者・トレーナーの故意または重大な過失による損害はこの限りではありません。）',
  },
  {
    id: 'minor_status',
    label: '未成年かどうか',
    type: 'radio',
    options: ['18歳以上です', '18歳未満です'],
    required: true,
    description: 'ご年齢をお知らせください。18歳未満の場合は保護者の同意が必要です。',
  },
  {
    id: 'guardian_name',
    label: '保護者氏名（未成年の場合のみ）',
    type: 'text',
    options: [],
    required: false,
    description: '18歳未満の方は保護者の氏名をご記入ください。',
  },
  {
    id: 'special_notes',
    label: 'その他・特記事項',
    type: 'textarea',
    options: [],
    required: false,
    description: '上記以外に、トレーナーに事前に伝えておきたいことがあればご記入ください。',
  },
  {
    id: 'consent_confirmed',
    label: '最終同意',
    type: 'checkbox',
    options: ['本書の内容をすべて読み、理解したうえで同意します。'],
    required: true,
    description: '同意される場合はチェックを入れてください。',
  },
  {
    id: 'signed_date',
    label: '署名日',
    type: 'date',
    options: [],
    required: true,
  },
];
