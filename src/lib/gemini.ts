import { GoogleGenerativeAI } from '@google/generative-ai';
import { TrainerFormData, DOCUMENT_TYPE_LABELS, DocumentType } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const DOCUMENT_SPECIFIC_INSTRUCTIONS: Record<DocumentType, string> = {
  training_contract: `
- 委託業務の範囲（指導内容・場所・頻度）を明記すること
- 料金・支払条件・遅延損害金について記載すること
- 契約解除条件（双方の事由）を明記すること
- 秘密保持義務を含めること`,

  health_check: `
- 既往症・現在の疾患・服薬状況の確認欄を設けること
- 運動制限の有無・医師の指示事項の記入欄を設けること
- 虚偽申告に関する免責条項を含めること
- 定期的な健康状態の更新について記載すること`,

  liability_waiver: `
- トレーニング中の怪我・事故に対するリスク説明を明記すること
- トレーナーおよび施設の責任範囲の限定を明記すること
- クライアントが自己責任においてトレーニングに参加することへの同意を明記すること
- 緊急時の対応手順について記載すること`,

  membership_form: `
- 入会条件・資格要件を明記すること
- 会員規約への同意条項を含めること
- 個人情報の取り扱いについて（利用目的・第三者提供の有無）を明記すること
- 会員証の発行・利用ルールについて記載すること`,

  cancellation_policy: `
- キャンセル通知の期限（例：24時間前・48時間前）と方法（電話・メール等）を明記すること
- 通知期限内・期限後それぞれのキャンセル料率（例：当日100%、前日50%等）を明記すること
- 未連絡ノーショーの扱い（全額請求等）を明記すること
- トレーナー都合でのキャンセル時の振替・返金ルールを明記すること
- 悪天候・災害等の不可抗力時の対応を明記すること
- 返金が発生する場合の計算方法と支払期限を明記すること
- クライアントが本ポリシーに同意した旨の確認欄を設けること`,

  mid_cancel_agreement: `
- 特定商取引法に基づくクーリングオフ制度（契約書面受領から8日以内）の説明を明記すること
- クーリングオフ行使方法（書面通知）と連絡先を明記すること
- クーリングオフ期間経過後の途中解約の申し出方法・必要書類を明記すること
- 残セッション分の返金計算方法（例：未消化回数×1回単価－事務手数料）を明記すること
- 解約時の事務手数料の有無と金額を明記すること
- 解約の効力発生日と返金支払期限を明記すること
- クライアントが説明を受け理解した旨の確認欄を設けること`,

  effect_disclaimer: `
- トレーニング効果（体重減少・筋肉増加・体力向上等）には個人差があり、特定の結果を保証しないことを明記すること
- 効果の発現には食事・睡眠・生活習慣等の外部要因が影響することを説明すること
- トレーナーは合理的な指導を提供する義務を負うが、期待する成果が出なかった場合の返金・補償義務を負わないことを明記すること
- クライアントが自身の目標を理解したうえで自己責任においてサービスを利用することへの同意を明記すること
- 医療行為ではなく、疾患の治療・改善を目的としたサービスではないことを明記すること
- クライアントが本免責事項を十分に理解・同意した旨の確認欄を設けること`,
};

export async function generateDocument(formData: TrainerFormData): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const documentLabel = DOCUMENT_TYPE_LABELS[formData.documentType];
  const specificInstructions = DOCUMENT_SPECIFIC_INSTRUCTIONS[formData.documentType];

  const prompt = `
あなたはパーソナルトレーナー向けの法的書類作成の専門家です。
以下の情報をもとに、プロフェッショナルな「${documentLabel}」を日本語で作成してください。

## 入力情報

### トレーナー情報
- トレーナー名: ${formData.trainerName}
- 事業者名: ${formData.businessName}
- 所在地: ${formData.address}
- 電話番号: ${formData.phone}
- メールアドレス: ${formData.email}

### クライアント情報
- 氏名: ${formData.clientName}
- 電話番号: ${formData.clientPhone}
- メールアドレス: ${formData.clientEmail}

### 契約内容
- 契約開始日: ${formData.contractStartDate}
- 契約終了日: ${formData.contractEndDate}
- セッション料金: ${formData.sessionFee.toLocaleString('ja-JP')}円
- セッション回数: ${formData.sessionCount}回
- セッション時間: ${formData.sessionDuration}分
- 支払方法: ${formData.paymentMethod}

### 特記事項
${formData.notes || 'なし'}

## 書類作成要件
- 書類種別: ${documentLabel}
- 法的に有効な形式で、明確かつ詳細に記述すること
- 日本の法律・慣習に準拠すること
- 署名欄（トレーナー・クライアント双方）を末尾に含めること
- 作成日を含めること
- 書類番号（自動採番形式）を含めること

### ${documentLabel} 固有の要件
${specificInstructions}

書類の本文のみを出力してください。マークダウン記法は使わず、プレーンテキストで出力してください。
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
