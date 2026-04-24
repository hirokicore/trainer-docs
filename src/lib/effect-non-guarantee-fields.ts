/** 効果保証なし・個人差に関する同意書のフォームフィールド定義型 */
export interface EffectNonGuaranteeFieldDef {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'date';
  options: string[];
  required: boolean;
  description?: string;
}

/**
 * 効果保証なし・個人差に関する同意書のフォームフィールド定義。
 * フロントエンドのフォームレンダリングおよびバリデーションに使用する。
 */
export const EFFECT_NON_GUARANTEE_FIELDS: EffectNonGuaranteeFieldDef[] = [
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
    description: '',
  },
  {
    id: 'expected_goal_items',
    label: '期待する目標・効果（複数選択、任意）',
    type: 'checkbox',
    options: [
      '体重・体脂肪の減少',
      '筋肉量の増加・引き締め',
      '体力・持久力の向上',
      '姿勢改善・体の歪み矯正',
      '健康維持・生活習慣の改善',
      'スポーツパフォーマンスの向上',
      'リハビリ・機能回復',
      'ストレス解消・メンタルヘルス向上',
    ],
    required: false,
    description: '該当するものをすべて選択してください（任意）。',
  },
  {
    id: 'expected_goal_detail',
    label: '具体的な目標の補足（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: '上記以外の目標や具体的な数値目標等があれば記載してください。',
  },
  {
    id: 'effect_non_guarantee_status',
    label: '効果保証なしの確認',
    type: 'radio',
    options: [
      'トレーニング指導は特定の効果・結果を保証するものではないことを理解しました',
      '上記について、説明を受け理解しました',
    ],
    required: true,
    description: 'トレーニングの成果には個人差があり、特定の結果を保証することはできません。',
  },
  {
    id: 'individual_difference_status',
    label: '個人差に関する確認',
    type: 'radio',
    options: [
      'トレーニング効果には個人差があり、同じプログラムでも結果が異なる場合があることを理解しました',
      '上記について、説明を受け理解しました',
    ],
    required: true,
    description: '年齢・体質・生活習慣・遺伝的要因等により、効果の現れ方は異なります。',
  },
  {
    id: 'result_influencing_factors_detail',
    label: '結果に影響する要因の説明（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: '例：食事・睡眠・ストレス・ホルモンバランス等の生活習慣が大きく影響します。',
  },
  {
    id: 'client_effort_requirement_detail',
    label: 'クライアントの自己努力に関する説明（任意）',
    type: 'textarea',
    options: [],
    required: false,
    description: '例：セッション外での自主的な取り組みや食事管理が結果に大きく影響します。',
  },
  {
    id: 'no_refund_for_unsatisfied_result_status',
    label: '不満足な結果に対する返金なしの確認',
    type: 'radio',
    options: [
      '期待通りの効果が得られなかった場合でも、返金・補償の請求はできないことを理解しました',
      '上記について、説明を受け理解しました',
    ],
    required: true,
    description: 'トレーナーは最善の指導を提供しますが、成果に対する金銭的保証は行いません。',
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
    label: 'ポリシー確認',
    type: 'checkbox',
    options: ['効果保証なし・個人差に関する説明を読み、理解しました。'],
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
