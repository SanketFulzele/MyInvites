import { useEffect, useRef } from 'react'

/**
 * A soft aurora backdrop in the spirit of React Bits' Aurora component.
 * Pure CSS gradients + a gentle cursor drift — no shader, no extra dependency.
 */
export default function Aurora() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const el = ref.current
      if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--px', String((event.clientX - rect.left) / rect.width - 0.5))
      el.style.setProperty('--py', String((event.clientY - rect.top) / rect.height - 0.5))
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        ref={ref}
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{ transform: 'translate3d(calc(var(--px, 0) * 26px), calc(var(--py, 0) * 16px), 0)' }}
      >
        <div className="absolute -left-[14%] -top-[34%] h-[78%] w-[86%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(143,123,255,.42),transparent_66%)] blur-[90px] animate-[aurora-drift_17s_ease-in-out_infinite_alternate]" />
        <div className="absolute -right-[18%] -top-[10%] h-[74%] w-[82%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(95,225,232,.26),transparent_66%)] blur-[100px] animate-[aurora-drift-2_21s_ease-in-out_infinite_alternate]" />
        <div className="absolute bottom-[-34%] left-[24%] h-[70%] w-[64%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(255,158,196,.24),transparent_68%)] blur-[100px] animate-[aurora-drift_25s_ease-in-out_infinite_alternate]" />
      </div>
    </div>
  )
}
