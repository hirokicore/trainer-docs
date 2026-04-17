/**
 * ドキュメント生成ログの保存ヘルパー
 *
 * - INSERT 失敗時でもメインの生成フローには影響しない（例外を外に投げない）
 * - エラーはコンソールに出力するだけに留める
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import type { DocumentGenerationLog } from '@/types';

export async function saveGenerationLog(
  supabase: SupabaseClient,
  log: DocumentGenerationLog
): Promise<void> {
  try {
    const { error } = await supabase
      .from('document_generations')
      .insert(log);

    if (error) {
      // ログ失敗はコンソール出力のみ。呼び出し元には伝播しない。
      console.error('[generation-log] INSERT failed:', error.message, '| code:', error.code);
    }
  } catch (err) {
    console.error('[generation-log] unexpected error:', err);
  }
}
