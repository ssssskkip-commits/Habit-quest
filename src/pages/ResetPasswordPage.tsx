import { useState, type FormEvent } from 'react'
import { AuthFrame } from '../components/auth/AuthFrame'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelInput } from '../components/ui/PixelInput'
import { authErrorMessage } from '../lib/authErrors'
import { validateNewPassword } from '../lib/authValidation'
import { supabase } from '../lib/supabase'

export function ResetPasswordPage({ onComplete }: { onComplete: () => void }) {
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationError = validateNewPassword(password, confirmation)
    if (validationError) { setErrorMessage(validationError); return }
    setSubmitting(true); setErrorMessage('')
    const { error } = await supabase.auth.updateUser({ password })
    if (error) { console.error(error); setErrorMessage(authErrorMessage(error)) }
    else { await supabase.auth.signOut(); onComplete() }
    setSubmitting(false)
  }
  return <AuthFrame title="Nouveau mot de passe" subtitle="Forge une nouvelle clé pour ton compte."><form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}><label className="block text-sm text-slate-300" htmlFor="new-password">Nouveau mot de passe<PixelInput id="new-password" className="mt-1" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label><label className="block text-sm text-slate-300" htmlFor="new-password-confirmation">Confirmation<PixelInput id="new-password-confirmation" className="mt-1" type="password" autoComplete="new-password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>{errorMessage ? <p role="alert" className="text-sm text-red-300">{errorMessage}</p> : null}<PixelButton className="w-full" type="submit" disabled={submitting}>{submitting ? 'Mise à jour…' : 'Changer le mot de passe'}</PixelButton></form></AuthFrame>
}
