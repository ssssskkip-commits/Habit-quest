import { useCallback, useEffect, useState } from 'react'
import { BottomNavigation, type Tab } from './components/dashboard/BottomNavigation'
import { useAuth } from './components/auth/AuthContext'
import { PixelButton } from './components/ui/PixelButton'
import { AppShell } from './layouts/AppShell'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { DashboardPage } from './pages/DashboardPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LoginPage } from './pages/LoginPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { ProfilePage } from './pages/ProfilePage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SignupPage } from './pages/SignupPage'

const publicPaths = new Set(['/login', '/signup', '/forgot-password', '/reset-password', '/auth/callback'])

export default function App() {
  const { loading, session, signOut } = useAuth()
  const [path, setPath] = useState(() => window.location.pathname)
  const [tab, setTab] = useState<Tab>('quests')

  const navigate = useCallback((nextPath: string, replace = false) => {
    window.history[replace ? 'replaceState' : 'pushState']({}, '', nextPath)
    setPath(nextPath)
    window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (loading || path === '/auth/callback' || path === '/reset-password') return
    if (!session && !publicPaths.has(path)) navigate('/login', true)
    if (session && (path === '/login' || path === '/signup' || path === '/forgot-password')) navigate('/', true)
  }, [loading, navigate, path, session])

  if (loading) return <main className="grid min-h-screen place-items-center text-gold">Chargement de la quête…</main>
  if (path === '/auth/callback') return <AuthCallbackPage onComplete={() => navigate('/', true)} />
  if (path === '/reset-password') return <ResetPasswordPage onComplete={() => navigate('/login', true)} />
  if (!session) {
    if (path === '/signup') return <SignupPage onLogin={() => navigate('/login')} />
    if (path === '/forgot-password') return <ForgotPasswordPage onLogin={() => navigate('/login')} />
    return <LoginPage onSignup={() => navigate('/signup')} onForgot={() => navigate('/forgot-password')} />
  }

  const handleTabChange = (nextTab: Tab) => {
    setTab(nextTab)
    navigate('/', true)
  }

  return (
    <>
      <AppShell>
        <header className="mb-5 flex items-center justify-between">
          <span className="text-lg font-bold text-gold">⚔ HABIT QUEST</span>
          <PixelButton variant="ghost" className="min-h-0 px-3 py-2 text-xs" onClick={() => void signOut()}>
            Déconnexion
          </PixelButton>
        </header>
        {tab === 'quests' ? <DashboardPage /> : tab === 'profile' ? <ProfilePage /> : <PlaceholderPage kind={tab} />}
      </AppShell>
      <BottomNavigation active={tab} onChange={handleTabChange} />
    </>
  )
}
