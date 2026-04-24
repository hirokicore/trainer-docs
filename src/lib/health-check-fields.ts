/** 健康状態確認書のフォームフィールド定義型 */
export interface HealthCheckFieldDef {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'date' | 'select';
  options: string[];
  required: boolean;
  description?: string;
}

/**
 * 健康状態確認書のフォームフィールド定義。
 * フロントエンドのフォームレンダリングおよびバリデーションに使用する。
 */
export const HEALTH_CHECK_FIELDS: HealthCheckFieldDef[] = [
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
    label: '記入日',
    type: 'date',
    options: [],
    required: true,
    description: '',
  },
  {
    id: 'current_treatment_status',
    label: '現在、治療中または通院中のご病気はありますか？',
    type: 'radio',
    options: ['はい', 'いいえ'],
    required: true,
    description: '',
  },
  {
    id: 'current_treatment_detail',
    label: '現在治療中・通院中の病名・症状・治療内容（ある場合）',
    type: 'textarea',
    options: [],
    required: false,
    description: '医師から説明を受けている範囲で構いません。差し支えない範囲でご記入ください。',
  },
  {
    id: 'past_illness_status',
    label: '過去に大きなご病気や手術のご経験はありますか？',
    type: 'radio',
    options: ['はい', 'いいえ'],
    required: true,
    description: '',
  },
  {
    id: 'past_illness_detail',
    label: '主な既往歴・手術歴（ある場合）',
    type: 'textarea',
    options: [],
    required: false,
    description: '心臓・呼吸器・脳・整形外科疾患など、運動に影響のあるものがあればご記入ください。',
  },
  {
    id: 'medication_status',
    label: '現在、常時または定期的に服用しているお薬はありますか？',
    type: 'radio',
    options: ['はい', 'いいえ'],
    required: true,
    description: '',
  },
  {
    id: 'medication_detail',
    label: '服用中のお薬の名称・目的（ある場合）',
    type: 'textarea',
    options: [],
    required: false,
    description: '正式名称が分からない場合は「血圧の薬」など分かる範囲で構いません。',
  },
  {
    id: 'doctor_restriction_status',
    label: '医師から運動・身体活動について制限や注意指示を受けていますか？',
    type: 'radio',
    options: ['はい', 'いいえ'],
    required: true,
    description: '',
  },
  {
    id: 'doctor_restriction_detail',
    label: '医師からの運動制限・注意事項（ある場合）',
    type: 'textarea',
    options: [],
    required: false,
    description: '例：激しい有酸素運動は控えるように言われている、など。',
  },
  {
    id: 'exercise_experience_status',
    label: 'これまでの運動習慣について',
    type: 'select',
    options: [
      '現在も定期的に運動している',
      '以前は運動していたが、ここ1年以上はほとんどしていない',
      'これまでほとんど運動習慣がない',
    ],
    required: true,
    description: '',
  },
  {
    id: 'exercise_experience_detail',
    label: 'これまでの主な運動経験（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: 'スポーツの種類や頻度などがあればご記入ください。',
  },
  {
    id: 'injury_history_status',
    label: '過去または現在、運動に影響するケガや痛みはありますか？',
    type: 'radio',
    options: ['はい', 'いいえ'],
    required: true,
    description: '',
  },
  {
    id: 'injury_history_detail',
    label: 'ケガ・痛みの部位や状況（ある場合）',
    type: 'textarea',
    options: [],
    required: false,
    description: '例：右膝の痛み、腰痛がある、肩を脱臼したことがある、など。',
  },
  {
    id: 'other_health_notes',
    label: 'その他、トレーニングにあたり事前に伝えておきたい健康上の注意点（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: 'アレルギー、睡眠、メンタルヘルスなど、配慮してほしい点があればご記入ください。',
  },
  {
    id: 'emergency_contact_name',
    label: '緊急連絡先お名前',
    type: 'text',
    options: [],
    required: true,
    description: '',
  },
  {
    id: 'emergency_contact_relationship',
    label: '続柄',
    type: 'text',
    options: [],
    required: true,
    description: '例：配偶者、親、兄弟など。',
  },
  {
    id: 'emergency_contact_phone',
    label: '緊急連絡先電話番号',
    type: 'text',
    options: [],
    required: true,
    description: '',
  },
  {
    id: 'health_declaration_confirmed',
    label: '申告内容に関する確認',
    type: 'checkbox',
    options: ['上記の申告内容は、現在把握している範囲で正確かつ誠実に記入しました。'],
    required: true,
    description: '',
  },
  {
    id: 'consent_confirmed',
    label: '最終同意',
    type: 'checkbox',
    options: ['本健康状態確認書の内容を理解し、自己の判断と責任においてトレーニングに参加することに同意します。'],
    required: true,
    description: '',
  },
];
