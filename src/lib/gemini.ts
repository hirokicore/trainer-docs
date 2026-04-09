import { GoogleGenerativeAI } from '@google/generative-ai';
import { TrainerFormData, DOCUMENT_TYPE_LABELS } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateDocument(formData: TrainerFormData): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const documentLabel = DOCUMENT_TYPE_LABELS[formData.documentType];

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

書類の本文のみを出力してください。マークダウン記法は使わず、プレーンテキストで出力してください。
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
