import { useEffect, useState, type FormEvent } from 'react'
import { Brain, Drama, Dumbbell, Flame, Heart, Pencil, X } from 'lucide-react'
import { ALL_WEEKDAYS, WEEKDAY_LABELS, type Habit, type HabitCategory, type HabitColor, type HabitFrequency } from '../../lib/habits'
import { PixelButton } from '../ui/PixelButton'
import { PixelInput } from '../ui/PixelInput'

export type HabitDraft = Pick<Habit, 'title' | 'description' | 'category' | 'xp_reward' | 'icon_key' | 'color' | 'schedule_days' | 'frequency_type'>

const categoryOptions = [
  ['force', 'Force', 'dumbbell', Dumbbell], ['vitality', 'Vitalité', 'heart', Heart],
  ['intelligence', 'Intelligence', 'brain', Brain], ['willpower', 'Volonté', 'flame', Flame],
  ['charisma', 'Charisme', 'drama', Drama], ['creativity', 'Créativité', 'pencil', Pencil],
] as const
const colorOptions: HabitColor[] = ['purple', 'gold', 'green', 'blue', 'pink']
const colorClasses: Record<HabitColor, string> = {
  purple: 'bg-purple-500', gold: 'bg-yellow-400', green: 'bg-emerald-400', blue: 'bg-sky-400', pink: 'bg-pink-400',
}

const emptyDraft: HabitDraft = {
  title: '', description: null, category: 'willpower', xp_reward: 10, icon_key: 'flame', color: 'purple',
  frequency_type: 'daily', schedule_days: [...ALL_WEEKDAYS],
}

export function HabitForm({ habit, onClose, onSave }: {
  habit: Habit | null
  onClose: () => void
  onSave: (draft: HabitDraft) => Promise<boolean>
}) {
  const [draft, setDraft] = useState<HabitDraft>(habit ? {
    title: habit.title, description: habit.description, category: habit.category, xp_reward: habit.xp_reward,
    icon_key: habit.icon_key, color: habit.color, frequency_type: habit.frequency_type, schedule_days: habit.schedule_days,
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
    if (draft.frequency_type === 'daily' && draft.schedule_days.length === 0) return setFormError('Choisis au moins un jour.')
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
          <fieldset><legend className="mb-2 text-sm text-slate-200">Catégories</legend><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {categoryOptions.map(([category, label, iconKey, Icon]) => <button key={category} type="button" aria-label={label} aria-pressed={draft.category === category} onClick={() => setDraft({ ...draft, category: category as HabitCategory, icon_key: iconKey })} className={`flex min-h-14 items-center justify-center gap-2 border-2 px-2 ${draft.category === category ? 'border-gold text-gold' : 'border-slate-700 text-slate-400'}`}><Icon size={20} /><span>{label}</span></button>)}
          </div></fieldset>
          <fieldset><legend className="mb-2 text-sm text-slate-200">Couleur</legend><div className="flex gap-3">
            {colorOptions.map((color) => <button key={color} type="button" aria-label={`Couleur ${color}`} aria-pressed={draft.color === color} onClick={() => setDraft({ ...draft, color })} className={`h-9 w-9 border-2 ${colorClasses[color]} ${draft.color === color ? 'border-white outline outline-2 outline-gold' : 'border-slate-800'}`} />)}
          </div></fieldset>
          <fieldset><legend className="mb-2 text-sm text-slate-200">Fréquence</legend>
            <div className="mb-3 grid grid-cols-2 gap-2">{([['daily', 'Quotidien'], ['weekly', 'Hebdo']] as const).map(([frequency, label]) => <button key={frequency} type="button" aria-pressed={draft.frequency_type === frequency} onClick={() => setDraft({ ...draft, frequency_type: frequency as HabitFrequency })} className={`min-h-11 border-2 font-bold ${draft.frequency_type === frequency ? 'border-purple-300 bg-purple text-white' : 'border-slate-700 text-slate-400'}`}>{label}</button>)}</div>
            {draft.frequency_type === 'daily' ? <div className="flex justify-between gap-1">{ALL_WEEKDAYS.map((day) => <button key={day} type="button" aria-label={`Jour ${day}`} aria-pressed={draft.schedule_days.includes(day)} onClick={() => toggleDay(day)} className={`h-10 min-w-10 border-2 font-bold ${draft.schedule_days.includes(day) ? 'border-purple-300 bg-purple text-white' : 'border-slate-700 text-slate-500'}`}>{WEEKDAY_LABELS[day]}</button>)}</div> : <p className="text-sm text-slate-400">À accomplir une fois, n’importe quand dans la semaine.</p>}
          </fieldset>
          {formError ? <p role="alert" className="text-sm text-red-300">{formError}</p> : null}
          <div className="grid grid-cols-2 gap-3"><PixelButton type="button" variant="ghost" onClick={onClose}>Annuler</PixelButton><PixelButton type="submit" variant="gold" disabled={saving}>{saving ? 'Sauvegarde…' : 'Sauvegarder'}</PixelButton></div>
        </form>
      </section>
    </div>
  )
}
