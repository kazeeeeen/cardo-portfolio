// The site has two layouts:
//   spread — the original's 16:9 pages (landscape screens from 768px, and any
//            screen from 1200px)
//   stack  — one column (phones, and upright tablets, where a 16:9 page would
//            be a thin strip with tiny type)
// Keep these in sync with the `stack` / `spread` variants and the two @media
// blocks in index.css (CSS can't import from here).
export const STACK_PARTS = ['(max-width: 767.98px)', '(orientation: portrait) and (max-width: 1199.98px)'] as const
export const STACK = STACK_PARTS.join(', ')
export const SPREAD = '(min-width: 768px) and (orientation: landscape), (min-width: 1200px)'

/** An <img sizes> value: `stackWidth` in the one-column layout, else `spreadWidth`. */
export const sizes = (stackWidth: string, spreadWidth: string) =>
  [...STACK_PARTS.map((q) => `${q} ${stackWidth}`), spreadWidth].join(', ')
