// 特定商取引法に基づく表記 — 事業者情報の型定義
// 将来 Supabase の app_settings テーブルに差し替える際もこの型をそのまま使う。

export interface TokushohoSettings {
  businessName:        string; // 事業者名（屋号または法人名）
  representativeName:  string; // 運営責任者の氏名
  businessAddress:     string; // 所在地
  phoneNumber:         string; // 電話番号（または開示請求時の文言）
  phoneAvailableHours: string; // 電話対応時間（例: 平日10:00〜18:00）
  email:               string; // お問い合わせ用メールアドレス
}
