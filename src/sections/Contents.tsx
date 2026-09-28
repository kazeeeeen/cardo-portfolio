import { Heading } from '../components/Heading'
import { Page } from '../components/Page'
import { RicaMark } from '../components/RicaMark'
import { Image } from '../components/Image'
import { asset, content } from '../data'
import { useScrollTo } from '../hooks/useScrollTo'
import { box, fs, mediaBox } from '../lib/layout'
import { sizes } from '../lib/breakpoints'

// The contents page is the site's navigation, as in the original.
export function Contents() {
  const scrollTo = useScrollTo()

  return (
    <Page id="contents" label="table of contents">
      <div className="overflow-hidden" style={mediaBox(0, 0, 659, 768, '4 / 5')}>
        <Image asset={asset('hero', 'gate-mirror-night')} fill position="1% 50%" sizes={sizes('100vw', '50vw')} />
      </div>
      <RicaMark x={697} y={52} />

      <div className="text-right" style={box(760, 112, 478)}>
        <Heading size={71}>table of</Heading>
        <Heading size={154} style={{ marginTop: "-0.3em" }}>
          c<em>o</em>nt<em>e</em>nt<em>s</em>
        </Heading>
      </div>

      <nav aria-label="Sections" style={box(746, 500)}>
        <ul className="leading-[0.74] tracking-[-0.03em] stack:leading-[1.6]" style={{ fontSize: fs(37.9) }}>
          {content.nav.map((item) => (
            <li key={item.href} data-reveal>
              <a
                href={item.href}
                className="transition-colors hover:text-accent"
                onClick={(e) => {
                  e.preventDefault()
                  scrollTo(item.href)
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Page>
  )
}
