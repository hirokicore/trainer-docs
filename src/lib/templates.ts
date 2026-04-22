/**
 * 静的テンプレートエンジン
 *
 * Gemini を使わず、固定テンプレートにフォームデータを差し込んで書類を生成する。
 *
 * 変数記法: {{variableName}}
 *
 * ── 共通変数（全テンプレートで使用可） ──────────────────────────
 *   {{contractNumber}}    - 書類番号（自動生成）
 *   {{contractDate}}      - 作成日（生成時点の日付、YYYY年M月D日）
 *   {{businessName}}      - 事業者名（屋号・法人名）
 *   {{businessAddress}}   - 乙の所在地
 *   {{businessPhone}}     - 乙の電話番号
 *   {{businessEmail}}     - 乙のメールアドレス
 *   {{trainerName}}       - 担当トレーナー名
 *   {{clientName}}        - クライアント氏名
 *   {{clientAddress}}     - クライアント住所（フォーム未収集→「（要記入）」）
 *   {{clientPhone}}       - クライアント電話番号
 *   {{clientEmail}}       - クライアントメールアドレス
 *   {{startDate}}         - 契約開始日（YYYY年M月D日）
 *   {{endDate}}           - 契約終了日（YYYY年M月D日）
 *   {{sessionFee}}        - セッション料金（カンマ区切り、単位なし）
 *   {{sessionCount}}      - セッション回数
 *   {{sessionDuration}}   - セッション時間（分）
 *   {{totalFee}}          - 合計金額（sessionFee × sessionCount）
 *   {{paymentMethod}}     - 支払方法
 *   {{paymentDeadline}}   - 支払期日（デフォルト: 契約開始日）
 *   {{cancelDeadlineHours}} - キャンセル期限（デフォルト: 24）
 *   {{specialNotes}}      - 特記事項
 *
 * ── 後方互換エイリアス（旧 Pro テンプレート用） ──────────────────
 *   {{address}}           = {{businessAddress}}
 *   {{phone}}             = {{businessPhone}}
 *   {{email}}             = {{businessEmail}}
 *   {{contractStartDate}} = {{startDate}}
 *   {{contractEndDate}}   = {{endDate}}
 *   {{totalAmount}}       = {{totalFee}}
 *   {{notes}}             = {{specialNotes}}
 */

import type { TrainerFormData, LiabilityWaiverFormData, MembershipFormData, CancellationPolicyFormData } from '@/types';

// ──────────────────────────────────────────────
// 内部ユーティリティ
// ──────────────────────────────────────────────

/** "YYYY-MM-DD" を "YYYY年M月D日" に変換する */
function formatDateJP(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(`${dateStr}T00:00:00`);
  if (isNaN(d.getTime())) return dateStr;
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/** 書類番号を自動生成する（例: TD-20250115-042） */
function generateContractNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `TD-${y}${m}${d}-${rand}`;
}

/** 今日の日付を "YYYY年M月D日" 形式で返す */
function todayJP(): string {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
}

// ──────────────────────────────────────────────
// テンプレートエンジン
// ──────────────────────────────────────────────

/**
 * テンプレート文字列の {{variable}} を formData の値に置換する。
 * 未定義の変数は {{variable}} のまま残す（デバッグ用）。
 */
export function applyTemplate(template: string, data: TrainerFormData): string {
  const totalFee = (data.sessionFee * data.sessionCount).toLocaleString('ja-JP');
  const feeFormatted = data.sessionFee.toLocaleString('ja-JP');
  const startDateJP = formatDateJP(data.contractStartDate);
  const endDateJP   = formatDateJP(data.contractEndDate);

  const vars: Record<string, string> = {
    // ── 自動生成 ──────────────────────────────────────
    contractNumber: generateContractNumber(),
    contractDate:   todayJP(),

    // ── 乙（事業者・トレーナー）情報 ─────────────────
    businessName:    data.businessName,
    businessAddress: data.address,
    businessPhone:   data.phone,
    businessEmail:   data.email,
    trainerName:     data.trainerName,

    // ── 甲（クライアント）情報 ────────────────────────
    clientName:    data.clientName,
    clientAddress: '（要記入）',   // フォーム未収集フィールド
    clientPhone:   data.clientPhone  || '',
    clientEmail:   data.clientEmail  || '',

    // ── 契約期間 ──────────────────────────────────────
    startDate: startDateJP,
    endDate:   endDateJP,

    // ── 料金 ──────────────────────────────────────────
    sessionFee:      feeFormatted,
    sessionCount:    String(data.sessionCount),
    sessionDuration: String(data.sessionDuration),
    totalFee,
    paymentMethod:   data.paymentMethod,

    // ── デフォルト値を持つオプションフィールド ─────────
    paymentDeadline:      startDateJP,  // 支払期日: デフォルトは契約開始日
    cancelDeadlineHours:  '24',         // キャンセル期限: デフォルト 24 時間前
    specialNotes:         data.notes || 'なし',

    // ── 後方互換エイリアス（旧 Pro テンプレート用） ───
    address:           data.address,
    phone:             data.phone,
    email:             data.email,
    contractStartDate: startDateJP,
    contractEndDate:   endDateJP,
    totalAmount:       totalFee,
    notes:             data.notes || 'なし',
  };

  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
}

