import { ScrollText, Shield, UserRound } from 'lucide-react'
export type Tab='quests'|'recap'|'profile'
const items=[['quests','Quêtes',ScrollText],['recap','Récap',Shield],['profile','Profil',UserRound]] as const
export function BottomNavigation({active,onChange}:{active:Tab;onChange:(tab:Tab)=>void}){return <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-3xl -translate-x-1/2 border-t-2 border-slate-700 bg-[#0b0f1e]/95 px-2 pb-[max(.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">{items.map(([id,label,Icon])=><button key={id} onClick={()=>onChange(id)} className={`flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-xs ${active===id?'text-gold':'text-slate-500'}`}><Icon size={21}/><span>{label}</span></button>)}</nav>}
