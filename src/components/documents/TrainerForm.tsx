'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import {
  DOCUMENT_TYPE_LABELS,
  PRO_ONLY_DOCUMENT_TYPES,
  type DocumentType,
  type TrainerFormData,
  type StructuredSpecialTerms,
  type LiabilityWaiverFormData,
  type MembershipFormData,
  type CancellationPolicyFormData,
} from '@/types';
import { User, Briefcase, FileText, StickyNote, ChevronRight, ChevronLeft, Lock } from 'lucide-react';
import Link from 'next/link';

/** 章立て版への布石として「準備中」ヒントを表示する書類タイプ */
const STRUCTURED_HINT_TYPES = new Set<DocumentType>([
  'liability_waiver',
  'cancellation_policy',
  'health_check',
]);

const DEFAULT_STEPS = [
  { id: 1, label: '書類選択', icon: FileText },
  { id: 2, label: 'トレーナー情報', icon: User },
  { id: 3, label: 'クライアント情報', icon: User },
  { id: 4, label: '契約内容', icon: Briefcase },
  { id: 5, label: '特記事項', icon: StickyNote },
];

const LIABILITY_WAIVER_STEPS = [
  { id: 1, label: '書類選択', icon: FileText },
  { id: 2, label: 'トレーナー情報', icon: User },
  { id: 3, label: 'クライアント情報', icon: User },
  { id: 4, label: '同意事項の確認', icon: StickyNote },
];

const MEMBERSHIP_FORM_STEPS = [
  { id: 1, label: '書類選択', icon: FileText },
  { id: 2, label: 'トレーナー情報', icon: User },
  { id: 3, label: 'お客様情報', icon: User },
  { id: 4, label: '申込内容', icon: Briefcase },
];

const CANCELLATION_POLICY_STEPS = [
  { id: 1, label: '書類選択', icon: FileText },
  { id: 2, label: 'トレーナー情報', icon: User },
  { id: 3, label: 'クライアント情報', icon: User },
  { id: 4, label: 'ポリシー同意', icon: StickyNote },
];

const defaultCancellationPolicyValues: Partial<CancellationPolicyFormData> = {
  client_name: '',
  signed_date: '',
  cancellation_policy_read_status: [],
  cancellation_deadline_detail: '',
  cancellation_fee_detail: '',
  refund_policy_status: '',
  refund_policy_detail: '',
  exception_cases_items: [],
  exception_cases_detail: '',
  policy_scope_items: [],
  consent_confirmed: [],
};

const defaultWaiverValues: Partial<LiabilityWaiverFormData> = {
  service_items: [],
  delivery_mode_status: '',
  risk_understanding_status: '',
  health_disclosure_status: '',
  symptom_report_status: '',
  medical_consultation_status: '',
  liability_consent_status: '',
  minor_status: '18歳以上です',
  guardian_name: '',
  special_notes: '',
  consent_confirmed: [],
  signed_date: '',
};

const defaultMembershipValues: Partial<MembershipFormData> = {
  client_name: '',
  client_kana: '',
  date_of_birth: '',
  gender_status: '',
  client_address: '',
  client_phone: '',
  client_email: '',
  client_affiliation: '',
  emergency_contact_name: '',
  emergency_contact_relation: '',
  emergency_contact_phone: '',
  membership_plan: '',
  membership_plan_detail: '',
  start_date: '',
  payment_method_status: '',
  payment_method_detail: '',
  preferred_days_items: [],
  preferred_time_detail: '',
  training_purpose_items: [],
  training_goal_detail: '',
  terms_consent_status: [],
  privacy_consent_status: [],
  contact_permission_status: '',
  minor_status: '18歳以上です',
  guardian_name: '',
  guardian_phone: '',
  special_notes: '',
  consent_confirmed: [],
  signed_date: '',
};

const defaultValues: TrainerFormData = {
  trainerName: '',
  businessName: '',
  address: '',
  phone: '',
  email: '',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  contractStartDate: '',
  contractEndDate: '',
  sessionFee: 0,
  sessionCount: 10,
  sessionDuration: 60,
  paymentMethod: '銀行振込',
  documentType: 'training_contract',
  notes: '',
  specialTerms: {},
  freeTextNotes: '',
};

/** Proユーザーには training_contract を「標準版」と明示するためのオーバーライドラベル */
const PRO_USER_LABEL_OVERRIDE: Partial<Record<DocumentType, string>> = {
  training_contract: 'トレーニング委託契約書（標準版）',
};

/** 各書類タイプに添える短い説明 */
const DOCUMENT_TYPE_DESCRIPTIONS: Partial<Record<DocumentType, string>> = {
  pro_training_contract_v1: '条文が章立てで整理された読みやすい版。10章構成で網羅的にカバー。',
};

/**
 * 生成進捗ステップ
 *  0: 待機中（未実行）
 *  1: 入力内容の確認中（生成開始直後）
 *  2: 文面生成中（約10秒後）
 *  3: PDF作成中（約25秒後）
 */
type GenerationStep = 0 | 1 | 2 | 3;

const GENERATION_STEP_MESSAGES: Record<Exclude<GenerationStep, 0>, string> = {
  1: '入力内容を確認しています…（最大約60秒かかる場合があります）',
  2: '契約書の文面を生成しています…',
  3: 'PDFを作成しています…',
};

// ── 特記事項の選択肢 ──────────────────────────────────────────

type RadioOption<T extends string> = { value: T; label: string };

const TRANSPORTATION_FEE_OPTIONS: RadioOption<NonNullable<StructuredSpecialTerms['transportationFee']> | ''>[] = [
  { value: '', label: '指定しない' },
  { value: 'included', label: '料金に含む' },
  { value: 'separate', label: '別途実費精算' },
  { value: 'not_applicable', label: '該当なし' },
];

const FACILITY_FEE_OPTIONS: RadioOption<NonNullable<StructuredSpecialTerms['facilityFee']> | ''>[] = [
  { value: '', label: '指定しない' },
  { value: 'client', label: 'クライアント負担' },
  { value: 'trainer', label: 'トレーナー負担' },
  { value: 'split', label: '折半' },
  { value: 'not_applicable', label: '該当なし' },
];

