import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { bodhiWedding as C } from './bodhiWedding.config'
import { dateText, timeText, toDate, weddingEvent } from './dates'
import { LangProvider, guestName, singingBowl, useMusic } from './ui'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'
import { useCountdown } from '../../hooks/useCountdown'
import LeafField from './LeafField'
import Envelope from './Envelope'
import { ChapterNav, MusicButton, PointerFX, type ChapterLink } from './Chrome'
import Opening from './chapters/Opening'
import { Couple, Invitation } from './chapters/Invitation'
import Story from './chapters/Story'
import { Celebrations, Countdown, Precepts } from './chapters/Celebrations'
import { Families, Venue } from './chapters/Families'
import Keepsake from './chapters/Keepsake'
import Rsvp from './chapters/Rsvp'
import Closing from './chapters/Closing'

const CHAPTERS: ChapterLink[] = [
  { id: 'opening', label: 'Opening', accent: 'बोधि' },
  { id: 'mangal', label: 'Invitation', accent: 'मंगल' },
  { id: 'couple', label: 'Two Hearts', accent: 'मैत्री' },
  { id: 'journey', label: 'The Journey', accent: 'धम्म' },
  { id: 'celebrations', label: 'Celebrations', accent: 'उत्सव' },
  { id: 'panchsheel', label: 'Five Vows', accent: 'पंचशील' },
  { id: 'countdown', label: 'Countdown', accent: 'प्रतीक्षा' },
  { id: 'families', label: 'Two Families', accent: 'कुटुंब' },
  { id: 'venue', label: 'Venue & Map', accent: 'स्थळ' },
  { id: 'keepsake', label: 'Keepsakes', accent: 'स्मृती' },
  { id: 'rsvp', label: 'RSVP', accent: 'करुणा' },
  { id: 'closing', label: 'Closing', accent: 'शांती' },
]

function Invite() {
  const [envelope, setEnvelope] = useState<'first' | 'replay' | null>('first')
  const reduced = usePrefersReducedMotion()
  const music = useMusic(C.music.src)
  const guest = useMemo(guestName, [])
  const wedding = toDate(C.weddingDateTime)
  const c = useCountdown(wedding ?? new Date(8.64e15))
  // leaves fall a little faster on the final day
  const finalDay = !!wedding && !c.isPast && c.days === 0
  const ev = weddingEvent()
  const [venueName, venueCity] = ev.venue.split(',').map((s) => s.trim())

  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="theme-color"]')
    const prevColor = meta?.getAttribute('content')
    document.title = C.meta.pageTitle
    meta?.setAttribute('content', '#7a1f2b')
    document.body.style.background = '#fbf5e9'
    return () => {
      document.title = prevTitle
      if (prevColor) meta?.setAttribute('content', prevColor)
      document.body.style.background = ''
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = envelope ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [envelope])

  // smooth scrolling, same as the Sakura invite
  useEffect(() => {
    if (envelope || reduced) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.4 })
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
  }, [envelope, reduced])

  const onOpen = () => {
    if (envelope === 'first') {
      void music.play()
      singingBowl()
    } else if (music.playing) {
      singingBowl()
    }
  }

  const onDone = () => {
    if (envelope === 'first') window.scrollTo(0, 0)
    setEnvelope(null)
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-bodhi-ivory font-mukta text-bodhi-ink">
      <AnimatePresence>
        {envelope && (
          <Envelope
            key={envelope}
            replay={envelope === 'replay'}
            bride={C.bride.first}
            groom={C.groom.first}
            fullNames={`${C.bride.first} ${C.bride.surname ?? ""} & ${C.groom.first} ${C.groom.surname ?? ""}`.replace(/\s+/g, ' ').trim()}
            blessing={C.envelopeBlessing}
            guest={guest}
            venue={venueName}
            venueCity={(venueCity ?? '').toUpperCase()}
            dateLine={dateText(wedding)}
            timeLine={wedding ? timeText(wedding) : 'Muhurat to be announced'}
            onOpen={onOpen}
            onDone={onDone}
          />
        )}
      </AnimatePresence>

      <LeafField speed={finalDay ? 1.7 : 1} />
      <PointerFX />

      {!envelope && (
        <>
          <ChapterNav chapters={CHAPTERS} />
          <MusicButton playing={music.playing} onToggle={music.toggle} />
        </>
      )}

      <main className="relative z-10">
        <Opening />
        <Invitation />
        <Couple />
        <Story />
        <Celebrations />
        <Precepts />
        <Countdown target={wedding} />
        <Families />
        <Venue />
        <Keepsake />
        <Rsvp />
        <Closing onReplay={() => setEnvelope('replay')} />
      </main>
    </div>
  )
}

export default function BodhiInvite() {
  return (
    <LangProvider>
      <Invite />
    </LangProvider>
  )
}
