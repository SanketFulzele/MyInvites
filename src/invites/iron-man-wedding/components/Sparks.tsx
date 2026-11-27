import { useEffect, useRef } from 'react'

/* Pre-drawn sprites: every frame only stamps images (no gradients / filters per frame). */
const S = 48
function glowSprite(core: string, glow: string) {
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2)
  grad.addColorStop(0, core)
  grad.addColorStop(0.18, core)
  grad.addColorStop(0.42, glow)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, S, S)
  return c
}
function flakeSprite(color: string) {
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')!
  g.translate(S / 2, S / 2)
  g.fillStyle = color
  g.beginPath()
  g.moveTo(0, -14)
  g.lineTo(5, 0)
  g.lineTo(0, 14)
  g.lineTo(-5, 0)
  g.closePath()
  g.fill()
  return c
}

/* ───────────────────────── Ambient HUD dust ───────────────────────── */
/** Faint blue/gold motes drifting upward across the whole invitation. */
export function HudDust() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const sprites = [glowSprite('rgba(220,248,255,1)', 'rgba(102,217,255,.35)'), glowSprite('rgba(255,236,200,1)', 'rgba(198,154,83,.35)')]
    let dpr = 1
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
    const n = w < 640 ? 16 : 30
    const motes = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vy: -(0.12 + Math.random() * 0.3),
      drift: Math.random() * Math.PI * 2,
      size: 6 + Math.random() * 10,
      a: 0.25 + Math.random() * 0.45,
      s: Math.random() < 0.7 ? 0 : 1,
      tw: Math.random() * Math.PI * 2,
    }))
    let raf = 0
    let last = 0
    let prevScroll = window.scrollY
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick)
      const dt = last ? Math.min(2.5, (t - last) / 16.67) : 1
      last = t
      // a touch of parallax: motes respond slightly to scrolling
      const sv = window.scrollY - prevScroll
      prevScroll = window.scrollY
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const m of motes) {
        m.drift += 0.01 * dt
        m.tw += 0.03 * dt
        m.y += m.vy * dt - sv * 0.08
        m.x += Math.sin(m.drift) * 0.25 * dt
        if (m.y < -20) {
          m.y = h + 20
          m.x = Math.random() * w
        } else if (m.y > h + 20) {
          m.y = -20
        }
        const k = (m.size / S) * dpr
        ctx.setTransform(k, 0, 0, k, m.x * dpr, m.y * dpr)
        ctx.globalAlpha = m.a * (0.6 + 0.4 * Math.sin(m.tw))
        ctx.drawImage(sprites[m.s], -S / 2, -S / 2)
      }
    }
    const start = () => {
      if (!raf) {
        last = 0
        raf = requestAnimationFrame(tick)
      }
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', resize)
    start()
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[5] h-full w-full" />
}

/* ───────────────────────── Repulsor-spark pointer trail ───────────────────────── */
interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  kind: 0 | 1 | 2 // 0 cyan spark, 1 gold flake, 2 shockwave ring
  rot: number
  spin: number
}

/** Cyan energy sparks and gold flecks trail the mouse / swiping finger; a tap fires a repulsor ring. */
export function SparkTrail() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const sprites = [glowSprite('rgba(235,252,255,1)', 'rgba(102,217,255,.55)'), flakeSprite('#e9c97e')]
    let dpr = 1
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

    const parts: Spark[] = []
    let raf = 0
    let last = 0
    let lx = -1
    let ly = -1

    const add = (p: Omit<Spark, 'max'>) => {
      if (parts.length > 110) parts.shift()
      parts.push({ ...p, max: p.life })
      if (!raf) {
        last = 0
        raf = requestAnimationFrame(tick)
      }
    }

    const tick = (t: number) => {
      const dt = last ? Math.min(6, (t - last) / 16.67) : 1
      last = t
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]
        p.life -= dt
        if (p.life <= 0) {
          parts.splice(i, 1)
          continue
        }
        const a = p.life / p.max
        if (p.kind === 2) {
          // expanding repulsor ring
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx.globalAlpha = a * 0.8
          ctx.strokeStyle = '#8fe6ff'
          ctx.lineWidth = 2 * a + 0.5
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * (1 - a) + 6, 0, Math.PI * 2)
          ctx.stroke()
          continue
        }
        p.vx *= Math.pow(0.95, dt)
        p.vy = p.vy * Math.pow(0.95, dt) + (p.kind === 1 ? 0.05 : 0.015) * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.spin * dt
        const k = (p.size / S) * dpr * (p.kind === 0 ? 0.5 + a * 0.7 : 1)
        const c = Math.cos(p.rot)
        const s = Math.sin(p.rot)
        ctx.setTransform(c * k, s * k, -s * k, c * k, p.x * dpr, p.y * dpr)
        ctx.globalAlpha = Math.min(1, a * 1.5)
        ctx.drawImage(sprites[p.kind], -S / 2, -S / 2)
      }
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      raf = parts.length ? requestAnimationFrame(tick) : 0
      if (!raf) {
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    const trail = (x: number, y: number, step: number) => {
      if (lx < 0) {
        lx = x
        ly = y
        return
      }
      const dx = x - lx
      const dy = y - ly
      const dist = Math.hypot(dx, dy)
      if (dist < step) return
      const n = Math.min(4, Math.floor(dist / step))
      for (let i = 1; i <= n; i++) {
        const px = lx + (dx * i) / n
        const py = ly + (dy * i) / n
        const flake = Math.random() < 0.25
        add({
          x: px,
          y: py,
          vx: dx * 0.06 + (Math.random() - 0.5) * 2.2,
          vy: dy * 0.06 + (Math.random() - 0.5) * 2.2,
          life: flake ? 55 + Math.random() * 30 : 26 + Math.random() * 18,
          size: flake ? 9 + Math.random() * 6 : 16 + Math.random() * 14,
          kind: flake ? 1 : 0,
          rot: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.25,
        })
      }
      lx = x
      ly = y
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      if (e.pointerType === 'pen' && e.buttons === 0) return
      trail(e.clientX, e.clientY, 14)
    }
    const onTouchMove = (e: TouchEvent) => {
      const t0 = e.touches[0]
      if (t0) trail(t0.clientX, t0.clientY, 20)
    }
    const onDown = (e: PointerEvent) => {
      lx = e.clientX
      ly = e.clientY
      add({ x: e.clientX, y: e.clientY, vx: 0, vy: 0, life: 26, size: 46, kind: 2, rot: 0, spin: 0 })
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2
        const sp = 2.4 + Math.random() * 2
        add({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: i % 3 === 0 ? 50 : 28,
          size: i % 3 === 0 ? 10 : 18,
          kind: i % 3 === 0 ? 1 : 0,
          rot: a,
          spin: 0.1,
        })
      }
    }
    const reset = () => {
      lx = -1
      ly = -1
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', reset, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', reset, { passive: true })
    document.addEventListener('pointerleave', reset)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', reset)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', reset)
      document.removeEventListener('pointerleave', reset)
      window.removeEventListener('resize', resize)
    }
  }, [])
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[95] h-full w-full" />
}
