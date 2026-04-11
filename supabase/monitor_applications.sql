-- monitor_applications テーブル作成
create table if not exists public.monitor_applications (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  activity_status text not null,
  message       text not null,
  status        text not null default 'pending'
                  check (status in ('pending', 'approved', 'rejected')),
  created_at    timestamptz not null default now()
);

-- RLS を有効化
alter table public.monitor_applications enable row level security;

-- 誰でも INSERT 可能（応募送信）
create policy "Anyone can apply"
  on public.monitor_applications
  for insert
  to anon, authenticated
  with check (true);

-- 参照・更新は管理者（service_role）のみ
-- （Supabase ダッシュボードまたは service_role キーで操作）
