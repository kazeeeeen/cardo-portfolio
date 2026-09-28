import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Lazy images load in batches as the user scrolls, so there is never a single
// "all images loaded" moment. Each load schedules one debounced refresh instead,
// which keeps pin positions correct without refreshing once per image.
let refreshTimer: number | undefined

export function scheduleRefresh() {
  window.clearTimeout(refreshTimer)
  refreshTimer = window.setTimeout(() => {
    // A refresh re-applies the scroll position, which knocks an in-flight
    // smooth scroll (e.g. a nav jump) off its target. Wait until it settles.
    if (ScrollTrigger.isScrolling()) scheduleRefresh()
    else ScrollTrigger.refresh()
  }, 150)
}

export { gsap, ScrollTrigger }
