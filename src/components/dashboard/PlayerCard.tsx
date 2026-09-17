import { PixelCard } from '../ui/PixelCard'
import { CharacterPlaceholder } from './CharacterPlaceholder'
import { XPBar } from './XPBar'

export function PlayerCard({ displayName, level, currentXp, loading }: { displayName: string; level: number; currentXp: number; loading: boolean }) {
  return <PixelCard className="pixel-grid"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[.25em] text-gold">Aventurier</p><h1 className="text-3xl font-bold">{loading ? 'Chargement…' : displayName}</h1></div><div className="border-2 border-gold px-3 py-1 text-gold">Niv. {level}</div></div><div className="py-7"><CharacterPlaceholder/></div><XPBar value={currentXp} max={100}/><p className="mt-4 text-center text-xs text-slate-500">Classe émergente · à découvrir</p></PixelCard>
}
