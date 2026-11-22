import { createContext, useContext } from 'react'

export interface EggsContextValue {
  found: string[]
  count: number
  total: number
  orbCount: number
  discover: (id: string) => void
  isFound: (id: string) => boolean
  wishOpen: boolean
  closeWish: () => void
  reset: () => void
}

export const EggContext = createContext<EggsContextValue | null>(null)

export function useEggs(): EggsContextValue {
  const value = useContext(EggContext)
  if (!value) {
    throw new Error('useEggs must be used inside an <EggProvider>.')
  }
  return value
}
