import { useState, type FormEvent } from 'react'
import { AuthFrame } from '../components/auth/AuthFrame'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelInput } from '../components/ui/PixelInput'
import { authErrorMessage } from '../lib/authErrors'
import { supabase } from '../lib/supabase'

export function ForgotPasswordPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitting(true); setErrorMessage('')
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` })
    if (error) { console.error(error); setErrorMessage(authErrorMessage(error)) }
    else setMessage('Si cette adresse correspond à un compte, un lien de réinitialisation vient d’être envoyé.')
    setSubmitting(false)
  }
  return <AuthFrame title="Mot de passe oublié" subtitle="Reçois un lien pour reprendre ta quête."><form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}><label className="block text-sm text-slate-300" htmlFor="recovery-email">Email<PixelInput id="recovery-email" className="mt-1" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>{errorMessage ? <p role="alert" className="text-sm text-red-300">{errorMessage}</p> : null}{message ? <p role="status" className="text-sm text-green-300">{message}</p> : null}<PixelButton className="w-full" type="submit" disabled={submitting}>{submitting ? 'Envoi…' : 'Envoyer le lien'}</PixelButton></form><button className="mt-5 w-full text-sm text-purple-300 underline" onClick={onLogin}>Retour à la connexion</button></AuthFrame>
}
