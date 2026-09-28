import { Credit } from '../components/Credit'
import { Heading } from '../components/Heading'
import { Image } from '../components/Image'
import { Page } from '../components/Page'
import { RicaMark } from '../components/RicaMark'
import { asset } from '../data'
import { box, fs } from '../lib/layout'
import type { WorksSection } from '../types'
import { sizes } from '../lib/breakpoints'

// The cover image already carries the Heyzine flipbook chrome and its shadow,
// so it sits straight and unframed, as in the original.
export function Magazine({ section }: { section: WorksSection }) {
  const cover = (
    <Image asset={asset('works/magazine', 'magazine-cover')} sizes={sizes('90vw', '31vw')} />
  )

  return (
    <Page id={section.id} label={section.label.toLowerCase()}>
      <div style={box(238, 115, 419)} data-mask="left">
        {section.link ? (
          <a href={section.link} target="_blank" rel="noreferrer" aria-label={`Open the ${section.credit ?? ''} flipbook`}>
            {cover}
          </a>
        ) : (
          // TODO: add the Heyzine flipbook URL to content.json → works.sections[0].link
          cover
        )}
      </div>
      <p className="condensed stack:hidden" style={{ ...box(682, 643), fontSize: fs(17) }}>
        &lt;&lt;&lt; click here
      </p>
      <div className="stack:order-first" style={box(883, 125)} data-reveal>
        <Heading size={105}>{section.label}</Heading>
        {section.credit && <Credit style={{ marginTop: '0.3em', marginLeft: '0.3%' }}>{section.credit}</Credit>}
      </div>
      <RicaMark x={77} y={680} />
    </Page>
  )
}
