/**
 * 静的テンプレートエンジン
 *
 * Pro版の書類は Gemini で動的生成せず、ここで定義した固定テンプレートに
 * フォームデータを差し込んで生成する。
 *
 * 変数記法: {{variableName}}
 * 利用可能な変数一覧:
 *   {{businessName}}   - 事業者名（屋号・法人名）
 *   {{trainerName}}    - トレーナー名
 *   {{address}}        - 所在地
 *   {{phone}}          - 電話番号
 *   {{email}}          - メールアドレス
 *   {{clientName}}     - クライアント氏名
 *   {{clientPhone}}    - クライアント電話番号
 *   {{clientEmail}}    - クライアントメールアドレス
 *   {{contractStartDate}} - 契約開始日（YYYY-MM-DD）
 *   {{contractEndDate}}   - 契約終了日（YYYY-MM-DD）
 *   {{sessionFee}}     - セッション料金（カンマ区切り、単位なし）
 *   {{sessionCount}}   - セッション回数
 *   {{sessionDuration}}- セッション時間（分）
 *   {{paymentMethod}}  - 支払方法
 *   {{totalAmount}}    - 合計金額（sessionFee × sessionCount、カンマ区切り）
 *   {{notes}}          - 特記事項
 */

import type { TrainerFormData } from '@/types';

/** テンプレート文字列の {{variable}} を formData の値に置換する */
export function applyTemplate(template: string, data: TrainerFormData): string {
  const totalAmount = (data.sessionFee * data.sessionCount).toLocaleString('ja-JP');
  const feeFormatted = data.sessionFee.toLocaleString('ja-JP');

  const vars: Record<string, string> = {
    businessName: data.businessName,
    trainerName: data.trainerName,
    address: data.address,
    phone: data.phone,
    email: data.email,
    clientName: data.clientName,
    clientPhone: data.clientPhone || '',
    clientEmail: data.clientEmail || '',
    contractStartDate: data.contractStartDate,
    contractEndDate: data.contractEndDate,
    sessionFee: feeFormatted,
    sessionCount: String(data.sessionCount),
    sessionDuration: String(data.sessionDuration),
    paymentMethod: data.paymentMethod,
    totalAmount,
    notes: data.notes || 'なし',
  };

  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
}

// ============================================================
// Pro版 トレーニング委託契約書テンプレート（章立て版）
//
// TODO: 以下の PLACEHOLDER 部分を、ユーザーが提供する
//       「階層構造版トレーニング委託契約書」の本文に差し替えてください。
//       変数は上記の {{variableName}} 形式で差し込まれます。
// ============================================================
export const PRO_TRAINING_CONTRACT_V1_TEMPLATE = `
【テンプレート未設定】
このPro版テンプレートはまだ設定されていません。
開発者がテンプレート本文を追加するまでお待ちください。
`.trim();
