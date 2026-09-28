import { useRef } from 'react'
import { Heading } from '../components/Heading'
import { Image } from '../components/Image'
import { Page } from '../components/Page'
import { asset } from '../data'
import { useMotion } from '../hooks/useMotion'
import { box } from '../lib/layout'
import { pinnedReveal } from '../lib/motion'

// Chapter break: same pinned treatment as the hero.
export function WorksIntro() {
  const title = useRef<HTMLDivElement>(null)

  useMotion((env) => {
    const page = title.current!.closest<HTMLElement>('.page')!
    const image = page.querySelector('.img-frame')!
    pinnedReveal(page, env, (tl) => {
      tl.fromTo(image, { scale: 1 }, { scale: 1.12 }, 0).to(title.current, { yPercent: -35 }, 0)
    })
  })

  return (
    <Page id="works" label="my works" tone="ink" cover>
      <Image asset={asset('portraits', 'works-walking')} fill position="50% 100%" sizes="100vw" />
      <div ref={title} style={box(90, 418)}>
        <Heading size={96} tone="paper">
          my
        </Heading>
        <Heading size={231} tone="paper" style={{ marginTop: '-0.432em', marginLeft: '-0.039em' }} split>
          <em>works</em>
        </Heading>
      </div>
    </Page>
  )
}
