import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, Menu, Pause, Play, X } from 'lucide-react'
import { usePrefersReducedMotion } from '../../../hooks/useReducedMotion'
import Blossom from './Blossom'

const LINKS = [
  { href: '#top', label: 'Opening' },
  { href: '#letter', label: 'The letter' },
  { href: '#couple', label: 'The couple' },
  { href: '#spring', label: 'The first spring' },
  { href: '#story', label: 'Our story' },
  { href: '#journey', label: 'The journey' },
  { href: '#events', label: 'The celebrations' },
  { href: '#countdown', label: 'The countdown' },
  { href: '#family', label: 'The families' },
  { href: '#keepsake', label: 'The keepsake' },
  { href: '#rsvp', label: 'RSVP' },
  { href: '#closing', label: 'Ending credits' },
]

interface Props {
  playing: boolean
  onToggleMusic: () => void
  scoreTitle: string
  listen: { label: string; url: string }
}

export default function SideDrawer({ playing, onToggleMusic, scoreTitle, listen }: Props) {
  const [open, setOpen] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open invitation menu"
        aria-expanded={open}
        className="fixed right-4 top-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-sakura-gold/40 bg-sakura-cream/85 text-sakura-plum shadow-[0_10px_30px_-18px_rgba(36,27,49,.7)] backdrop-blur-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sakura-gold"
      >
        <Menu className="h-5 w-5" strokeWidth={1.6} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close invitation menu"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0.01 : 0.3 }}
              className="fixed inset-0 z-40 cursor-default bg-sakura-ink/25 backdrop-blur-[2px]"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Invitation menu"
              initial={{ x: reduced ? 0 : '100%', opacity: reduced ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: reduced ? 0 : '100%', opacity: reduced ? 0 : 1 }}
              transition={{ duration: reduced ? 0.01 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="fixed right-0 top-0 z-50 flex h-full w-[88%] max-w-sm flex-col bg-sakura-cream/95 px-7 pb-[max(24px,env(safe-area-inset-bottom))] pt-7 shadow-[-30px_0_60px_-40px_rgba(36,27,49,.7)] backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <Blossom className="h-6 w-6 text-sakura-rose" />
                  <p className="mt-4 font-display text-2xl italic text-sakura-ink">The Invitation</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="grid h-10 w-10 place-items-center rounded-full text-sakura-plum/70 transition hover:bg-sakura-blush/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sakura-gold"
                >
                  <X className="h-5 w-5" strokeWidth={1.6} />
                </button>
              </div>

              <div className="hairline mt-7 h-px w-full bg-sakura-gold/35" />

              <nav className="mt-7 flex flex-col gap-1" aria-label="Invitation sections">
                {LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-2 py-3 font-display text-lg text-sakura-ink/80 transition hover:bg-white hover:text-sakura-plum focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sakura-gold"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="mt-auto pt-8">
                <div className="hairline mb-6 h-px w-full bg-sakura-gold/35" />
                <button
                  type="button"
                  onClick={onToggleMusic}
                  aria-pressed={playing}
                  className="flex w-full items-center gap-3 rounded-md border border-sakura-gold/30 bg-white/60 px-4 py-4 text-left transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sakura-gold"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sakura-rose/15 text-sakura-plum">
                    {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold tracking-[0.28em] text-sakura-plum/70">SOUNDSCAPE · {playing ? 'ON' : 'OFF'}</span>
                    <span className="mt-1 block truncate text-xs text-sakura-ink/60">{scoreTitle}</span>
                  </span>
                </button>

                <a
                  href={listen.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-between px-1 text-[11px] tracking-wide text-sakura-plum/70 transition hover:text-sakura-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sakura-gold"
                >
                  {listen.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
