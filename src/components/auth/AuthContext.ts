import { createContext, useContext } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Tables } from '../../types/database'

export type AuthContextValue = {
  session: Session | null
  profile: Tables<'profiles'> | null
  progress: Tables<'player_progress'> | null
  loading: boolean
  profileLoading: boolean
  refreshProfile: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
