export type SignupFields = { displayName: string; email: string; password: string; confirmation: string }

export function validateSignup(fields: SignupFields) {
  const nameLength = fields.displayName.trim().length
  if (nameLength < 2 || nameLength > 32) return 'Le pseudo doit contenir entre 2 et 32 caractères.'
  if (!fields.email.includes('@')) return 'Saisis une adresse email valide.'
  if (fields.password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.'
  if (fields.password !== fields.confirmation) return 'Les mots de passe ne correspondent pas.'
  return null
}

export function validateNewPassword(password: string, confirmation: string) {
  if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.'
  if (password !== confirmation) return 'Les mots de passe ne correspondent pas.'
  return null
}
