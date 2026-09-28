// Shapes of src/data/manifest.json and src/data/content.json.
// Field names match the real files (the manifest uses `w`/`h`, not width/height).

export interface ImageAsset {
  src: string
  slug: string
  alt: string
  w: number
  h: number
  ratio: number
  /** ~20px blurred WebP data URI, shown until the real image loads */
  lqip: string
  /** Smaller variants (scripts/responsive-images.mjs); `src` is the largest. */
  srcset?: { w: number; src: string }[]
}

export type AssetGroup =
  | 'hero'
  | 'portraits'
  | 'works/magazine'
  | 'works/photography'
  | 'works/pubmats/cassayuran'
  | 'works/pubmats/kapilas-bayan'
  | 'works/pubmats/orions'
  | 'works/posters'
  | 'works/vlogs'

export type AssetManifest = Record<AssetGroup, ImageAsset[]>

export interface NavItem {
  label: string
  href: `#${string}`
}

export interface Org {
  name: string
  years: string
  roles: string[]
}

export interface SkillGroup {
  label: string
  items: string[]
}

export type WorksKind = 'feature' | 'grid' | 'marquee-grid' | 'collage' | 'phones' | 'films'

export interface WorksSection {
  id: string
  label: string
  kind: WorksKind
  /** Absent for pages without images yet (documentary/films). */
  assetGroup?: AssetGroup
  marquee?: string
  credit?: string
  note?: string
  link?: string
  /** Which images of the group sit on this page, in SVG order. Absent = all. */
  slugs?: string[]
  /** Pubmats pages: the two rows of the strip, in SVG order. */
  rows?: [string[], string[]]
  /** Films: how many empty phone screens to show until the videos are linked. */
  screens?: number
}

export interface ContactItem {
  label: string
  value: string
  href: string
}

export interface Content {
  meta: {
    name: string
    nickname: string
    title: string
    byline: string
    role: string
    location: string
  }
  nav: NavItem[]
  about: { heading: string; body: string }
  background: { heading: string; orgs: Org[] }
  education: {
    heading: string
    school: string
    years: string
    degree: string
    degreeEnglish: string
    /** The word before the degree in the original ("studies"). */
    studies: string
  }
  skills: { heading: string; groups: SkillGroup[] }
  works: { heading: string; sections: WorksSection[] }
  contact: { heading: string; label: string; items: ContactItem[] }
}
