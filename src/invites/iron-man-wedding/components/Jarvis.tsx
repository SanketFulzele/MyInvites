import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface JarvisApi {
  /** Show a J.A.R.V.I.S. message. `once` keys prevent repeats. */
  say: (text: string, once?: string) => void
}

const Ctx = createContext<JarvisApi>({ say: () => {} })
export const useJarvis = () => useContext(Ctx)

export function JarvisProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null)
  const seen = useRef(new Set<string>())
  const timer = useRef<number | undefined>(undefined)

  const say = useCallback((text: string, once?: string) => {
    if (once) {
      if (seen.current.has(once)) return
      seen.current.add(once)
    }
    window.clearTimeout(timer.current)
    setMsg({ id: Date.now(), text })
    timer.current = window.setTimeout(() => setMsg(null), 4200)
  }, [])

  return (
    <Ctx.Provider value={{ say }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4" aria-live="polite">
        <AnimatePresence>
          {msg && (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="pointer-events-auto flex max-w-sm items-start gap-3 rounded-xl border border-reactor/35 bg-[#061017]/90 px-4 py-3 shadow-[0_0_30px_-8px_rgba(127,233,255,.6)] backdrop-blur-md"
              onClick={() => setMsg(null)}
            >
              <span className="relative mt-1 grid h-5 w-5 shrink-0 place-items-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-reactor/40" />
                <span className="h-2.5 w-2.5 rounded-full bg-reactor shadow-[0_0_10px_#7fe9ff]" />
              </span>
              <div>
                <p className="font-hud text-[9px] font-semibold tracking-[0.35em] text-reactor">J.A.R.V.I.S.</p>
                <p className="mt-0.5 font-tech text-[15px] leading-snug text-white/90">{msg.text}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}