// ──────────────────────────────────────────────
// フィールド定義（ドキュメント・フォーム生成用メタデータ）
// ──────────────────────────────────────────────

/** テンプレートフィールドの定義型 */
export interface TemplateFieldDef {
  /** プレースホルダ名（{{ }} を除いたキー名） */
  placeholder: string;
  /** 日本語ラベル */
  label: string;
  /** 値の取得元 */
  source: 'form' | 'auto' | 'default';
  /** source = 'form' のとき、対応する TrainerFormData のフィールド名 */
  formField?: keyof TrainerFormData;
  /** source = 'auto' / 'default' のときのデフォルト値説明 */
  defaultNote?: string;
}

/** STANDARD_TRAINING_CONTRACT_V1 で使用するフィールド定義 */
export const STANDARD_TRAINING_CONTRACT_V1_FIELDS: TemplateFieldDef[] = [
  { placeholder: 'contractNumber',      label: '書類番号',                  source: 'auto',    defaultNote: 'TD-YYYYMMDD-NNN 形式で自動生成' },
  { placeholder: 'contractDate',        label: '契約書作成日',               source: 'auto',    defaultNote: '生成時点の日付' },
  { placeholder: 'clientName',          label: '甲（クライアント）の氏名',    source: 'form',    formField: 'clientName' },
  { placeholder: 'clientAddress',       label: '甲の住所',                   source: 'default', defaultNote: '（要記入）— フォームで未収集' },
  { placeholder: 'clientPhone',         label: '甲の電話番号',               source: 'form',    formField: 'clientPhone' },
  { placeholder: 'clientEmail',         label: '甲のメールアドレス',          source: 'form',    formField: 'clientEmail' },
  { placeholder: 'businessName',        label: '乙の事業者名',               source: 'form',    formField: 'businessName' },
  { placeholder: 'businessAddress',     label: '乙の所在地',                 source: 'form',    formField: 'address' },
  { placeholder: 'businessPhone',       label: '乙の電話番号',               source: 'form',    formField: 'phone' },
  { placeholder: 'businessEmail',       label: '乙のメールアドレス',          source: 'form',    formField: 'email' },
  { placeholder: 'trainerName',         label: '担当トレーナー名',            source: 'form',    formField: 'trainerName' },
  { placeholder: 'sessionCount',        label: 'セッション総回数',            source: 'form',    formField: 'sessionCount' },
  { placeholder: 'sessionDuration',     label: '1回あたりのセッション時間（分）', source: 'form', formField: 'sessionDuration' },
  { placeholder: 'sessionFee',          label: '1回あたりのセッション料金（円）', source: 'form', formField: 'sessionFee' },
  { placeholder: 'totalFee',            label: 'セッション料金の総額（円）',   source: 'auto',    defaultNote: 'sessionFee × sessionCount' },
  { placeholder: 'startDate',           label: '契約期間の開始日',            source: 'form',    formField: 'contractStartDate' },
  { placeholder: 'endDate',             label: '契約期間の終了日',            source: 'form',    formField: 'contractEndDate' },
  { placeholder: 'paymentDeadline',     label: '料金の支払期日',              source: 'default', defaultNote: '契約開始日と同日（デフォルト）' },
  { placeholder: 'cancelDeadlineHours', label: 'キャンセル期限（時間前）',     source: 'default', defaultNote: '24（固定デフォルト）' },
  { placeholder: 'specialNotes',        label: '特記事項（任意）',            source: 'form',    formField: 'notes' },
];

// ──────────────────────────────────────────────
// テンプレートバリアント管理
// （将来のバリエーション追加に備えた enum + テンプレマップ）
// ──────────────────────────────────────────────

/**
 * 契約書バリアント識別子。
 * 新しいバリエーションを追加するときはここに追記し、
 * TRAINING_CONTRACT_TEMPLATE_MAP にテンプレを登録する。
 */
