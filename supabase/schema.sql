-- Schema for Anna Krawczyk-Grudzińska CRM
-- Run in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Source: 'landing' (web form) | 'meta_lead_ad' (Facebook/Instagram Lead Ad)
  source text not null check (source in ('landing', 'meta_lead_ad', 'other')),

  -- Lead data
  name text,
  phone text,
  email text,
  situation text,         -- "Rozważam operację" / "Mam termin" / "Operacja za chwilę" / "Jestem po operacji" / "Inne"
  message text,
  consent boolean not null default false,

  -- Meta-specific (when source = 'meta_lead_ad')
  meta_lead_id text unique,    -- Lead ID from Meta
  meta_form_id text,
  meta_ad_id text,
  meta_campaign_id text,
  meta_adset_id text,
  meta_raw jsonb,              -- full payload from Meta webhook

  -- CRM workflow
  status text not null default 'new'
    check (status in ('new', 'contacted', 'won', 'lost')),
  notes text,
  contacted_at timestamptz,
  closed_at timestamptz
);

create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_source_idx on public.leads (source);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Auto-update updated_at on row update
create or replace function public.set_updated_at() returns trigger as $$
begin
  new.updated_at := now();
  return new;
end; $$ language plpgsql;

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- Lock down with RLS — leads only writable/readable via service role (used in Vercel functions)
alter table public.leads enable row level security;
-- No policies = no public access. Service role bypasses RLS automatically.

-- Optional: log table for status changes
create table if not exists public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  event_type text not null,    -- 'status_change' | 'note_added' | 'created'
  payload jsonb
);

create index if not exists lead_events_lead_id_idx on public.lead_events (lead_id, created_at desc);
alter table public.lead_events enable row level security;
