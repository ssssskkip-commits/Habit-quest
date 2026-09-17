import { useState, type FormEvent } from 'react'
import { AuthFrame } from '../components/auth/AuthFrame'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelInput } from '../components/ui/PixelInput'
import { authErrorMessage } from '../lib/authErrors'
import { validateSignup } from '../lib/authValidation'
import { supabase } from '../lib/supabase'

export function SignupPage({ onLogin }: { onLogin: () => void }) {
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    const validationError = validateSignup({ displayName, email, password, confirmation })
    if (validationError) { setErrorMessage(validationError); return }
    setErrorMessage('')
    setSubmitting(true)
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { display_name: displayName.trim() }, emailRedirectTo: `${window.location.origin}/auth/callback` } })
    if (error) { console.error(error); setErrorMessage(authErrorMessage(error)) }
    else if (!data.session) setMessage('Un email de confirmation vient de t’être envoyé. Consulte ta boîte mail pour activer ton compte.')
    setSubmitting(false)
  }
  return <AuthFrame title="Inscription" subtitle="Crée ton aventurier. Ta classe viendra avec tes actions."><form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}><label className="block text-sm text-slate-300" htmlFor="signup-name">Pseudo<PixelInput id="signup-name" className="mt-1" autoComplete="nickname" required minLength={2} maxLength={32} value={displayName} onChange={(event) => setDisplayName(event.target.value)} /></label><label className="block text-sm text-slate-300" htmlFor="signup-email">Email<PixelInput id="signup-email" className="mt-1" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label className="block text-sm text-slate-300" htmlFor="signup-password">Mot de passe<PixelInput id="signup-password" className="mt-1" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label><label className="block text-sm text-slate-300" htmlFor="signup-confirmation">Confirmation<PixelInput id="signup-confirmation" className="mt-1" type="password" autoComplete="new-password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>{errorMessage ? <p role="alert" className="text-sm text-red-300">{errorMessage}</p> : null}{message ? <p role="status" className="border-2 border-green-700 bg-green-950/40 p-3 text-sm text-green-300">{message}</p> : null}<PixelButton className="w-full" variant="gold" type="submit" disabled={submitting}>{submitting ? 'Création…' : 'Créer un compte'}</PixelButton></form><button className="mt-5 w-full text-sm text-purple-300 underline" onClick={onLogin}>Déjà un compte ? Se connecter</button></AuthFrame>
}
