import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { AshokChakra, PipalLeaf } from './art'
import { EASE, useLang } from './ui'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'

export interface ChapterLink {
  id: string
  label: string
  accent: string
}

function LangToggle({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang()
  return (
    <div role="group" aria-label="Language" className={`inline-flex rounded-full border p-0.5 ${dark ? 'border-bodhi-gold/40' : 'border-bodhi-gold/50 bg-bodhi-ivory/80'}`}>
      {(
        [
          ['en', 'EN'],
          ['mr', 'मराठी'],
        ] as const
      ).map(([k, label]) => (
        <button
          key={k}
          type="button"
          aria-pressed={lang === k}
          onClick={() => setLang(k)}
          className={`min-h-[34px] rounded-full px-3 text-xs transition ${k === 'mr' ? 'font-marathi' : 'font-cinzel tracking-[0.15em]'} ${
            lang === k ? 'bg-bodhi-maroon text-bodhi-ivory' : 'text-bodhi-ink/70 hover:text-bodhi-maroon'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/** Right-side chapter rail on desktop; a chapter sheet on phones. */
export function ChapterNav({ chapters }: { chapters: ChapterLink[] }) {
  const [active, setActive] = useState(chapters[0]?.id)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (v) setActive(v.target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.3, 0.6] },
    )
    chapters.forEach((c) => {
      const el = document.getElementById(c.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [chapters])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), open ? 250 : 0)
  }

  const index = Math.max(0, chapters.findIndex((c) => c.id === active))

  return (
    <>
      {/* desktop rail */}
      <nav aria-label="Chapters" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 lg:flex">
        <div className="mb-3">
          <LangToggle />
        </div>
        {chapters.map((c, i) => {
          const on = active === c.id
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => go(c.id)}
              aria-label={`Chapter ${i + 1}: ${c.label}`}
              aria-current={on ? 'true' : undefined}
              className="group flex min-h-[30px] items-center gap-2.5"
            >
              <span
                className={`max-w-0 overflow-hidden whitespace-nowrap font-mukta text-xs transition-all duration-300 group-hover:max-w-[180px] group-focus-visible:max-w-[180px] ${
                  on ? 'max-w-[180px] text-bodhi-maroon' : 'text-bodhi-ink/50'
                }`}
              >
                <span className="mr-1.5 font-marathi text-bodhi-gold-deep">{c.accent}</span>
                {c.label}
              </span>
              <span className={`grid h-4 w-4 place-items-center transition ${on ? 'scale-125' : ''}`}>
                {on ? <PipalLeaf className="h-4 w-3.5" fill="#7a1f2b" vein="#fbf5e9" rotate={180} /> : <span className="h-1.5 w-1.5 rounded-full bg-bodhi-ink/30 group-hover:bg-bodhi-maroon" />}
              </span>
            </button>
          )
        })}
      </nav>

      {/* phone: chapter button + sheet */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Open chapters"
        className="fixed right-3 top-3 z-40 flex min-h-[44px] items-center gap-2 rounded-full border border-bodhi-gold/50 bg-bodhi-ivory/90 py-2 pl-3 pr-4 shadow-[0_8px_24px_-14px_rgba(59,36,22,.6)] backdrop-blur lg:hidden"
      >
        <AshokChakra className="h-5 w-5" spin />
        <span className="font-cinzel text-[11px] tracking-[0.2em] text-bodhi-ink/80">{String(index + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close chapters"
              className="fixed inset-0 z-50 bg-bodhi-ink/30 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Chapters"
              className="bodhi-parchment fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col overflow-y-auto px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-6 shadow-[-30px_0_60px_-40px_rgba(59,36,22,.8)] lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="flex items-center justify-between">
                <LangToggle />
                <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-11 w-11 place-items-center rounded-full text-bodhi-ink/70 hover:bg-bodhi-gold/15">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ol className="mt-6">
                {chapters.map((c, i) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => go(c.id)}
                      className={`flex w-full items-baseline gap-3 border-b border-bodhi-gold/25 py-3.5 text-left ${active === c.id ? 'text-bodhi-maroon' : 'text-bodhi-ink/80'}`}
                    >
                      <span className="w-6 font-cinzel text-[11px] text-bodhi-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-display text-xl">{c.label}</span>
                      <span className="ml-auto font-marathi text-sm text-bodhi-gold-deep/80">{c.accent}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

/** Floating round music button with a turning chakra. */
export function MusicButton({ playing, onToggle }: { playing: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'Mute music' : 'Play music'}
      aria-pressed={playing}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
      whileTap={{ scale: 0.92 }}
      className={`fixed bottom-[max(16px,env(safe-area-inset-bottom))] left-4 z-40 grid h-14 w-14 place-items-center rounded-full border shadow-[0_12px_30px_-14px_rgba(59,36,22,.7)] backdrop-blur transition-colors ${
        playing ? 'border-bodhi-gold bg-bodhi-ivory/95' : 'border-bodhi-gold/40 bg-bodhi-ivory/80'
      }`}
    >
      <span className={playing ? '' : 'opacity-45 grayscale'}>
        <AshokChakra className="h-9 w-9" spin={playing} />
      </span>
      {!playing && <span className="absolute h-[2px] w-9 rotate-45 rounded bg-bodhi-maroon/70" />}
      {playing && <span className="absolute inset-0 animate-ping rounded-full border border-bodhi-gold/40 [animation-duration:2.4s]" />}
    </motion.button>
  )
}

/** Gold sparkles that trail the cursor on desktop; water ripples on tap. */
export function PointerFX() {
  const reduced = usePrefersReducedMotion()
  const layer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !layer.current) return
    const root = layer.current
    const fine = window.matchMedia('(pointer: fine)').matches
    let last = 0

    const spawn = (x: number, y: number, cls: string, style: Partial<CSSStyleDeclaration>, life: number) => {
      const el = document.createElement('span')
      el.className = cls
      Object.assign(el.style, { left: `${x}px`, top: `${y}px`, ...style })
      root.appendChild(el)
      window.setTimeout(() => el.remove(), life)
    }

    const onMove = (e: PointerEvent) => {
      if (!fine || e.pointerType !== 'mouse') return
      const now = performance.now()
      if (now - last < 40) return
      last = now
      const s = 3 + Math.random() * 4
      spawn(e.clientX, e.clientY, 'absolute rounded-full', {
        width: `${s}px`,
        height: `${s}px`,
        background: 'radial-gradient(circle, #fff6c9, #e8a33d 60%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        transition: 'transform .9s ease-out, opacity .9s ease-out',
        opacity: '1',
      }, 950)
      const el = root.lastElementChild as HTMLElement | null
      requestAnimationFrame(() => {
        if (!el) return
        el.style.transform = `translate(${(Math.random() - 0.5) * 30 - 50}%, ${Math.random() * 40 + 20}px) scale(.3)`
        el.style.opacity = '0'
      })
    }

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      spawn(e.clientX, e.clientY, 'absolute h-16 w-16 rounded-full border-2 border-bodhi-gold/60', { animation: 'bodhi-ripple .9s ease-out forwards' }, 950)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [reduced])

  return <div ref={layer} aria-hidden className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" />
}
