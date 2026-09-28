import { useRef } from 'react'
import { Heading } from '../components/Heading'
import { Image } from '../components/Image'
import { Page } from '../components/Page'
import { RicaMark } from '../components/RicaMark'
import { asset, content } from '../data'
import { useMotion } from '../hooks/useMotion'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { box, fs, mediaBox } from '../lib/layout'
import { sizes } from '../lib/breakpoints'

// Grid cells (0-based, 3 per row) each chip sits in, copied from the
// original's arrangement. Groups not listed simply flow.
const CELLS: Record<string, number[]> = {
  'DESIGN & MULTIMEDIA': [0, 1, 2, 3, 4, 5, 8], // "branding & visual…" sits alone under col 3
  'ADMINISTRATIVE/DATA SKILLS': [0, 1, 3, 4], // two columns
}

export function Skills() {
  const panel = useRef<HTMLDivElement>(null)

  // Chips flip down into place, group by group, as they arrive.
  useMotion(() => {
    const chips = panel.current!.querySelectorAll('[data-chip]')
    gsap.set(chips, { rotateX: -90, transformPerspective: 600, transformOrigin: '50% 0%', opacity: 0 })
    ScrollTrigger.batch(chips, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { rotateX: 0, opacity: 1, duration: 1.3, ease: 'power3.out', stagger: 0.08 }),
    })
  })

  return (
    <Page id="skills" label="technical skills">
      <div className="overflow-hidden" style={mediaBox(877, 0, 489, 768, '3 / 4')}>
        <Image asset={asset('portraits', 'skills-fullbody')} fill position="50% 40%" parallax={0.85} sizes={sizes('100vw', '36vw')} />
      </div>
      <RicaMark x={749} y={66} />

      <div style={box(46, 78)}>
        <Heading size={53}>
          techn<em>ica</em>l s<em>kill</em>s:
        </Heading>
      </div>

      <div ref={panel} className="flex flex-col" style={{ ...box(127, 152), gap: fs(20) }}>
        {content.skills.groups.map((group) => {
          const cells = CELLS[group.label]
          return (
            <section key={group.label} aria-label={group.label.toLowerCase()}>
              <h3 data-reveal className="condensed text-fill-ink uppercase leading-none tracking-[-0.02em]" style={{ fontSize: fs(18.9) }}>
                {group.label}
              </h3>
              <ul
                className="grid items-start"
                style={{
                  gridTemplateColumns: `repeat(3, ${fs(177)})`,
                  columnGap: fs(16),
                  rowGap: fs(14),
                  marginTop: fs(18),
                  marginLeft: fs(3),
                }}
              >
                {group.items.map((item, i) => {
                  const cell = cells?.[i]
                  return (
                    <li
                      key={item}
                      data-chip
                      className="condensed bg-ink font-bold text-white leading-none tracking-[-0.02em] text-balance"
                      style={{
                        fontSize: `max(0.75rem, ${fs(19.3)})`,
                        padding: `${fs(9)} ${fs(9)} ${fs(8)}`,
                        minHeight: fs(35),
                        ...(cell !== undefined && { gridColumn: (cell % 3) + 1, gridRow: Math.floor(cell / 3) + 1 }),
                      }}
                    >
                      {item}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </Page>
  )
}
