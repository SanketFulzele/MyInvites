import { useEffect, useRef } from 'react'

/**
 * Rose petals (and the odd gold sparkle) peel off the pointer as it moves —
 * mouse on desktop, finger-drag on phones — drift with the motion, flutter
 * down and fade. A click / tap releases a small burst.
 *
 * Performance: petals are pre-drawn once into small sprites; the canvas loop
 * only runs while particles are alive and stops completely when idle.
 */

const COLORS: [string, string][] = [
  ['#fde3e6', '#e08a9b'],
  ['#f9d2d8', '#c34f62'],
  ['#f3b9c3', '#a8344c'],
  ['#fff1ee', '#efb2bd'],
  ['#e8a0ad', '#6e1f2f'],
]
const SPRITE = 48
const MAX = 90

function petalSprite([light, dark]: [string, string]) {
  const c = document.createElement('canvas')
  c.width = c.height = SPRITE
  const g = c.getContext('2d')!
  g.translate(SPRITE / 2, SPRITE / 2)
  g.scale(SPRITE * 0.42, SPRITE * 0.42)
  // rounded rose petal with a notched tip
  const p = new Path2D('M0 1 C-0.85 0.55 -0.95 -0.35 -0.32 -0.92 Q-0.1 -0.78 0 -0.58 Q0.1 -0.78 0.32 -0.92 C0.95 -0.35 0.85 0.55 0 1Z')
  const grad = g.createLinearGradient(0, 1, 0, -1)
  grad.addColorStop(0, dark)
  grad.addColorStop(0.55, light)
  grad.addColorStop(1, light)
  g.fillStyle = grad
  g.fill(p)
  g.globalAlpha = 0.35
  g.strokeStyle = '#ffffff'
  g.lineWidth = 0.05
  g.beginPath()
  g.moveTo(0, 0.85)
  g.quadraticCurveTo(0.08, 0.1, 0, -0.5)
  g.stroke()
  return c
}

function sparkleSprite() {
  const c = document.createElement('canvas')
  c.width = c.height = SPRITE
  const g = c.getContext('2d')!
  const m = SPRITE / 2
  const glow = g.createRadialGradient(m, m, 0, m, m, m)
  glow.addColorStop(0, 'rgba(255,240,200,.9)')
  glow.addColorStop(0.3, 'rgba(230,190,110,.35)')
  glow.addColorStop(1, 'rgba(230,190,110,0)')
  g.fillStyle = glow
  g.fillRect(0, 0, SPRITE, SPRITE)
  g.fillStyle = '#fff4d2'
  g.beginPath()
  g.moveTo(m, m - 16)
  g.quadraticCurveTo(m + 2, m - 2, m + 16, m)
  g.quadraticCurveTo(m + 2, m + 2, m, m + 16)
  g.quadraticCurveTo(m - 2, m + 2, m - 16, m)
  g.quadraticCurveTo(m - 2, m - 2, m, m - 16)
  g.fill()
  return c
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  rot: number
  spin: number
  size: number
  life: number
  maxLife: number
  phase: number
  sprite: number // index into sprites; last one is the sparkle
}

export default function PetalTrail() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const sprites = [...COLORS.map(petalSprite), sparkleSprite()]
    const SPARKLE = sprites.length - 1
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
    }
    resize()

    const parts: Particle[] = []
    let raf = 0
    let last = 0
    let lastX = -1
    let lastY = -1

    const spawn = (x: number, y: number, vx: number, vy: number, sparkle: boolean) => {
      if (parts.length >= MAX) parts.shift()
      const life = sparkle ? 42 + Math.random() * 22 : 85 + Math.random() * 55
      parts.push({
        x,
        y,
        vx: vx * 0.12 + (Math.random() - 0.5) * 1.6,
        vy: vy * 0.12 + (Math.random() - 0.5) * 1.2 - (sparkle ? 0.3 : 0.6),
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.12,
        size: sparkle ? 12 + Math.random() * 9 : 13 + Math.random() * 11,
        life,
        maxLife: life,
        phase: Math.random() * Math.PI * 2,
        sprite: sparkle ? SPARKLE : Math.floor(Math.random() * COLORS.length),
      })
      if (!raf) {
        last = 0
        raf = requestAnimationFrame(tick)
      }
    }

    const tick = (t: number) => {
      const dt = last ? Math.min(2.5, (t - last) / 16.67) : 1
      last = t
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.life -= dt
        if (p.life <= 0) {
          parts.splice(i, 1)
          continue
        }
        const isSparkle = p.sprite === SPARKLE
        p.phase += 0.08 * dt
        p.vx *= Math.pow(0.97, dt)
        p.vy = p.vy * Math.pow(0.97, dt) + (isSparkle ? 0.01 : 0.05) * dt // gentle gravity
        p.x += (p.vx + (isSparkle ? 0 : Math.sin(p.phase) * 0.6)) * dt
        p.y += p.vy * dt
        p.rot += p.spin * dt
        const a = p.life / p.maxLife
        const flip = isSparkle ? 1 : Math.cos(p.phase * 0.8) * 0.75 + 0.25
        const k = (p.size / SPRITE) * dpr * (isSparkle ? 0.6 + a * 0.6 : 1)
        const c = Math.cos(p.rot)
        const s = Math.sin(p.rot)
        ctx.setTransform(c * flip * k, s * flip * k, -s * k, c * k, p.x * dpr, p.y * dpr)
        ctx.globalAlpha = Math.min(1, a * 1.6) * (isSparkle ? 0.95 : 0.9)
        ctx.drawImage(sprites[p.sprite], -SPRITE / 2, -SPRITE / 2)
      }
      ctx.globalAlpha = 1
      // idle → stop the loop entirely
      raf = parts.length ? requestAnimationFrame(tick) : 0
      if (!raf) {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    const onMove = (e: PointerEvent) => {
      // touch is handled by onTouchMove (pointer events get cancelled once a swipe scrolls)
      if (e.pointerType === 'touch') return
      if (e.pointerType === 'pen' && e.buttons === 0) return
      trail(e.clientX, e.clientY, e.pointerType === 'mouse' ? 16 : 22)
    }

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (touch) trail(touch.clientX, touch.clientY, 22)
    }

    const trail = (x: number, y: number, step: number) => {
      if (lastX < 0) {
        lastX = x
        lastY = y
        return
      }
      const dx = x - lastX
      const dy = y - lastY
      const dist = Math.hypot(dx, dy)
      if (dist < step) return
      // fill the gap along fast strokes so the trail stays continuous
      const n = Math.min(4, Math.floor(dist / step))
      for (let i = 1; i <= n; i++) {
        spawn(lastX + (dx * i) / n, lastY + (dy * i) / n, dx, dy, Math.random() < 0.18)
      }
      lastX = x
      lastY = y
    }

    const onDown = (e: PointerEvent) => {
      lastX = e.clientX
      lastY = e.clientY
      const count = e.pointerType === 'mouse' ? 10 : 8
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2
        spawn(e.clientX, e.clientY, Math.cos(a) * 26, Math.sin(a) * 26 - 10, i % 4 === 0)
      }
    }

    const onLeave = () => {
      lastX = -1
      lastY = -1
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onLeave, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onLeave, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onLeave)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onLeave)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[80] h-full w-full" />
}
