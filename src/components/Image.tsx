import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import clsx from 'clsx'
import type { ImageAsset } from '../types'
import { scheduleRefresh } from '../lib/gsap'
import { publicUrl } from '../lib/url'

interface ImageProps {
  asset: ImageAsset
  className?: string
  imgClassName?: string
  style?: CSSProperties
  /** Above-the-fold image: loads eagerly with high fetch priority. */
  priority?: boolean
  /** Purely decorative: empty alt so screen readers skip it. */
  decorative?: boolean
  /** Fill the positioned parent (object-fit: cover) instead of sizing by ratio. */
  fill?: boolean
  /** object-position for `fill`, matching the SVG's crop. */
  position?: string
  /** Parallax speed (see motion.ts); the image is oversized to cover the travel. */
  parallax?: number
  /** Rendered width, phones included, so the right srcset candidate is picked. */
  sizes?: string
}

const srcSetOf = (a: ImageAsset) =>
  a.srcset
    ? [...a.srcset.map((v) => `${publicUrl(v.src)} ${v.w}w`), `${publicUrl(a.src)} ${a.w}w`].join(', ')
    : undefined

export function Image({
  asset,
  className,
  imgClassName,
  style,
  priority = false,
  decorative = false,
  fill = false,
  position,
  parallax,
  sizes = '100vw',
}: ImageProps) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  // A cached image can finish before React attaches onLoad, so check once.
  useLayoutEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth > 0) setLoaded(true)
  }, [])

  return (
    <span
      className={clsx('img-frame', fill && 'absolute inset-0', className)}
      data-loaded={loaded || undefined}
      data-parallax={parallax}
      data-parallax-cover={parallax !== undefined ? '' : undefined}
      style={{
        ...(!fill && { aspectRatio: `${asset.w} / ${asset.h}` }),
        ['--lqip' as string]: `url("${asset.lqip}")`,
        ...style,
      }}
    >
      <img
        ref={ref}
        src={publicUrl(asset.src)}
        srcSet={srcSetOf(asset)}
        width={asset.w}
        height={asset.h}
        alt={decorative ? '' : asset.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        sizes={sizes}
        className={imgClassName}
        style={position ? { objectPosition: position } : undefined}
        onLoad={() => {
          setLoaded(true)
          scheduleRefresh()
        }}
      />
    </span>
  )
}
