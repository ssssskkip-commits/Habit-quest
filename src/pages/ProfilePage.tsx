import { useEffect, useState, type FormEvent } from 'react'
import { useAuth } from '../components/auth/AuthContext'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelCard } from '../components/ui/PixelCard'
import { PixelInput } from '../components/ui/PixelInput'
import { supabase } from '../lib/supabase'

export function ProfilePage() {
  const { profile, progress, session, refreshProfile, signOut } = useAuth()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => setDisplayName(profile?.display_name ?? ''), [profile?.display_name])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setMessage(''); setErrorMessage('')
    const trimmedName = displayName.trim()
    if (trimmedName.length < 2 || trimmedName.length > 32) { setErrorMessage('Le pseudo doit contenir entre 2 et 32 caractères.'); return }
    setSubmitting(true)
    const { error } = await supabase.from('profiles').update({ display_name: trimmedName }).eq('id', session!.user.id)
    if (error) { console.error(error); setErrorMessage('Impossible de mettre à jour le profil.') }
    else { await refreshProfile(); setMessage('Profil mis à jour.') }
    setSubmitting(false)
  }

  return <div className="space-y-4"><PixelCard><p className="text-xs uppercase tracking-[.2em] text-purple-300">Profil joueur</p><h1 className="mt-1 text-3xl font-bold">{profile?.display_name ?? 'Joueur'}</h1><p className="mt-2 text-sm text-slate-400">{session?.user.email}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="border-2 border-slate-700 p-3"><p className="text-xs text-slate-500">Niveau</p><p className="text-2xl text-gold">{progress?.level ?? 1}</p></div><div className="border-2 border-slate-700 p-3"><p className="text-xs text-slate-500">XP totale</p><p className="text-2xl text-purple-300">{progress?.total_xp ?? 0}</p></div></div></PixelCard><PixelCard><h2 className="mb-4 text-xl font-bold">Modifier le pseudo</h2><form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}><label className="block text-sm text-slate-300" htmlFor="profile-name">Pseudo<PixelInput id="profile-name" className="mt-1" required minLength={2} maxLength={32} value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label>{errorMessage ? <p role="alert" className="text-sm text-red-300">{errorMessage}</p> : null}{message ? <p role="status" className="text-sm text-green-300">{message}</p> : null}<PixelButton type="submit" disabled={submitting}>{submitting ? 'Sauvegarde…' : 'Sauvegarder'}</PixelButton></form></PixelCard><PixelButton variant="ghost" className="w-full" onClick={() => void signOut()}>Se déconnecter</PixelButton></div>
}
