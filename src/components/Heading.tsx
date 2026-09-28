import type { CSSProperties, ReactNode } from 'react'
import clsx from 'clsx'
import { fs } from '../lib/layout'

interface HeadingProps {
  /** Size in SVG page pixels. */
  size: number
  tone?: 'ink' | 'paper'
  as?: 'h1' | 'h2' | 'p'
  className?: string
  style?: CSSProperties
  /** Per-character rise: on scroll-in, or 'now' for on-load (hero). */
  split?: boolean | 'now'
  children: ReactNode
}

/** Display heading with the original's gray gradient fill. Use <em> for the italic letters. */
export function Heading({ size, tone = 'ink', as: Tag = 'h2', className, style, split, children }: HeadingProps) {
  return (
    <Tag
      data-split={split === 'now' ? 'now' : split ? '' : undefined}
      className={clsx(
        // Padding (pulled back by negative margin) so the gradient, which only
        // paints inside the box, reaches ascenders, descenders (the g's tail)
        // and italic overhangs on either side at 0.8 leading.
        'font-display leading-[0.8] tracking-[-0.045em] whitespace-nowrap',
        'pt-[0.14em] pb-[0.3em] px-[0.2em] mt-[-0.14em] mb-[-0.3em] mx-[-0.2em]',
        tone === 'ink' ? 'text-fill-ink' : 'text-fill-paper',
        className,
      )}
      style={{ fontSize: fs(size), ...style }}
    >
      {children}
    </Tag>
  )
}
