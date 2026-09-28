import { useEffect, useRef } from 'react'
import { useLenis } from '../hooks/useLenis'
import type { ImageAsset } from '../types'
import { Image } from './Image'

interface LightboxProps {
  items: ImageAsset[]
  /** Open at this index; null = closed. */
  index: number | null
  onIndex: (i: number) => void
  onClose: () => void
  label: string
}

/**
 * Full-colour viewer for the pubmats, which are too small in the strip to read.
 * Built on <dialog>.showModal(): the rest of the page goes inert (focus is
 * trapped), Esc closes it natively, and focus returns to the opening tile.
 * Arrow keys step through; Lenis is paused so the page can't scroll behind.
 */
export function Lightbox({ items, index, onIndex, onClose, label }: LightboxProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const lenis = useLenis()
  const open = index !== null

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    if (open && !d.open) {
      opener.current = document.activeElement as HTMLElement | null
      d.showModal()
      lenis?.stop()
    } else if (!open && d.open) {
      d.close()
    }
  }, [open, lenis])

  // Runs for every close path (Esc, button, backdrop): restore scroll + focus.
  const handleClose = () => {
    lenis?.start()
    opener.current?.focus({ preventScroll: true })
    onClose()
  }

  const step = (by: number) => index !== null && onIndex((index + by + items.length) % items.length)
  const item = index !== null ? items[index] : null

  return (
    <dialog
      ref={dialog}
      aria-label={label}
      className="lightbox"
      onClose={handleClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') step(1)
        if (e.key === 'ArrowLeft') step(-1)
      }}
      // A click on the backdrop (the dialog itself, outside the figure) closes.
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
    >
      {item && (
        <figure className="flex h-full flex-col items-center justify-center gap-4 p-[4vw]">
          <Image
            key={item.slug}
            asset={item}
            priority
            sizes="90vw"
            className="max-h-[80vh] w-auto max-w-full"
            style={{ height: `min(80vh, ${(100 / item.ratio) * 0.9}vw)` }}
          />
          <figcaption className="condensed flex w-full max-w-[80vh] justify-between text-small text-gray-300">
            <span>{item.alt}</span>
            <span aria-live="polite">
              {index! + 1} / {items.length}
            </span>
          </figcaption>
        </figure>
      )}
      <div className="condensed pointer-events-none fixed inset-x-0 top-0 flex justify-end p-4 text-small uppercase">
        <button className="pointer-events-auto text-white hover:text-accent" onClick={() => dialog.current?.close()}>
          close ✕
        </button>
      </div>
      <button
        aria-label="Previous"
        className="fixed top-1/2 left-4 -translate-y-1/2 p-3 text-display-s leading-none text-white hover:text-accent"
        onClick={() => step(-1)}
      >
        ‹
      </button>
      <button
        aria-label="Next"
        className="fixed top-1/2 right-4 -translate-y-1/2 p-3 text-display-s leading-none text-white hover:text-accent"
        onClick={() => step(1)}
      >
        ›
      </button>
    </dialog>
  )
}
