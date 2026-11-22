import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'

interface Props {
  /** Fixed (page-wide) by default; absolute keeps leaves inside a scene. */
  position?: 'fixed' | 'absolute'
  /** Multiplies fall speed — used on the final day. */
  speed?: number
  /** Override the automatic count. */
  count?: number
  className?: string
}

interface Leaf {
  x: number
  y: number
  vy: number
  size: number
  rot: number
  spin: number
  phase: number
  sway: number
  flipSpeed: number
  kind: 'leaf' | 'lotus' | 'rose'
  color: string
  depth: number
}

const LEAF_GREENS = ['#5e8c3a', '#6f9c45', '#86b157', '#9cc46b', '#4d7a2f']
const LEAF_GOLD = ['#c9a227', '#e0b84a']

function buildLeafPath() {
  // pipal leaf, normalised: base at top (y=-0.5), drip tip at bottom (y=+0.62)
  const p = new Path2D()
  p.moveTo(0, -0.48)
  p.bezierCurveTo(-0.22, -0.5, -0.44, -0.36, -0.44, -0.12)
  p.bezierCurveTo(-0.44, 0.1, -0.24, 0.26, -0.06, 0.4)
  p.quadraticCurveTo(-0.02, 0.48, 0, 0.62)
  p.quadraticCurveTo(0.02, 0.48, 0.06, 0.4)
  p.bezierCurveTo(0.24, 0.26, 0.44, 0.1, 0.44, -0.12)
  p.bezierCurveTo(0.44, -0.36, 0.22, -0.5, 0, -0.48)
  p.closePath()
  return p
}

function make(w: number, h: number, i: number, n: number, spread = true): Leaf {
  const depth = (i + Math.random()) / n
  const r = Math.random()
  const kind: Leaf['kind'] = r < 0.06 ? 'lotus' : r < 0.1 ? 'rose' : 'leaf'
  const color =
    kind === 'lotus' ? '#f2a7b8' : kind === 'rose' ? '#c2263a' : Math.random() < 0.15 ? LEAF_GOLD[i % 2] : LEAF_GREENS[Math.floor(Math.random() * LEAF_GREENS.length)]
  return {
    x: Math.random() * w,
    y: spread ? Math.random() * h - h * 0.1 : -40 - Math.random() * 80,
    vy: 0.35 + depth * 0.7 + Math.random() * 0.2,
    size: (kind === 'leaf' ? 12 : 8) + depth * 14,
    rot: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.02,
    phase: Math.random() * Math.PI * 2,
    sway: 0.4 + Math.random() * 0.9,
    flipSpeed: 0.012 + Math.random() * 0.02,
    kind,
    color,
    depth,
  }
}

/** One canvas of drifting pipal leaves (and the odd lotus / rose petal). */
export default function LeafField({ position = 'fixed', speed = 1, count, className = '' }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const speedRef = useRef(speed)
  speedRef.current = speed

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const leafPath = buildLeafPath()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0

    const resize = () => {
      const box = position === 'fixed' ? { width: window.innerWidth, height: window.innerHeight } : canvas.parentElement!.getBoundingClientRect()
      w = box.width
      h = box.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const mobile = window.innerWidth < 768
    const n = count ?? (reduced ? 4 : mobile ? 13 : 28)
    const leaves = Array.from({ length: n }, (_, i) => make(w, h, i, n))
    leaves.sort((a, b) => a.depth - b.depth)

    let raf = 0
    let last = performance.now()
    let running = true

    const draw = (now: number) => {
      if (!running) return
      // ~60fps cap and time-based motion so slow phones stay smooth
      const dt = Math.min(48, now - last) / 16.67
      last = now
      ctx.clearRect(0, 0, w, h)
      const sp = reduced ? 0.35 : speedRef.current
      for (let i = 0; i < leaves.length; i++) {
        const l = leaves[i]
        l.phase += 0.012 * dt * sp
        l.y += l.vy * dt * sp
        l.x += Math.sin(l.phase) * l.sway * 0.6 * dt * sp
        l.rot += l.spin * dt * sp
        if (l.y > h + 40) {
          leaves[i] = make(w, h, i, n, false)
          continue
        }
        const flip = Math.cos(l.phase * l.flipSpeed * 60)
        const fade = l.y > h * 0.82 ? Math.max(0, 1 - (l.y - h * 0.82) / (h * 0.18)) : 1
        ctx.save()
        ctx.translate(l.x, l.y)
        ctx.rotate(l.rot + Math.sin(l.phase) * 0.5)
        ctx.scale(l.size * (0.25 + 0.75 * Math.abs(flip)), l.size)
        ctx.globalAlpha = (0.55 + l.depth * 0.4) * fade
        ctx.fillStyle = l.color
        if (l.kind === 'leaf') {
          ctx.fill(leafPath)
          ctx.globalAlpha *= 0.55
          ctx.strokeStyle = flip > 0 ? 'rgba(240,248,220,.9)' : 'rgba(40,60,20,.5)'
          ctx.lineWidth = 0.04
          ctx.beginPath()
          ctx.moveTo(0, -0.44)
          ctx.lineTo(0, 0.5)
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.ellipse(0, 0, 0.32, 0.5, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha *= 0.5
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.ellipse(-0.08, -0.12, 0.08, 0.22, 0.3, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        running = false
        cancelAnimationFrame(raf)
      } else if (!running) {
        running = true
        last = performance.now()
        raf = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', resize)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
    }
  }, [position, reduced, count])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none ${position === 'fixed' ? 'fixed' : 'absolute'} inset-0 z-30 ${className}`}
    />
  )
}
