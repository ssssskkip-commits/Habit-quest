import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

type Props=PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>&{variant?:'primary'|'gold'|'ghost'}>
export function PixelButton({children,variant='primary',className='',...props}:Props){const styles={primary:'bg-purple text-white border-purple-300',gold:'bg-gold text-ink border-yellow-200',ghost:'bg-panel text-slate-200 border-slate-600'};return <button className={`pixel-border min-h-12 border-2 px-5 py-3 font-bold uppercase tracking-wide transition active:translate-x-1 active:translate-y-1 active:shadow-none ${styles[variant]} ${className}`} {...props}>{children}</button>}
