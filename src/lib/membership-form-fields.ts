/** 入会申込書のフォームフィールド定義型 */
export interface MembershipFormFieldDef {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'date';
  options: string[];
  required: boolean;
  description?: string;
}

/**
 * 入会申込書のフォームフィールド定義。
 * フロントエンドのフォームレンダリングおよびバリデーションに使用する。
 */
export const MEMBERSHIP_FORM_FIELDS: MembershipFormFieldDef[] = [
  // ── お客様情報 ─────────────────────────────────────────────────────
  {
    id: 'client_name',
    label: 'お名前',
    type: 'text',
    options: [],
    required: true,
    description: '氏名をご記入ください。',
  },
  {
    id: 'client_kana',
    label: 'お名前（カナ）',
    type: 'text',
    options: [],
    required: true,
    description: 'フリガナをカタカナでご記入ください。',
  },
  {
    id: 'date_of_birth',
    label: '生年月日',
    type: 'date',
    options: [],
    required: true,
  },
  {
    id: 'gender_status',
    label: '性別',
    type: 'radio',
    options: ['男性', '女性', 'その他', '回答しない'],
    required: false,
  },
  {
    id: 'client_address',
    label: 'ご住所',
    type: 'text',
    options: [],
    required: true,
    description: '都道府県から番地までご記入ください。',
  },
  {
    id: 'client_phone',
    label: '電話番号',
    type: 'text',
    options: [],
    required: true,
    description: '連絡のとれる電話番号をご記入ください。',
  },
  {
    id: 'client_email',
    label: 'メールアドレス',
    type: 'text',
    options: [],
    required: true,
  },
  {
    id: 'client_affiliation',
    label: 'ご所属（会社・学校等）',
    type: 'text',
    options: [],
    required: false,
    description: '任意項目です。',
  },
  // ── 緊急連絡先 ─────────────────────────────────────────────────────
  {
    id: 'emergency_contact_name',
    label: '緊急連絡先：お名前',
    type: 'text',
    options: [],
    required: true,
    description: 'ご家族など、緊急時に連絡できる方のお名前をご記入ください。',
  },
  {
    id: 'emergency_contact_relation',
    label: '緊急連絡先：続柄',
    type: 'text',
    options: [],
    required: true,
    description: '例：母、配偶者、兄 など',
  },
  {
    id: 'emergency_contact_phone',
    label: '緊急連絡先：電話番号',
    type: 'text',
    options: [],
    required: true,
  },
  // ── ご契約内容 ─────────────────────────────────────────────────────
  {
    id: 'membership_plan',
    label: 'ご希望プラン',
    type: 'radio',
    options: ['月4回プラン', '月8回プラン', '月12回プラン', '都度払い', 'その他'],
    required: true,
    description: 'ご希望のプランを選択してください。',
  },
  {
    id: 'membership_plan_detail',
    label: 'プラン詳細・備考',
    type: 'text',
    options: [],
    required: false,
    description: '「その他」を選択した場合や補足事項があればご記入ください。',
  },
  {
    id: 'start_date',
    label: 'ご利用開始希望日',
    type: 'date',
    options: [],
    required: true,
  },
  {
    id: 'payment_method_status',
    label: 'お支払い方法',
    type: 'radio',
    options: ['銀行振込', 'クレジットカード', '現金払い', 'その他'],
    required: true,
  },
  {
    id: 'payment_method_detail',
    label: 'お支払い詳細',
    type: 'text',
    options: [],
    required: false,
    description: '「その他」を選択した場合や補足事項があればご記入ください。',
  },
  {
    id: 'preferred_days_items',
    label: 'ご希望曜日',
    type: 'checkbox',
    options: ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日', '不問'],
    required: true,
    description: 'ご希望の曜日をすべて選択してください。',
  },
  {
    id: 'preferred_time_detail',
    label: 'ご希望時間帯',
    type: 'text',
    options: [],
    required: false,
    description: '例：午前中、18時以降 など',
  },
  // ── トレーニング目的・目標 ─────────────────────────────────────────
  {
    id: 'training_purpose_items',
    label: 'ご利用目的',
    type: 'checkbox',
    options: [
      'ダイエット・体重管理',
      '筋肉増量・ボディメイク',
      '体力・持久力の向上',
      '姿勢改善・体の歪み矯正',
      '健康維持・生活習慣改善',
      'スポーツパフォーマンス向上',
      'リハビリ・機能回復',
      'その他',
    ],
    required: true,
    description: '当てはまるものをすべて選択してください。',
  },
  {
    id: 'training_goal_detail',
    label: '具体的な目標',
    type: 'textarea',
    options: [],
    required: false,
    description: '例：3ヶ月で5kg減量したい、フルマラソンを完走したい など',
  },
  // ── 各種同意 ───────────────────────────────────────────────────────
  {
    id: 'terms_consent_status',
    label: '会員規約への同意',
    type: 'checkbox',
    options: ['会員規約の内容を確認し、同意します。'],
    required: true,
    description: '会員規約に同意いただける場合はチェックを入れてください。',
  },
  {
    id: 'privacy_consent_status',
    label: '個人情報の取り扱いへの同意',
    type: 'checkbox',
    options: ['個人情報の取り扱いに関する説明を受け、同意します。'],
    required: true,
    description: '個人情報の利用目的・管理方法について同意いただける場合はチェックを入れてください。',
  },
  {
    id: 'contact_permission_status',
    label: '連絡・広告についての許諾',
    type: 'radio',
    options: ['許可します', '許可しません'],
    required: false,
    description: 'キャンペーン情報やお知らせのご連絡を行う場合があります。',
  },
  // ── 未成年者対応 ───────────────────────────────────────────────────
  {
    id: 'minor_status',
    label: '年齢確認',
    type: 'radio',
    options: ['18歳以上です', '18歳未満です'],
    required: true,
    description: '18歳未満の場合は保護者の同意が必要です。',
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
    id: 'guardian_phone',
    label: '保護者電話番号（未成年の場合のみ）',
    type: 'text',
    options: [],
    required: false,
    description: '18歳未満の方は保護者の連絡先電話番号をご記入ください。',
  },
  // ── 備考・最終確認 ─────────────────────────────────────────────────
  {
    id: 'special_notes',
    label: '備考・特記事項',
    type: 'textarea',
    options: [],
    required: false,
    description: 'トレーナーに事前に伝えておきたいことがあればご記入ください。',
  },
  {
    id: 'consent_confirmed',
    label: '最終確認・同意',
    type: 'checkbox',
    options: ['本申込書の内容をすべて確認し、同意のうえ申し込みます。'],
    required: true,
    description: '同意される場合はチェックを入れてください。',
  },
  {
    id: 'signed_date',
    label: '申込日',
    type: 'date',
    options: [],
    required: false,
    description: '未入力の場合は本日の日付が使用されます。',
  },
];
