import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import Lenis from 'lenis'
import { royalRose as R, W } from './royalRose.config'
import Book from './Book'
import { CornerRoses } from './Decor'
import { PetalRain } from './ui'
import PetalTrail from './PetalTrail'
import FirstPage from './sections/FirstPage'
import SaveTheDate from './sections/SaveTheDate'
import { Festivities, OurStory } from './sections/Carousels'
import { Closing, Grand, Location } from './sections/Finale'
import { LangProvider, useLang } from '../bodhi-wedding/ui'

/** Music on a single preloaded <audio>, faded in softly when the book opens. */
function useSong(src: string) {
  const audio = useMemo(() => {
    const a = new Audio()
    a.src = src
    a.loop = true
    a.preload = 'auto'
    a.volume = 0
    return a
  }, [src])
  const [playing, setPlaying] = useState(false)
  const fade = useRef<number | undefined>(undefined)

  const play = useCallback(async () => {
    try {
      window.clearInterval(fade.current)
      await audio.play()
      setPlaying(true)
      fade.current = window.setInterval(() => {
        audio.volume = Math.min(0.5, audio.volume + 0.02)
        if (audio.volume >= 0.5) window.clearInterval(fade.current)
      }, 80)
    } catch {
      setPlaying(false)
    }
  }, [audio])

  const pause = useCallback(() => {
    window.clearInterval(fade.current)
    audio.pause()
    audio.volume = 0
    setPlaying(false)
  }, [audio])

  useEffect(() => {
    const onVis = () => document.hidden && pause()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.clearInterval(fade.current)
      audio.pause()
    }
  }, [audio, pause])

  return { audio, playing, play, pause, toggle: () => (playing ? pause() : void play()) }
}

function LangPill() {
  const { lang, setLang } = useLang()
  return (
    <div role="group" aria-label="Language" className="fixed right-3 top-3 z-50 flex rounded-full border border-rr-gold/50 bg-rr-ivory/90 p-0.5 shadow-[0_8px_20px_-12px_rgba(110,31,47,.6)] backdrop-blur">
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
          className={`min-h-[40px] min-w-[44px] rounded-full px-3 text-xs transition ${k === 'mr' ? 'font-marathi' : 'font-montserrat font-semibold tracking-wider'} ${lang === k ? 'bg-rr-wine text-rr-ivory' : 'text-rr-wine/80'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function Invite() {
  const [opened, setOpened] = useState(false)
  const [started, setStarted] = useState(false)
  const [burst, setBurst] = useState(0)
  const song = useSong(R.music.src)
  const assets = useMemo(() => [R.heroPhoto, ...R.story.map((s) => s.src)], [])
  const { lang } = useLang()

  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="theme-color"]')
    const prevColor = meta?.getAttribute('content')
    document.title = R.meta.pageTitle
    meta?.setAttribute('content', '#6e1f2f')
    document.body.style.background = '#fdf7f0'
    return () => {
      document.title = prevTitle
      if (prevColor) meta?.setAttribute('content', prevColor)
      document.body.style.background = ''
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [opened])

  useEffect(() => {
    if (!opened) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.3 })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
    }
  }, [opened])

  const onOpen = () => {
    void song.play()
    setBurst((b) => b + 1)
    window.scrollTo(0, 0)
    window.setTimeout(() => setStarted(true), 1500)
  }

  return (
    <div className="motion-keep rr-paper relative min-h-screen overflow-x-clip font-montserrat text-rr-ink" lang={lang === 'mr' ? 'mr' : 'en'}>
      {/* one continuous page: soft ivory → blush washes, no hard section lines */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(247,225,223,.0)_0%,rgba(247,225,223,.55)_18%,rgba(253,247,240,0)_32%,rgba(247,225,223,.5)_48%,rgba(253,247,240,0)_62%,rgba(247,225,223,.55)_80%,rgba(253,247,240,0)_100%)]" />

      <AnimatePresence>
        {!opened && (
          <Book
            assets={assets}
            audio={song.audio}
            coverNames={[W.groom.first, W.bride.first]}
            tapLabel={lang === 'en' ? R.copy.tapBook.en : R.copy.tapBook.mr}
            onOpen={onOpen}
            onDone={() => setOpened(true)}
          />
        )}
      </AnimatePresence>

      <PetalRain burstKey={burst} base={opened ? 6 : 0} />
      <PetalTrail />
      {opened && <CornerRoses />}

      {opened && (
        <>
          <LangPill />
          <motion.button
            type="button"
            onClick={song.toggle}
            aria-label={song.playing ? 'Pause music' : 'Play music'}
            aria-pressed={song.playing}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="fixed bottom-[max(16px,env(safe-area-inset-bottom))] right-4 z-50 flex h-14 w-14 items-center justify-center gap-[3px] rounded-full border border-rr-gold/60 bg-rr-wine shadow-[0_14px_30px_-12px_rgba(74,18,32,.8)]"
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="block w-[3px] origin-bottom rounded-full bg-[#f2dfa8]"
                style={{ height: 16, transform: song.playing ? undefined : 'scaleY(.3)', animation: song.playing ? `eq ${0.7 + i * 0.15}s ease-in-out ${i * 0.1}s infinite` : 'none' }}
              />
            ))}
          </motion.button>
        </>
      )}

      <main className="relative z-10">
        <FirstPage started={started} />
        <SaveTheDate />
        <Festivities />
        <OurStory />
        <Grand />
        <Location />
        <Closing />
      </main>
    </div>
  )
}

export default function RoyalRoseInvite() {
  return (
    <MotionConfig reducedMotion="never">
      <LangProvider>
        <Invite />
      </LangProvider>
    </MotionConfig>
  )
}
