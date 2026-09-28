import type { CSSProperties } from 'react'
import clsx from 'clsx'
import { fs } from '../lib/layout'

interface CreditProps {
  children: string
  style?: CSSProperties
  /** The wider chip with a dark gradient (the pubmats credit in the Canva design). */
  wide?: boolean
}

/** The small black label chip the original puts above headings (KINAADMAN, CASSAYURAN…). */
export function Credit({ children, style, wide = false }: CreditProps) {
  return (
    <span
      className={clsx(
        'inline-block leading-none text-white uppercase',
        wide ? 'condensed px-[1.18em] py-0 tracking-[-0.045em] whitespace-nowrap' : 'bg-ink px-[0.6em] py-[0.15em]',
      )}
      style={{
        fontSize: `max(0.625rem, ${fs(10)})`,
        ...(wide && { backgroundImage: 'linear-gradient(90deg, #3a3431 0%, #0a0a0a 100%)' }),
        ...style,
      }}
    >
      {children}
    </span>
  )
}
