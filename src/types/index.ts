// ──────────────────────────────────────────────
// 料金プラン定数
// ──────────────────────────────────────────────

/** スタンダードプランの月額料金（税込、円） */
export const STANDARD_PLAN_PRICE = 1480;

/** プロプランの月額料金（税込、円） */
export const PRO_PLAN_PRICE = 2980;

/** Freeプランの累計書類生成上限（件） */
export const FREE_TOTAL_LIMIT = 10;

// ──────────────────────────────────────────────
// 書類タイプ
// ──────────────────────────────────────────────

export type DocumentType =
  | 'training_contract'
  | 'pro_training_contract_v1'
  | 'health_check'
  | 'liability_waiver'
  | 'membership_form'
  | 'cancellation_policy'
  | 'mid_cancel_agreement'
  | 'effect_disclaimer';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  training_contract: 'トレーニング委託契約書',
  pro_training_contract_v1: 'トレーニング委託契約書（Pro・章立て版）',
  health_check: '健康状態確認書',
  liability_waiver: '免責同意書',
  membership_form: '入会申込書',
  cancellation_policy: 'キャンセル・返金ポリシー同意書',
  mid_cancel_agreement: '途中解約・クーリングオフ同意書',
  effect_disclaimer: '効果保証なし同意書',
};

/**
 * PDF 出力時に使うタイトルラベル。
 * 版別・管理用の表記を除いた正式名称のみを記載する。
 * 画面表示には DOCUMENT_TYPE_LABELS を使い、こちらは PDF 生成専用とする。
 */
export const PDF_DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  training_contract: 'パーソナルトレーニング委託契約書',
  pro_training_contract_v1: 'トレーニング委託契約書',
  health_check: '健康状態確認書',
  liability_waiver: '免責同意書',
  membership_form: '入会申込書',
  cancellation_policy: 'キャンセル・返金ポリシー同意書',
  mid_cancel_agreement: '途中解約・クーリングオフ同意書',
  effect_disclaimer: '効果保証なし同意書',
};

/** Proプラン専用の書類タイプ。Freeユーザーには選択肢を非表示・APIでも弾く。 */
export const PRO_ONLY_DOCUMENT_TYPES = new Set<DocumentType>([
  'pro_training_contract_v1',
]);

export interface TrainerFormData {
  // トレーナー情報
  trainerName: string;
  businessName: string;
  address: string;
  phone: string;
  email: string;

  // クライアント情報
  clientName: string;
  clientPhone: string;
  clientEmail: string;

  // 契約内容
  contractStartDate: string;
  contractEndDate: string;
  sessionFee: number;
  sessionCount: number;
  sessionDuration: number; // 分
  paymentMethod: string;

  // 書類種別
  documentType: DocumentType;

  // 特記事項
  notes: string;
}

export interface Document {
  id: string;
  user_id: string;
  document_type: DocumentType;
  title: string;
  content: string;
  form_data: TrainerFormData;
  created_at: string;
  updated_at: string;
}

// ──────────────────────────────────────────────
// ドキュメント生成ログ
// ──────────────────────────────────────────────

/** 生成失敗時のエラー分類コード */
export type GenerationErrorCode =
  | 'FORBIDDEN_PRO_TEMPLATE' // FreeユーザーがProテンプレートを要求
  | 'GEMINI_ERROR'           // Gemini API エラー（503 / 429 など）
  | 'UNKNOWN_ERROR';         // その他

/** document_generations テーブルへの INSERT 用型 */
export interface DocumentGenerationLog {
  user_id: string;
  document_type: string;
  template_id: string;
  is_subscribed: boolean;
  is_pro_template: boolean;
  status: 'success' | 'error';
  error_code?: GenerationErrorCode | null;
  duration_ms?: number | null;
  engine?: 'gemini' | 'template_only' | null;
  request_origin?: 'web' | 'api' | 'admin' | null;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_status: 'active' | 'inactive' | 'trialing' | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  plan?: 'free' | 'standard' | 'pro';
}
