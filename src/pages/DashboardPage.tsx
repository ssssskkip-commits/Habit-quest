import { useAuth } from '../components/auth/AuthContext'
import { QuestCard } from '../components/dashboard/QuestCard'
import { PlayerCard } from '../components/dashboard/PlayerCard'
import { FloatingActionButton } from '../components/ui/FloatingActionButton'

export function DashboardPage() {
  const { profile, progress, profileLoading } = useAuth()
  return <><PlayerCard displayName={profile?.display_name ?? 'Joueur'} level={progress?.level ?? 1} currentXp={progress?.current_xp ?? 0} loading={profileLoading} /><div className="mb-3 mt-7 flex items-end justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-purple-300">Journal de quête</p><h2 className="text-2xl font-bold">Aujourd'hui</h2></div><span className="text-sm text-gold">1 / 3</span></div><div className="space-y-3"><QuestCard title="Boire 2 L d'eau" xp={15} done/><QuestCard title="20 min de mouvement" xp={25}/><QuestCard title="Lire 10 pages" xp={20}/></div><FloatingActionButton/></>
}
