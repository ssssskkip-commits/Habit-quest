alter table public.habits
  add column icon_key text not null default 'target'
    check (icon_key in ('target', 'movement', 'book', 'water', 'mind', 'heart')),
  add column color text not null default 'purple'
    check (color in ('purple', 'gold', 'green', 'blue', 'pink')),
  add column schedule_days smallint[] not null default array[0, 1, 2, 3, 4, 5, 6]::smallint[]
    check (
      cardinality(schedule_days) between 1 and 7
      and schedule_days <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]
    );

comment on column public.habits.schedule_days is
  'Weekdays when the habit is due, using JavaScript numbering: Sunday=0 through Saturday=6.';

create index habits_due_user_idx
  on public.habits using gin (schedule_days)
  where not is_archived;
