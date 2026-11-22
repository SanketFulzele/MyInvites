import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStatus } from './status'
import { EASE } from './ui'
import { usePrefersReducedMotion } from '../../../hooks/useReducedMotion'

export interface NavItem {
  id: string
  label: string
}

const MARKS = ['Mk I', 'Mk II', 'Mk III', 'Mk IV', 'Mk V', 'Mk VI', 'Mk VII', 'Mk VIII']

function useTyped(text: string, stamp: number) {
  const reduced = usePrefersReducedMotion()
  const [out, setOut] = useState(text)
  useEffect(() => {
    if (reduced) {
      setOut(text)
      return
    }
    let i = 0
    setOut('')
    const id = window.setInterval(() => {
      i++
      setOut(text.slice(0, i))
      if (i >= text.length) window.clearInterval(id)
    }, 22)
    return () => window.clearInterval(id)
  }, [text, stamp, reduced])
  return out
}

export default function TopBar({
  monogram,
  nav,
  playing,
  onToggleMusic,
}: {
  monogram: string
  nav: NavItem[]
  playing: boolean
  onToggleMusic: () => void
}) {
  const { message, stamp } = useStatus()
  const typed = useTyped(message, stamp)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), open ? 260 : 0)
  }

  return (
    <>
      <motion.header
        initial={{ y: -64, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-colors duration-500 ${
          solid || open ? 'border-b border-white/[.06] bg-obsidian/90 backdrop-blur-md' : 'bg-gradient-to-b from-obsidian/70 to-transparent'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <button onClick={() => go('hero')} className="shrink-0 font-display text-xl italic text-paper" aria-label="Back to top">
            {monogram}
          </button>

          {/* J.A.R.V.I.S. status line */}
          <p className="flex min-w-0 flex-1 items-start gap-2 font-mono text-[11px] leading-[1.35] text-arc/80" aria-live="polite">
            <span className="mt-[4px] h-1.5 w-1.5 shrink-0 rounded-full bg-arc shadow-[0_0_8px_rgba(102,217,255,.9)]" title="J.A.R.V.I.S." />
            <span className="line-clamp-2">
              <span className="hidden text-arc/45 sm:inline">J.A.R.V.I.S. › </span>
              {typed}
            </span>
          </p>

          <button
            onClick={onToggleMusic}
            aria-label={playing ? 'Mute music' : 'Play music'}
            aria-pressed={playing}
            className="flex h-10 w-10 shrink-0 items-center justify-center gap-[3px]"
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`block w-[2px] origin-bottom rounded-full transition-colors ${playing ? 'bg-iron-gold' : 'bg-paper/40'}`}
                style={{
                  height: 14,
                  transform: playing ? undefined : 'scaleY(.25)',
                  animation: playing ? `eq ${0.7 + i * 0.17}s ease-in-out ${i * 0.1}s infinite` : 'none',
                }}
              />
            ))}
          </button>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="relative flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[6px]"
          >
            <span className={`block h-px w-6 bg-paper transition-transform duration-300 ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`block h-px w-6 bg-paper transition-transform duration-300 ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-0 z-40 overflow-y-auto bg-obsidian px-6 pt-24 pb-10"
            aria-label="Invitation sections"
          >
            <div className="film-grain pointer-events-none absolute inset-0 opacity-[.05] mix-blend-overlay" />
            <div className="absolute right-0 bottom-0 h-80 w-80 bg-[radial-gradient(circle,rgba(143,24,32,.3),transparent_70%)]" />
            <ol className="relative mx-auto max-w-md">
              {nav.map((n, i) => (
                <motion.li
                  key={n.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE }}
                  className="border-b border-white/[.07]"
                >
                  <button onClick={() => go(n.id)} className="flex w-full items-baseline gap-5 py-4 text-left active:opacity-60">
                    <span className="w-14 shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] text-iron-gold/70">{MARKS[i]}</span>
                    <span className="font-display text-[2rem] leading-none text-paper">{n.label}</span>
                  </button>
                </motion.li>
              ))}
            </ol>
            <p className="relative mx-auto mt-10 max-w-md font-mono text-[11px] uppercase tracking-[0.25em] text-paper/30">
              Stark Industries · Wedding Division
            </p>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  )
}
