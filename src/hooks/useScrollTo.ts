import { useCallback } from 'react'
import { useLenis } from './useLenis'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/**
 * Scroll to an in-page hash. Uses Lenis when it's running; under reduced
 * motion Lenis is off, so fall back to an instant native jump. Focus moves to
 * the section either way so keyboard and screen-reader users follow along.
 */
export function useScrollTo() {
  const lenis = useLenis()
  const reducedMotion = usePrefersReducedMotion()

  return useCallback(
    (hash: string) => {
      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return
      if (lenis) lenis.scrollTo(target, { duration: 1.4 })
      else target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
      target.focus({ preventScroll: true })
      history.replaceState(null, '', hash)
    },
    [lenis, reducedMotion],
  )
}
