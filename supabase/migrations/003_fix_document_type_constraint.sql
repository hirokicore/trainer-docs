-- ============================================================
-- 003_fix_document_type_constraint.sql
-- documents テーブルの document_type CHECK 制約を削除する
--
-- 背景:
--   001_initial.sql の CHECK 制約が 4 種類しか許可しておらず、
--   後から追加した pro_training_contract_v1 などが INSERT できない。
--   書類タイプはコード側で管理するため、DB 側の制約は不要。
--
-- Supabase SQL Editor で実行してください
-- ============================================================

ALTER TABLE public.documents
  DROP CONSTRAINT IF EXISTS documents_document_type_check;
