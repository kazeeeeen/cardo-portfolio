import type { AssetGroup, AssetManifest, Content, ImageAsset } from '../types'
import manifestJson from './manifest.json'
import contentJson from './content.json'

export const manifest = manifestJson as AssetManifest
export const content = contentJson as Content

/** Look up one image by group + slug. Throws so a typo fails loudly in dev. */
export function asset(group: AssetGroup, slug: string): ImageAsset {
  const found = manifest[group].find((a) => a.slug === slug)
  if (!found) throw new Error(`No asset "${slug}" in group "${group}"`)
  return found
}
