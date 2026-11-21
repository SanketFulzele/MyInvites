import { useEffect, useState } from 'react'

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** true once the target moment has passed */
  isPast: boolean
  /** Whole days since the target (only meaningful when isPast) */
  daysSince: number
}

function compute(target: number): CountdownParts {
  const diff = target - Date.now()
  const abs = Math.abs(diff)
  const isPast = diff <= 0
  const remain = isPast ? 0 : abs
  return {
    days: Math.floor(remain / 86_400_000),
    hours: Math.floor((remain / 3_600_000) % 24),
    minutes: Math.floor((remain / 60_000) % 60),
    seconds: Math.floor((remain / 1000) % 60),
    isPast,
    daysSince: isPast ? Math.floor(abs / 86_400_000) : 0,
  }
}

export function useCountdown(target: Date): CountdownParts {
  const t = target.getTime()
  const [parts, setParts] = useState(() => compute(t))
  useEffect(() => {
    setParts(compute(t))
    const id = window.setInterval(() => setParts(compute(t)), 1000)
    return () => window.clearInterval(id)
  }, [t])
  return parts
}
