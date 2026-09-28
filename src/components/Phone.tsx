import type { ImageAsset } from '../types'
import { box, fs } from '../lib/layout'
import { Image } from './Image'

interface PhoneProps {
  /** Thumbnail on the screen; omit for an empty screen (video not linked yet). */
  asset?: ImageAsset
  /** Outer box in SVG page pixels; height follows the phone's proportion. */
  x: number
  y: number
  w: number
  parallax?: number
}

// A landscape phone drawn in CSS, proportioned off the original: black bezel
// with a thin silver rim, white screen, the pill cutout on the left, and the
// thumbnail letterboxed right of centre.
export function Phone({ asset, x, y, w, parallax }: PhoneProps) {
  const h = w * 0.481
  return (
    // Outer box: position + parallax drift. Inner body: the phone itself, which
    // tilts up into place on scroll (data-reveal="tilt"), so the two motions
    // never fight over the same transform.
    <div style={{ ...box(x, y, w, h), aspectRatio: `${w} / ${h}` }} data-parallax={parallax}>
      <div
        className="absolute inset-0 bg-white"
        style={{
          borderRadius: fs(w * 0.1),
          border: `${fs(w * 0.011)} solid var(--color-ink)`,
          boxShadow: `0 0 0 ${fs(Math.max(2, w * 0.006))} var(--color-gray-300)`,
        }}
        data-reveal="tilt"
      >
        <span
          aria-hidden
          className="absolute rounded-full bg-ink"
          style={{ left: '2.6%', top: '50%', translate: '0 -50%', width: '4.4%', height: '29%' }}
        />
        <div className="absolute" style={{ left: '15.4%', top: '50%', translate: '0 -50%', width: '68.7%' }}>
          {asset ? (
            <Image asset={asset} sizes="23vw" />
          ) : (
            <div aria-hidden className="flex aspect-video items-center justify-center bg-gray-900">
              {/* A quiet play mark until the video is linked. */}
              <span
                className="block bg-gray-600"
                style={{ width: '9%', aspectRatio: '0.87', clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
