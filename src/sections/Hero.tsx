import { useRef } from 'react'
import { Heading } from '../components/Heading'
import { Image } from '../components/Image'
import { Page } from '../components/Page'
import { asset, content } from '../data'
import { useMotion } from '../hooks/useMotion'
import { box, fs } from '../lib/layout'
import { pinnedReveal } from '../lib/motion'

// SVG page pixels, fitted so the title's ink spans x 223–1157, y 253–567 as in
// the original.
const TITLE_SIZE = 338
const TITLE_X = 205
const TITLE_Y = 228
const BYLINE_SIZE = 37.3
const BYLINE_X = 1053
const BYLINE_Y = 510

export function Hero() {
  const title = useRef<HTMLDivElement>(null)

  // Pinned for ~80vh: the portrait pushes in while the title lifts away faster.
  useMotion((env) => {
    const page = title.current!.closest<HTMLElement>('.page')!
    const portrait = page.querySelector('.img-frame')!
    pinnedReveal(page, env, (tl) => {
      tl.fromTo(portrait, { scale: 1 }, { scale: 1.12 }, 0).to(title.current, { yPercent: -45 }, 0)
    })
  })

  return (
    <Page id="hero" label="portfolio" tone="ink" cover>
      {/* Same aspect as the page on desktop (no crop); on phones this keeps the face in frame. */}
      <Image asset={asset('hero', 'hero-portrait')} fill priority position="62% 40%" sizes="100vw" />
      {/* The cover title: Helvetica Condensed Bold, near-solid white, with
          "o" and "folio" in italic, measured off the original. */}
      <div ref={title} style={box(TITLE_X, TITLE_Y)}>
        <Heading
          as="h1"
          size={TITLE_SIZE}
          tone="paper"
          split="now"
          className="tracking-[-0.062em]"
          style={{
            fontWeight: 700,
            fontStretch: '75%',
            backgroundImage: 'linear-gradient(100deg, #ffffff 0%, #f4f4f4 60%, #ececec 100%)',
          }}
        >
          p<em>o</em>rt<em>folio</em>
        </Heading>
        {/* Inside the title box so it lifts with the title; placed at the
            original's coordinates on the 16:9 page, tucked under the title on phones. */}
        <p
          className="absolute whitespace-nowrap text-white spread:top-(--by-t) spread:left-(--by-l) stack:top-[96%] stack:right-[1.5%]"
          style={{
            fontSize: fs(BYLINE_SIZE),
            ['--by-l' as string]: fs(BYLINE_X - TITLE_X),
            ['--by-t' as string]: fs(BYLINE_Y - TITLE_Y),
          }}
        >
          {content.meta.byline}
        </p>
      </div>
    </Page>
  )
}
