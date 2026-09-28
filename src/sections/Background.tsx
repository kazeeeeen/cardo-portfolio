import { Heading } from '../components/Heading'
import { Image } from '../components/Image'
import { Page } from '../components/Page'
import { RicaMark } from '../components/RicaMark'
import { asset, content } from '../data'
import { box, fs, mediaBox } from '../lib/layout'
import type { Org } from '../types'
import { sizes } from '../lib/breakpoints'

// The original splits the orgs 2 / 3 across two columns, each with a large
// black star centred on the block.
const COLUMNS = [
  { x: 518, y: 160, orgs: content.background.orgs.slice(0, 2) },
  { x: 912, y: 162, orgs: content.background.orgs.slice(2) },
]

function OrgBlock({ org }: { org: Org }) {
  return (
    <li className="flex items-center" data-mask="bottom">
      <span aria-hidden className="w-[1.32em] shrink-0 text-[1.75em] leading-none">
        ★
      </span>
      <div>
        <p className="font-bold">
          {org.name} ({org.years})
        </p>
        <ul>
          {org.roles.map((role) => (
            <li key={role}>▪ {role}</li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export function Background() {
  return (
    <Page id="background" label="background">
      <div className="overflow-hidden" style={mediaBox(0, 0, 464, 768, '4 / 5')}>
        <Image asset={asset('portraits', 'background-wall')} fill position="61% 50%" parallax={0.85} sizes={sizes('100vw', '34vw')} />
      </div>
      <RicaMark x={517} y={50} />

      {COLUMNS.map((col) => (
        <ul
          key={col.x}
          className="condensed flex flex-col gap-[1.05em] leading-[0.9] tracking-[-0.02em]"
          style={{ ...box(col.x, col.y), fontSize: `max(0.875rem, ${fs(23.7)})` }}
        >
          {col.orgs.map((org) => (
            <OrgBlock key={org.name} org={org} />
          ))}
        </ul>
      ))}

      <div style={box(515, 558)} data-parallax="1.15">
        <Heading size={133} split>
          back<em>gr</em>ou<em>n</em>d
        </Heading>
      </div>
    </Page>
  )
}
