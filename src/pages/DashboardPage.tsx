import { useCallback, useState } from 'react'
import { CalendarDays, ListChecks, ScrollText } from 'lucide-react'
import { useAuth } from '../components/auth/AuthContext'
import { PlayerCard } from '../components/dashboard/PlayerCard'
import { QuestCard } from '../components/dashboard/QuestCard'
import { HabitForm, type HabitDraft } from '../components/habits/HabitForm'
import { FloatingActionButton } from '../components/ui/FloatingActionButton'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelCard } from '../components/ui/PixelCard'
import { useHabits } from '../hooks/useHabits'
import { formatLongDate, type Habit } from '../lib/habits'

function EmptyQuestSection({ message }: { message: string }) {
  return <PixelCard className="py-6 text-center text-sm text-slate-400">{message}</PixelCard>
}

export function DashboardPage() {
  const { session, profile, progress, profileLoading } = useAuth()
  const { habits, dailyHabits, weeklyHabits, completedIds, dailyCompletedCount, weeklyCompletedCount, loading, savingId, error, createHabit, updateHabit, deleteHabit, toggleCompletion } = useHabits(session?.user.id)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const closeForm = useCallback(() => { setFormOpen(false); setEditingHabit(null) }, [])

  const saveHabit = async (draft: HabitDraft) => editingHabit
    ? updateHabit(editingHabit.id, draft)
    : createHabit(draft)

  const confirmDelete = async (habit: Habit) => {
    if (window.confirm(`Supprimer définitivement « ${habit.title} » et tout son historique ?`)) await deleteHabit(habit.id)
  }

  const editHabit = (habit: Habit) => { setEditingHabit(habit); setFormOpen(true) }
  const archiveHabit = (habit: Habit) => updateHabit(habit.id, { is_archived: !habit.is_archived })
  const cardActions = (habit: Habit) => ({
    onEdit: () => editHabit(habit),
    onArchive: () => void archiveHabit(habit),
    onDelete: () => void confirmDelete(habit),
  })

  return <>
    <PlayerCard displayName={profile?.display_name ?? 'Joueur'} level={progress?.level ?? 1} currentXp={progress?.current_xp ?? 0} loading={profileLoading} />
    {error ? <p role="alert" className="mb-3 mt-6 border-2 border-red-400/50 bg-red-950/30 p-3 text-sm text-red-200">{error}</p> : null}
    {loading ? <PixelCard className="mt-7 animate-pulse text-center text-slate-400">Chargement des quêtes…</PixelCard> : <>
      <section className="mt-7" aria-labelledby="daily-quests-title">
        <div className="mb-3 flex items-end justify-between"><div><p className="flex items-center gap-2 text-xs capitalize text-purple-300"><CalendarDays size={14}/>{formatLongDate()}</p><h2 id="daily-quests-title" className="mt-1 text-2xl font-bold">Quêtes du jour</h2></div><span className="text-sm text-gold">{dailyCompletedCount} / {dailyHabits.length}</span></div>
        {dailyHabits.length === 0 ? <EmptyQuestSection message="Aucune quête à accomplir aujourd’hui." /> : <div className="space-y-3">{dailyHabits.map((habit) => <QuestCard key={habit.id} habit={habit} done={completedIds.has(habit.id)} saving={savingId === habit.id} onToggle={() => void toggleCompletion(habit)} />)}</div>}
      </section>

      <section className="mt-8" aria-labelledby="weekly-quests-title">
        <div className="mb-3 flex items-end justify-between"><div><p className="flex items-center gap-2 text-xs uppercase tracking-[.15em] text-purple-300"><ScrollText size={14}/>Cette semaine</p><h2 id="weekly-quests-title" className="mt-1 text-2xl font-bold">Quêtes hebdomadaires</h2></div><span className="text-sm text-gold">{weeklyCompletedCount} / {weeklyHabits.length}</span></div>
        {weeklyHabits.length === 0 ? <EmptyQuestSection message="Aucune quête hebdomadaire." /> : <div className="space-y-3">{weeklyHabits.map((habit) => <QuestCard key={habit.id} habit={habit} done={completedIds.has(habit.id)} saving={savingId === habit.id} onToggle={() => void toggleCompletion(habit)} />)}</div>}
      </section>

      <section className="mt-8" aria-labelledby="all-quests-title">
        <div className="mb-3"><p className="flex items-center gap-2 text-xs uppercase tracking-[.15em] text-purple-300"><ListChecks size={14}/>Gestion</p><h2 id="all-quests-title" className="mt-1 text-2xl font-bold">Toutes les quêtes</h2></div>
        {habits.length === 0 ? <PixelCard className="py-8 text-center"><p className="font-bold">Ton journal est vide</p><p className="mt-1 text-sm text-slate-400">Crée ta première quête pour commencer l’aventure.</p><PixelButton variant="gold" className="mt-5" onClick={() => setFormOpen(true)}>Créer une quête</PixelButton></PixelCard> : <div className="space-y-3">{habits.map((habit) => <QuestCard key={habit.id} habit={habit} {...cardActions(habit)} />)}</div>}
      </section>
    </>}
    <FloatingActionButton onClick={() => setFormOpen(true)} />
    {formOpen ? <HabitForm habit={editingHabit} onClose={closeForm} onSave={saveHabit} /> : null}
  </>
}
