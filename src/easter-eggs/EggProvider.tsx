import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { EGGS, ORB_IDS } from './registry'
import { EggContext } from './useEasterEggs'
import type { EggsContextValue } from './useEasterEggs'
import WishMoment from './WishMoment'

const STORAGE_KEY = 'sakura-eggs-v1'
const VALID_IDS: ReadonlySet<string> = new Set(EGGS.map((egg) => egg.id))
const ORB_ID_SET: ReadonlySet<string> = new Set(ORB_IDS)

function hasAllOrbs(ids: readonly string[]): boolean {
  return ORB_IDS.every((id) => ids.includes(id))
}

function readStoredEggs(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return [
      ...new Set(
        parsed.filter((value): value is string => typeof value === 'string' && VALID_IDS.has(value)),
      ),
    ]
  } catch {
    return []
  }
}

export default function EggProvider({ children }: { children: ReactNode }) {
  const [found, setFound] = useState<string[]>(readStoredEggs)
  const [wishOpen, setWishOpen] = useState(false)
  const foundRef = useRef(found)

  useEffect(() => {
    foundRef.current = found
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(found))
      }
    } catch {
      // Storage can be blocked (private mode / disabled cookies); stay in memory.
    }
  }, [found])

  const discover = useCallback((id: string) => {
    if (!VALID_IDS.has(id)) return
    const current = foundRef.current
    if (current.includes(id)) return
    const next = [...current, id]
    foundRef.current = next
    setFound(next)
    if (ORB_ID_SET.has(id) && hasAllOrbs(next)) {
      setWishOpen(true)
    }
  }, [])

  const isFound = useCallback((id: string) => found.includes(id), [found])
  const closeWish = useCallback(() => setWishOpen(false), [])
  const reset = useCallback(() => {
    foundRef.current = []
    setFound([])
    setWishOpen(false)
  }, [])

  const value = useMemo<EggsContextValue>(
    () => ({
      found,
      count: found.length,
      total: EGGS.length,
      orbCount: ORB_IDS.reduce((sum, id) => sum + (found.includes(id) ? 1 : 0), 0),
      discover,
      isFound,
      wishOpen,
      closeWish,
      reset,
    }),
    [found, discover, isFound, wishOpen, closeWish, reset],
  )

  return (
    <EggContext.Provider value={value}>
      {children}
      <WishMoment />
    </EggContext.Provider>
  )
}