export type TrainingContractVariant = 'standard_v1' | 'pro_v1';

/** バリアント → テンプレート文字列 のマップ */
export const TRAINING_CONTRACT_TEMPLATE_MAP: Record<TrainingContractVariant, string> = {
  standard_v1: '', // 後の定数定義で代入される（循環参照回避のため下で上書き）
  pro_v1:      '', // 同上
};

// ──────────────────────────────────────────────
// テンプレート本文
// ──────────────────────────────────────────────

// ── 標準版（standard_v1）────────────────────────────────────────────
export const STANDARD_TRAINING_CONTRACT_V1_TEMPLATE = `
パーソナルトレーニング委託契約書
書類番号：{{contractNumber}}　作成日：{{contractDate}}

本契約書は、以下の甲および乙との間において、パーソナルトレーニング指導の委託に関し、以下の各条項のとおり契約を締結する。

甲（クライアント）
氏名：{{clientName}}
住所：{{clientAddress}}
電話番号：{{clientPhone}}
メールアドレス：{{clientEmail}}

乙（事業者／トレーナー）
事業者名：{{businessName}}
所在地：{{businessAddress}}
電話番号：{{businessPhone}}
メールアドレス：{{businessEmail}}
担当トレーナー：{{trainerName}}

第1条（目的）
本契約は、乙が甲に対してパーソナルトレーニング指導を提供し、甲がその対価を乙に支払うことに関する基本的事項を定めることを目的とする。

第2条（本業務の内容）
1. 乙は、甲に対し、パーソナルトレーニングセッションを合計{{sessionCount}}回実施するものとする。
2. 1回のセッション時間は{{sessionDuration}}分とする。
3. トレーニングの実施場所は、乙が指定する場所または甲乙が別途合意した場所とする。
4. トレーニングの具体的なプログラム内容は、甲の目標・体力レベル・健康状態に基づき、乙が適切に設定するものとし、実施日程は甲乙協議のうえ別途定めるものとする。

第3条（料金および支払方法）
1. 本契約におけるセッション料金は、1回あたり金{{sessionFee}}円とし、合計金{{totalFee}}円とする。
2. 甲は、前項の料金を{{paymentDeadline}}までに、乙が別途通知する銀行口座へ銀行振込にて支払うものとする。振込手数料は甲の負担とする。
3. 甲が支払期日までに料金を支払わない場合、乙は甲に対して催告のうえ、セッションの実施を停止することができる。

第4条（予約・キャンセル・返金）
1. セッションの予約は、乙の定める方法により行うものとする。
2. 甲は、予約したセッションの変更またはキャンセルを行う場合、当該セッション開始時刻の{{cancelDeadlineHours}}時間前までに乙に連絡するものとする。
3. 前項に定める期限を過ぎての変更またはキャンセル、あるいは無断欠席の場合、当該セッションは実施されたものとみなし、甲は当該セッション分の料金の返還または振替を求めることができない。
4. 乙の都合によりセッションが中止または変更される場合、乙は速やかに甲に連絡し、代替セッション日の設定または未消化分の料金の返還を行うものとする。

第5条（健康状態の申告および免責）
1. 甲は、トレーニング開始前に、自身の健康状態（既往症、体調不良、アレルギー、服薬状況等を含む）について乙に正確に申告するものとする。
2. 甲は、トレーニング中に体調の異常を感じた場合、直ちに乙に申告し、トレーニングを中断するものとする。
3. 乙は、甲の健康状態に配慮しながら細心の注意を払い指導を行う。ただし、甲が虚偽の申告を行った場合、または乙の指示に従わずに行ったトレーニングにより生じた怪我・体調不良・その他の損害については、乙は責任を負わない。
4. トレーニングに起因する予見不可能な怪我や体調不良等については、甲の自己責任とする。ただし、乙に故意または重大な過失が認められる場合はこの限りではない。

第6条（契約期間）
1. 本契約の有効期間は、{{startDate}}から{{endDate}}までとする。
2. 期間満了をもって本契約は終了するものとし、継続を希望する場合は別途再契約を行うものとする。

第7条（契約の解除）
1. 甲または乙は、相手方が本契約のいずれかの条項に違反し、相当期間を定めて催告したにもかかわらず当該違反が是正されない場合、本契約を解除することができる。
2. 甲が第3条に定める料金の支払いを遅滞した場合、乙は催告のうえ本契約を解除することができる。
3. 甲がトレーニングを継続することが客観的に困難と判断される健康状態になった場合、乙は本契約を解除することができる。この場合、未消化分の料金については、甲乙協議のうえ返還または相殺するものとする。

第8条（禁止事項・マナー）
甲は、以下の行為を行ってはならない。
1. 乙の指示に従わないトレーニング行為。
2. 他の利用者への迷惑行為、施設内での器物損壊行為。
3. 乙または乙の関係者に対するハラスメント行為。
4. その他、乙が不適切と判断する行為。

第9条（個人情報の取扱い）
1. 乙は、本契約の遂行のために知り得た甲の個人情報および健康情報を、個人情報保護法その他関係法令に基づき適切に管理するものとする。
2. 乙は、甲の同意なく個人情報を第三者に開示または提供しない。ただし、法令に基づく場合を除く。
3. 乙が提供するトレーニング資料・プログラム等の著作権は乙に帰属するものとする。

第10条（損害賠償）
1. 甲または乙は、本契約に違反し相手方に損害を与えた場合、その損害を賠償する責任を負う。
2. 乙の責任が認められる場合、その賠償額は、原則として甲が乙に支払ったセッション料金の総額（{{totalFee}}円）を上限とする。ただし、乙の故意または重大な過失による損害についてはこの限りではない。

第11条（準拠法および合意管轄）
本契約は日本法に準拠し、本契約に関する一切の紛争については、乙の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とする。

特記事項：{{specialNotes}}

以上のとおり、本契約の成立を証するため、本書2通を作成し、甲乙記名押印のうえ、各自1通を保有する。

甲（クライアント）
氏名：{{clientName}}
住所：{{clientAddress}}
　　　　　　　　　　　　　　　　印

乙（事業者／トレーナー）
事業者名：{{businessName}}
所在地：{{businessAddress}}
代表者・担当トレーナー：{{trainerName}}
　　　　　　　　　　　　　　　　印
`.trim();

