alter table public.habits drop constraint if exists habits_category_check;
alter table public.habits drop constraint if exists habits_icon_key_check;

update public.habits
set category = case category
  when 'strength' then 'force'
  when 'knowledge' then 'intelligence'
  when 'discipline' then 'willpower'
  when 'social' then 'charisma'
  else 'creativity'
end;

update public.habits
set icon_key = case category
  when 'force' then 'dumbbell'
  when 'vitality' then 'heart'
  when 'intelligence' then 'brain'
  when 'willpower' then 'flame'
  when 'charisma' then 'drama'
  else 'pencil'
end;

alter table public.habits
  alter column category set default 'willpower',
  alter column icon_key set default 'flame',
  add constraint habits_category_check
    check (category in ('force', 'vitality', 'intelligence', 'willpower', 'charisma', 'creativity')),
  add constraint habits_icon_key_check
    check (icon_key in ('dumbbell', 'heart', 'brain', 'flame', 'drama', 'pencil')),
  add column frequency_type text not null default 'daily'
    check (frequency_type in ('daily', 'weekly'));

alter table public.habit_completions
  add column completion_period_start date;

update public.habit_completions
set completion_period_start = completed_on;

alter table public.habit_completions
  alter column completion_period_start set not null,
  add constraint habit_completions_period_unique
    unique (habit_id, completion_period_start);

create index habits_user_frequency_idx
  on public.habits (user_id, frequency_type)
  where not is_archived;