const CANCELLATION_POLICY_OPTIONS: RadioOption<NonNullable<StructuredSpecialTerms['cancellationPolicy']> | ''>[] = [
  { value: '', label: '指定しない（テンプレートに従う）' },
  { value: 'pattern_a', label: 'パターンA：24時間前まで無料・以降100%' },
  { value: 'pattern_b', label: 'パターンB：前日50%・当日100%' },
  { value: 'pattern_c', label: 'パターンC：甲乙個別合意に従う' },
];

const SESSION_FORMAT_OPTIONS: RadioOption<NonNullable<StructuredSpecialTerms['sessionFormat']> | ''>[] = [
  { value: '', label: '指定しない' },
  { value: 'in_person', label: '対面のみ' },
  { value: 'online', label: 'オンラインのみ' },
  { value: 'both', label: '対面＋オンライン' },
];

const PHOTO_CONSENT_OPTIONS: RadioOption<NonNullable<StructuredSpecialTerms['photoConsent']> | ''>[] = [
  { value: '', label: '指定しない' },
  { value: 'allowed', label: '撮影・利用OK' },
  { value: 'not_allowed', label: '撮影・利用不可' },
  { value: 'ask_each_time', label: '都度確認' },
];

// ── ラジオグループ UI ────────────────────────────────────────

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  cols = 3,
}: {
  label: string;
  options: RadioOption<T>[];
  value: T | '';
  onChange: (v: T | '') => void;
  cols?: 2 | 3 | 4;
}) {
  const colClass = { 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' }[cols];
  return (
    <div>
      <p className="form-label mb-2">{label}</p>
      <div className={`grid ${colClass} gap-2`}>
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
              value === opt.value
                ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              checked={value === opt.value}
              onChange={() => onChange(opt.value as T | '')}
            />
            <span
              className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
                value === opt.value ? 'border-brand-500 bg-brand-500' : 'border-gray-300'
              }`}
            />
            <span className="leading-tight">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ── シンプルラジオグループ（免責同意書固有フィールド用）────────────────────────────

function SimpleRadioGroup({
  label,
  description,
  options,
  value,
  onChange,
  required = false,
}: {
  label: string;
  description?: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <p className="form-label mb-1">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </p>
      {description && (
        <p className="text-xs text-gray-500 mb-2 leading-relaxed">{description}</p>
      )}
      <div className="flex flex-col gap-1.5">
        {options.map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
              value === opt
                ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              className="sr-only"
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            <span
              className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${
                value === opt ? 'border-brand-500 bg-brand-500' : 'border-gray-300'
              }`}
            />
            <span className="leading-tight">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ── チェックボックスグループ（入会申込書固有フィールド用）────────────────────────

function SimpleCheckboxGroup({
  label,
  description,
  options,
  values,
  onChange,
  required = false,
}: {
  label: string;
  description?: string;
  options: string[];
  values: string[];
  onChange: (option: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <p className="form-label mb-1">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </p>
      {description && (
        <p className="text-xs text-gray-500 mb-2 leading-relaxed">{description}</p>
      )}
      <div className="space-y-1.5">
        {options.map((opt) => {
          const checked = values.includes(opt);
          return (
            <label
              key={opt}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                checked
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <input type="checkbox" className="sr-only" checked={checked} onChange={() => onChange(opt)} />
              <span
                className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  checked ? 'border-brand-500 bg-brand-500' : 'border-gray-300'
                }`}
              >
                {checked && (
                  <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                    <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span>{opt}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ── メインコンポーネント ─────────────────────────────────────

export default function TrainerForm({ isSubscribed = false, isPro = false }: { isSubscribed?: boolean; isPro?: boolean }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<TrainerFormData>(defaultValues);
  const [liabilityWaiverData, setLiabilityWaiverData] = useState<Partial<LiabilityWaiverFormData>>(defaultWaiverValues);
  const [membershipFormData, setMembershipFormData] = useState<Partial<MembershipFormData>>(defaultMembershipValues);
  const [cancellationPolicyData, setCancellationPolicyData] = useState<Partial<CancellationPolicyFormData>>(defaultCancellationPolicyValues);
  const [generationStep, setGenerationStep] = useState<GenerationStep>(0);
  const [error, setError] = useState('');
  const [showProHint, setShowProHint] = useState(false);
  const router = useRouter();

  const step2TimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step3TimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGenerating = generationStep > 0;
  const isLiabilityWaiver = form.documentType === 'liability_waiver';
  const isMembershipForm = form.documentType === 'membership_form';
  const isCancellationPolicy = form.documentType === 'cancellation_policy';
  const STEPS = isLiabilityWaiver
    ? LIABILITY_WAIVER_STEPS
    : isMembershipForm
    ? MEMBERSHIP_FORM_STEPS
    : isCancellationPolicy
    ? CANCELLATION_POLICY_STEPS
    : DEFAULT_STEPS;
  const totalSteps = STEPS.length;

  const clearStepTimers = () => {
    if (step2TimerRef.current) clearTimeout(step2TimerRef.current);
    if (step3TimerRef.current) clearTimeout(step3TimerRef.current);
    step2TimerRef.current = null;
    step3TimerRef.current = null;
  };

  const update = (field: keyof TrainerFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDocumentTypeChange = (docType: string) => {
    update('documentType', docType);
    const maxStep = ['liability_waiver', 'membership_form', 'cancellation_policy'].includes(docType) ? 4 : 5;
    if (step > maxStep) setStep(1);
  };

  const updateSpecialTerms = (field: keyof StructuredSpecialTerms, value: string | undefined) => {
    setForm((prev) => ({
      ...prev,
      specialTerms: { ...(prev.specialTerms ?? {}), [field]: value || undefined },
    }));
  };

  const updateWaiver = <K extends keyof LiabilityWaiverFormData>(field: K, value: LiabilityWaiverFormData[K]) => {
    setLiabilityWaiverData((prev) => ({ ...prev, [field]: value }));
  };

  const updateMembership = <K extends keyof MembershipFormData>(field: K, value: MembershipFormData[K]) => {
    setMembershipFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleMembershipCheckbox = (
    field: 'preferred_days_items' | 'training_purpose_items' | 'terms_consent_status' | 'privacy_consent_status' | 'consent_confirmed',
    option: string
  ) => {
    setMembershipFormData((prev) => {
      const current = (prev[field] as string[]) ?? [];
      const next = current.includes(option) ? current.filter((v) => v !== option) : [...current, option];
      return { ...prev, [field]: next };
    });
  };

  const validateMembershipFormStep = (): string | null => {
    const m = membershipFormData;
    if (!m.client_name?.trim()) return '氏名を入力してください';
    if (!m.client_kana?.trim()) return '氏名（カナ）を入力してください';
    if (!m.date_of_birth) return '生年月日を入力してください';
    if (!m.client_address?.trim()) return '住所を入力してください';
    if (!m.client_phone?.trim()) return '電話番号を入力してください';
    if (!m.client_email?.trim()) return 'メールアドレスを入力してください';
    if (!m.emergency_contact_name?.trim()) return '緊急連絡先のお名前を入力してください';
    if (!m.emergency_contact_relation?.trim()) return '緊急連絡先の続柄を入力してください';
    if (!m.emergency_contact_phone?.trim()) return '緊急連絡先の電話番号を入力してください';
    if (!m.membership_plan) return 'ご希望プランを選択してください';
    if (m.membership_plan === 'その他' && !m.membership_plan_detail?.trim()) return 'プラン詳細を入力してください';
    if (!m.start_date) return 'ご利用開始希望日を選択してください';
    if (!m.payment_method_status) return 'お支払い方法を選択してください';
    if (m.payment_method_status === 'その他' && !m.payment_method_detail?.trim()) return 'お支払い詳細を入力してください';
    if (!m.minor_status) return '年齢確認を選択してください';
    if (m.minor_status === '18歳未満です' && !m.guardian_name?.trim()) return '保護者氏名を入力してください';
    if (m.minor_status === '18歳未満です' && !m.guardian_phone?.trim()) return '保護者電話番号を入力してください';
    if (!m.terms_consent_status?.length) return '会員規約への同意が必要です';
    if (!m.privacy_consent_status?.length) return '個人情報の取り扱いへの同意が必要です';
    if (!m.consent_confirmed?.length) return '最終確認のチェックが必要です';
    return null;
  };

  const updateCancellationPolicy = <K extends keyof CancellationPolicyFormData>(key: K, value: CancellationPolicyFormData[K]) => {
    setCancellationPolicyData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleCancellationPolicyCheckbox = (
    key: 'cancellation_policy_read_status' | 'exception_cases_items' | 'policy_scope_items' | 'consent_confirmed',
    option: string
  ) => {
    setCancellationPolicyData((prev) => {
      const current = (prev[key] as string[]) ?? [];
      const next = current.includes(option) ? current.filter((item) => item !== option) : [...current, option];
      return { ...prev, [key]: next };
    });
  };

  const validateCancellationPolicyStep = (): string | null => {
    const c = cancellationPolicyData;
    if (!c.client_name?.trim()) return '氏名を入力してください';
    if (!c.signed_date) return '同意日を入力してください';
    if (!c.refund_policy_status) return '返金に関する基本方針を選択してください';
    if (!c.cancellation_policy_read_status?.length) return 'ポリシーの確認チェックが必要です';
    if (!c.consent_confirmed?.length) return '最終同意のチェックが必要です';
    return null;
  };

  const toggleWaiverCheckbox = (field: 'service_items' | 'consent_confirmed', option: string) => {
    setLiabilityWaiverData((prev) => {
      const current = (prev[field] as string[]) ?? [];
      const next = current.includes(option) ? current.filter((v) => v !== option) : [...current, option];
      return { ...prev, [field]: next };
    });
  };

  const validateLiabilityWaiverStep = (): string | null => {
    const w = liabilityWaiverData;
    if (!w.service_items?.length) return 'サービス内容を1つ以上選択してください';
    if (!w.delivery_mode_status) return '実施形態を選択してください';
    if (!w.risk_understanding_status) return '運動リスクについての確認を選択してください';
    if (!w.health_disclosure_status) return '健康状態申告の重要性について確認してください';
    if (!w.symptom_report_status) return '体調不良時の申告義務について確認してください';
    if (!w.medical_consultation_status) return '医師への相談が必要な場合について確認してください';
    if (!w.liability_consent_status) return '免責条項への同意を選択してください';
    if (w.minor_status === '18歳未満です' && !w.guardian_name?.trim()) return '未成年の方は保護者氏名を入力してください';
    if (!w.consent_confirmed?.length) return '最終同意のチェックが必要です';
    return null;
  };

  const specialTerms = form.specialTerms ?? {};

  const handleSubmit = async () => {
    setError('');

    if (isLiabilityWaiver) {
      const validationError = validateLiabilityWaiverStep();
      if (validationError) { setError(validationError); return; }
    }
    if (isMembershipForm) {
      const validationError = validateMembershipFormStep();
      if (validationError) { setError(validationError); return; }
    }
    if (isCancellationPolicy) {
      const validationError = validateCancellationPolicyStep();
      if (validationError) { setError(validationError); return; }
    }

    setGenerationStep(1);
    step2TimerRef.current = setTimeout(() => setGenerationStep(2), 10_000);
    step3TimerRef.current = setTimeout(() => setGenerationStep(3), 25_000);

    try {
      const requestBody: TrainerFormData = {
        ...form,
        liabilityWaiverData: isLiabilityWaiver ? (liabilityWaiverData as LiabilityWaiverFormData) : undefined,
        membershipFormData: isMembershipForm ? (membershipFormData as MembershipFormData) : undefined,
        cancellationPolicyData: isCancellationPolicy ? (cancellationPolicyData as CancellationPolicyFormData) : undefined,
      };

      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '生成に失敗しました');
      }

      const { id } = await res.json();
      router.push(`/documents/${id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '予期しないエラーが発生しました');
    } finally {
      clearStepTimers();
      setGenerationStep(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <button
              onClick={() => s.id < step && setStep(s.id)}
              className={`flex items-center gap-2 ${s.id < step ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  step === s.id
                    ? 'bg-brand-600 text-white'
                    : step > s.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s.id ? '✓' : s.id}
              </div>
              <span
                className={`text-xs hidden sm:block ${
                  step === s.id ? 'text-brand-600 font-medium' : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 transition-colors ${
                  step > s.id ? 'bg-green-400' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">
            {STEPS[step - 1].label}
          </h2>
        </CardHeader>
        <CardBody>
          {/* Step 1: 書類選択 */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                作成する書類の種類を選んでください。後から変更はできません。
              </p>

              {/* ── 委託契約書グループ（標準版／章立て版 横並び） ── */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  委託契約書
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* 標準版 */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      form.documentType === 'training_contract'
                        ? 'border-brand-500 bg-brand-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="documentType"
                      value="training_contract"
                      checked={form.documentType === 'training_contract'}
                      onChange={() => handleDocumentTypeChange('training_contract')}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        form.documentType === 'training_contract' ? 'border-brand-500' : 'border-gray-400'
                      }`}
                    >
                      {form.documentType === 'training_contract' && (
                        <div className="w-2 h-2 rounded-full bg-brand-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {isPro ? PRO_USER_LABEL_OVERRIDE['training_contract'] : DOCUMENT_TYPE_LABELS['training_contract']}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">条文ごとに章立てされていない標準構成</p>
                    </div>
                  </label>

                  {/* 章立て版（Pro専用） */}
                  {isPro ? (
                    <label
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        form.documentType === 'pro_training_contract_v1'
                          ? 'border-brand-500 bg-brand-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="documentType"
                        value="pro_training_contract_v1"
                        checked={form.documentType === 'pro_training_contract_v1'}
                        onChange={() => handleDocumentTypeChange('pro_training_contract_v1')}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          form.documentType === 'pro_training_contract_v1' ? 'border-brand-500' : 'border-gray-400'
                        }`}
                      >
                        {form.documentType === 'pro_training_contract_v1' && (
                          <div className="w-2 h-2 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900 text-sm">委託契約書（章立て版）</p>
                          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-600 text-white leading-none">
                            Pro
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">第1章〜と章立てされた網羅的な構成</p>
                      </div>
                    </label>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowProHint((v) => !v)}
                      className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-100 bg-gray-50 w-full text-left cursor-pointer transition-colors hover:border-gray-200"
                    >
                      <Lock size={16} className="text-gray-300 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-400 text-sm">委託契約書（章立て版）</p>
                          <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-300 text-white leading-none">
                            Pro
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">第1章〜と章立てされた網羅的な構成</p>
                        {showProHint && (
                          <p className="text-xs text-brand-600 mt-1.5">
                            章立て版はProプランでご利用いただけます。
                          </p>
                        )}
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* ── その他の書類（1カラム） ── */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  その他の書類
                </p>
                <div className="space-y-2">
                  {(Object.entries(DOCUMENT_TYPE_LABELS) as [DocumentType, string][])
                    .filter(([value]) => !PRO_ONLY_DOCUMENT_TYPES.has(value as DocumentType) && value !== 'training_contract')
                    .map(([value, label]) => {
                      const docType = value as DocumentType;
                      const hasStructuredHint = STRUCTURED_HINT_TYPES.has(docType);

                      return (
                        <label
                          key={value}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-colors ${
                            form.documentType === value
                              ? 'border-brand-500 bg-brand-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="documentType"
                            value={value}
                            checked={form.documentType === value}
                            onChange={() => handleDocumentTypeChange(value)}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              form.documentType === value ? 'border-brand-500' : 'border-gray-400'
                            }`}
                          >
                            {form.documentType === value && (
                              <div className="w-2 h-2 rounded-full bg-brand-500" />
                            )}
                          </div>
                          <span className="flex-1 text-sm font-medium text-gray-900">{label}</span>
                          {hasStructuredHint && (
                            <span className="text-[11px] text-gray-400 shrink-0">
                              章立て版はご要望次第で追加予定
                            </span>
                          )}
                        </label>
                      );
                    })}
                </div>
              </div>

              {/* フィードバック誘導 */}
              <p className="text-[11px] text-gray-400 pt-1">
                章立て構成のテンプレート追加など、ご希望があれば
                <Link
                  href="/monitors"
                  className="ml-1 underline underline-offset-2 hover:text-gray-600"
                >
                  フィードバックフォーム
                </Link>
                からお知らせください。
              </p>
            </div>
          )}

          {/* Step 2: トレーナー情報 */}
          {step === 2 && (
            <div className="space-y-4">
              <Input
                label="トレーナー名"
                value={form.trainerName}
                onChange={(e) => update('trainerName', e.target.value)}
                placeholder="山田 太郎"
                required
              />
              <Input
                label="事業者名（屋号 / 法人名）"
                value={form.businessName}
                onChange={(e) => update('businessName', e.target.value)}
                placeholder="ヤマダフィットネス"
                required
              />
              <Input
                label="所在地"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="東京都渋谷区〇〇 1-2-3"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="電話番号"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="090-0000-0000"
                  required
                />
                <Input
                  label="メールアドレス"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="trainer@example.com"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 3: お客様情報（入会申込書専用） */}
          {step === 3 && isMembershipForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="氏名"
                  value={membershipFormData.client_name ?? ''}
                  onChange={(e) => updateMembership('client_name', e.target.value)}
                  placeholder="田中 花子"
                  required
                />
                <Input
                  label="氏名（カナ）"
                  value={membershipFormData.client_kana ?? ''}
                  onChange={(e) => updateMembership('client_kana', e.target.value)}
                  placeholder="タナカ ハナコ"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="生年月日"
                  type="date"
                  value={membershipFormData.date_of_birth ?? ''}
                  onChange={(e) => updateMembership('date_of_birth', e.target.value)}
                  required
                />
                <div>
                  <label className="form-label">性別<span className="ml-1 text-xs font-normal text-gray-400">（任意）</span></label>
                  <select
                    value={membershipFormData.gender_status ?? ''}
                    onChange={(e) => updateMembership('gender_status', e.target.value)}
                    className="form-input"
                  >
                    <option value="">選択しない</option>
                    <option>男性</option>
                    <option>女性</option>
                    <option>その他</option>
                    <option>回答しない</option>
                  </select>
                </div>
              </div>
              <Input
                label="住所"
                value={membershipFormData.client_address ?? ''}
                onChange={(e) => updateMembership('client_address', e.target.value)}
                placeholder="東京都渋谷区〇〇 1-2-3"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="電話番号"
                  type="tel"
                  value={membershipFormData.client_phone ?? ''}
                  onChange={(e) => updateMembership('client_phone', e.target.value)}
                  placeholder="090-0000-0000"
                  required
                />
                <Input
                  label="メールアドレス"
                  type="email"
                  value={membershipFormData.client_email ?? ''}
                  onChange={(e) => updateMembership('client_email', e.target.value)}
                  placeholder="client@example.com"
                  required
                />
              </div>
              <Input
                label="ご所属（会社・学校等）"
                value={membershipFormData.client_affiliation ?? ''}
                onChange={(e) => updateMembership('client_affiliation', e.target.value)}
                placeholder="〇〇株式会社"
              />

              {/* 緊急連絡先 */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">緊急連絡先</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="お名前"
                      value={membershipFormData.emergency_contact_name ?? ''}
                      onChange={(e) => updateMembership('emergency_contact_name', e.target.value)}
                      placeholder="田中 一郎"
                      required
                    />
                    <Input
                      label="続柄"
                      value={membershipFormData.emergency_contact_relation ?? ''}
                      onChange={(e) => updateMembership('emergency_contact_relation', e.target.value)}
                      placeholder="父"
                      required
                    />
                  </div>
                  <Input
                    label="電話番号"
                    type="tel"
                    value={membershipFormData.emergency_contact_phone ?? ''}
                    onChange={(e) => updateMembership('emergency_contact_phone', e.target.value)}
                    placeholder="090-0000-0000"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: クライアント情報（その他書類） */}
          {step === 3 && !isMembershipForm && (
            <div className="space-y-4">
              <Input
                label="クライアント氏名"
                value={form.clientName}
                onChange={(e) => update('clientName', e.target.value)}
                placeholder="田中 花子"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="クライアント電話番号"
                  type="tel"
                  value={form.clientPhone}
                  onChange={(e) => update('clientPhone', e.target.value)}
                  placeholder="090-0000-0000"
                  required
                />
                <Input
                  label="クライアントメールアドレス"
                  type="email"
                  value={form.clientEmail}
                  onChange={(e) => update('clientEmail', e.target.value)}
                  placeholder="client@example.com"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 4: ポリシー同意（キャンセル・返金ポリシー同意書専用） */}
          {step === 4 && isCancellationPolicy && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">
                各項目を確認し、必須項目（<span className="text-red-500">*</span>）をすべて入力・選択してください。
              </p>

              {/* クライアント情報 */}
              <div className="space-y-4">
                <Input
                  label="氏名（フルネーム）"
                  value={cancellationPolicyData.client_name ?? ''}
                  onChange={(e) => updateCancellationPolicy('client_name', e.target.value)}
                  placeholder="田中 花子"
                  required
                />
                <Input
                  label="同意日"
                  type="date"
                  value={cancellationPolicyData.signed_date ?? ''}
                  onChange={(e) => updateCancellationPolicy('signed_date', e.target.value)}
                  required
                />
              </div>

              {/* ポリシー確認 */}
              <div className="pt-2 border-t border-gray-100">
                <SimpleCheckboxGroup
                  label="キャンセル・返金ポリシーの確認"
                  options={['キャンセル・返金ポリシーの内容を読み、理解しました。']}
                  values={cancellationPolicyData.cancellation_policy_read_status ?? []}
                  onChange={(opt) => toggleCancellationPolicyCheckbox('cancellation_policy_read_status', opt)}
                  required
                />
              </div>

              {/* キャンセルルール */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="form-label">
                    キャンセル受付期限のルール
                    <span className="ml-1 text-xs font-normal text-gray-400">（任意）</span>
                  </label>
                  <textarea
                    value={cancellationPolicyData.cancellation_deadline_detail ?? ''}
                    onChange={(e) => updateCancellationPolicy('cancellation_deadline_detail', e.target.value)}
                    className="form-input min-h-20 resize-y"
                    maxLength={500}
                    placeholder="例：予約日時の24時間前までのご連絡でキャンセル料無料"
                  />
                </div>
                <div>
                  <label className="form-label">
                    キャンセル料に関するルール
                    <span className="ml-1 text-xs font-normal text-gray-400">（任意）</span>
                  </label>
                  <textarea
                    value={cancellationPolicyData.cancellation_fee_detail ?? ''}
                    onChange={(e) => updateCancellationPolicy('cancellation_fee_detail', e.target.value)}
                    className="form-input min-h-20 resize-y"
                    maxLength={500}
                    placeholder="例：前日は料金の50％、当日は100％、無断キャンセルは1回分消化"
                  />
                </div>
              </div>

              {/* 返金ポリシー */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <SimpleRadioGroup
                  label="返金に関する基本方針"
                  options={['原則として返金は行いません', '所定の条件を満たす場合のみ一部返金を行います']}
                  value={cancellationPolicyData.refund_policy_status ?? ''}
                  onChange={(v) => updateCancellationPolicy('refund_policy_status', v)}
                  required
                />
                <div>
                  <label className="form-label">
                    返金対象となるケース
                    <span className="ml-1 text-xs font-normal text-gray-400">（任意）</span>
                  </label>
                  <textarea
                    value={cancellationPolicyData.refund_policy_detail ?? ''}
                    onChange={(e) => updateCancellationPolicy('refund_policy_detail', e.target.value)}
                    className="form-input min-h-20 resize-y"
                    maxLength={500}
                    placeholder="例：長期プランの途中解約、病気や怪我による継続不能など"
                  />
                </div>
              </div>

              {/* 例外条件 */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <SimpleCheckboxGroup
                  label="キャンセル料が免除される例外条件"
                  description="免除の対象となる例外条件をすべて選択してください。"
                  options={['医師の診断書がある病気・怪我の場合', '天災・交通機関の大幅な乱れの場合', 'その他、当社がやむを得ないと認める場合']}
                  values={cancellationPolicyData.exception_cases_items ?? []}
                  onChange={(opt) => toggleCancellationPolicyCheckbox('exception_cases_items', opt)}
                />
                <div>
                  <label className="form-label">
                    例外条件の補足
                    <span className="ml-1 text-xs font-normal text-gray-400">（任意）</span>
                  </label>
                  <textarea
                    value={cancellationPolicyData.exception_cases_detail ?? ''}
                    onChange={(e) => updateCancellationPolicy('exception_cases_detail', e.target.value)}
                    className="form-input min-h-20 resize-y"
                    maxLength={500}
                    placeholder="具体例や運営の裁量について補足があればご記入ください。"
                  />
                </div>
              </div>

              {/* 適用範囲 */}
              <div className="pt-2 border-t border-gray-100">
                <SimpleCheckboxGroup
                  label="本ポリシーの適用対象"
                  description="本ポリシーが適用されるサービス種別をすべて選択してください。"
                  options={['単発セッション', '回数券・パッケージプラン', 'オンライン指導']}
                  values={cancellationPolicyData.policy_scope_items ?? []}
                  onChange={(opt) => toggleCancellationPolicyCheckbox('policy_scope_items', opt)}
                />
              </div>

              {/* 最終同意 */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={(cancellationPolicyData.consent_confirmed ?? []).length > 0}
                    onChange={() => toggleCancellationPolicyCheckbox('consent_confirmed', '上記キャンセル・返金ポリシーを理解し、同意します。')}
                  />
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      (cancellationPolicyData.consent_confirmed ?? []).length > 0
                        ? 'border-brand-500 bg-brand-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {(cancellationPolicyData.consent_confirmed ?? []).length > 0 && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      上記キャンセル・返金ポリシーを理解し、同意します。<span className="ml-0.5 text-red-500">*</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">この同意がないと書類を生成できません。</p>
                  </div>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: 申込内容（入会申込書専用） */}
          {step === 4 && isMembershipForm && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">
                ご契約内容・ご希望・各種同意をご記入ください。必須項目（<span className="text-red-500">*</span>）はすべて入力が必要です。
              </p>

              {/* ご契約内容 */}
              <div className="space-y-4">
                <SimpleRadioGroup
                  label="ご希望プラン"
                  options={['月4回プラン', '月8回プラン', '月12回プラン', '都度払い', 'その他']}
                  value={membershipFormData.membership_plan ?? ''}
                  onChange={(v) => updateMembership('membership_plan', v)}
                  required
                />
                {membershipFormData.membership_plan === 'その他' && (
                  <Input
                    label="プラン詳細"
                    value={membershipFormData.membership_plan_detail ?? ''}
                    onChange={(e) => updateMembership('membership_plan_detail', e.target.value)}
                    placeholder="ご希望のプラン内容をご記入ください"
                    required
                  />
                )}
                <Input
                  label="ご利用開始希望日"
                  type="date"
                  value={membershipFormData.start_date ?? ''}
                  onChange={(e) => updateMembership('start_date', e.target.value)}
                  required
                />
                <SimpleRadioGroup
                  label="お支払い方法"
                  options={['銀行振込', 'クレジットカード', '現金払い', 'その他']}
                  value={membershipFormData.payment_method_status ?? ''}
                  onChange={(v) => updateMembership('payment_method_status', v)}
                  required
                />
                {membershipFormData.payment_method_status === 'その他' && (
                  <Input
                    label="お支払い詳細"
                    value={membershipFormData.payment_method_detail ?? ''}
                    onChange={(e) => updateMembership('payment_method_detail', e.target.value)}
                    placeholder="お支払い方法の詳細をご記入ください"
                    required
                  />
                )}
              </div>

              {/* ご希望・目標 */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <SimpleCheckboxGroup
                  label="ご希望曜日"
                  description="ご希望の曜日をすべて選択してください。"
                  options={['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日', '不問']}
                  values={membershipFormData.preferred_days_items ?? []}
                  onChange={(opt) => toggleMembershipCheckbox('preferred_days_items', opt)}
                />
                <Input
                  label="ご希望時間帯"
                  value={membershipFormData.preferred_time_detail ?? ''}
                  onChange={(e) => updateMembership('preferred_time_detail', e.target.value)}
                  placeholder="例：午前中、18時以降"
                />
                <SimpleCheckboxGroup
                  label="ご利用目的"
                  description="当てはまるものをすべて選択してください。"
                  options={['ダイエット・体重管理', '筋肉増量・ボディメイク', '体力・持久力の向上', '姿勢改善・体の歪み矯正', '健康維持・生活習慣改善', 'スポーツパフォーマンス向上', 'リハビリ・機能回復', 'その他']}
                  values={membershipFormData.training_purpose_items ?? []}
                  onChange={(opt) => toggleMembershipCheckbox('training_purpose_items', opt)}
                />
                <div>
                  <label className="form-label">具体的な目標<span className="ml-1 text-xs font-normal text-gray-400">（任意）</span></label>
                  <textarea
                    value={membershipFormData.training_goal_detail ?? ''}
                    onChange={(e) => updateMembership('training_goal_detail', e.target.value)}
                    className="form-input min-h-20 resize-y"
                    maxLength={500}
                    placeholder="例：3ヶ月で5kg減量したい、フルマラソンを完走したい"
                  />
                </div>
              </div>

              {/* 各種同意 */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <SimpleCheckboxGroup
                  label="会員規約への同意"
                  description="会員規約の内容を確認し、同意いただける場合はチェックを入れてください。"
                  options={['会員規約の内容を確認し、同意します。']}
                  values={membershipFormData.terms_consent_status ?? []}
                  onChange={(opt) => toggleMembershipCheckbox('terms_consent_status', opt)}
                  required
                />
                <SimpleCheckboxGroup
                  label="個人情報の取り扱いへの同意"
                  description="個人情報の利用目的・管理方法について同意いただける場合はチェックを入れてください。"
                  options={['個人情報の取り扱いに関する説明を受け、同意します。']}
                  values={membershipFormData.privacy_consent_status ?? []}
                  onChange={(opt) => toggleMembershipCheckbox('privacy_consent_status', opt)}
                  required
                />
                <SimpleRadioGroup
                  label="連絡・広告についての許諾"
                  description="キャンペーン情報やお知らせのご連絡を行う場合があります。"
                  options={['許可します', '許可しません']}
                  value={membershipFormData.contact_permission_status ?? ''}
                  onChange={(v) => updateMembership('contact_permission_status', v)}
                />
              </div>

              {/* 年齢確認・保護者 */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <SimpleRadioGroup
                  label="年齢確認"
                  description="18歳未満の場合は保護者の同意が必要です。"
                  options={['18歳以上です', '18歳未満です']}
                  value={membershipFormData.minor_status ?? '18歳以上です'}
                  onChange={(v) => updateMembership('minor_status', v as MembershipFormData['minor_status'])}
                  required
                />
                {membershipFormData.minor_status === '18歳未満です' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="保護者氏名"
                      value={membershipFormData.guardian_name ?? ''}
                      onChange={(e) => updateMembership('guardian_name', e.target.value)}
                      placeholder="山田 一郎"
                      required
                    />
                    <Input
                      label="保護者電話番号"
                      type="tel"
                      value={membershipFormData.guardian_phone ?? ''}
                      onChange={(e) => updateMembership('guardian_phone', e.target.value)}
                      placeholder="090-0000-0000"
                      required
                    />
                  </div>
                )}
              </div>

              {/* 備考・署名 */}
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="form-label">備考・特記事項<span className="ml-1 text-xs font-normal text-gray-400">（任意）</span></label>
                  <textarea
                    value={membershipFormData.special_notes ?? ''}
                    onChange={(e) => updateMembership('special_notes', e.target.value)}
                    className="form-input min-h-20 resize-y"
                    maxLength={500}
                    placeholder="トレーナーに事前に伝えておきたいことがあればご記入ください。"
                  />
                </div>
                <Input
                  label="申込日"
                  type="date"
                  value={membershipFormData.signed_date ?? ''}
                  onChange={(e) => updateMembership('signed_date', e.target.value)}
                />
              </div>

              {/* 最終同意 */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={(membershipFormData.consent_confirmed ?? []).length > 0}
                    onChange={() => toggleMembershipCheckbox('consent_confirmed', '本申込書の内容をすべて確認し、同意のうえ申し込みます。')}
                  />
                  <span
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                      (membershipFormData.consent_confirmed ?? []).length > 0
                        ? 'border-brand-500 bg-brand-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {(membershipFormData.consent_confirmed ?? []).length > 0 && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      本申込書の内容をすべて確認し、同意のうえ申し込みます。<span className="ml-0.5 text-red-500">*</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">この同意がないと書類を生成できません。</p>
                  </div>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: 免責同意書専用フォーム */}
          {step === 4 && isLiabilityWaiver && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">
                各項目を確認し、正直にお答えください。必須項目（<span className="text-red-500">*</span>）はすべて入力が必要です。
              </p>

              {/* service_items（チェックボックス複数選択） */}
              <div>
                <p className="form-label mb-1">提供されるサービス内容<span className="ml-0.5 text-red-500">*</span></p>
                <p className="text-xs text-gray-500 mb-2">今回のご契約に含まれるサービスをすべて選択してください。</p>
                <div className="space-y-1.5">
                  {['パーソナルトレーニング（対面）','パーソナルトレーニング（オンライン）','食事指導・栄養サポート','姿勢・動作分析','ストレッチ・コンディショニング','その他'].map((opt) => {
                    const checked = (liabilityWaiverData.service_items ?? []).includes(opt);
                    return (
                      <label key={opt} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${checked ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                        <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggleWaiverCheckbox('service_items', opt)} />
                        <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${checked ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`}>
                          {checked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </span>
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <SimpleRadioGroup label="実施形態" description="トレーニングの実施形態を選択してください。" options={['対面のみ','オンラインのみ','対面・オンライン両方']} value={liabilityWaiverData.delivery_mode_status ?? ''} onChange={(v) => updateWaiver('delivery_mode_status', v)} required />

              <SimpleRadioGroup label="運動・指導に伴うリスクの理解" description="筋肉痛・疲労・転倒・筋損傷・既往症の悪化など、運動や指導に伴う一般的なリスクがあることを理解していますか？" options={['理解しました','確認が必要です']} value={liabilityWaiverData.risk_understanding_status ?? ''} onChange={(v) => updateWaiver('risk_understanding_status', v)} required />

              <SimpleRadioGroup label="健康状態申告の重要性の理解" description="健康状態確認書または口頭での申告内容が、安全な指導のために重要であることを理解していますか？" options={['理解しました','確認が必要です']} value={liabilityWaiverData.health_disclosure_status ?? ''} onChange={(v) => updateWaiver('health_disclosure_status', v)} required />

              <SimpleRadioGroup label="体調不良時の申告義務の理解" description="トレーニング前・中・後に体調の異変を感じた場合は、速やかにトレーナーへ申告することを理解していますか？" options={['理解しました','確認が必要です']} value={liabilityWaiverData.symptom_report_status ?? ''} onChange={(v) => updateWaiver('symptom_report_status', v)} required />

              <SimpleRadioGroup label="医師への相談が必要な場合があることの理解" description="持病・妊娠・服薬中などの場合は、トレーニング開始前に医師へ相談する必要があることを理解していますか？" options={['理解しました','確認が必要です']} value={liabilityWaiverData.medical_consultation_status ?? ''} onChange={(v) => updateWaiver('medical_consultation_status', v)} required />

              <SimpleRadioGroup label="免責条項への同意" description="運動に伴う一般的なリスクを理解したうえで自らの意思で参加し、通常想定される範囲の事故や体調不良について、事業者・トレーナーに対して過度な責任追及を行わないことに同意しますか？（故意または重大な過失による損害はこの限りではありません。）" options={['同意します','同意しません']} value={liabilityWaiverData.liability_consent_status ?? ''} onChange={(v) => updateWaiver('liability_consent_status', v)} required />

              <SimpleRadioGroup label="未成年かどうか" description="ご年齢をお知らせください。18歳未満の場合は保護者の同意が必要です。" options={['18歳以上です','18歳未満です']} value={liabilityWaiverData.minor_status ?? '18歳以上です'} onChange={(v) => updateWaiver('minor_status', v as LiabilityWaiverFormData['minor_status'])} required />

              {liabilityWaiverData.minor_status === '18歳未満です' && (
                <Input label="保護者氏名" value={liabilityWaiverData.guardian_name ?? ''} onChange={(e) => updateWaiver('guardian_name', e.target.value)} placeholder="山田 花子" required />
              )}

              <div>
                <label className="form-label">その他・特記事項<span className="ml-1 text-xs font-normal text-gray-400">（任意）</span></label>
                <textarea value={liabilityWaiverData.special_notes ?? ''} onChange={(e) => updateWaiver('special_notes', e.target.value)} className="form-input min-h-24 resize-y" maxLength={500} placeholder="上記以外に、トレーナーに事前に伝えておきたいことがあればご記入ください。" />
              </div>

              <Input label="署名日" type="date" value={liabilityWaiverData.signed_date ?? ''} onChange={(e) => updateWaiver('signed_date', e.target.value)} />

              {/* 最終同意 */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="sr-only" checked={(liabilityWaiverData.consent_confirmed ?? []).length > 0} onChange={() => toggleWaiverCheckbox('consent_confirmed', '本書の内容をすべて読み、理解したうえで同意します。')} />
                  <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${(liabilityWaiverData.consent_confirmed ?? []).length > 0 ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`}>
                    {(liabilityWaiverData.consent_confirmed ?? []).length > 0 && <svg className="w-3 h-3 text-white" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">本書の内容をすべて読み、理解したうえで同意します。<span className="ml-0.5 text-red-500">*</span></p>
                    <p className="text-xs text-gray-500 mt-0.5">この同意がないと書類を生成できません。</p>
                  </div>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: 契約内容（免責同意書・入会申込書・キャンセルポリシー以外） */}
          {step === 4 && !isLiabilityWaiver && !isMembershipForm && !isCancellationPolicy && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="契約開始日"
                  type="date"
                  value={form.contractStartDate}
                  onChange={(e) => update('contractStartDate', e.target.value)}
                  required
                />
                <Input
                  label="契約終了日"
                  type="date"
                  value={form.contractEndDate}
                  onChange={(e) => update('contractEndDate', e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="セッション料金（円）"
                  type="number"
                  value={form.sessionFee || ''}
                  onChange={(e) => update('sessionFee', Number(e.target.value))}
                  placeholder="10000"
                  required
                />
                <Input
                  label="セッション回数（回）"
                  type="number"
                  value={form.sessionCount || ''}
                  onChange={(e) => update('sessionCount', Number(e.target.value))}
                  placeholder="10"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="セッション時間（分）"
                  type="number"
                  value={form.sessionDuration || ''}
                  onChange={(e) => update('sessionDuration', Number(e.target.value))}
                  placeholder="60"
                  required
                />
                <div>
                  <label className="form-label">
                    支払方法 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) => update('paymentMethod', e.target.value)}
                    className="form-input"
                    required
                  >
                    <option>銀行振込</option>
                    <option>クレジットカード</option>
                    <option>現金</option>
                    <option>PayPay</option>
                    <option>その他</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: 特記事項（免責同意書以外） */}
          {step === 5 && !isLiabilityWaiver && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed">
                料金・キャンセル等の主要条件は前のステップで設定済みです。
                この契約だけに適用したい追加条件がある場合のみ選択・記入してください。
                すべて任意項目です。
              </p>

              <RadioGroup
                label="交通費"
                options={TRANSPORTATION_FEE_OPTIONS}
                value={(specialTerms.transportationFee ?? '') as NonNullable<StructuredSpecialTerms['transportationFee']> | ''}
                onChange={(v) => updateSpecialTerms('transportationFee', v || undefined)}
                cols={4}
              />

              <RadioGroup
                label="施設利用料"
                options={FACILITY_FEE_OPTIONS}
                value={(specialTerms.facilityFee ?? '') as NonNullable<StructuredSpecialTerms['facilityFee']> | ''}
                onChange={(v) => updateSpecialTerms('facilityFee', v || undefined)}
                cols={4}
              />

              <RadioGroup
                label="キャンセルポリシーの明示"
                options={CANCELLATION_POLICY_OPTIONS}
                value={(specialTerms.cancellationPolicy ?? '') as NonNullable<StructuredSpecialTerms['cancellationPolicy']> | ''}
                onChange={(v) => updateSpecialTerms('cancellationPolicy', v || undefined)}
                cols={2}
              />

              <div className="space-y-3">
                <RadioGroup
                  label="セッション形態"
                  options={SESSION_FORMAT_OPTIONS}
                  value={(specialTerms.sessionFormat ?? '') as NonNullable<StructuredSpecialTerms['sessionFormat']> | ''}
                  onChange={(v) => updateSpecialTerms('sessionFormat', v || undefined)}
                  cols={4}
                />
                {(specialTerms.sessionFormat === 'in_person' || specialTerms.sessionFormat === 'both') && (
                  <Input
                    label="対面の主な実施場所"
                    value={specialTerms.sessionLocation ?? ''}
                    onChange={(e) => updateSpecialTerms('sessionLocation', e.target.value || undefined)}
                    placeholder="例：渋谷区〇〇スポーツクラブ"
                  />
                )}
              </div>

              <RadioGroup
                label="撮影・利用許諾"
                options={PHOTO_CONSENT_OPTIONS}
                value={(specialTerms.photoConsent ?? '') as NonNullable<StructuredSpecialTerms['photoConsent']> | ''}
                onChange={(v) => updateSpecialTerms('photoConsent', v || undefined)}
                cols={4}
              />

              <div>
                <label className="form-label">
                  その他の特記事項
                  <span className="ml-1 text-xs font-normal text-gray-400">（任意・AI が条文に整形します）</span>
                </label>
                <textarea
                  value={form.freeTextNotes ?? ''}
                  onChange={(e) => update('freeTextNotes', e.target.value)}
                  className="form-input min-h-28 resize-y"
                  maxLength={1000}
                  placeholder="例：乙がトレーナーの変更を希望する場合、セッション予定日の7日前までに甲に連絡するものとする。"
                />
                <div className="mt-2 space-y-1 text-xs text-gray-500 leading-relaxed">
                  <p>・主語（甲／乙）が分かるように、1〜2文で具体的にご記入ください。</p>
                  <p>・第三者が読んでも意味が分かる書き方をお願いします。</p>
                  <p className="text-gray-400">
                    ※「トレーナー変更対応」のようなラベルだけの入力ではなく、
                    「誰が」「何を」「いつまでに」するかが分かる文章にしてください。
                  </p>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-right">
                  {(form.freeTextNotes ?? '').length} / 1000
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
            {isGenerating && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-3 text-sm text-brand-700 bg-brand-50 border border-brand-100 rounded-xl px-4 py-3"
              >
                <span
                  className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin flex-shrink-0"
                  aria-hidden="true"
                />
                <span>{GENERATION_STEP_MESSAGES[generationStep as Exclude<GenerationStep, 0>]}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 1 || isGenerating}
              >
                <ChevronLeft size={16} />
                戻る
              </Button>

              {step < totalSteps ? (
                <Button variant="primary" onClick={() => setStep((s) => s + 1)}>
                  次へ
                  <ChevronRight size={16} />
                </Button>
              ) : (
                <Button
                  variant="primary"
                  loading={isGenerating}
                  disabled={isGenerating}
                  onClick={handleSubmit}
                  size="lg"
                  aria-busy={isGenerating}
                >
                  {isGenerating ? '生成中…' : 'AIで書類を生成'}
                </Button>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
