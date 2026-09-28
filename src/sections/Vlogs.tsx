import { Credit } from '../components/Credit'
import { Heading } from '../components/Heading'
import { Page } from '../components/Page'
import { Phone } from '../components/Phone'
import { RicaMark } from '../components/RicaMark'
import { asset } from '../data'
import { box } from '../lib/layout'
import type { WorksSection } from '../types'

// Phone positions per page, in the order of the section's slugs. Each moves at
// its own speed so the arrangement has depth.
const PHONES = {
  a: [
    { x: 87, y: 80, w: 451, parallax: 0.94 },
    { x: 560, y: 190, w: 452, parallax: 1.06 },
    { x: 87, y: 316, w: 451, parallax: 1.0 },
  ],
  b: [
    { x: 272, y: 228, w: 513, parallax: 1.05 },
    { x: 803, y: 78, w: 513, parallax: 0.94 },
    { x: 818, y: 344, w: 513, parallax: 1.0 },
  ],
}

/** A: phones top-left, heading bottom-right. B: heading bottom-left, phones right. */
export function Vlogs({ section, variant }: { section: WorksSection; variant: 'a' | 'b' }) {
  const a = variant === 'a'
  const [first, second] = section.label.split(' ')
  const thumbs = (section.slugs ?? []).map((slug) => asset(section.assetGroup!, slug))

  return (
    <Page id={section.id} label={`youtube vlogs ${variant}`}>
      {thumbs.map((thumb, i) => (
        <Phone key={thumb.slug} asset={thumb} {...PHONES[variant][i]} />
      ))}

      <div data-reveal className={a ? 'text-right stack:order-first' : 'stack:order-first'} style={a ? box(900, 490, 416) : box(80, 518, 375)}>
        <div className={a ? 'text-left leading-none' : 'text-right leading-none'} style={a ? { marginLeft: '9.9%' } : undefined}>
          <Credit>{section.credit ?? ''}</Credit>
        </div>
        <Heading size={104} style={{ marginTop: '-0.08em' }}>
          {first}
          <br />
          {second}
        </Heading>
      </div>
      {a ? <RicaMark x={85} y={665} /> : <RicaMark x={90} y={76} />}
    </Page>
  )
}