// ── Pro版（pro_v1）── 章立て版（第1章〜第10章）────────────────────
export const PRO_TRAINING_CONTRACT_V1_TEMPLATE = `
トレーニング委託契約書
書類番号：{{contractNumber}}　作成日：{{contractDate}}

本契約書は、以下の甲および乙との間において、トレーニング委託に関し、以下の各条項のとおり契約を締結する。

甲（以下「甲」という）
事業者名：{{businessName}}
所在地：{{businessAddress}}
トレーナー名：{{trainerName}}
電話番号：{{businessPhone}}
メールアドレス：{{businessEmail}}

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
本契約におけるセッション料金は、1回あたり金{{sessionFee}}円とし、合計金{{totalFee}}円とする。
乙は、前項の料金を、契約開始日までに甲が指定する銀行口座へ{{paymentMethod}}にて支払うものとする。振込手数料は乙の負担とする。


第4章　予約・キャンセル・返金ポリシー

第5条（予約・キャンセルポリシー）
セッションの予約は、甲乙合意のうえ実施するものとする。
乙は、予約したセッションの変更またはキャンセルを行う場合、当該セッション開始時刻の{{cancelDeadlineHours}}時間前までに甲に連絡するものとする。
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
本契約の有効期間は、{{startDate}}から{{endDate}}までとする。
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
{{specialNotes}}


以上のとおり、本契約の成立を証するため、本書2通を作成し、甲乙記名押印のうえ、各自1通を保有する。

作成日：{{contractDate}}

甲
事業者名：{{businessName}}
所在地：{{businessAddress}}
代表者：　　　　　　　　　　　　　　　印

乙
氏名：{{clientName}}
住所：
　　　　　　　　　　　　　　　　　　　印
`.trim();

// テンプレートマップを定数定義後に確定させる
TRAINING_CONTRACT_TEMPLATE_MAP.standard_v1 = STANDARD_TRAINING_CONTRACT_V1_TEMPLATE;
TRAINING_CONTRACT_TEMPLATE_MAP.pro_v1      = PRO_TRAINING_CONTRACT_V1_TEMPLATE;

// ──────────────────────────────────────────────
// 免責同意書テンプレート
// ──────────────────────────────────────────────

/**
 * 免責同意書テンプレート本文（未成年ブロックを除く）。
 * 変数は snake_case で統一（この書類固有のスキーマに合わせる）。
 *
 * 変数一覧:
 *   {{document_number}}      - 書類番号（自動生成）
 *   {{business_name}}        - 事業者名
 *   {{service_name}}         - サービス名（businessName にフォールバック）
 *   {{trainer_name}}         - 担当トレーナー名
 *   {{client_name}}          - クライアント氏名
 *   {{signed_date}}          - 署名日
 *   {{service_items}}        - 提供サービス（「、」区切りで結合）
 *   {{delivery_mode_status}} - 実施形態
 *   {{special_notes}}        - 特記事項
 */
