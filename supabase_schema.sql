-- =============================================================
--  DINK PLAYA — database schema (no-login / name-only version)
--  Paste this whole file into Supabase: SQL Editor -> New query -> Run.
--  Safe to run more than once.
-- =============================================================

-- ---------- Tables ----------

-- Recurring weekly sessions (one row per weekday slot).
-- start_time/end_time are the REGULAR recurring times and never change via the app.
-- The override_* columns are a ONE-OFF change for the next occurrence and are
-- ignored once override_date has passed (the session then rolls forward to the
-- next weekday automatically).
create table if not exists sessions (
  id                  text primary key,             -- 'tue' | 'fri' | 'sun'
  day_of_week         int  not null,                -- 0=Sun, 2=Tue, 5=Fri
  start_time          time not null,                -- regular recurring start
  end_time            time not null,                -- regular recurring end
  court_nums          int[] not null default '{1}', -- e.g. {1,2,3}
  spots_per_court     int  not null default 6,
  max_courts          int  not null default 3,
  override_date       date,                          -- one-off date for next occurrence
  override_start_time time,                          -- one-off start (null = use regular)
  override_end_time   time                           -- one-off end   (null = use regular)
);

-- If you ran an earlier version of this file, bring the table up to date:
alter table sessions add column if not exists override_date date;
alter table sessions add column if not exists override_start_time time;
alter table sessions add column if not exists override_end_time time;
alter table sessions drop column if exists date_override;

-- One row per person, per game occurrence. created_at order = seat order.
create table if not exists signups (
  id            uuid primary key default gen_random_uuid(),
  session_id    text not null references sessions(id) on delete cascade,
  session_date  date not null,                      -- which occurrence (this Tuesday, etc.)
  user_id       text not null,                      -- per-device id (no login)
  display_name  text not null,
  bringing      text[] not null default '{}',       -- ['Balls · Franklin','Speaker']
  created_at    timestamptz not null default now()
);
create index if not exists signups_seat_order
  on signups (session_id, session_date, created_at);

-- Per-session group chat
create table if not exists messages (
  id            uuid primary key default gen_random_uuid(),
  session_id    text not null references sessions(id) on delete cascade,
  user_id       text not null,
  display_name  text not null,
  body          text not null,
  created_at    timestamptz not null default now()
);
create index if not exists messages_order
  on messages (session_id, created_at);

-- ---------- Seed the 3 recurring sessions ----------
insert into sessions (id, day_of_week, start_time, end_time, court_nums, spots_per_court, max_courts)
values
  ('tue', 2, '17:00', '19:00', '{1}', 6, 3),
  ('fri', 5, '15:00', '17:00', '{1}', 6, 3),
  ('sun', 0, '15:00', '17:00', '{1}', 6, 3)
on conflict (id) do nothing;

-- ---------- Row Level Security ----------
-- NOTE: This app has NO login (people just type a name), so these policies are
-- intentionally PERMISSIVE: anyone with the app link can read and write.
-- That is acceptable for a small, trusted, private club. If you later add real
-- logins, tighten these (see the commented examples at the bottom).

alter table sessions enable row level security;
alter table signups  enable row level security;
alter table messages enable row level security;

drop policy if exists "public access" on sessions;
drop policy if exists "public access" on signups;
drop policy if exists "public access" on messages;

create policy "public access" on sessions for all using (true) with check (true);
create policy "public access" on signups  for all using (true) with check (true);
create policy "public access" on messages for all using (true) with check (true);

-- ---------- Realtime (so every phone updates live) ----------
-- Add tables to the realtime publication. Wrapped so re-running won't error.
do $$
begin
  begin execute 'alter publication supabase_realtime add table signups';  exception when duplicate_object then null; end;
  begin execute 'alter publication supabase_realtime add table messages'; exception when duplicate_object then null; end;
  begin execute 'alter publication supabase_realtime add table sessions'; exception when duplicate_object then null; end;
end $$;

-- =============================================================
--  LATER: if you add real logins, replace the permissive policies above
--  with owner-scoped ones, e.g.:
--
--    create policy "read"        on signups for select using (auth.role() = 'authenticated');
--    create policy "self insert" on signups for insert with check (auth.uid()::text = user_id);
--    create policy "self delete" on signups for delete using (auth.uid()::text = user_id);
-- =============================================================
