import { useCallback, useEffect, useRef } from 'react'
import { useEggs } from './useEasterEggs'

const SEQUENCE = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
] as const

const AURA_DURATION_MS = 2400

const KONAMI_CSS = `
@keyframes konami-aura-glow {
  0%, 100% {
    text-shadow: 0 0 4px rgba(201, 164, 92, 0.35);
    box-shadow: 0 0 8px rgba(242, 163, 58, 0.18);
  }
  50% {
    text-shadow: 0 0 18px rgba(255, 227, 160, 0.95), 0 0 34px rgba(201, 164, 92, 0.6);
    box-shadow: 0 0 26px rgba(242, 163, 58, 0.45), inset 0 0 18px rgba(255, 227, 160, 0.2);
  }
}
.konami-aura {
  animation: konami-aura-glow 1.2s ease-in-out infinite;
  border-radius: inherit;
}
@media (prefers-reduced-motion: reduce) {
  .konami-aura {
    animation: none;
    text-shadow: 0 0 12px rgba(255, 227, 160, 0.8);
    box-shadow: 0 0 18px rgba(242, 163, 58, 0.35);
  }
}
`

export default function KonamiAura() {
  const { discover } = useEggs()
  const progressRef = useRef(0)
  const auraTimerRef = useRef<number | null>(null)

  const fireAura = useCallback(() => {
    if (typeof document === 'undefined') return
    const targets = document.querySelectorAll<HTMLElement>('[data-konami]')
    targets.forEach((element) => element.classList.add('konami-aura'))
    if (auraTimerRef.current !== null) window.clearTimeout(auraTimerRef.current)
    auraTimerRef.current = window.setTimeout(() => {
      targets.forEach((element) => element.classList.remove('konami-aura'))
      auraTimerRef.current = null
    }, AURA_DURATION_MS)
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.setAttribute('data-egg-konami-style', '')
    style.textContent = KONAMI_CSS
    document.head.appendChild(style)
    return () => {
      style.remove()
    }
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      ) {
        return
      }

      const key = event.key.toLowerCase()
      if (key === SEQUENCE[progressRef.current]) {
        progressRef.current += 1
        if (progressRef.current === SEQUENCE.length) {
          progressRef.current = 0
          discover('konami')
          fireAura()
        }
      } else {
        progressRef.current = key === SEQUENCE[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [discover, fireAura])

  useEffect(
    () => () => {
      if (auraTimerRef.current !== null) window.clearTimeout(auraTimerRef.current)
    },
    [],
  )

  return null
}
