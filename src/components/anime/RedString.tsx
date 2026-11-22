import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'

/**
 * A single page-wide SVG thread. Any element with `data-thread` becomes an
 * anchor; the line is re-drawn as the page scrolls and reveals with progress.
 */
export default function RedString() {
  const path = useRef<SVGPathElement>(null)
  const outline = useRef<SVGPathElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    let frame = 0

    const draw = () => {
      frame = 0
      const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-thread]'))
      if (anchors.length < 2) return
      const points = anchors.map((el) => {
        const r = el.getBoundingClientRect()
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      })
      let d = `M ${points[0].x} ${points[0].y}`
      for (let i = 1; i < points.length; i += 1) {
        const prev = points[i - 1]
        const curr = points[i]
        const midY = (prev.y + curr.y) / 2
        d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`
      }
      path.current?.setAttribute('d', d)
      outline.current?.setAttribute('d', d)

      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 1
      const length = path.current?.getTotalLength() ?? 0
      const shown = length * Math.max(0.04, progress)
      path.current?.style.setProperty('stroke-dasharray', `${shown} ${length + 10}`)
      outline.current?.style.setProperty('stroke-dasharray', `${shown} ${length + 10}`)
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-[24] h-screen w-screen overflow-visible"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id="thread-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path ref={outline} fill="none" stroke="rgba(255,236,220,.28)" strokeWidth="5" filter="url(#thread-glow)" />
      <path ref={path} fill="none" stroke="#c8372d" strokeWidth="1.6" strokeLinecap="round" opacity="0.88" />
    </svg>
  )
}
