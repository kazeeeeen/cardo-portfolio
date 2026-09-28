import { Heading } from '../components/Heading'
import { Image } from '../components/Image'
import { Page } from '../components/Page'
import { RicaMark } from '../components/RicaMark'
import { asset, content } from '../data'
import { box, fs, mediaBox } from '../lib/layout'

// Minimal and generous, like the original: a centred heading, two small lines
// far below it, then a full-bleed band of the portrait.
export function Education() {
  const e = content.education
  return (
    <Page id="education" label="education">
      <RicaMark x={77} y={66} />
      <div className="flex justify-center" style={box(0, 106, 1366)}>
        <Heading size={134} split>
          e<em>d</em>uc<em>a</em>ti<em>on</em>
        </Heading>
      </div>

      <div
        data-reveal
        className="condensed text-center leading-[0.95] tracking-[-0.02em]"
        style={{ ...box(0, 340, 1366), fontSize: `max(0.875rem, ${fs(22.7)})` }}
      >
        <p>
          <b className="font-bold">{e.school}</b> ({e.years})
        </p>
        <p>
          {e.studies} <b className="font-bold">{e.degree}&nbsp;&nbsp;/</b> {e.degreeEnglish}
        </p>
      </div>

      <div className="overflow-hidden" style={mediaBox(0, 515, 1366, 253, '16 / 9')}>
        <Image asset={asset('portraits', 'education-bushes')} fill position="50% 79%" parallax={0.6} sizes="100vw" />
      </div>
    </Page>
  )
}