const LIABILITY_WAIVER_MAIN_TEMPLATE = `
免責同意書

書類番号：{{document_number}}
事業者名：{{business_name}}
サービス名：{{service_name}}
担当トレーナー：{{trainer_name}}

---

はじめに

本書は、{{service_name}}をご利用いただくにあたり、提供するサービスの内容・運動に伴うリスク・責任の範囲について、事前にご理解・ご同意いただくための書類です。

パーソナルトレーニングや運動指導には、筋肉痛・疲労・転倒・筋損傷・関節への負担・既往症の悪化など、一定のリスクが伴います。{{business_name}}および担当トレーナーは、安全への配慮を最大限行いますが、すべての事故や体調不良を完全に防ぐことを保証するものではありません。

ご不明な点がございましたら、署名前に担当トレーナーまでお気軽にお申し出ください。

---

確認事項

1. 提供サービスおよび実施形態について

今回ご提供するサービスは、{{service_items}}です。実施形態は{{delivery_mode_status}}となります。サービス内容・形態については、契約前にご確認ください。

2. 運動・指導に伴うリスクについて

ご利用者は、筋肉痛・疲労・転倒・筋損傷・関節痛・既往症の悪化など、運動や運動指導に一般的に伴うリスクについて理解したうえでご参加いただきます。

3. 健康状態の申告について

安全なトレーニングのため、現在および過去の健康状態・既往歴・医師からの指示等について、正確かつ誠実にお申し出ください。申告いただいた内容を前提として、担当トレーナーは指導を行います。申告内容に重大な虚偽・漏れがあった場合、それにより生じた不利益については、{{business_name}}およびトレーナーは責任を負いかねます。

4. 体調不良時の対応について

トレーニング前・中・後を問わず、体調の異変（めまい・動悸・息切れ・痛み・倦怠感など）を感じた場合は、直ちにトレーナーへお申し出ください。必要に応じてトレーニングを中断し、医師の診察を受けるようにしてください。

5. 医師への相談について

持病・妊娠中・産後・服薬中など、健康上の注意が必要な状態にある方は、トレーニング開始前に必ず担当医へご相談のうえ、参加の可否についてご確認ください。

6. 責任の範囲について

ご利用者は、運動に伴う一般的なリスクを理解したうえで、自らの意思でサービスにご参加いただきます。{{business_name}}およびトレーナーは、安全に配慮した指導を行いますが、通常想定される運動リスクの範囲内で生じた事故・体調不良については、過度な責任を負いかねます。ただし、{{business_name}}またはトレーナーの故意もしくは重大な過失によって生じた損害については、この限りではありません。

---

特記事項

{{special_notes}}

---

同意・署名

私は、本書の内容をすべて読み、十分に理解したうえで、上記の各事項に同意します。

クライアント氏名（自署）：{{client_name}}
日付：{{signed_date}}
`.trim();

/** 未成年者の保護者同意ブロック（minor_status が「18歳未満です」の場合のみ末尾に追加） */
const LIABILITY_WAIVER_GUARDIAN_BLOCK = `

---

【未成年の方へ】
本サービスをご利用いただく方が18歳未満の場合、保護者の同意が必要です。

保護者氏名（自署）：{{guardian_name}}
日付：{{signed_date}}`;

// ──────────────────────────────────────────────
// 入会申込書
// ──────────────────────────────────────────────

