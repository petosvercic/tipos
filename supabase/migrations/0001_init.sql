create extension if not exists pgcrypto;

create table if not exists public.draws (
  id uuid primary key default gen_random_uuid(),
  draw_no integer unique,
  draw_at timestamptz not null,
  source_url text,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.draw_numbers (
  id uuid primary key default gen_random_uuid(),
  draw_id uuid not null references public.draws(id) on delete cascade,
  number integer not null check (number >= 1 and number <= 80),
  position integer,
  created_at timestamptz not null default now()
);

create unique index if not exists draw_numbers_draw_id_number_idx
  on public.draw_numbers(draw_id, number);

create index if not exists draws_draw_at_idx
  on public.draws(draw_at desc);

create index if not exists draw_numbers_number_idx
  on public.draw_numbers(number);

create table if not exists public.collector_runs (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null,
  records_found integer not null default 0,
  records_inserted integer not null default 0,
  message text
);

alter table public.draws enable row level security;
alter table public.draw_numbers enable row level security;
alter table public.collector_runs enable row level security;

drop policy if exists "public can read draws" on public.draws;
create policy "public can read draws"
  on public.draws
  for select
  to anon
  using (true);

drop policy if exists "public can read draw_numbers" on public.draw_numbers;
create policy "public can read draw_numbers"
  on public.draw_numbers
  for select
  to anon
  using (true);