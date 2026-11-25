import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'

/**
 * A single page-wide SVG thread through every `data-thread` anchor.
 *
 * Performance: the curve lives in page coordinates, so it is only rebuilt when
 * the layout changes (resize / content height), never on scroll. Scrolling just
 * advances the dash — no layout reads, no path rebuilds, no SVG blur filter.
 */
export default function RedString() {
  const svg = useRef<SVGSVGElement>(null)
  const path = useRef<SVGPathElement>(null)
  const glow = useRef<SVGPathElement>(null)
  const reduced = usePrefersReducedMotion()
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (reduced) return
    let length = 0
    let max = 1
    let frame = 0
    let layoutFrame = 0

    const paintProgress = () => {
      frame = 0
      const progress = Math.min(1, Math.max(0, window.scrollY / max))
      const shown = length * Math.max(0.04, progress)
      const dash = `${shown} ${length + 10}`
      path.current?.style.setProperty('stroke-dasharray', dash)
      glow.current?.style.setProperty('stroke-dasharray', dash)
    }

    const layout = () => {
      layoutFrame = 0
      const host = svg.current?.parentElement
      if (!host) return
      const hostTop = host.getBoundingClientRect().top + window.scrollY
      const anchors = Array.from(document.querySelectorAll<HTMLElement>('[data-thread]'))
      setHeight(host.scrollHeight)
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
      if (anchors.length < 2) return
      const pts = anchors.map((el) => {
        const r = el.getBoundingClientRect()
        return { x: r.left + r.width / 2, y: r.top + window.scrollY - hostTop + r.height / 2 }
      })
      let d = `M ${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < pts.length; i += 1) {
        const a = pts[i - 1]
        const b = pts[i]
        const midY = (a.y + b.y) / 2
        d += ` C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`
      }
      path.current?.setAttribute('d', d)
      glow.current?.setAttribute('d', d)
      length = path.current?.getTotalLength() ?? 0
      paintProgress()
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(paintProgress)
    }
    const onLayout = () => {
      if (!layoutFrame) layoutFrame = window.requestAnimationFrame(layout)
    }

    layout()
    // content height changes (images, reveals, open panels) → re-measure once
    const ro = new ResizeObserver(onLayout)
    ro.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onLayout)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      if (layoutFrame) window.cancelAnimationFrame(layoutFrame)
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onLayout)
    }
  }, [reduced])

  if (reduced) return null

  return (
    <svg
      ref={svg}
      className="pointer-events-none absolute left-0 top-0 z-[24] w-full overflow-visible"
      style={{ height: height || '100%' }}
      aria-hidden="true"
    >
      {/* soft halo: a wide translucent stroke instead of a blur filter */}
      <path ref={glow} fill="none" stroke="rgba(255,236,220,.22)" strokeWidth="7" strokeLinecap="round" />
      <path ref={path} fill="none" stroke="#c8372d" strokeWidth="1.6" strokeLinecap="round" opacity="0.88" />
    </svg>
  )
}
