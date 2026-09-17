import type { PropsWithChildren } from 'react'
export function PixelCard({children,className=''}:PropsWithChildren<{className?:string}>){return <section className={`pixel-border bg-panel/95 p-4 ${className}`}>{children}</section>}
