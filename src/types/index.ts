export type DocumentType =
  | 'training_contract'
  | 'health_check'
  | 'liability_waiver'
  | 'membership_form';

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  training_contract: 'トレーニング委託契約書',
  health_check: '健康状態確認書',
  liability_waiver: '免責同意書',
  membership_form: '入会申込書',
};

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

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  subscription_status: 'active' | 'inactive' | 'trialing' | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}
