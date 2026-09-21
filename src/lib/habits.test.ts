import { describe, expect, it } from 'vitest'
import { getFrequencyLabel, getWeekStartKey, isHabitDue, toLocalDateKey } from './habits'

describe('habit scheduling', () => {
  it('uses the local calendar day instead of UTC', () => {
    expect(toLocalDateKey(new Date(2026, 8, 21, 23, 45))).toBe('2026-09-21')
  })

  it('detects whether a habit is due on a weekday', () => {
    expect(isHabitDue({ frequency_type: 'daily', schedule_days: [1, 3, 5] }, new Date(2026, 8, 21))).toBe(true)
    expect(isHabitDue({ frequency_type: 'daily', schedule_days: [2, 4] }, new Date(2026, 8, 21))).toBe(false)
    expect(isHabitDue({ frequency_type: 'weekly', schedule_days: [1] }, new Date(2026, 8, 21))).toBe(false)
  })

  it('formats common frequencies', () => {
    expect(getFrequencyLabel({ frequency_type: 'daily', schedule_days: [0, 1, 2, 3, 4, 5, 6] })).toBe('Tous les jours')
    expect(getFrequencyLabel({ frequency_type: 'daily', schedule_days: [1, 2, 3, 4, 5] })).toBe('En semaine')
    expect(getFrequencyLabel({ frequency_type: 'weekly', schedule_days: [] })).toBe('Hebdo')
  })

  it('uses Monday as the weekly completion period', () => {
    expect(getWeekStartKey(new Date(2026, 8, 23))).toBe('2026-09-21')
    expect(getWeekStartKey(new Date(2026, 8, 27))).toBe('2026-09-21')
  })
})