/**
 * 入会申込書テンプレート。
 *
 * 変数一覧:
 *   {{document_number}}             - 書類番号（自動生成）
 *   {{business_name}}               - 事業者名
 *   {{trainer_name}}                - 担当トレーナー名
 *   {{signed_date}}                 - 申込日
 *   {{client_name}}                 - 氏名
 *   {{client_kana}}                 - 氏名（カナ）
 *   {{date_of_birth}}               - 生年月日
 *   {{gender_status}}               - 性別
 *   {{client_address}}              - 住所
 *   {{client_phone}}                - 電話番号
 *   {{client_email}}                - メールアドレス
 *   {{client_affiliation}}          - 所属
 *   {{emergency_contact_name}}      - 緊急連絡先：氏名
 *   {{emergency_contact_relation}}  - 緊急連絡先：続柄
 *   {{emergency_contact_phone}}     - 緊急連絡先：電話番号
 *   {{membership_plan}}             - 希望プラン
 *   {{membership_plan_detail}}      - プラン詳細
 *   {{start_date}}                  - 利用開始希望日
 *   {{payment_method_status}}       - 支払い方法
 *   {{payment_method_detail}}       - 支払い詳細
 *   {{preferred_days_items}}        - 希望曜日（「、」区切り）
 *   {{preferred_time_detail}}       - 希望時間帯
 *   {{training_purpose_items}}      - 利用目的（「、」区切り）
 *   {{training_goal_detail}}        - 具体的な目標
 *   {{terms_consent_status}}        - 会員規約同意
 *   {{privacy_consent_status}}      - 個人情報同意
 *   {{contact_permission_status}}   - 連絡・広告許諾
 *   {{guardian_block}}              - 保護者同意セクション（未成年時のみ展開、空文字でも可）
 *   {{special_notes}}               - 備考・特記事項
 *   {{consent_confirmed}}           - 最終同意
 */
const MEMBERSHIP_FORM_TEMPLATE = `
入会申込書
書類番号：{{document_number}}　申込日：{{signed_date}}

事業者名：{{business_name}}
担当トレーナー：{{trainer_name}}

---

■ お客様情報

氏名：{{client_name}}
氏名（カナ）：{{client_kana}}
生年月日：{{date_of_birth}}
性別：{{gender_status}}
ご住所：{{client_address}}
電話番号：{{client_phone}}
メールアドレス：{{client_email}}
ご所属（会社・学校等）：{{client_affiliation}}

---

■ 緊急連絡先

お名前：{{emergency_contact_name}}
続柄：{{emergency_contact_relation}}
電話番号：{{emergency_contact_phone}}

---

■ ご契約内容

ご希望プラン：{{membership_plan}}
プラン詳細：{{membership_plan_detail}}
ご利用開始希望日：{{start_date}}
お支払い方法：{{payment_method_status}}
お支払い詳細：{{payment_method_detail}}
ご希望曜日：{{preferred_days_items}}
ご希望時間帯：{{preferred_time_detail}}

---

■ トレーニング目的・目標

ご利用目的：{{training_purpose_items}}
具体的な目標：{{training_goal_detail}}

---

■ 各種同意

会員規約への同意：{{terms_consent_status}}
個人情報の取り扱いへの同意：{{privacy_consent_status}}
連絡・広告についての許諾：{{contact_permission_status}}{{guardian_block}}

---

■ 備考・特記事項

{{special_notes}}

---

■ 最終確認

{{consent_confirmed}}

申込者氏名（自署）：{{client_name}}
日付：{{signed_date}}

担当トレーナー：{{trainer_name}}
事業者名：{{business_name}}
`.trim();

/**
 * 入会申込書テンプレートを適用してドキュメント文字列を生成する。
 *
 * - preferred_days_items / training_purpose_items（checkbox）は「、」区切りで結合
 * - minor_status が「18歳未満です」の場合のみ {{guardian_block}} に保護者同意セクションを展開
 * - 共通変数（businessName / trainerName）は TrainerFormData から取得
 * - 書類固有変数は formData.membershipFormData から取得
 */
