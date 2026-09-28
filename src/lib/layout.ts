// The original is a stack of 1366×768 pages. These helpers take numbers
// measured straight off the SVG and turn them into page-relative CSS, so a
// layout reads like the source: box(517, 62, 400, 120).
//
// The stack layout (phones, upright tablets — see breakpoints.ts) doesn't get
// the 16:9 page: every box() carries a `--bx` marker, and index.css drops those
// boxes back into normal flow there, so each page restacks as a single column
// in DOM order.
import type { CSSProperties } from 'react'

export const PAGE_W = 1366
export const PAGE_H = 768

const pctX = (px: number) => `${(px / PAGE_W) * 100}%`
const pctY = (px: number) => `${(px / PAGE_H) * 100}%`

/** Absolute box in SVG page pixels (desktop). Omit w/h to size by content. */
export function box(x: number, y: number, w?: number, h?: number): CSSProperties {
  return {
    ['--bx' as string]: 1,
    position: 'absolute',
    left: pctX(x),
    top: pctY(y),
    ...(w !== undefined && { width: pctX(w) }),
    ...(h !== undefined && { height: pctY(h) }),
  }
}

/**
 * A box holding a `fill` image. On phones it becomes a full-bleed band with
 * the given aspect ratio, since its desktop height comes from the page.
 */
export function mediaBox(x: number, y: number, w: number, h: number, phoneAspect: string): CSSProperties {
  return { ...box(x, y, w, h), ['--m-aspect' as string]: phoneAspect }
}

/**
 * Font size in SVG page pixels, scaled with the viewport width. On phones
 * --fs-scale (index.css) enlarges it so type stays readable; a single element
 * can override the scale inline.
 */
export const fs = (px: number) => `calc(${(px / PAGE_W) * 100}vw * var(--fs-scale, 1))`
