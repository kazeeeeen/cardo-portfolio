import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/** 2px accent bar down the left edge, filling with page scroll. */
export function ProgressBar() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bar.current
    if (!el) return
    const setScale = gsap.quickSetter(el, 'scaleY')
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => setScale(self.progress),
    })
    return () => trigger.kill()
  }, [])

  return (
    <div
      ref={bar}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[95] h-full w-[2px] origin-top scale-y-0 bg-accent"
    />
  )
}
