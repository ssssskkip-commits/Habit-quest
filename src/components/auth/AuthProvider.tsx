import type { Session } from '@supabase/supabase-js'
import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'
import { supabase } from '../../lib/supabase'
import type { Tables } from '../../types/database'
import { AuthContext, type AuthContextValue } from './AuthContext'

type Profile = Tables<'profiles'>
type PlayerProgress = Tables<'player_progress'>
export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [progress, setProgress] = useState<PlayerProgress | null>(null)

  useEffect(() => {
    let active = true
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session)
        setLoading(false)
      }
    })
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    const userId = session?.user.id
    if (!userId) return
    setProfileLoading(true)
    const [profileResult, progressResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('player_progress').select('*').eq('user_id', userId).single(),
    ])
    if (profileResult.error) console.error(profileResult.error)
    if (progressResult.error) console.error(progressResult.error)
    setProfile(profileResult.data)
    setProgress(progressResult.data)
    setProfileLoading(false)
  }, [session?.user.id])

  useEffect(() => {
    if (!session) {
      setProfile(null)
      setProgress(null)
      return
    }
    void refreshProfile()
  }, [refreshProfile, session])

  const value = useMemo<AuthContextValue>(() => ({
    session,
    profile,
    progress,
    loading,
    profileLoading,
    refreshProfile,
    signOut: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) console.error(error)
    },
  }), [loading, profile, profileLoading, progress, refreshProfile, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