export function applyMembershipFormTemplate(formData: TrainerFormData): string {
  const m: Partial<MembershipFormData> = formData.membershipFormData ?? {};

  const joinItems = (arr: string[] | undefined): string =>
    Array.isArray(arr) && arr.length > 0 ? arr.join('、') : '（未選択）';

  const signedDateLabel = m.signed_date ? formatDateJP(m.signed_date) : todayJP();
  const dobLabel        = m.date_of_birth ? formatDateJP(m.date_of_birth) : '（未入力）';
  const startDateLabel  = m.start_date    ? formatDateJP(m.start_date)    : '（未入力）';

  const isMinor = m.minor_status === '18歳未満です';
  const guardianBlock = isMinor
    ? `\n\n---\n\n■ 保護者同意（未成年の方のみ）\n\n18歳未満のお客様がご利用される場合、保護者の方のご同意が必要です。\n\n保護者氏名（自署）：${m.guardian_name?.trim() || '（記入欄）'}\n保護者電話番号：${m.guardian_phone?.trim() || '（記入欄）'}`
    : '';

  const vars: Record<string, string> = {
    document_number:             generateContractNumber(),
    business_name:               formData.businessName,
    trainer_name:                formData.trainerName,
    signed_date:                 signedDateLabel,
    client_name:                 m.client_name                ?? formData.clientName,
    client_kana:                 m.client_kana                ?? '（未入力）',
    date_of_birth:               dobLabel,
    gender_status:               m.gender_status              || '（未選択）',
    client_address:              m.client_address             ?? '（未入力）',
    client_phone:                m.client_phone               ?? '（未入力）',
    client_email:                m.client_email               ?? '（未入力）',
    client_affiliation:          m.client_affiliation         || 'なし',
    emergency_contact_name:      m.emergency_contact_name     ?? '（未入力）',
    emergency_contact_relation:  m.emergency_contact_relation ?? '（未入力）',
    emergency_contact_phone:     m.emergency_contact_phone    ?? '（未入力）',
    membership_plan:             m.membership_plan            ?? '（未選択）',
    membership_plan_detail:      m.membership_plan_detail     || 'なし',
    start_date:                  startDateLabel,
    payment_method_status:       m.payment_method_status      ?? '（未選択）',
    payment_method_detail:       m.payment_method_detail      || 'なし',
    preferred_days_items:        joinItems(m.preferred_days_items),
    preferred_time_detail:       m.preferred_time_detail      || 'なし',
    training_purpose_items:      joinItems(m.training_purpose_items),
    training_goal_detail:        m.training_goal_detail       || 'なし',
    terms_consent_status:        joinItems(m.terms_consent_status),
    privacy_consent_status:      joinItems(m.privacy_consent_status),
    contact_permission_status:   m.contact_permission_status  || '（未回答）',
    guardian_block:              guardianBlock,
    special_notes:               m.special_notes?.trim()      || 'なし',
    consent_confirmed:           joinItems(m.consent_confirmed),
  };

  return MEMBERSHIP_FORM_TEMPLATE.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);
}

/**
 * 免責同意書テンプレートを適用してドキュメント文字列を生成する。
 *
 * - service_items（checkbox）は「、」区切りで結合
 * - minor_status が「18歳未満です」の場合のみ保護者同意ブロックを末尾に追加
 * - 共通変数（businessName / trainerName / clientName）は TrainerFormData から取得
 * - 書類固有変数は formData.liabilityWaiverData から取得
 */
export function applyLiabilityWaiverTemplate(formData: TrainerFormData): string {
  const w: Partial<LiabilityWaiverFormData> = formData.liabilityWaiverData ?? {};

  const serviceItemsText = Array.isArray(w.service_items) && w.service_items.length > 0
    ? w.service_items.join('、')
    : '（未選択）';

  const signedDateLabel = w.signed_date ? formatDateJP(w.signed_date) : todayJP();

  const vars: Record<string, string> = {
    document_number:       generateContractNumber(),
    business_name:         formData.businessName,
    service_name:          formData.businessName, // サービス名は事業者名にフォールバック
    trainer_name:          formData.trainerName,
    client_name:           formData.clientName,
    signed_date:           signedDateLabel,
    service_items:         serviceItemsText,
    delivery_mode_status:  w.delivery_mode_status  ?? '（未選択）',
    special_notes:         w.special_notes?.trim() || 'なし',
    guardian_name:         w.guardian_name?.trim() || '（記入欄）',
  };

  const resolve = (template: string) =>
    template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => vars[key] ?? `{{${key}}}`);

  const mainBody = resolve(LIABILITY_WAIVER_MAIN_TEMPLATE);

  const isMinor = w.minor_status === '18歳未満です';
  if (!isMinor) return mainBody;

  return mainBody + resolve(LIABILITY_WAIVER_GUARDIAN_BLOCK);
}

// ──────────────────────────────────────────────
// キャンセル・返金ポリシー同意書
// ──────────────────────────────────────────────

/**
 * キャンセル・返金ポリシー同意書テンプレート。
 *
 * 変数一覧:
 *   {{document_number}}               - 書類番号（自動生成）
 *   {{business_name}}                 - 事業者名
 *   {{service_name}}                  - サービス名（businessName にフォールバック）
 *   {{cancellation_deadline_detail}}  - キャンセル受付期限ルール
 *   {{cancellation_fee_detail}}       - キャンセル料ルール
 *   {{refund_policy_status}}          - 返金基本方針
 *   {{refund_policy_detail}}          - 返金対象ケース（空の場合は空行）
 *   {{exception_cases_items}}         - 免除例外条件（箇条書き、空の場合「特に定めなし」）
 *   {{exception_cases_detail}}        - 例外条件補足（空の場合は空行）
 *   {{policy_scope_items}}            - 適用対象（箇条書き、空の場合「特に定めなし」）
 *   {{client_name}}                   - クライアント氏名
 *   {{signed_date}}                   - 同意日
 */
