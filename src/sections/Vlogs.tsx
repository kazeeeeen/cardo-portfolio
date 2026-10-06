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
    { x: 87, y: 80, w: 451, parallax: 0.82 },
    { x: 560, y: 190, w: 452, parallax: 1.18 },
    { x: 87, y: 316, w: 451, parallax: 1.0 },
  ],
  b: [
    { x: 272, y: 228, w: 513, parallax: 1.16 },
    { x: 803, y: 78, w: 513, parallax: 0.82 },
    { x: 818, y: 344, w: 513, parallax: 1.0 },
  ],
}

/** A: phones top-left, heading bottom-right. B: heading bottom-left, phones right. */
export function Vlogs({ section, variant }: { section: WorksSection; variant: 'a' | 'b' }) {
  const a = variant === 'a'
  // First word on its own line: YOUTUBE / VLOG EDITS, YOUTUBE / VLOGS.
  const [first, ...rest] = section.label.split(' ')
  const second = rest.join(' ')
  const thumbs = (section.slugs ?? []).map((slug) => asset(section.assetGroup!, slug))

  return (
    <Page id={section.id} label={`youtube vlogs ${variant}`}>
      {thumbs.map((thumb, i) => (
        <Phone
          key={thumb.slug}
          asset={thumb}
          href={section.links?.[i]}
          label={`Watch on YouTube: ${thumb.alt.replace(/ — .*$/, '')}`}
          {...PHONES[variant][i]}
        />
      ))}

      <div data-reveal className={a ? 'text-right stack:order-first' : 'stack:order-first'} style={a ? box(700, 490, 586) : box(80, 518, 375)}>
        <div className={a ? 'text-right leading-none' : 'leading-none'}>
          <Credit>{section.credit ?? ''}</Credit>
        </div>
        {/* B sizes to its widest line so the second line can sit flush right
            under the first: YOUTUBE / ···VLOGS. */}
        <Heading size={104} className={a ? undefined : 'w-fit'} style={{ marginTop: '-0.08em' }}>
          {first}
          {a ? <br /> : null}
          {a ? second : <span className="block text-right">{second}</span>}
        </Heading>
      </div>
      {a ? <RicaMark x={85} y={665} /> : <RicaMark x={90} y={76} />}
    </Page>
  )
}
