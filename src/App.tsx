import { useState } from 'react'
import { BottomNavigation, type Tab } from './components/dashboard/BottomNavigation'
import { PixelButton } from './components/ui/PixelButton'
import { AppShell } from './layouts/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { PlaceholderPage } from './pages/PlaceholderPage'
import { SignupPage } from './pages/SignupPage'

type Screen='app'|'login'|'signup'
export default function App(){const [screen,setScreen]=useState<Screen>('app');const [tab,setTab]=useState<Tab>('quests');if(screen==='login')return <LoginPage onSignup={()=>setScreen('signup')}/>;if(screen==='signup')return <SignupPage onLogin={()=>setScreen('login')}/>;return <><AppShell><header className="mb-5 flex items-center justify-between"><span className="text-lg font-bold text-gold">⚔ HABIT QUEST</span><PixelButton variant="ghost" className="min-h-0 px-3 py-2 text-xs" onClick={()=>setScreen('login')}>Connexion</PixelButton></header>{tab==='quests'?<DashboardPage/>:<PlaceholderPage kind={tab}/>}</AppShell><BottomNavigation active={tab} onChange={setTab}/></>}
