import type { AuthError } from '@supabase/supabase-js'

const messages: Record<string, string> = {
  invalid_credentials: 'Email ou mot de passe incorrect.',
  email_not_confirmed: 'Confirme ton adresse email avant de te connecter.',
  user_already_exists: 'Un compte existe déjà avec cette adresse email.',
  weak_password: 'Choisis un mot de passe plus robuste.',
  over_request_rate_limit: 'Trop de tentatives. Réessaie dans quelques minutes.',
  same_password: 'Le nouveau mot de passe doit être différent de l’ancien.',
}

export function authErrorMessage(error: AuthError) {
  return messages[error.code ?? ''] ?? 'Une erreur est survenue. Réessaie dans quelques instants.'
}
