// Reusable ScrollTrigger recipes. None of these check reduced motion
// themselves: they only ever run inside useMotion(), whose gsap.matchMedia()
// conditions exclude prefers-reduced-motion, so under that setting nothing is
// created and every element stays in its final, static CSS state.
import { SplitText } from 'gsap/SplitText'
import { gsap, ScrollTrigger } from './gsap'

gsap.registerPlugin(SplitText)

export interface MotionEnv {
  isMobile: boolean
  /** Parallax depth multiplier: 1 on desktop, 0.5 on phones. */
  depth: number
}

// Only hint the compositor while something is actually moving.
const hint = (el: HTMLElement) => (self: ScrollTrigger) => {
  el.style.willChange = self.isActive ? 'transform' : ''
}

/* 1 ─ parallax ─────────────────────────────────────────────────────────────
   speed < 1 lags behind the scroll (backgrounds), > 1 runs ahead (text).
   Travel is (1 − speed) × half the page height over the page's time on
   screen, so 0.6 moves 20% of the page, 1.15 moves 7.5% the other way.
   `cover` oversizes the element so the moving edge never shows. */
export function parallaxLayer(el: HTMLElement, speed: number, env: MotionEnv, cover = false) {
  // Off on phones: a lagging drift "swims" against touch momentum scrolling.
  if (env.isMobile) return
  const page = (el.closest('.page') as HTMLElement | null) ?? el.parentElement!
  const frac = (1 - speed) * 0.5 * env.depth
  // Oversize by the travel relative to the element's own height: a band
  // shorter than its page (the about portrait) needs more headroom.
  if (cover) gsap.set(el, { scale: 1 + (Math.abs(frac) * page.offsetHeight) / el.offsetHeight + 0.02 })

  return gsap.fromTo(
    el,
    { y: () => (-frac * page.offsetHeight) / 2 },
    {
      y: () => (frac * page.offsetHeight) / 2,
      ease: 'none',
      scrollTrigger: {
        trigger: page,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
        onToggle: hint(el),
      },
    },
  )
}

/* 2 ─ pinned reveal ─────────────────────────────────────────────────────────
   Pins a page while `build` fills a scrubbed timeline. Released on phones:
   the timeline still scrubs as the page scrolls past, just without the pin. */
export function pinnedReveal(
  section: HTMLElement,
  env: MotionEnv,
  build: (tl: gsap.core.Timeline) => void,
  length = '80%',
) {
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: env.isMobile
      ? { trigger: section, start: 'top top', end: 'bottom top', scrub: true } // no lag against touch momentum
      : { trigger: section, start: 'top top', end: `+=${length}`, pin: true, scrub: 1, anticipatePin: 1 },
  })
  build(tl)
  return tl
}

/* 3 ─ mask reveal ───────────────────────────────────────────────────────────
   Clip-path opens from one edge while the image inside settles 1.08 → 1.
   (Clip-path isn't compositor-only, but it runs once per element on enter,
   never scrubbed, so it stays cheap.) Elements entering together stagger. */
const INSET = {
  bottom: 'inset(100% 0% 0% 0%)',
  top: 'inset(0% 0% 100% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
} as const
export type MaskFrom = keyof typeof INSET

// Only images settle in scale; a masked text block just opens.
const innerImage = (el: HTMLElement) => el.querySelector('img')

