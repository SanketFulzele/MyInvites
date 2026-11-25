import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'

interface PetalFieldProps {
  density?: number
  wind?: number
  tint?: string[]
  blend?: GlobalCompositeOperation
  className?: string
  /** Fixed (page-wide) by default; absolute petals stay inside their scene. */
  position?: 'fixed' | 'absolute'
}

type ShapeIndex = 0 | 1 | 2 | 3

interface Petal {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  spin: number
  phase: number
  sway: number
  flip: number
  shape: ShapeIndex
  depth: number
  light: string
  deep: string
  vein: string
}

const DEFAULT_TINT = ['#f7d9e1', '#f4c2ce', '#e9afc0', '#fff9f2', '#ffd8c2']
const MAX_DESKTOP = 60
const MAX_MOBILE = 16

/** Blend a hex/tint colour towards another hex colour without pulling in a colour library. */
function shade(color: string, toward: string, amount: number): string {
  const rgb = (value: string): [number, number, number] | null => {
    const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim())
    if (!match) return null
    const hex = match[1].length === 3 ? match[1].split('').map((c) => c + c).join('') : match[1]
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)]
  }
  const a = rgb(color)
  const b = rgb(toward)
  if (!a || !b) return color
  const mixed = a.map((v, i) => Math.round(v + (b[i] - v) * amount))
  return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`
}

/** Four hand-drawn, normalised petal silhouettes (base at +y, tip at -y). */
function buildShapes(): Path2D[] {
  const notched = new Path2D()
  notched.moveTo(0, 0.55)
  notched.bezierCurveTo(-0.5, 0.3, -0.62, -0.26, -0.16, -0.5)
  notched.quadraticCurveTo(-0.05, -0.4, 0, -0.22)
  notched.quadraticCurveTo(0.05, -0.4, 0.16, -0.5)
  notched.bezierCurveTo(0.62, -0.26, 0.5, 0.3, 0, 0.55)
  notched.closePath()

  const curled = new Path2D()
  curled.moveTo(0, 0.52)
  curled.bezierCurveTo(-0.46, 0.24, -0.58, -0.3, -0.2, -0.48)
  curled.bezierCurveTo(0.02, -0.58, 0.34, -0.5, 0.44, -0.3)
  curled.bezierCurveTo(0.5, -0.16, 0.34, -0.08, 0.24, -0.18)
  curled.bezierCurveTo(0.4, 0.02, 0.22, 0.36, 0, 0.52)
  curled.closePath()

  const folded = new Path2D()
  folded.moveTo(0, 0.5)
  folded.bezierCurveTo(-0.3, 0.18, -0.36, -0.3, -0.06, -0.46)
  folded.lineTo(0.1, -0.18)
  folded.bezierCurveTo(0.3, -0.34, 0.34, 0.1, 0, 0.5)
  folded.closePath()

  const side = new Path2D()
  side.moveTo(0, 0.5)
  side.bezierCurveTo(0.18, 0.18, 0.16, -0.22, 0.02, -0.5)
  side.bezierCurveTo(-0.12, -0.2, -0.14, 0.2, 0, 0.5)
  side.closePath()

  return [notched, curled, folded, side]
}

function makePetal(width: number, height: number, index: number, count: number, palette: string[]): Petal {
  const depth = (index + Math.random()) / count
  const base = palette[Math.floor(Math.random() * palette.length)] ?? DEFAULT_TINT[0]
  return {
    x: Math.random() * width,
    y: Math.random() * (height + 220) - 110,
    vx: (Math.random() - 0.5) * 0.28,
    vy: 0.22 + depth * 0.62 + Math.random() * 0.18,
    size: 3.2 + depth * 9.5 + Math.random() * 2,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.036,
    phase: Math.random() * Math.PI * 2,
    sway: 0.22 + Math.random() * 0.6,
    flip: 0.7 + Math.random() * 1.9,
    shape: Math.floor(Math.random() * 4) as ShapeIndex,
    depth,
    light: shade(base, '#ffffff', 0.48),
    deep: shade(base, '#a85068', 0.3),
    vein: shade(base, '#ffffff', 0.82),
  }
}

/**
 * Each petal look (shape × colour × near/far) is painted ONCE into a small
 * sprite canvas — gradient, vein and the near-layer soft focus baked in.
 * Every frame then only stamps sprites with drawImage: no per-frame
 * gradients, no canvas filters (which are very slow on phones).
 */
const SPRITE = 64
const spriteCache = new Map<string, HTMLCanvasElement>()

function petalSprite(shape: Path2D, shapeIndex: number, petal: Petal, near: boolean) {
  const key = `${shapeIndex}|${petal.light}|${petal.deep}|${petal.vein}|${near ? 1 : 0}`
  const hit = spriteCache.get(key)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = SPRITE
  c.height = SPRITE
  const g = c.getContext('2d')
  if (!g) return c
  const s = SPRITE * (near ? 0.78 : 0.86)
  g.translate(SPRITE / 2, SPRITE / 2)
  g.scale(s, s)
  // soft focus for the near layer, applied once here (ignored where unsupported)
  if (near && 'filter' in g) g.filter = 'blur(1.4px)'
  const gradient = g.createLinearGradient(-0.4, -0.5, 0.4, 0.5)
  gradient.addColorStop(0, petal.light)
  gradient.addColorStop(1, petal.deep)
  g.fillStyle = gradient
  g.fill(shape)
  g.strokeStyle = petal.vein
  g.globalAlpha = 0.7
  g.lineWidth = 0.03
  g.beginPath()
  g.moveTo(0, 0.42)
  g.quadraticCurveTo(0.06, 0.02, 0, -0.3)
  if (shapeIndex === 2) {
    g.moveTo(0.02, 0.28)
    g.lineTo(0.12, -0.14)
  }
  g.stroke()
  spriteCache.set(key, c)
  return c
}

/**
 * A single-canvas falling-petal field. Depth is stratified so the far layer is
 * tiny and slow while the near layer is larger and faster. Pauses when the
 * canvas is off-screen or the tab is hidden.
 */
export default function PetalField({
  density,
  wind = 1,
  tint,
  blend = 'source-over',
  className = '',
  position = 'fixed',
}: PetalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()
  const tintKey = tint?.join(',') ?? ''

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const shapes = buildShapes()
    const palette = tintKey ? tintKey.split(',') : DEFAULT_TINT
    let width = window.innerWidth
    let height = window.innerHeight
    // 1.5× is visually identical for soft petals and ~44% fewer pixels than 2×
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      const bounds = position === 'absolute' ? canvas.parentElement?.getBoundingClientRect() : undefined
      width = Math.max(1, bounds?.width ?? window.innerWidth)
      height = Math.max(1, bounds?.height ?? window.innerHeight)
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }
    resize()

    const isMobile = width < 768
    const cap = isMobile ? MAX_MOBILE : MAX_DESKTOP
    const count = Math.min(density ?? cap, cap)
    const petals = Array.from({ length: count }, (_, i) => makePetal(width, height, i, count, palette))
    const sprites = petals.map((p) => petalSprite(shapes[p.shape], p.shape, p, p.depth >= 0.72))

    let frame = 0
    let last = 0
    let prevScroll = window.scrollY
    let scrollVel = 0
    let gust = 0
    const half = SPRITE / 2

    const tick = (time: number) => {
      frame = window.requestAnimationFrame(tick)
      const dt = last ? Math.min(2.2, (time - last) / 16.67) : 1
      last = time
      const t = time * 0.001

      const scrollY = window.scrollY
      scrollVel += (scrollY - prevScroll - scrollVel) * 0.18
      prevScroll = scrollY
      gust *= Math.pow(0.982, dt)
      if (Math.random() < 0.0024 * dt) gust += (Math.random() - 0.28) * 2.6

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = blend

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i]
        p.vy += 0.011 * (0.35 + p.depth) * dt
        p.vy *= Math.pow(0.985, dt)
        const sway = Math.sin(t * (1.05 + p.depth * 1.5) + p.phase) * p.sway
        const drift = (wind * (0.32 + p.depth * 0.9) + gust * (0.4 + p.depth)) * dt
        p.x += (p.vx + sway + drift + scrollVel * 0.032 * p.depth) * dt
        p.y += (p.vy + Math.abs(scrollVel) * 0.005 * p.depth) * dt
        p.rotation += p.spin * dt
        if (p.y > height + 34) {
          p.y = -30
          p.x = Math.random() * width
        }
        if (p.x < -48) p.x = width + 36
        else if (p.x > width + 48) p.x = -36

        const flip = Math.cos(t * p.flip + p.phase)
        const flipScale = Math.abs(flip) < 0.14 ? (flip < 0 ? -0.14 : 0.14) : flip
        // one matrix = translate · rotate · scale(flip, 1) · (petal size / sprite size), in device pixels
        const k = (p.size / SPRITE) * dpr
        const cos = Math.cos(p.rotation)
        const sin = Math.sin(p.rotation)
        ctx.setTransform(cos * flipScale * k, sin * flipScale * k, -sin * k, cos * k, p.x * dpr, p.y * dpr)
        ctx.globalAlpha = 0.42 + p.depth * 0.54
        ctx.drawImage(sprites[i], -half, -half)
      }
    }

    let onscreen = position === 'fixed'
    let tabVisible = !document.hidden
    const start = () => {
      if (frame || !onscreen || !tabVisible) return
      last = 0
      prevScroll = window.scrollY
      scrollVel = 0
      frame = window.requestAnimationFrame(tick)
    }
    const stop = () => {
      if (!frame) return
      window.cancelAnimationFrame(frame)
      frame = 0
    }
    const sync = () => (onscreen && tabVisible ? start() : stop())
    const onVisibility = () => {
      tabVisible = !document.hidden
      sync()
    }

    // scene canvases only run while their scene is on screen
    let io: IntersectionObserver | null = null
    if (position === 'absolute') {
      io = new IntersectionObserver(
        (entries) => {
          onscreen = entries[0]?.isIntersecting ?? false
          sync()
        },
        { rootMargin: '80px' },
      )
      io.observe(canvas)
    }

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    sync()

    return () => {
      stop()
      io?.disconnect()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [reduced, density, wind, tintKey, blend, position])

  if (reduced) return null

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none inset-0 ${position === 'fixed' ? 'fixed z-40' : 'absolute z-[12]'} ${className}`}
      aria-hidden="true"
    />
  )
}