const CANCELLATION_POLICY_TEMPLATE = `
キャンセル・返金ポリシー同意書

書類番号：{{document_number}}
事業者名：{{business_name}}
サービス名：{{service_name}}

---

はじめに

本書は、{{service_name}}のご利用にあたり、予約のキャンセル・変更、途中解約、および返金に関するルールを事前にご確認・ご同意いただくための書類です。

トラブルを未然に防ぎ、お客様と{{business_name}}の双方が安心してサービスを継続できるよう、以下のポリシーを定めています。ご不明な点があれば、署名前に担当トレーナーまでお気軽にご確認ください。

---

■ キャンセル・変更のルール

予約のキャンセルまたは変更をご希望の場合は、電話・メール・その他ご案内した方法にてご連絡ください。

【キャンセル受付期限】
{{cancellation_deadline_detail}}

期限内にご連絡いただいた場合は、原則としてキャンセル料は発生しません。

【キャンセル料について】
{{cancellation_fee_detail}}

（個別のご案内がない場合の目安：前日キャンセルはセッション料金の50％、当日キャンセルおよび無断キャンセルは100％を申し受けます。無断キャンセルが続く場合、今後のご予約をお断りする場合があります。）

---

■ 返金ポリシー

本サービスの返金に関する基本方針は以下のとおりです。

{{refund_policy_status}}

{{refund_policy_detail}}

返金が発生する場合は、返金対象・計算方法・振込手数料の有無等について、契約時または申請時に個別にご説明いたします。

---

■ 例外的な免除・考慮について

以下に該当する場合は、キャンセル料の免除または日程変更に応じる場合があります（保証するものではありません）。

{{exception_cases_items}}

{{exception_cases_detail}}

免除の適用については、{{business_name}}の判断によるものとし、必要に応じて証明書類の提出をお願いする場合があります。

---

■ 本ポリシーの適用範囲

本ポリシーは、以下のサービスに適用されます。

{{policy_scope_items}}

---

■ 同意について

キャンセル料・返金条件はお客様にとって不利益となる場合があります。本書の内容をよくお読みいただいたうえで、ご同意をお願いします。Web予約時または書面へのご署名をもって、本ポリシーに同意いただいたものとみなします。

---

私は、本書のキャンセル・返金ポリシーの内容をすべて読み、理解し、同意します。

クライアント氏名（自署）：{{client_name}}
日付：{{signed_date}}
`.trim();

/**
 * キャンセル・返金ポリシー同意書テンプレートを適用してドキュメント文字列を生成する。
 *
 * - exception_cases_items / policy_scope_items（checkbox）は箇条書き（「・」＋改行）で展開
 * - 任意テキスト項目が空の場合はデフォルト文言または空文字を設定
 * - 共通変数（businessName / trainerName）は TrainerFormData から取得
 * - 書類固有変数は formData.cancellationPolicyData から取得
 */
export function applyCancellationPolicyTemplate(formData: TrainerFormData): string {
  const c: Partial<CancellationPolicyFormData> = formData.cancellationPolicyData ?? {};

  const toBullets = (arr: string[] | undefined): string =>
    Array.isArray(arr) && arr.length > 0
      ? arr.map((item) => `・${item}`).join('\n')
      : '（特に定めなし）';

  const signedDateLabel = c.signed_date ? formatDateJP(c.signed_date) : todayJP();

  const vars: Record<string, string> = {
    document_number:              generateContractNumber(),
    business_name:                formData.businessName,
    service_name:                 formData.businessName,
    client_name:                  c.client_name?.trim() || formData.clientName,
    signed_date:                  signedDateLabel,
    cancellation_deadline_detail: c.cancellation_deadline_detail?.trim()
                                  || '（担当トレーナーよりご案内いたします）',
    cancellation_fee_detail:      c.cancellation_fee_detail?.trim()
                                  || '（担当トレーナーよりご案内いたします）',
    refund_policy_status:         c.refund_policy_status?.trim()
                                  || '（担当トレーナーよりご案内いたします）',
    refund_policy_detail:         c.refund_policy_detail?.trim() || '',
    exception_cases_items:        toBullets(c.exception_cases_items),
    exception_cases_detail:       c.exception_cases_detail?.trim() || '',
    policy_scope_items:           toBullets(c.policy_scope_items),
  };

  return CANCELLATION_POLICY_TEMPLATE.replace(
    /\{\{(\w+)\}\}/g,
    (_, key: string) => vars[key] ?? `{{${key}}}`
  );
}
