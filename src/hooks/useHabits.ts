import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getWeekStartKey, isHabitDue, toLocalDateKey, type Habit, type HabitCompletion } from '../lib/habits'
import type { TablesInsert, TablesUpdate } from '../types/database'

export function useHabits(userId: string | undefined) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [completions, setCompletions] = useState<HabitCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const today = toLocalDateKey()
  const weekStart = getWeekStartKey()

  const refresh = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    setError(null)
    const [habitsResult, completionsResult] = await Promise.all([
      supabase.from('habits').select('*').eq('user_id', userId).order('created_at'),
      supabase.from('habit_completions').select('*').eq('user_id', userId).in('completion_period_start', [today, weekStart]),
    ])
    if (habitsResult.error || completionsResult.error) {
      console.error(habitsResult.error ?? completionsResult.error)
      setError('Impossible de charger tes quêtes. Réessaie dans un instant.')
    } else {
      setHabits(habitsResult.data)
      setCompletions(completionsResult.data)
    }
    setLoading(false)
  }, [today, userId, weekStart])

  useEffect(() => { void refresh() }, [refresh])

  const createHabit = async (habit: Omit<TablesInsert<'habits'>, 'user_id'>) => {
    if (!userId) return false
    setError(null)
    const { error: mutationError } = await supabase.from('habits').insert({ ...habit, user_id: userId })
    if (mutationError) {
      console.error(mutationError)
      setError('La quête n’a pas pu être créée.')
      return false
    }
    await refresh()
    return true
  }

  const updateHabit = async (id: string, changes: TablesUpdate<'habits'>) => {
    setError(null)
    const { error: mutationError } = await supabase.from('habits').update(changes).eq('id', id)
    if (mutationError) {
      console.error(mutationError)
      setError('La quête n’a pas pu être modifiée.')
      return false
    }
    await refresh()
    return true
  }

  const deleteHabit = async (id: string) => {
    setError(null)
    const { error: mutationError } = await supabase.from('habits').delete().eq('id', id)
    if (mutationError) {
      console.error(mutationError)
      setError('La quête n’a pas pu être supprimée.')
      return false
    }
    setHabits((current) => current.filter((habit) => habit.id !== id))
    return true
  }

  const toggleCompletion = async (habit: Habit) => {
    if (!userId || savingId) return
    setSavingId(habit.id)
    setError(null)
    const completion = completions.find((item) => item.habit_id === habit.id)
    const completionPeriodStart = habit.frequency_type === 'weekly' ? weekStart : today
    const result = completion
      ? await supabase.from('habit_completions').delete().eq('id', completion.id)
      : await supabase.from('habit_completions').insert({ habit_id: habit.id, user_id: userId, completed_on: today, completion_period_start: completionPeriodStart })
    if (result.error) {
      console.error(result.error)
      setError(completion ? 'La validation n’a pas pu être annulée.' : 'La quête n’a pas pu être validée.')
    } else {
      await refresh()
    }
    setSavingId(null)
  }

  const dailyHabits = useMemo(() => habits.filter((habit) => !habit.is_archived && isHabitDue(habit)), [habits])
  const weeklyHabits = useMemo(() => habits.filter((habit) => !habit.is_archived && habit.frequency_type === 'weekly'), [habits])
  const completedIds = useMemo(() => new Set(completions.map((item) => item.habit_id)), [completions])
  const dailyCompletedCount = dailyHabits.filter((habit) => completedIds.has(habit.id)).length
  const weeklyCompletedCount = weeklyHabits.filter((habit) => completedIds.has(habit.id)).length

  return { habits, dailyHabits, weeklyHabits, completedIds, dailyCompletedCount, weeklyCompletedCount, loading, savingId, error, createHabit, updateHabit, deleteHabit, toggleCompletion }
}
