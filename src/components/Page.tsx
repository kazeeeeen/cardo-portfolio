import type { ReactNode } from 'react'
import clsx from 'clsx'

interface PageProps {
  id: string
  /** Human name, used for data-section (ScrollTrigger) and aria-label. */
  label: string
  tone?: 'paper' | 'ink'
  /** Full-bleed photo page: on phones it stays one screen tall, text at the bottom. */
  cover?: boolean
  className?: string
  children?: ReactNode
}

/**
 * One page of the original SVG. On desktop each page keeps the SVG's
 * 1366×768 proportion so positions measured off the SVG (see RicaMark) land
 * in the same place; on phones it restacks as one column (see index.css).
 */
export function Page({ id, label, tone = 'paper', cover = false, className, children }: PageProps) {
  return (
    <section
      id={id}
      data-section={label}
      aria-label={label}
      // Focus target for in-page links, so keyboard users land in the section.
      tabIndex={-1}
      className={clsx(
        'page relative overflow-hidden outline-none',
        tone === 'ink' ? 'bg-ink text-white' : 'bg-paper text-ink',
        cover && 'page-cover',
        className,
      )}
    >
      {children}
    </section>
  )
}
