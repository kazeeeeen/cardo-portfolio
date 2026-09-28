import { useRef } from 'react'
import { Heading } from '../components/Heading'
import { Image } from '../components/Image'
import { Page } from '../components/Page'
import { RicaMark } from '../components/RicaMark'
import { asset, content } from '../data'
import { useMotion } from '../hooks/useMotion'
import { gsap } from '../lib/gsap'
import { box, fs, mediaBox } from '../lib/layout'

const NAME = content.meta.name.toUpperCase()
const NICK = content.meta.nickname

// The original sets a gray highlight behind "RICARDO JOSE GAGNO but you can
// call me rica", with the two names in bold. Split the body copy around it.
function splitBody(body: string) {
  const start = body.indexOf(NAME)
  const endToken = `call me ${NICK}`
  const end = body.indexOf(endToken) + endToken.length
  if (start < 0 || end < endToken.length) return null
  const middle = body.slice(start + NAME.length, end - NICK.length)
  return { before: body.slice(0, start), middle, after: body.slice(end) }
}

export function About() {
  const mark = useRef<HTMLElement>(null)
  const parts = splitBody(content.about.body)

  // The highlight wipes in left-to-right when the paragraph arrives.
  useMotion(() => {
    if (!mark.current) return
    gsap.fromTo(
      mark.current,
      { '--wipe': '0%' },
      {
        '--wipe': '100%',
        duration: 1.6,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: mark.current, start: 'top 85%', once: true },
      },
    )
  })

  return (
    <Page id="about" label="about me">
      {/* Photo and heading share a box so the heading stays on the photo on phones. */}
      <div className="overflow-hidden" style={mediaBox(0, 0, 1366, 467, '4 / 3')}>
        <Image asset={asset('portraits', 'about-crawl')} fill position="50% 30%" parallax={0.6} sizes="100vw" />
        <div className="absolute" style={{ left: '6.15%', top: `${(283 / 467) * 100}%` }}>
          <Heading size={132} tone="paper" split>
            a<em>bo</em>u<em>t</em> m<em>e</em>
          </Heading>
        </div>
      </div>
      <RicaMark x={77} y={38} tone="white" />

      <p
        data-reveal
        className="text-right leading-[1.0] tracking-[-0.035em] whitespace-pre-wrap"
        style={{ ...box(292, 544, 1036), fontSize: `max(0.9375rem, ${fs(32)})` }}
      >
        {parts ? (
          <>
            {parts.before}
            <mark ref={mark} className="highlight">
              <b className="font-bold">{NAME}</b>
              {parts.middle}
              <b className="font-bold">{NICK}</b>
            </mark>
            {parts.after}
          </>
        ) : (
          content.about.body
        )}
      </p>
    </Page>
  )
}
