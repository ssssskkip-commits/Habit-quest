import { useCallback, useState } from 'react'
import { ScrollText } from 'lucide-react'
import { useAuth } from '../components/auth/AuthContext'
import { PlayerCard } from '../components/dashboard/PlayerCard'
import { QuestCard } from '../components/dashboard/QuestCard'
import { HabitForm, type HabitDraft } from '../components/habits/HabitForm'
import { FloatingActionButton } from '../components/ui/FloatingActionButton'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelCard } from '../components/ui/PixelCard'
import { useHabits } from '../hooks/useHabits'
import type { Habit } from '../lib/habits'

export function DashboardPage() {
  const { session, profile, progress, profileLoading } = useAuth()
  const { habits, dueHabits, completedIds, completedCount, loading, savingId, error, createHabit, updateHabit, deleteHabit, toggleCompletion } = useHabits(session?.user.id)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const dueIds = new Set(dueHabits.map((habit) => habit.id))
  const otherActiveHabits = habits.filter((habit) => !habit.is_archived && !dueIds.has(habit.id))
  const inactiveHabits = habits.filter((habit) => habit.is_archived)
  const closeForm = useCallback(() => { setFormOpen(false); setEditingHabit(null) }, [])

  const saveHabit = async (draft: HabitDraft) => editingHabit
    ? updateHabit(editingHabit.id, draft)
    : createHabit(draft)

  const confirmDelete = async (habit: Habit) => {
    if (window.confirm(`Supprimer définitivement « ${habit.title} » et tout son historique ?`)) await deleteHabit(habit.id)
  }

  const editHabit = (habit: Habit) => { setEditingHabit(habit); setFormOpen(true) }

  return <>
    <PlayerCard displayName={profile?.display_name ?? 'Joueur'} level={progress?.level ?? 1} currentXp={progress?.current_xp ?? 0} loading={profileLoading} />
    <div className="mb-3 mt-7 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-purple-300">Journal de quête</p><h2 className="text-2xl font-bold">Aujourd'hui</h2></div><span className="text-sm text-gold">{completedCount} / {dueHabits.length}</span></div>
    {error ? <p role="alert" className="mb-3 border-2 border-red-400/50 bg-red-950/30 p-3 text-sm text-red-200">{error}</p> : null}
    {loading ? <PixelCard className="animate-pulse text-center text-slate-400">Chargement des quêtes…</PixelCard> : dueHabits.length === 0 ? <PixelCard className="py-8 text-center"><ScrollText className="mx-auto mb-3 text-gold"/><p className="font-bold">Aucune quête pour aujourd’hui</p><p className="mt-1 text-sm text-slate-400">Ajoute ta première habitude pour commencer l’aventure.</p><PixelButton variant="gold" className="mt-5" onClick={() => setFormOpen(true)}>Créer une quête</PixelButton></PixelCard> : <div className="space-y-3">{dueHabits.map((habit) => <QuestCard key={habit.id} habit={habit} done={completedIds.has(habit.id)} saving={savingId === habit.id} onToggle={() => void toggleCompletion(habit.id)} onEdit={() => editHabit(habit)} onArchive={() => void updateHabit(habit.id, { is_archived: true })} onDelete={() => void confirmDelete(habit)} />)}</div>}
    {otherActiveHabits.length > 0 ? <details className="mt-7"><summary className="cursor-pointer text-sm text-slate-400">Autres quêtes ({otherActiveHabits.length})</summary><div className="mt-3 space-y-3">{otherActiveHabits.map((habit) => <QuestCard key={habit.id} habit={habit} onEdit={() => editHabit(habit)} onArchive={() => void updateHabit(habit.id, { is_archived: true })} onDelete={() => void confirmDelete(habit)} />)}</div></details> : null}
    {inactiveHabits.length > 0 ? <details className="mt-7"><summary className="cursor-pointer text-sm text-slate-400">Quêtes désactivées ({inactiveHabits.length})</summary><div className="mt-3 space-y-3">{inactiveHabits.map((habit) => <QuestCard key={habit.id} habit={habit} onEdit={() => editHabit(habit)} onArchive={() => void updateHabit(habit.id, { is_archived: false })} onDelete={() => void confirmDelete(habit)} />)}</div></details> : null}
    <FloatingActionButton onClick={() => setFormOpen(true)} />
    {formOpen ? <HabitForm habit={editingHabit} onClose={closeForm} onSave={saveHabit} /> : null}
  </>
}
