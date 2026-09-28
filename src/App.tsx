import { ProgressBar } from './components/ProgressBar'
import { content } from './data'
import { useLenisRoot } from './hooks/useLenis'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion'
import { useScrollMotion } from './hooks/useScrollMotion'
import { About } from './sections/About'
import { Background } from './sections/Background'
import { Contact } from './sections/Contact'
import { Contents } from './sections/Contents'
import { Education } from './sections/Education'
import { Films } from './sections/Films'
import { Hero } from './sections/Hero'
import { Magazine } from './sections/Magazine'
import { Photography } from './sections/Photography'
import { Posters } from './sections/Posters'
import { Pubmats } from './sections/Pubmats'
import { Skills } from './sections/Skills'
import { Vlogs } from './sections/Vlogs'
import { WorksIntro } from './sections/WorksIntro'
import type { WorksSection } from './types'

// The pubmats pages don't simply alternate in the original: A B B A.
const PUBMATS_LAYOUT: Record<string, 'a' | 'b'> = {
  'pubmats-cassayuran': 'a',
  'pubmats-cassayuran-2': 'b',
  'pubmats-kapilas-bayan': 'b',
  'pubmats-orions': 'a',
}

// Works pages come from content.json in SVG order; a kind that appears twice
// (photography, vlogs) gets layout "a" then its mirrored "b".
function renderWorks(sections: WorksSection[]) {
  const seen: Record<string, number> = {}
  return sections.map((s) => {
    const variant = (seen[s.kind] = (seen[s.kind] ?? 0) + 1) === 1 ? 'a' : 'b'
    switch (s.kind) {
      case 'feature':
        return <Magazine key={s.id} section={s} />
      case 'grid':
        return <Photography key={s.id} section={s} variant={variant} />
      case 'marquee-grid':
        return <Pubmats key={s.id} section={s} variant={PUBMATS_LAYOUT[s.id] ?? 'a'} />
      case 'collage':
        return <Posters key={s.id} section={s} />
      case 'phones':
        return <Vlogs key={s.id} section={s} variant={variant} />
      case 'films':
        return <Films key={s.id} section={s} />
    }
  })
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  useLenisRoot(!reducedMotion)
  useScrollMotion()

  return (
    <>
      <div className="grain-overlay" aria-hidden />
      <ProgressBar />

      <main>
        <Hero />
        <Contents />
        <About />
        <Background />
        <Education />
        <Skills />
        <WorksIntro />
        {renderWorks(content.works.sections)}
        <Contact />
      </main>
    </>
  )
}
