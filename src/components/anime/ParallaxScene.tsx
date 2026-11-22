import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../../lib/gsapSetup'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'

interface Props {
  children: ReactNode
  className?: string
  /** Optional commissioned artwork; SVG layers stay in front as parallax. */
  imageSrc?: string
  alt?: string
  /** Disable the built-in grain overlay. */
  noGrain?: boolean
}

/**
 * A scene stage. Descendants marked `data-depth="0.2"` drift at that rate as
 * the scene crosses the viewport. Reduced motion renders them statically.
 */
export default function ParallaxScene({ children, className = '', imageSrc, alt, noGrain = false }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || !root.current) return
    const ctx = gsap.context(() => {
      const layers = gsap.utils.toArray<HTMLElement>('[data-depth]', root.current)
      layers.forEach((layer) => {
        const depth = Number(layer.dataset.depth ?? 0)
        if (!depth) return
        gsap.fromTo(
          layer,
          { yPercent: -depth * 8 },
          {
            yPercent: depth * 8,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <div ref={root} className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden={!alt}>
      {imageSrc && <img src={imageSrc} alt={alt ?? ''} className="absolute inset-0 h-full w-full object-cover" />}
      {children}
      {!noGrain && <div className="scene-grain" aria-hidden="true" />}
      <div className="pointer-events-none absolute inset-0 z-[10]" aria-hidden="true" />
    </div>
  )
}
