import { useState, type FormEvent } from 'react'
import { AuthFrame } from '../components/auth/AuthFrame'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelInput } from '../components/ui/PixelInput'
import { authErrorMessage } from '../lib/authErrors'
import { supabase } from '../lib/supabase'

export function LoginPage({ onSignup, onForgot }: { onSignup: () => void; onForgot: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      console.error(error)
      setErrorMessage(authErrorMessage(error))
    }
    setSubmitting(false)
  }
  return <AuthFrame title="Connexion" subtitle="Reprends ta quête là où tu l'as laissée."><form className="space-y-4" onSubmit={(event) => void handleSubmit(event)}><label className="block text-sm text-slate-300" htmlFor="login-email">Email<PixelInput id="login-email" className="mt-1" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="aventurier@email.fr" /></label><label className="block text-sm text-slate-300" htmlFor="login-password">Mot de passe<PixelInput id="login-password" className="mt-1" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" /></label>{errorMessage ? <p role="alert" className="text-sm text-red-300">{errorMessage}</p> : null}<button type="button" className="text-sm text-purple-300 underline" onClick={onForgot}>Mot de passe oublié ?</button><PixelButton className="w-full" type="submit" disabled={submitting}>{submitting ? 'Connexion…' : 'Se connecter'}</PixelButton></form><button className="mt-5 w-full text-sm text-purple-300 underline" onClick={onSignup}>Créer un compte</button></AuthFrame>
}
