-- ============================================================================
-- TEDxTIET event registration + admin dashboard
-- Run this whole file in the Supabase SQL editor.
--
-- NOTE: the table is called event_registrations, NOT registrations. The repo
-- already had an older `registrations` table (roll_no / year_of_study) used by
-- src/Components/Register.jsx, so this uses a separate table to avoid a clash.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Registrations table
-- ---------------------------------------------------------------------------
create table if not exists event_registrations (
  id               uuid primary key default gen_random_uuid(),
  name             text not null,
  email            text not null,
  phone            text not null,
  admission_number text not null,
  ip_address       text,
  created_at       timestamptz not null default now()
);

-- Block duplicate registrations by email (case-insensitive: the Edge Function
-- lowercases before insert).
create unique index if not exists event_registrations_email_key
  on event_registrations (email);

-- Speeds up the per-IP rate-limit lookup in the Edge Function.
create index if not exists event_registrations_ip_created_idx
  on event_registrations (ip_address, created_at);

alter table event_registrations enable row level security;

-- ---------------------------------------------------------------------------
-- 2. Admin allow-list
--    A user can see registrations only if their auth uid has a row here.
-- ---------------------------------------------------------------------------
create table if not exists admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- Helper: is the current caller an admin?
-- SECURITY DEFINER so the lookup itself isn't subject to RLS on `admins`
-- (otherwise the policy below would recurse into itself).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a where a.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- 3. RLS policies
-- ---------------------------------------------------------------------------

-- Registrations: NO public insert. Every write goes through the Edge Function
-- using the service role key, so the rate limit / honeypot cannot be bypassed
-- by editing frontend code. The service role bypasses RLS entirely.
drop policy if exists "Allow public insert" on event_registrations;
drop policy if exists "Admins can read registrations" on event_registrations;

create policy "Admins can read registrations"
  on event_registrations
  for select
  to authenticated
  using (public.is_admin());

-- Admins table: a signed-in admin may read the allow-list (so the dashboard
-- can confirm its own access). Nobody can write to it from the client — add
-- admins manually via the SQL editor (step 4).
drop policy if exists "Admins can read admin list" on admins;

create policy "Admins can read admin list"
  on admins
  for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- 4. Granting admin access
--
--    a) Create the user first: Supabase dashboard -> Authentication -> Users
--       -> "Add user" (set an email + password).
--    b) Then run, with that user's email:
--
--         insert into admins (user_id, email)
--         select id, email from auth.users where email = 'you@thapar.edu'
--         on conflict (user_id) do nothing;
--
--    To revoke: delete from admins where email = 'them@thapar.edu';
-- ---------------------------------------------------------------------------
