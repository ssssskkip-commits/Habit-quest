import { BookOpen, Brain, Check, Dumbbell, Droplets, Heart, Pencil, Power, Sparkles, Target, Trash2 } from 'lucide-react'
import { getFrequencyLabel, type Habit, type HabitColor } from '../../lib/habits'
import { PixelCard } from '../ui/PixelCard'

const iconMap = { target: Target, movement: Dumbbell, book: BookOpen, water: Droplets, mind: Brain, heart: Heart } as const
const colorMap: Record<string, string> = {
  purple: 'border-purple-400 text-purple-300', gold: 'border-yellow-300 text-gold', green: 'border-emerald-400 text-emerald-300',
  blue: 'border-sky-400 text-sky-300', pink: 'border-pink-400 text-pink-300',
}

export function QuestCard({ habit, done = false, saving = false, onToggle, onEdit, onArchive, onDelete }: {
  habit: Habit
  done?: boolean
  saving?: boolean
  onToggle?: () => void
  onEdit: () => void
  onArchive: () => void
  onDelete: () => void
}) {
  const Icon = iconMap[habit.icon_key as keyof typeof iconMap] ?? Target
  const colorClass = colorMap[habit.color as HabitColor] ?? colorMap.purple
  return <PixelCard className={`p-3 ${habit.is_archived ? 'opacity-60' : ''}`}>
    <div className="flex items-center gap-3">
      <button type="button" disabled={!onToggle || saving} onClick={onToggle} aria-label={done ? `Annuler ${habit.title}` : `Valider ${habit.title}`} aria-pressed={done} className={`grid h-12 w-12 shrink-0 place-items-center border-2 transition ${done ? 'border-success bg-success/10 text-success' : colorClass} disabled:cursor-wait`}>
        {done ? <Check size={23} /> : <Icon size={22} />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`truncate font-bold ${done ? 'text-slate-500 line-through' : 'text-white'}`}>{habit.title}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-purple-300"><span className="flex items-center gap-1"><Sparkles size={12}/>+{habit.xp_reward} XP</span><span className="text-slate-500">{getFrequencyLabel(habit.schedule_days)}</span></p>
      </div>
      <div className="flex gap-1">
        <button type="button" onClick={onEdit} aria-label={`Modifier ${habit.title}`} className="p-2 text-slate-400 hover:text-white"><Pencil size={17}/></button>
        <button type="button" onClick={onArchive} aria-label={habit.is_archived ? `Réactiver ${habit.title}` : `Désactiver ${habit.title}`} className="p-2 text-slate-400 hover:text-gold"><Power size={17}/></button>
        <button type="button" onClick={onDelete} aria-label={`Supprimer ${habit.title}`} className="p-2 text-slate-400 hover:text-red-300"><Trash2 size={17}/></button>
      </div>
    </div>
    {habit.description ? <p className="mt-3 border-t border-slate-700 pt-2 text-sm text-slate-400">{habit.description}</p> : null}
  </PixelCard>
}
