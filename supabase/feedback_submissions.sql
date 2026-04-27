-- feedback_submissions テーブル定義（参照用）
-- 旧名: monitor_applications
-- migration 005 で rename 済み
create table if not exists public.feedback_submissions (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  email           text not null,           -- UNIQUE 制約なし（migration 004 で削除済み）
  activity_status text not null,
  message         text not null,
  status          text not null default 'pending'
                    check (status in ('pending', 'approved', 'rejected')),
  created_at      timestamptz not null default now()
);

-- RLS を有効化
alter table public.feedback_submissions enable row level security;

-- 誰でも INSERT 可（要望フォーム送信）
create policy "Anyone can submit feedback"
  on public.feedback_submissions
  for insert
  to anon, authenticated
  with check (true);

-- 参照・更新は管理者（service_role）のみ
