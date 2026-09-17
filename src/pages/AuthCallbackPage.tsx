import { useEffect, useState } from 'react'
import { AuthFrame } from '../components/auth/AuthFrame'
import { PixelButton } from '../components/ui/PixelButton'
import { supabase } from '../lib/supabase'

export function AuthCallbackPage({ onComplete }: { onComplete: () => void }) {
  const [errorMessage, setErrorMessage] = useState('')
  useEffect(() => {
    let active = true
    const complete = async () => {
      const currentSession = await supabase.auth.getSession()
      if (currentSession.data.session) {
        if (active) onComplete()
        return
      }
      const code = new URLSearchParams(window.location.search).get('code')
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error && active) { console.error(error); setErrorMessage('Le lien de confirmation est invalide ou expiré.'); return }
      }
      const { data } = await supabase.auth.getSession()
      if (!active) return
      if (data.session) onComplete()
      else setErrorMessage('Le lien de confirmation est invalide ou expiré.')
    }
    void complete()
    return () => { active = false }
  }, [onComplete])
  return <AuthFrame title="Validation du compte" subtitle="Nous vérifions ton sceau d’aventurier.">{errorMessage ? <><p role="alert" className="mb-4 text-sm text-red-300">{errorMessage}</p><PixelButton className="w-full" onClick={onComplete}>Retour</PixelButton></> : <p role="status" className="text-center text-gold">Confirmation en cours…</p>}</AuthFrame>
}
