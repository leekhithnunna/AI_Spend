-- ============================================================
-- AI Spend Audit Tool — Initial Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- Table: audits
-- Stores each audit session with full data as JSONB
-- ============================================================
create table if not exists audits (
  id              uuid primary key default uuid_generate_v4(),
  audit_data      jsonb not null,
  monthly_savings numeric(10, 2) not null default 0,
  annual_savings  numeric(10, 2) not null default 0,
  created_at      timestamptz not null default now()
);

-- Index for time-based queries
create index if not exists audits_created_at_idx on audits (created_at desc);

-- ============================================================
-- Table: leads
-- Captures contact info for follow-up after audit
-- ============================================================
create table if not exists leads (
  id          uuid primary key default uuid_generate_v4(),
  email       text not null,
  company     text,
  role        text,
  team_size   integer,
  audit_id    uuid references audits(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Index for email lookups
create index if not exists leads_email_idx on leads (email);
create index if not exists leads_audit_id_idx on leads (audit_id);

-- ============================================================
-- Row Level Security (RLS)
-- Enable RLS — anon key can insert but not read others' data
-- ============================================================
alter table audits enable row level security;
alter table leads enable row level security;

-- Allow anyone to insert audits (anon key)
create policy "Allow insert audits"
  on audits for insert
  with check (true);

-- Allow anyone to insert leads (anon key)
create policy "Allow insert leads"
  on leads for insert
  with check (true);

-- Only service role can read all data (for admin dashboard)
create policy "Service role can read audits"
  on audits for select
  using (auth.role() = 'service_role');

create policy "Service role can read leads"
  on leads for select
  using (auth.role() = 'service_role');
