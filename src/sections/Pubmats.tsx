import { useState } from 'react'
import { Credit } from '../components/Credit'
import { Heading } from '../components/Heading'
import { Image } from '../components/Image'
import { Lightbox } from '../components/Lightbox'
import { Page } from '../components/Page'
import { RicaMark } from '../components/RicaMark'
import { asset } from '../data'
import { box, fs } from '../lib/layout'
import type { ImageAsset, WorksSection } from '../types'
import { sizes } from '../lib/breakpoints'

const ROW_H = 250 // SVG px
// Credit chip top, relative to the strip box (SVG px), fitted so the gap
// between the chip and the letters matches the Canva design.
const CHIP_TOP = -2.4
const GAP = 9
// Tile width: 250/1366 of the viewport on desktop, ×1.75 (--fs-scale) on phones.
const TILE_SIZES = sizes('32vw', '19vw')

// Where the first pubmat of each row starts in the original (they bleed off
// the left edge by different amounts).
const ROW_START: Record<string, [number, number]> = {
  'pubmats-cassayuran': [-18, -102],
  'pubmats-cassayuran-2': [-105, -22],
  'pubmats-kapilas-bayan': [0, -105],
  'pubmats-orions': [-48, -118],
}

function Row({
  items,
  y,
  start,
  drift,
  offset,
  onOpen,
}: {
  items: ImageAsset[]
  y: number
  start: number
  drift: 1 | -1
  offset: number
  onOpen: (i: number) => void
}) {
  // The drift slides a row sideways, so pad each end with a copy of the
  // neighbouring pubmat (hidden from AT, not focusable) to keep the edges full.
  const lead = items[items.length - 1]
  const tail = items[0]
  const leadW = ROW_H * lead.ratio + GAP
  const tile = (a: ImageAsset) => ({ height: fs(ROW_H), width: fs(ROW_H * a.ratio) })

  // On phones the row is a swipeable strip instead (drift off, pads hidden).
  return (
    <div className="pub-row" style={box(start - leadW, y)} data-reveal>
      <div className="flex w-max" style={{ gap: fs(GAP) }} data-drift={drift}>
        <Image asset={lead} decorative className="shrink-0 stack:hidden" style={tile(lead)} sizes={TILE_SIZES} />
        {items.map((a, i) => (
          <button
            key={a.slug}
            type="button"
            className="shrink-0 cursor-zoom-in snap-start"
            style={tile(a)}
            aria-label={`View larger: ${a.alt}`}
            onClick={() => onOpen(offset + i)}
          >
            <Image asset={a} className="h-full w-full" sizes={TILE_SIZES} />
          </button>
        ))}
        <Image asset={tail} decorative className="shrink-0 stack:hidden" style={tile(tail)} sizes={TILE_SIZES} />
      </div>
    </div>
  )
}

/**
 * Two layouts alternate in the original. "a": the PUBMATS strip bleeds off the
 * left and stops short of RICA. on the right, credit over its right end. "b":
 * the strip starts mid-page and bleeds off the right, credit over its left end.
 * The strip is a clipped window onto the velocity marquee, so the composition
 * holds while the words run; the credit stays put above it.
 */
export function Pubmats({ section, variant }: { section: WorksSection; variant: 'a' | 'b' }) {
  const a = variant === 'a'
  const words = section.marquee ?? section.label
  const group = section.assetGroup!
  const [top, bottom] = (section.rows ?? [[], []]).map((row) => row.map((slug) => asset(group, slug)))
  const all = [...top, ...bottom]
  const [starts0, starts1] = ROW_START[section.id] ?? [0, 0]
  const [open, setOpen] = useState<number | null>(null)

  return (
    <Page id={section.id} label={section.id.replace(/-/g, ' ')}>
      <Row items={top} y={56} start={starts0} drift={1} offset={0} onOpen={setOpen} />
      <Row items={bottom} y={316} start={starts1} drift={-1} offset={top.length} onOpen={setOpen} />

      <div style={a ? box(0, 596, 1040) : box(300, 596, 1066)} data-reveal>
        {/* Sits clear above the letters, as in the Canva design. */}
        <Credit
          wide
          style={{ position: 'absolute', top: fs(CHIP_TOP), zIndex: 1, ...(a ? { right: '0.3%' } : { left: '0.2%' }) }}
        >
          {section.credit ?? ''}
        </Credit>
        {/* "a" starts with the words ending flush right (cut off on the left).
            Clipped sideways only (overflow-x: clip), so round letter bottoms
            are never cut on any screen size. */}
        <div
          className={a ? 'flex justify-end overflow-x-clip pt-[0.3em]' : 'overflow-x-clip pt-[0.3em]'}
          data-marquee={a ? 'right' : 'left'}
          data-marquee-align={a ? 'end' : undefined}
        >
          <span className="sr-only">{section.label}</span>
          {/* Two identical halves so the loop wraps seamlessly. */}
          <div className="flex w-max" data-marquee-track aria-hidden>
            {[0, 1].map((half) => (
              <Heading
                key={half}
                size={105}
                as="p"
                className="pr-[0.26em] [word-spacing:0.14em]"
                // The strip clips its overflow, so keep the room under the
                // baseline (the heading's negative margin would let round S/P/B
                // bottoms get cut). Flat ink: a per-copy gradient would jump
                // from black back to gray where the copies meet.
                style={{ marginBottom: 0, backgroundImage: 'none', color: 'var(--color-ink)' }}
              >
                {words} {words}
              </Heading>
            ))}
          </div>
        </div>
      </div>

      {a ? <RicaMark x={1245} y={697} /> : <RicaMark x={83} y={683} />}

      <Lightbox
        items={all}
        index={open}
        onIndex={setOpen}
        onClose={() => setOpen(null)}
        label={`${section.credit?.toLowerCase() ?? ''} pubmats`}
      />
    </Page>
  )
}
