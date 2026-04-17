-- ============================================================
-- 002_document_generations.sql
-- ドキュメント生成ログテーブル
-- Supabase SQL Editor で実行してください
-- ============================================================

CREATE TABLE IF NOT EXISTS public.document_generations (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 書類情報
  document_type   TEXT        NOT NULL,
  template_id     TEXT        NOT NULL,

  -- プラン状態（生成時点のスナップショット）
  is_subscribed   BOOLEAN     NOT NULL,
  is_pro_template BOOLEAN     NOT NULL,

  -- 生成結果
  status          TEXT        NOT NULL CHECK (status IN ('success', 'error')),
  error_code      TEXT,               -- FORBIDDEN_PRO_TEMPLATE / GEMINI_ERROR / UNKNOWN_ERROR

  -- パフォーマンス
  duration_ms     INTEGER,            -- 生成処理時間（ms）。NULL = 未計測

  -- 将来用メタデータ
  engine          TEXT        CHECK (engine IN ('gemini', 'template_only')),
  request_origin  TEXT        CHECK (request_origin IN ('web', 'api', 'admin'))
);

-- インデックス（利用状況分析・トラブルシュートで使うクエリを想定）
CREATE INDEX IF NOT EXISTS document_generations_user_id_idx
  ON public.document_generations(user_id);

CREATE INDEX IF NOT EXISTS document_generations_created_at_idx
  ON public.document_generations(created_at DESC);

CREATE INDEX IF NOT EXISTS document_generations_status_idx
  ON public.document_generations(status);

CREATE INDEX IF NOT EXISTS document_generations_document_type_idx
  ON public.document_generations(document_type);

-- RLS 有効化
ALTER TABLE public.document_generations ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のログのみ INSERT 可（直接 SELECT/UPDATE/DELETE は不可）
-- 管理・分析は service_role 経由で行う
CREATE POLICY "Users can insert own generation logs"
  ON public.document_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service Role は全操作可（管理ダッシュボード・分析用）
CREATE POLICY "Service role full access generation logs"
  ON public.document_generations FOR ALL
  USING (auth.role() = 'service_role');