export function maskReveal(els: HTMLElement[]) {
  els.forEach((el) => {
    gsap.set(el, { clipPath: INSET[(el.dataset.mask as MaskFrom) || 'bottom'] })
    const img = innerImage(el)
    if (img) gsap.set(img, { scale: 1.08 })
  })
  return ScrollTrigger.batch(els, {
    start: 'top 85%',
    once: true,
    onEnter: (batch) => {
      const targets = batch as HTMLElement[]
      gsap.to(targets, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.out', stagger: 0.14 })
      const imgs = targets.map(innerImage).filter(Boolean)
      if (imgs.length) gsap.to(imgs, { scale: 1, duration: 2.2, ease: 'expo.out', stagger: 0.14 })
    },
  })
}

/* 4 ─ split heading ─────────────────────────────────────────────────────────
   Per-character rise from 110% inside line masks. The headings use a
   background-clip gradient, which Chrome drops once children are transformed,
   so each character gets its own slice of the same gradient: sized to the
   whole heading and offset to where the character sits. */
function paintChars(el: HTMLElement, chars: Element[]) {
  el.dataset.fill ??= getComputedStyle(el).backgroundImage
  const fill = el.dataset.fill
  if (!fill || fill === 'none') return
  el.style.backgroundImage = 'none'
  // A text-clipped background only paints inside the element's own box, and
  // at 0.8 line-height a character's box is shorter than its glyph: the g's
  // tail and italic overhangs would go unpainted. Grow each box on all sides
  // with padding, cancelled by negative margin so layout doesn't move. Set
  // before measuring, since the gradient offset uses the padded box.
  for (const c of chars as HTMLElement[]) {
    c.style.padding = '0.16em 0.2em 0.32em'
    c.style.margin = '-0.16em -0.2em -0.32em'
  }
  const box = el.getBoundingClientRect()
  for (const c of chars as HTMLElement[]) {
    const r = c.getBoundingClientRect()
    c.style.backgroundImage = fill
    c.style.backgroundSize = `${box.width}px ${box.height}px`
    c.style.backgroundPosition = `${box.left - r.left}px ${box.top - r.top}px`
    c.style.backgroundClip = 'text'
    c.style.setProperty('-webkit-background-clip', 'text')
    c.style.color = 'transparent'
  }
}

export function splitHeading(el: HTMLElement, { immediate = false } = {}) {
  const split = SplitText.create(el, {
    type: 'lines,chars',
    mask: 'lines',
    linesClass: 'split-line',
    autoSplit: true, // re-split after fonts load and on resize
    onSplit(self) {
      paintChars(el, self.chars)
      return gsap.from(self.chars, {
        yPercent: 110,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.035,
        delay: immediate ? 0.15 : 0,
        scrollTrigger: immediate ? undefined : { trigger: el, start: 'top 88%', once: true },
      })
    },
  })
  return () => {
    split.revert()
    el.style.backgroundImage = ''
  }
}

/* 5 ─ velocity marquee ──────────────────────────────────────────────────────
   The signature move. A track holding two identical halves slides at a
   constant base speed; scrolling boosts the speed with scroll velocity and
   flips the direction with scroll direction. Driven from the ticker with a
   wrapped x (not a repeating tween, which stalls when reversed past 0), and
   only while the strip is on screen. */
export function velocityMarquee(container: HTMLElement, env: MotionEnv, baseDir: 1 | -1 = -1) {
  const track = container.querySelector<HTMLElement>('[data-marquee-track]')
  if (!track) return () => {}

  const pxPerSec = env.isMobile ? 45 : 70
  // A right-aligned track (data-marquee-align="end") sits flush right at x=0,
  // so its seamless range is [0, half] rather than [−half, 0].
  const endAligned = container.dataset.marqueeAlign === 'end'
  const range = (h: number) => (endAligned ? gsap.utils.wrap(0, h) : gsap.utils.wrap(-h, 0))
  let half = track.scrollWidth / 2
  let wrap = range(half)
  const setX = gsap.quickSetter(track, 'x', 'px')
  let x = 0
  let dir = 1 // +1 while scrolling down, −1 while scrolling up
  let boost = 1
  let targetBoost = 1

  const tick = (_t: number, dt: number) => {
    targetBoost += (1 - targetBoost) * 0.04 // velocity kick decays back to base
    boost += (targetBoost - boost) * 0.12
    x = wrap(x + baseDir * dir * boost * pxPerSec * (dt / 1000))
    setX(x)
  }

  const st = ScrollTrigger.create({
    trigger: container,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      track.style.willChange = self.isActive ? 'transform' : ''
      if (self.isActive) gsap.ticker.add(tick)
      else gsap.ticker.remove(tick)
    },
    onUpdate: (self) => {
      dir = self.direction
      targetBoost = 1 + Math.min(Math.abs(self.getVelocity()) / 220, 9)
    },
    onRefresh: () => {
      half = track.scrollWidth / 2
      wrap = range(half)
    },
  })

  return () => {
    gsap.ticker.remove(tick)
    st.kill()
  }
}

/* 8 ─ scroll reveal ─────────────────────────────────────────────────────────
   Apple-style: blocks fade and rise into place as they scroll in, tied to
   the scroll position (scrubbed with a long lag, so it feels slow and smooth
   and reverses if you scroll back). Elements that already move on scroll
   (data-parallax) only fade and settle in scale, so the two don't fight.
   Phones play each reveal once instead: a scrubbed, lagging reveal reverses
   and replays under touch momentum (worst when flicking back up), which reads
   as glitching. */
export function scrollReveal(els: HTMLElement[], env: MotionEnv) {
  const drive = (el: Element, start: string, end: string, duration: number) =>
    env.isMobile
      ? { duration, scrollTrigger: { trigger: el, start: 'top 92%', once: true } }
      : { scrollTrigger: { trigger: el, start, end, scrub: 1.6 } }
  els.forEach((el) => {
    // Devices (the vlog / film phones) tilt up from lying back as they rise,
    // over a longer stretch of scroll so the move is easy to see.
    if (el.dataset.reveal === 'tilt') {
      gsap.fromTo(
        el,
        { opacity: 0, y: 140, rotateX: 32, scale: 0.88, transformPerspective: 1200, transformOrigin: '50% 100%' },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          ease: 'power2.out',
          ...drive(el.parentElement ?? el, 'top 100%', 'top 45%', 1.4),
        },
      )
      return
    }
    const moving = el.hasAttribute('data-parallax')
    gsap.fromTo(
      el,
      { opacity: 0, ...(moving ? { scale: 0.94 } : { y: 70, scale: 0.97 }) },
      {
        opacity: 1,
        scale: 1,
        ...(moving ? {} : { y: 0 }),
        ease: 'power2.out',
        ...drive(el, 'top 100%', 'top 76%', 1.2),
      },
    )
  })
}

/* 5b ─ row drift ───────────────────────────────────────────────────────────
   A pubmats row slides sideways as its page scrolls past; paired rows get
   opposite `dir`s so they shear against each other. `px` is the travel each
   way in SVG page pixels (scaled to the viewport). */
export function rowDrift(el: HTMLElement, dir: 1 | -1, env: MotionEnv, px = 60) {
  // Phones swipe the row instead; a transform would fight the scroll.
  if (env.isMobile) return
  const travel = () => ((px / 1366) * window.innerWidth * env.depth)
  return gsap.fromTo(
    el,
    { x: () => -dir * travel() },
    {
      x: () => dir * travel(),
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('.page') ?? el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
        onToggle: hint(el),
      },
    },
  )
}

// (6, scrapbookDrift, and 7, colorPop, are intentionally absent: nothing in
// the original drifts, and its photos are full colour throughout.)
