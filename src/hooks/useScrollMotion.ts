import { ScrollTrigger } from '../lib/gsap'
import { maskReveal, parallaxLayer, rowDrift, scrollReveal, splitHeading, velocityMarquee } from '../lib/motion'
import { useMotion } from './useMotion'

const all = (sel: string) => Array.from(document.querySelectorAll<HTMLElement>(sel))

/**
 * Applies the declarative motion attributes across the page:
 *   data-parallax="0.6" (+ data-parallax-cover)   data-split / data-split="now"
 *   data-mask="bottom|top|left|right"             data-marquee="left|right"
 *   data-drift="1|-1"                            data-reveal (Apple-style fade/rise)
 * Called once from App. Its layout effect runs after the sections' own
 * effects, so their pins exist before these triggers measure the page.
 */
export function useScrollMotion() {
  useMotion((env) => {
    all('[data-parallax]').forEach((el) =>
      parallaxLayer(el, Number(el.dataset.parallax), env, el.hasAttribute('data-parallax-cover')),
    )
    const unsplit = all('[data-split]').map((el) => splitHeading(el, { immediate: el.dataset.split === 'now' }))
    const masks = all('[data-mask]')
    if (masks.length) maskReveal(masks)
    const marquees = all('[data-marquee]').map((el) => velocityMarquee(el, env, el.dataset.marquee === 'right' ? 1 : -1))
    scrollReveal(all('[data-reveal]'))
    all('[data-drift]').forEach((el) => rowDrift(el, el.dataset.drift === '-1' ? -1 : 1, env))

    ScrollTrigger.refresh()
    return () => {
      unsplit.forEach((f) => f())
      marquees.forEach((f) => f())
    }
  })
}
