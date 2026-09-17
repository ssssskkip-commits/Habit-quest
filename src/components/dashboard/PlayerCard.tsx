import { PixelCard } from '../ui/PixelCard'
import { CharacterPlaceholder } from './CharacterPlaceholder'
import { XPBar } from './XPBar'
export function PlayerCard(){return <PixelCard className="pixel-grid"><div className="flex items-start justify-between"><div><p className="text-xs uppercase tracking-[.25em] text-gold">Aventurier</p><h1 className="text-3xl font-bold">Joueur</h1></div><div className="border-2 border-gold px-3 py-1 text-gold">Niv. 3</div></div><div className="py-7"><CharacterPlaceholder/></div><XPBar value={68} max={100}/><p className="mt-4 text-center text-xs text-slate-500">Classe émergente · à découvrir</p></PixelCard>}
