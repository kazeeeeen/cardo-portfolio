import { Heading } from '../components/Heading'
import { Page } from '../components/Page'
import { Phone } from '../components/Phone'
import { box } from '../lib/layout'
import { asset } from '../data'
import type { WorksSection } from '../types'

// Measured off the Canva design: one phone centred on top, two below, the
// heading centred under them. Each phone opens its reel on Facebook.
const PHONES = [
  { x: 458, y: 70, w: 450 },
  { x: 228, y: 306, w: 450 },
  { x: 698, y: 306, w: 450 },
]

// SVG page px, fitted so the heading spans ≈ x 274–1117 with its caps
// starting at y ≈ 599, as in the Canva design.
const TITLE_SIZE = 110
const TITLE_Y = 596

export function Films({ section }: { section: WorksSection }) {
  const thumbs = (section.slugs ?? []).map((slug) => asset(section.assetGroup!, slug))
  return (
    <Page id={section.id} label={section.label.toLowerCase()}>
      {PHONES.map((p, i) => (
        <Phone
          key={`${p.x}-${p.y}`}
          asset={thumbs[i]}
          href={section.links?.[i]}
          caption={section.titles?.[i]}
          label={thumbs[i] ? `Watch on Facebook: ${thumbs[i].alt.replace(/ — .*$/, '')}` : undefined}
          {...p}
        />
      ))}
      <div data-reveal className="flex justify-center stack:order-first stack:justify-start" style={box(0, TITLE_Y, 1366)}>
        <Heading size={TITLE_SIZE} className="tracking-[-0.072em] stack:[--fs-scale:1.35]">
          {section.label}
        </Heading>
      </div>
    </Page>
  )
}

