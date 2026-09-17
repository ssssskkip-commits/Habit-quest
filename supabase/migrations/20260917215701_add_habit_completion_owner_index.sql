create index habit_completions_habit_owner_idx
  on public.habit_completions(habit_id, user_id);