import { Heading } from '../components/Heading'
import { Image } from '../components/Image'
import { Page } from '../components/Page'
import { asset } from '../data'
import { box, fs } from '../lib/layout'
import type { WorksSection } from '../types'
import { sizes } from '../lib/breakpoints'

// The original's two rows, left to right. Both bleed off the page edges.
const ROWS = [
  { y: 60, x: -20, w: 224, slugs: ['cosmic', 'sukit-sukit', 'hulagway-sang-nayon', 'nokia-7250', 'pandamay-na-pandemya', 'happy-together'] },
  { y: 390, x: 0, w: 237, slugs: ['in-the-mood', 'green-portrait', 'chungking-express', 'look-mom-its-keeho', 'wake-up', 'japanese-portrait'] },
]
const H = 318 // SVG px; widths keep a poster proportion, landscape files crop to it
const GAP = 14
// The landscape "happy together" file is cropped to its left edge in the original.
const POSITION: Record<string, string> = { 'happy-together': '0% 50%' }

export function Posters({ section }: { section: WorksSection }) {
  return (
    <Page id={section.id} label="posters">
      {ROWS.map((row) => (
        <div key={row.y} className="poster-row flex" style={{ ...box(row.x, row.y), gap: fs(GAP) }}>
          {row.slugs.map((slug) => (
            <div key={slug} data-reveal className="poster-tile relative shrink-0" style={{ width: fs(row.w), height: fs(H) }}>
              <Image asset={asset(section.assetGroup!, slug)} fill position={POSITION[slug]} sizes={sizes('50vw', '17vw')} />
            </div>
          ))}
        </div>
      ))}

      {/* White over the artwork, as in the original. A gradient-clipped fill
          can't carry a real shadow, so desktop uses flat white with a close
          dark halo (legible over bright posters) plus the original's wide glow.
          Phones: above the grid, in ink. */}
      <div className="pointer-events-none flex justify-center stack:order-first stack:justify-start" style={box(0, 336, 1366)}>
        <Heading
          size={101}
          tone="paper"
         
          split
          className="stack:text-fill-ink spread:bg-none spread:text-white spread:[text-shadow:0_0_2px_rgb(0_0_0/0.75),0_0_8px_rgb(0_0_0/0.5),0_0_30px_rgb(0_0_0/0.4)]"
        >
          {section.label}
        </Heading>
      </div>
    </Page>
  )
}
