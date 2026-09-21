import { useEffect, useState, type FormEvent } from 'react'
import { BookOpen, Brain, Dumbbell, Droplets, Heart, Target, X } from 'lucide-react'
import { ALL_WEEKDAYS, WEEKDAY_LABELS, type Habit, type HabitColor, type HabitIcon } from '../../lib/habits'
import { PixelButton } from '../ui/PixelButton'
import { PixelInput } from '../ui/PixelInput'

export type HabitDraft = Pick<Habit, 'title' | 'description' | 'category' | 'xp_reward' | 'icon_key' | 'color' | 'schedule_days'>

const iconOptions = [
  ['target', 'Objectif', Target], ['movement', 'Mouvement', Dumbbell], ['book', 'Lecture', BookOpen],
  ['water', 'Eau', Droplets], ['mind', 'Esprit', Brain], ['heart', 'Bien-être', Heart],
] as const
const colorOptions: HabitColor[] = ['purple', 'gold', 'green', 'blue', 'pink']
const colorClasses: Record<HabitColor, string> = {
  purple: 'bg-purple-500', gold: 'bg-yellow-400', green: 'bg-emerald-400', blue: 'bg-sky-400', pink: 'bg-pink-400',
}

const emptyDraft: HabitDraft = {
  title: '', description: null, category: 'discipline', xp_reward: 10, icon_key: 'target', color: 'purple',
  schedule_days: [...ALL_WEEKDAYS],
}

export function HabitForm({ habit, onClose, onSave }: {
  habit: Habit | null
  onClose: () => void
  onSave: (draft: HabitDraft) => Promise<boolean>
}) {
  const [draft, setDraft] = useState<HabitDraft>(habit ? {
    title: habit.title, description: habit.description, category: habit.category, xp_reward: habit.xp_reward,
    icon_key: habit.icon_key, color: habit.color, schedule_days: habit.schedule_days,
  } : emptyDraft)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const toggleDay = (day: number) => {
    setDraft((current) => ({
      ...current,
      schedule_days: current.schedule_days.includes(day)
        ? current.schedule_days.filter((value) => value !== day)
        : [...current.schedule_days, day],
    }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const title = draft.title.trim()
    if (!title) return setFormError('Donne un nom à ta quête.')
    if (draft.schedule_days.length === 0) return setFormError('Choisis au moins un jour.')
    setSaving(true)
    setFormError(null)
    const saved = await onSave({ ...draft, title, description: draft.description?.trim() || null })
    setSaving(false)
    if (saved) onClose()
  }

  return (
    <div className="fixed inset-0 z-50 grid items-end bg-black/70 p-0 sm:place-items-center sm:p-4" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="habit-form-title" className="pixel-border max-h-[92vh] w-full max-w-lg overflow-y-auto border-2 border-purple-300 bg-panel p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="habit-form-title" className="text-xl font-bold text-gold">{habit ? 'Modifier la quête' : 'Nouvelle quête'}</h2>
          <button type="button" onClick={onClose} aria-label="Fermer" className="p-2 text-slate-300"><X /></button>
        </div>
        <form onSubmit={(event) => void submit(event)} className="space-y-5">
          <label className="block text-sm text-slate-200">Nom
            <PixelInput autoFocus maxLength={100} value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="Ex. Lire 10 pages" className="mt-1" />
          </label>
          <label className="block text-sm text-slate-200">Description <span className="text-slate-500">(facultative)</span>
            <textarea maxLength={500} value={draft.description ?? ''} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Pourquoi cette quête compte pour toi ?" className="mt-1 min-h-20 w-full resize-y border-2 border-slate-600 bg-ink px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-purple" />
          </label>
          <fieldset><legend className="mb-2 text-sm text-slate-200">Icône</legend><div className="grid grid-cols-3 gap-2">
            {iconOptions.map(([value, label, Icon]) => <button key={value} type="button" title={label} aria-label={label} aria-pressed={draft.icon_key === value} onClick={() => setDraft({ ...draft, icon_key: value as HabitIcon })} className={`grid min-h-12 place-items-center border-2 ${draft.icon_key === value ? 'border-gold text-gold' : 'border-slate-700 text-slate-400'}`}><Icon size={20} /></button>)}
          </div></fieldset>
          <fieldset><legend className="mb-2 text-sm text-slate-200">Couleur</legend><div className="flex gap-3">
            {colorOptions.map((color) => <button key={color} type="button" aria-label={`Couleur ${color}`} aria-pressed={draft.color === color} onClick={() => setDraft({ ...draft, color })} className={`h-9 w-9 border-2 ${colorClasses[color]} ${draft.color === color ? 'border-white outline outline-2 outline-gold' : 'border-slate-800'}`} />)}
          </div></fieldset>
          <fieldset><legend className="mb-2 text-sm text-slate-200">Fréquence</legend><div className="flex justify-between gap-1">
            {ALL_WEEKDAYS.map((day) => <button key={day} type="button" aria-label={`Jour ${day}`} aria-pressed={draft.schedule_days.includes(day)} onClick={() => toggleDay(day)} className={`h-10 min-w-10 border-2 font-bold ${draft.schedule_days.includes(day) ? 'border-purple-300 bg-purple text-white' : 'border-slate-700 text-slate-500'}`}>{WEEKDAY_LABELS[day]}</button>)}
          </div></fieldset>
          {formError ? <p role="alert" className="text-sm text-red-300">{formError}</p> : null}
          <div className="grid grid-cols-2 gap-3"><PixelButton type="button" variant="ghost" onClick={onClose}>Annuler</PixelButton><PixelButton type="submit" variant="gold" disabled={saving}>{saving ? 'Sauvegarde…' : 'Sauvegarder'}</PixelButton></div>
        </form>
      </section>
    </div>
  )
}
