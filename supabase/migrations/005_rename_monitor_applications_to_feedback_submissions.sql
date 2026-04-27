-- ============================================================
-- 005_rename_monitor_applications_to_feedback_submissions.sql
--
-- 背景:
--   monitor_applications テーブルは「モニター応募」という仮名で作成されたが、
--   実態は「要望フォーム / フィードバック送信」として使われている。
--   テーブル名をコードの実態に合わせて rename する。
--   行データはそのまま引き継がれる。RLS ポリシーは OID ベースで追従する。
--
-- Supabase SQL Editor で実行してください
-- ============================================================

ALTER TABLE public.monitor_applications
  RENAME TO feedback_submissions;
