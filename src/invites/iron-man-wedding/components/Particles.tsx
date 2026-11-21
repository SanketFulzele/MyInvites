import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../../hooks/useReducedMotion'

/** Lightweight floating embers + reactor sparks on a fixed canvas. */
export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let w = 0
    let h = 0
    let raf = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const count = window.innerWidth < 640 ? 28 : 55

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const colors = ['255,207,110', '232,182,76', '127,233,255', '255,120,90']
    const ps = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.6 + 0.4,
      vy: -(Math.random() * 0.25 + 0.06),
      vx: (Math.random() - 0.5) * 0.12,
      a: Math.random() * 0.5 + 0.15,
      tw: Math.random() * Math.PI * 2,
      c: colors[Math.floor(Math.random() * colors.length)],
    }))

    let visible = true
    const onVis = () => {
      visible = document.visibilityState === 'visible'
      if (visible) raf = requestAnimationFrame(loop)
    }
    document.addEventListener('visibilitychange', onVis)

    function loop() {
      if (!visible) return
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        p.x += p.vx
        p.y += p.vy
        p.tw += 0.03
        if (p.y < -10) {
          p.y = h + 10
          p.x = Math.random() * w
        }
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw))
        ctx.beginPath()
        ctx.fillStyle = `rgba(${p.c},${alpha})`
        ctx.shadowColor = `rgba(${p.c},${alpha})`
        ctx.shadowBlur = 8
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [reduced])

  if (reduced) return null
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden />
}
