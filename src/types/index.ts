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

// ──────────────────────────────────────────────
// 特記事項（構造化）
// ──────────────────────────────────────────────

/** 頻出パターンの特記事項を選択式で保持する型 */
export interface StructuredSpecialTerms {
  /** 交通費: 料金に含む / 別途実費 / 該当なし */
  transportationFee?: 'included' | 'separate' | 'not_applicable';
  /** 施設利用料: クライアント負担 / トレーナー負担 / 折半 / 該当なし */
  facilityFee?: 'client' | 'trainer' | 'split' | 'not_applicable';
  /** キャンセルポリシー: パターンA(24h) / パターンB(前日50%・当日100%) / パターンC(個別合意) */
  cancellationPolicy?: 'pattern_a' | 'pattern_b' | 'pattern_c';
  /** セッション形態: 対面のみ / オンラインのみ / 対面＋オンライン */
  sessionFormat?: 'in_person' | 'online' | 'both';
  /** 対面の場合の主な場所（任意） */
  sessionLocation?: string;
  /** 撮影・利用許諾: 許可 / 不可 / 都度確認 */
  photoConsent?: 'allowed' | 'not_allowed' | 'ask_each_time';
}

// ──────────────────────────────────────────────
// 免責同意書（フォーム固有データ）
// ──────────────────────────────────────────────

/** 免責同意書の書類固有フォームフィールド */
export interface LiabilityWaiverFormData {
  /** 提供サービス（複数選択） */
  service_items: string[];
  /** 実施形態 */
  delivery_mode_status: string;
  /** 運動リスクの理解 */
  risk_understanding_status: string;
  /** 健康状態申告の重要性の理解 */
  health_disclosure_status: string;
  /** 体調不良時の申告義務の理解 */
  symptom_report_status: string;
  /** 医師への相談が必要な場合の理解 */
  medical_consultation_status: string;
  /** 免責条項への同意 */
  liability_consent_status: string;
  /** 未成年かどうか */
  minor_status: '18歳以上です' | '18歳未満です';
  /** 保護者氏名（未成年の場合のみ必須） */
  guardian_name?: string;
  /** その他・特記事項 */
  special_notes?: string;
  /** 最終同意チェック */
  consent_confirmed: string[];
  /** 署名日（YYYY-MM-DD） */
  signed_date: string;
}

// ──────────────────────────────────────────────
// キャンセル・返金ポリシー同意書（フォーム固有データ）
// ──────────────────────────────────────────────

/** キャンセル・返金ポリシー同意書の書類固有フォームフィールド */
export interface CancellationPolicyFormData {
  /** クライアント氏名 */
  client_name: string;
  /** 同意日（YYYY-MM-DD） */
  signed_date: string;
  /** ポリシー確認チェック */
  cancellation_policy_read_status: string[];
  /** キャンセル受付期限のルール（任意） */
  cancellation_deadline_detail?: string;
  /** キャンセル料に関するルール（任意） */
  cancellation_fee_detail?: string;
  /** 返金に関する基本方針 */
  refund_policy_status: string;
  /** 返金対象となるケース（任意） */
  refund_policy_detail?: string;
  /** キャンセル料免除の例外条件（複数選択、任意） */
  exception_cases_items?: string[];
  /** 例外条件の補足（任意） */
  exception_cases_detail?: string;
  /** 本ポリシーの適用対象（複数選択、任意） */
  policy_scope_items?: string[];
  /** 最終同意チェック */
  consent_confirmed: string[];
}

// ──────────────────────────────────────────────
// 入会申込書（フォーム固有データ）
// ──────────────────────────────────────────────

/** 入会申込書の書類固有フォームフィールド */
export interface MembershipFormData {
  /** 氏名 */
  client_name: string;
  /** 氏名（カナ） */
  client_kana: string;
  /** 生年月日（YYYY-MM-DD） */
  date_of_birth: string;
  /** 性別 */
  gender_status?: string;
  /** 住所 */
  client_address: string;
  /** 電話番号 */
  client_phone: string;
  /** メールアドレス */
  client_email: string;
  /** 所属（会社・学校等、任意） */
  client_affiliation?: string;
  /** 緊急連絡先：氏名 */
  emergency_contact_name: string;
  /** 緊急連絡先：続柄 */
  emergency_contact_relation: string;
  /** 緊急連絡先：電話番号 */
  emergency_contact_phone: string;
  /** 希望プラン */
  membership_plan: string;
  /** プラン詳細（任意） */
  membership_plan_detail?: string;
  /** ご利用開始希望日（YYYY-MM-DD） */
  start_date: string;
  /** お支払い方法 */
  payment_method_status: string;
  /** お支払い詳細（任意） */
  payment_method_detail?: string;
  /** 希望曜日（複数選択） */
  preferred_days_items: string[];
  /** 希望時間帯（任意） */
  preferred_time_detail?: string;
  /** 利用目的（複数選択） */
  training_purpose_items: string[];
  /** 具体的な目標（任意） */
  training_goal_detail?: string;
  /** 会員規約への同意 */
  terms_consent_status: string[];
  /** 個人情報の取り扱いへの同意 */
  privacy_consent_status: string[];
  /** 連絡・広告についての許諾（任意） */
  contact_permission_status?: string;
  /** 未成年かどうか */
  minor_status: '18歳以上です' | '18歳未満です';
  /** 保護者氏名（未成年の場合のみ） */
  guardian_name?: string;
  /** 保護者電話番号（未成年の場合のみ） */
  guardian_phone?: string;
  /** 備考・特記事項（任意） */
  special_notes?: string;
  /** 最終同意チェック */
  consent_confirmed: string[];
  /** 署名日（YYYY-MM-DD） */
  signed_date?: string;
}

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

  // 特記事項（APIがマージして notes に書き込む）
  notes: string;
  /** 頻出パターンの選択式特記事項 */
  specialTerms?: StructuredSpecialTerms;
  /** Gemini で条文整形する自由入力（任意） */
  freeTextNotes?: string;

  /** 免責同意書固有フォームデータ */
  liabilityWaiverData?: LiabilityWaiverFormData;
  /** 入会申込書固有フォームデータ */
  membershipFormData?: MembershipFormData;
  /** キャンセル・返金ポリシー同意書固有フォームデータ */
  cancellationPolicyData?: CancellationPolicyFormData;
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
