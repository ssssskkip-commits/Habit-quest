import type { Tables } from '../types/database'

export type Habit = Tables<'habits'>
export type HabitCompletion = Tables<'habit_completions'>
export type HabitIcon = Habit['icon_key']
export type HabitColor = Habit['color']
export type HabitFrequency = 'daily' | 'weekly'
export type HabitCategory = 'force' | 'vitality' | 'intelligence' | 'willpower' | 'charisma' | 'creativity'

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

export function getWeekStartKey(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const daysSinceMonday = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - daysSinceMonday)
  return toLocalDateKey(start)
}

export function formatLongDate(date = new Date()) {
  return new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)
}

export function isHabitDue(habit: Pick<Habit, 'frequency_type' | 'schedule_days'>, date = new Date()) {
  return habit.frequency_type === 'daily' && habit.schedule_days.includes(date.getDay())
}

export function getFrequencyLabel(habit: Pick<Habit, 'frequency_type' | 'schedule_days'>) {
  if (habit.frequency_type === 'weekly') return 'Hebdo'
  const days = habit.schedule_days
  const uniqueDays = new Set(days)
  if (uniqueDays.size === 7) return 'Tous les jours'
  if ([1, 2, 3, 4, 5].every((day) => uniqueDays.has(day)) && uniqueDays.size === 5) return 'En semaine'
  if ([0, 6].every((day) => uniqueDays.has(day)) && uniqueDays.size === 2) return 'Week-end'
  return ALL_WEEKDAYS.filter((day) => uniqueDays.has(day)).map((day) => WEEKDAY_LABELS[day]).join(' · ')
}
