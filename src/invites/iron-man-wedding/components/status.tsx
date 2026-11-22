import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react'
import { greeting, sectionStatus } from '../copy'

/**
 * J.A.R.V.I.S. status line. Sections report when they're in view and the
 * top bar types a quiet contextual message — no pop-ups over the content.
 */
interface StatusApi {
  message: string
  /** bumps whenever a new message should be typed */
  stamp: number
  setSection: (key: string) => void
  say: (text: string) => void
}

const Ctx = createContext<StatusApi>({ message: '', stamp: 0, setSection: () => {}, say: () => {} })
export const useStatus = () => useContext(Ctx)

export function StatusProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState({ message: greeting(), stamp: 0 })
  const last = useRef('')

  const say = useCallback((text: string) => {
    setState((s) => ({ message: text, stamp: s.stamp + 1 }))
  }, [])

  const setSection = useCallback(
    (key: string) => {
      if (last.current === key) return
      last.current = key
      const text = key === 'hero' ? greeting() : sectionStatus[key]
      if (text) say(text)
    },
    [say],
  )

  const value = useMemo(() => ({ ...state, setSection, say }), [state, setSection, say])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
