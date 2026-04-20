'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { DOCUMENT_TYPE_LABELS, PRO_ONLY_DOCUMENT_TYPES, type DocumentType, type TrainerFormData } from '@/types';
import { User, Briefcase, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'トレーナー情報', icon: User },
  { id: 2, label: 'クライアント情報', icon: User },
  { id: 3, label: '契約内容', icon: Briefcase },
  { id: 4, label: '書類種別', icon: FileText },
];

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

export default function TrainerForm({ isSubscribed = false, isPro = false }: { isSubscribed?: boolean; isPro?: boolean }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<TrainerFormData>(defaultValues);
  const [generationStep, setGenerationStep] = useState<GenerationStep>(0);
  const [error, setError] = useState('');
  const router = useRouter();

  // タイムアウトIDを ref で保持し、完了/失敗時に必ずクリアする
  const step2TimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step3TimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGenerating = generationStep > 0;

  const clearStepTimers = () => {
    if (step2TimerRef.current) clearTimeout(step2TimerRef.current);
    if (step3TimerRef.current) clearTimeout(step3TimerRef.current);
    step2TimerRef.current = null;
    step3TimerRef.current = null;
  };

  const update = (field: keyof TrainerFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setError('');
    setGenerationStep(1); // Step 1: 開始直後

    // Step 2: 10 秒後（Gemini がレスポンスを返し始める頃）
    step2TimerRef.current = setTimeout(() => setGenerationStep(2), 10_000);
    // Step 3: 25 秒後（長い書類の場合に備えた後半演出）
    step3TimerRef.current = setTimeout(() => setGenerationStep(3), 25_000);

    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
      // 成功・失敗いずれでもタイマーを止め、演出をリセット
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
          {step === 1 && (
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

          {step === 2 && (
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

          {step === 3 && (
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
              <div>
                <label className="form-label">特記事項</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update('notes', e.target.value)}
                  className="form-input min-h-24 resize-y"
                  placeholder="キャンセルポリシー、特別条件など..."
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                生成する書類の種類を選択してください。
              </p>
              {(Object.entries(DOCUMENT_TYPE_LABELS) as [DocumentType, string][])
                // Proプラン専用の種別はFreeユーザーには非表示
                .filter(([value]) => isPro || !PRO_ONLY_DOCUMENT_TYPES.has(value as DocumentType))
                .map(([value, label]) => {
                  const docType = value as DocumentType;
                  const isProDoc = PRO_ONLY_DOCUMENT_TYPES.has(docType);
                  const displayLabel = isPro
                    ? (PRO_USER_LABEL_OVERRIDE[docType] ?? label)
                    : label;
                  const description = DOCUMENT_TYPE_DESCRIPTIONS[docType];

                  return (
                    <label
                      key={value}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
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
                        onChange={() => update('documentType', value)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          form.documentType === value
                            ? 'border-brand-500'
                            : 'border-gray-400'
                        }`}
                      >
                        {form.documentType === value && (
                          <div className="w-2 h-2 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900 text-sm">{displayLabel}</p>
                          {isProDoc && (
                            <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-600 text-white leading-none">
                              Pro
                            </span>
                          )}
                        </div>
                        {description && (
                          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                        )}
                      </div>
                    </label>
                  );
                })
              }

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mt-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
            {/* 生成進捗メッセージ（generationStep > 0 のときのみ表示） */}
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

              {step < 4 ? (
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
