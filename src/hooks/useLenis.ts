import { useEffect, useSyncExternalStore } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '../lib/gsap'

// One Lenis instance for the whole app, held at module level so any component
// (nav links, the lightbox) can reach it without prop drilling.
let instance: Lenis | null = null
const listeners = new Set<() => void>()

function setInstance(next: Lenis | null) {
  instance = next
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

/**
 * Call once, at the app root. Lenis is driven by GSAP's ticker so Lenis and
 * ScrollTrigger share a single frame loop. Disabled under reduced motion,
 * which falls back to native scrolling.
 */
export function useLenisRoot(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const lenis = new Lenis({ autoRaf: false, lerp: 0.1 })
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setInstance(lenis)

    // Cleanup also covers StrictMode's double-mount in dev, so there is never
    // a second instance fighting the first.
    return () => {
      gsap.ticker.remove(tick)
      gsap.ticker.lagSmoothing(500, 33)
      lenis.destroy()
      setInstance(null)
    }
  }, [enabled])
}

/** The shared instance, or null (not mounted yet, or reduced motion). */
export function useLenis() {
  return useSyncExternalStore(subscribe, () => instance, () => null)
}
