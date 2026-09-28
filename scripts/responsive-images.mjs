// Generates smaller WebP variants next to each large image in public/assets
// and records them in src/data/manifest.json as `srcset`, so phones and small
// tiles stop downloading full-size files. Re-run after adding or replacing
// images:  npm run images
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = fileURLToPath(new URL('..', import.meta.url)) // decodes the space in the path
const MANIFEST = `${ROOT}src/data/manifest.json`
const WIDTHS = [480, 960, 1440]
const QUALITY = 78

const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
let made = 0

for (const assets of Object.values(manifest)) {
  for (const a of assets) {
    const source = `${ROOT}public${a.src}`
    // Only widths meaningfully smaller than the original; the original stays
    // the largest candidate.
    const widths = WIDTHS.filter((w) => w < a.w * 0.85)
    const srcset = []
    for (const w of widths) {
      const src = a.src.replace(/\.webp$/, `-${w}.webp`)
      const out = `${ROOT}public${src}`
      if (!existsSync(out) || statSync(out).mtimeMs < statSync(source).mtimeMs) {
        await sharp(source).resize({ width: w }).webp({ quality: QUALITY }).toFile(out)
        made++
      }
      srcset.push({ w, src })
    }
    if (srcset.length) a.srcset = srcset
    else delete a.srcset
  }
}

writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n')
console.log(`variants written: ${made}`)
