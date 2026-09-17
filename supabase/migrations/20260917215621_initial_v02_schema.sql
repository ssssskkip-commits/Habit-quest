create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null
    check (char_length(btrim(display_name)) between 2 and 32),
  avatar_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.player_progress (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  level integer not null default 1 check (level >= 1),
  current_xp bigint not null default 0 check (current_xp >= 0),
  total_xp bigint not null default 0 check (total_xp >= current_xp),
  emerging_class text,
  class_affinities jsonb not null default '{}'::jsonb
    check (jsonb_typeof(class_affinities) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 100),
  description text check (description is null or char_length(description) <= 500),
  category text not null default 'discipline'
    check (category in ('strength', 'knowledge', 'creativity', 'discipline', 'social')),
  xp_reward integer not null default 10 check (xp_reward between 1 and 1000),
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null,
  user_id uuid not null,
  completed_on date not null default current_date,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint habit_completions_habit_owner_fkey
    foreign key (habit_id, user_id)
    references public.habits(id, user_id)
    on delete cascade,
  unique (habit_id, completed_on)
);

create index habits_user_id_idx on public.habits(user_id);
create index habits_active_user_idx on public.habits(user_id) where not is_archived;
create index habit_completions_user_date_idx
  on public.habit_completions(user_id, completed_on desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function private.set_updated_at() from public, anon, authenticated;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger player_progress_set_updated_at
before update on public.player_progress
for each row execute function private.set_updated_at();

create trigger habits_set_updated_at
before update on public.habits
for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_name text;
begin
  requested_name := btrim(coalesce(new.raw_user_meta_data ->> 'display_name', ''));

  if char_length(requested_name) < 2 then
    requested_name := btrim(coalesce(split_part(new.email, '@', 1), ''));
  end if;

  if char_length(requested_name) < 2 then
    requested_name := 'Joueur';
  end if;

  insert into public.profiles (id, display_name)
  values (new.id, left(requested_name, 32))
  on conflict (id) do nothing;

  insert into public.player_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

insert into public.profiles (id, display_name)
select
  id,
  left(
    case
      when char_length(btrim(coalesce(raw_user_meta_data ->> 'display_name', ''))) >= 2
        then btrim(raw_user_meta_data ->> 'display_name')
      when char_length(btrim(coalesce(split_part(email, '@', 1), ''))) >= 2
        then btrim(split_part(email, '@', 1))
      else 'Joueur'
    end,
    32
  )
from auth.users
on conflict (id) do nothing;

insert into public.player_progress (user_id)
select id from public.profiles
on conflict (user_id) do nothing;

alter table public.profiles enable row level security;
alter table public.player_progress enable row level security;
alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;

create policy "profiles_select_own"
on public.profiles for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "player_progress_select_own"
on public.player_progress for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "habits_select_own"
on public.habits for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "habits_insert_own"
on public.habits for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "habits_update_own"
on public.habits for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "habits_delete_own"
on public.habits for delete
to authenticated
using ((select auth.uid()) = user_id);

create policy "habit_completions_select_own"
on public.habit_completions for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "habit_completions_insert_own"
on public.habit_completions for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "habit_completions_delete_own"
on public.habit_completions for delete
to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.profiles from anon, authenticated;
revoke all on public.player_progress from anon, authenticated;
revoke all on public.habits from anon, authenticated;
revoke all on public.habit_completions from anon, authenticated;

grant select on public.profiles to authenticated;
grant update (display_name, avatar_key) on public.profiles to authenticated;
grant select on public.player_progress to authenticated;
grant select, insert, update, delete on public.habits to authenticated;
grant select, insert, delete on public.habit_completions to authenticated;