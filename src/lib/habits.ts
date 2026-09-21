import type { Tables } from '../types/database'

export type Habit = Tables<'habits'>
export type HabitCompletion = Tables<'habit_completions'>
export type HabitIcon = Habit['icon_key']
export type HabitColor = Habit['color']

export const ALL_WEEKDAYS = [1, 2, 3, 4, 5, 6, 0] as const
export const WEEKDAY_LABELS: Record<number, string> = {
  0: 'D', 1: 'L', 2: 'M', 3: 'M', 4: 'J', 5: 'V', 6: 'S',
}

export function toLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isHabitDue(habit: Pick<Habit, 'schedule_days'>, date = new Date()) {
  return habit.schedule_days.includes(date.getDay())
}

export function getFrequencyLabel(days: number[]) {
  const uniqueDays = new Set(days)
  if (uniqueDays.size === 7) return 'Tous les jours'
  if ([1, 2, 3, 4, 5].every((day) => uniqueDays.has(day)) && uniqueDays.size === 5) return 'En semaine'
  if ([0, 6].every((day) => uniqueDays.has(day)) && uniqueDays.size === 2) return 'Week-end'
  return ALL_WEEKDAYS.filter((day) => uniqueDays.has(day)).map((day) => WEEKDAY_LABELS[day]).join(' · ')
}
