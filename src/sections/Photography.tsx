import { Heading } from '../components/Heading'
import { Image } from '../components/Image'
import { Page } from '../components/Page'
import { RicaMark } from '../components/RicaMark'
import { asset } from '../data'
import { box, fs } from '../lib/layout'
import type { WorksSection } from '../types'
import { sizes } from '../lib/breakpoints'

// Each tile drifts at a slightly different rate so the grid breathes.
const TILE_SPEED = [0.96, 1.04, 1.03, 0.97]

/** Two pages in the original: A has the grid left / heading right, B mirrors it. */
export function Photography({ section, variant }: { section: WorksSection; variant: 'a' | 'b' }) {
  const mirrored = variant === 'b'
  const photos = (section.slugs ?? []).map((slug) => asset(section.assetGroup!, slug))

  return (
    <Page id={section.id} label={`photography ${variant}`}>
      <div
        className="grid grid-cols-2"
        style={{ ...box(mirrored ? 574 : 77, mirrored ? 134 : 112, 737), columnGap: fs(9), rowGap: fs(17) }}
      >
        {photos.map((photo, i) => (
          <div key={photo.slug} data-mask="bottom" data-parallax={TILE_SPEED[i]}>
            <Image asset={photo} sizes={sizes('50vw', '27vw')} />
          </div>
        ))}
      </div>

      <div data-reveal className={mirrored ? 'stack:order-first' : 'text-right stack:order-first stack:text-left'} style={mirrored ? box(77, 135) : box(700, 106, 586)}>
        <Heading size={103}>
          PHOTO
          <br />
          GRAPHY
        </Heading>
      </div>
      {mirrored ? <RicaMark x={95} y={683} /> : <RicaMark x={1228} y={668} />}
    </Page>
  )
}
