import type { TokushohoSettings } from '@/types/legal';

// ============================================================
//  ⚠️  現在は in-memory 仮実装
//
//  Cloudflare Pages / Vercel などのサーバーレス環境では
//  リクエストをまたいで値が保持されない。
//  本番運用前に下記 Supabase 実装に差し替えること。
//
//  【将来の Supabase 差し替えイメージ】
//  テーブル: app_settings (key TEXT PK, value JSONB)
//
//  export async function getTokushohoSettings() {
//    const supabase = createServiceClient(); // service role key
//    const { data } = await supabase
//      .from('app_settings')
//      .select('value')
//      .eq('key', 'tokushoho')
//      .maybeSingle();
//    return (data?.value as TokushohoSettings) ?? null;
//  }
//
//  export async function upsertTokushohoSettings(payload: TokushohoSettings) {
//    const supabase = createServiceClient();
//    await supabase
//      .from('app_settings')
//      .upsert({ key: 'tokushoho', value: payload });
//  }
// ============================================================

let _devStore: TokushohoSettings | null = null;

/**
 * 特商法事業者情報を取得する。
 * 未設定の場合は null を返す。
 */
export async function getTokushohoSettings(): Promise<TokushohoSettings | null> {
  // TODO: Supabase 実装に差し替える
  return _devStore;
}

/**
 * 特商法事業者情報を保存（なければ INSERT、あれば UPDATE）する。
 */
export async function upsertTokushohoSettings(
  payload: TokushohoSettings,
): Promise<void> {
  // TODO: Supabase 実装に差し替える
  _devStore = payload;
}
