import { useLayoutEffect, type DependencyList } from 'react'
import { STACK } from '../lib/breakpoints'
import { gsap } from '../lib/gsap'
import type { MotionEnv } from '../lib/motion'

/**
 * Runs `setup` inside gsap.matchMedia. It never runs under
 * prefers-reduced-motion, so elements stay static. Switching layout
 * (rotating a tablet, resizing past a breakpoint) or toggling reduced motion
 * live reverts everything created here (tweens, triggers, pins, splits) and
 * re-runs. Layout effect, so initial hidden states are set before first paint.
 */
export function useMotion(setup: (env: MotionEnv) => void | (() => void), deps: DependencyList = []) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    // STACK is a comma list, so it can't simply be AND-ed with the motion
    // query; check both separately instead.
    mm.add({ stack: STACK, motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      if (!ctx.conditions?.motion) return
      const isMobile = Boolean(ctx.conditions.stack)
      return setup({ isMobile, depth: isMobile ? 0.5 : 1 })
    })
    return () => mm.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
