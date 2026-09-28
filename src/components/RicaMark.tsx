import clsx from 'clsx'
import { box } from '../lib/layout'

interface RicaMarkProps {
  /** Position in SVG page pixels (the page is 1366×768). */
  x: number
  y: number
  tone?: 'ink' | 'white'
}

/** The "RICA." signature that sits in a different corner on each SVG page. */
export function RicaMark({ x, y, tone = 'ink' }: RicaMarkProps) {
  return (
    <span
      aria-hidden
      className={clsx(
        'condensed z-10 stack:order-last text-[max(0.875rem,1.75vw)] leading-none tracking-[-0.02em] select-none',
        // On phones the mark flows onto white paper, so it is always ink there.
        tone === 'white' ? 'text-ink spread:text-white' : 'text-ink',
      )}
      style={box(x, y)}
    >
      RICA.
    </span>
  )
}
