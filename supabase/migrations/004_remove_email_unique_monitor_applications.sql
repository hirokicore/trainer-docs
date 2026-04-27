-- ============================================================
-- 004_remove_email_unique_monitor_applications.sql
--
-- 背景:
--   monitor_applications テーブルは元々「モニター応募」用として
--   email を UNIQUE にしていたが、現在は「要望フォーム」として
--   同一ユーザーが複数回送信できる必要がある。
--   email UNIQUE 制約が 23505 エラーの原因になっているため削除する。
--   行の一意性は id (UUID PK) で担保される。
--
-- Supabase SQL Editor で実行してください
-- ============================================================

ALTER TABLE public.monitor_applications
  DROP CONSTRAINT IF EXISTS monitor_applications_email_key;
