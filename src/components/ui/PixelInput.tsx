import type { InputHTMLAttributes } from 'react'
export function PixelInput({className='',...props}:InputHTMLAttributes<HTMLInputElement>){return <input className={`w-full border-2 border-slate-600 bg-ink px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-purple ${className}`} {...props}/>}
