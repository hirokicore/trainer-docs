/**
 * 静的テンプレートエンジン
 *
 * Pro版の書類は Gemini で動的生成せず、ここで定義した固定テンプレートに
 * フォームデータを差し込んで生成する。
 *
 * 変数記法: {{variableName}}
 * 利用可能な変数一覧:
 *   {{businessName}}      - 事業者名（屋号・法人名）
 *   {{trainerName}}       - トレーナー名
 *   {{address}}           - 所在地
 *   {{phone}}             - 電話番号
 *   {{email}}             - メールアドレス
 *   {{clientName}}        - クライアント氏名
 *   {{clientPhone}}       - クライアント電話番号
 *   {{clientEmail}}       - クライアントメールアドレス
 *   {{contractStartDate}} - 契約開始日（YYYY年M月D日 形式に自動変換）
 *   {{contractEndDate}}   - 契約終了日（YYYY年M月D日 形式に自動変換）
 *   {{sessionFee}}        - セッション料金（カンマ区切り、単位なし）
 *   {{sessionCount}}      - セッション回数
 *   {{sessionDuration}}   - セッション時間（分）
 *   {{paymentMethod}}     - 支払方法
 *   {{totalAmount}}       - 合計金額（sessionFee × sessionCount、カンマ区切り）
 *   {{notes}}             - 特記事項
 */

import type { TrainerFormData } from '@/types';

/** "YYYY-MM-DD" を "YYYY年M月D日" に変換する。変換できない場合は元の文字列をそのまま返す */
function formatDateJP(dateStr: string): string {
  if (!dateStr) return '';
  // Edge Runtime では Date コンストラクタが UTC 解釈するため、時刻を付けて補正
  const d = new Date(`${dateStr}T00:00:00`);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

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
    contractStartDate: formatDateJP(data.contractStartDate),
    contractEndDate: formatDateJP(data.contractEndDate),
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
// 第1章 総則 〜 第10章 協議・準拠法・合意管轄
// ============================================================
export const PRO_TRAINING_CONTRACT_V1_TEMPLATE = `
トレーニング委託契約書
契約書No. 【契約書番号】

本契約書は、以下の甲および乙との間において、トレーニング委託に関し、以下の各条項のとおり契約を締結する。

甲（以下「甲」という）
事業者名：{{businessName}}
所在地：{{address}}
トレーナー名：{{trainerName}}
電話番号：{{phone}}
メールアドレス：{{email}}

乙（以下「乙」という）
氏名：{{clientName}}
電話番号：{{clientPhone}}
メールアドレス：{{clientEmail}}


第1章　総則

第1条（目的）
本契約は、甲が乙に対してパーソナルトレーニングサービスを提供し、乙がその対価を甲に支払うことに関する基本的事項を定めることを目的とする。

第2条（定義）
「セッション」とは、甲が乙に対して実施する1回のパーソナルトレーニングをいう。
「契約期間」とは、第8条に定める本契約の有効期間をいう。


第2章　サービス内容

第3条（委託内容）
甲は、乙に対し、パーソナルトレーニングセッションを合計{{sessionCount}}回実施するものとする。
1回のセッション時間は{{sessionDuration}}分とする。
トレーニングの実施場所、具体的な内容および日程は、甲乙協議のうえ、別途定めるものとする。


第3章　料金および支払方法

第4条（料金）
本契約におけるセッション料金は、1回あたり金{{sessionFee}}円とし、合計金{{totalAmount}}円とする。
乙は、前項の料金を、契約開始日までに甲が指定する銀行口座へ{{paymentMethod}}にて支払うものとする。振込手数料は乙の負担とする。


第4章　予約・キャンセル・返金ポリシー

第5条（予約・キャンセルポリシー）
セッションの予約は、甲乙合意のうえ実施するものとする。
乙は、予約したセッションの変更またはキャンセルを行う場合、当該セッション開始時刻の24時間前までに甲に連絡するものとする。
前項に定める期間を過ぎての変更またはキャンセル、あるいは無断欠席の場合、当該セッションは実施されたものとみなし、乙は当該セッション分の料金の返還または消化を求めることができない。
甲の都合によりセッションが中止または変更される場合、甲は速やかに乙に連絡し、代替セッション日の設定または未消化分の料金を返還するものとする。


第5章　健康状態・申告・免責

第6条（健康状態の申告）
乙は、トレーニング開始前に自身の健康状態（既往症、体調不良、アレルギー等を含む）について、甲に正確に申告するものとする。
乙は、トレーニング中に体調に異常を感じた場合、直ちに甲に申告し、トレーニングを中断するものとする。

第7条（免責）
甲は、乙が虚偽の申告をした場合、または甲の指示に従わずに行ったトレーニングによって生じた怪我、体調不良、その他の損害について一切の責任を負わない。
甲は、細心の注意を払い指導を行うが、トレーニングに起因する予見不可能な怪我や体調不良等については、乙の自己責任とし、甲は賠償責任を負わないものとする。ただし、甲に重大な過失が認められる場合はこの限りではない。


第6章　契約期間・更新・解除

第8条（契約期間）
本契約の有効期間は、{{contractStartDate}}から{{contractEndDate}}までとする。
期間満了をもって本契約は終了するものとし、継続を希望する場合は別途再契約を行うものとする。

第9条（契約解除）
甲または乙は、相手方が本契約のいずれかの条項に違反し、相当期間を定めて催告したにもかかわらず当該違反が是正されない場合、本契約を解除することができる。
乙が第4条に定める料金の支払いを遅滞した場合、甲は催告のうえ本契約を解除することができる。
乙がトレーニングを継続することが客観的に困難と判断される健康状態になった場合、甲は本契約を解除することができる。この場合、未消化分の料金については、甲乙協議のうえ、返還または相殺するものとする。


第7章　禁止事項・マナー

第10条（禁止事項）
乙は、以下の行為を行ってはならない。
甲の指示に従わないトレーニング行為。
他の利用者への迷惑行為、施設内での器物損壊行為。
その他、甲が不適切と判断する行為。


第8章　個人情報の取扱い

第11条（個人情報の取扱い）
甲は、本契約遂行のために知り得た乙の個人情報を、個人情報保護法および甲のプライバシーポリシーに基づき、適切に取り扱うものとする。
甲は、乙の同意なく個人情報を第三者に開示または提供しない。ただし、法令に基づく場合を除く。


第9章　損害賠償・責任の範囲

第12条（損害賠償）
甲または乙は、本契約に違反し、相手方に損害を与えた場合、その損害を賠償する責任を負う。


第10章　協議・準拠法・合意管轄

第13条（協議）
本契約に定めのない事項または本契約の解釈に疑義が生じた場合、甲乙は信義誠実の原則に基づき、協議のうえ円満に解決するものとする。

第14条（準拠法および合意管轄）
本契約は日本法に準拠し、本契約に関する一切の紛争については、甲の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とする。


特記事項：
{{notes}}


以上のとおり、本契約の成立を証するため、本書2通を作成し、甲乙記名押印のうえ、各自1通を保有する。

作成日：{{contractStartDate}}

甲
事業者名：{{businessName}}
所在地：{{address}}
代表者：　　　　　　　　　　　　　　　印

乙
氏名：{{clientName}}
住所：
　　　　　　　　　　　　　　　　　　　印
`.trim();
