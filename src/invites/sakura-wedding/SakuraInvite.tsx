import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Lenis from 'lenis'
import { wedding } from '../../data/wedding'
import { fmt, parseLocal } from '../../lib/date'
import { gsap, ScrollTrigger } from '../../lib/gsapSetup'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'
import PetalField from '../../art/PetalField'
import RedString from '../../components/anime/RedString'
import EpisodeNav, { type EpisodeLink } from '../../components/anime/EpisodeNav'
import ScrollBranch from '../../components/anime/ScrollBranch'
import EggProvider from '../../easter-eggs/EggProvider'
import KonamiAura from '../../easter-eggs/KonamiAura'
import { useMusic } from './components/useMusic'
import WelcomeScreen from './components/WelcomeScreen'
import SideDrawer from './components/SideDrawer'
import HeroSection from '../../sections/HeroSection'
import LetterSection from '../../sections/LetterSection'
import CoupleSection from '../../sections/CoupleSection'
import SpringSection from '../../sections/SpringSection'
import StorySection from '../../sections/StorySection'
import JourneySection from '../../sections/JourneySection'
import EventsSection from '../../sections/EventsSection'
import CountdownSection from '../../sections/CountdownSection'
import FamilySection from '../../sections/FamilySection'
import KeepsakeSection from '../../sections/KeepsakeSection'
import RsvpSection from '../../sections/RsvpSection'
import ClosingSection from '../../sections/ClosingSection'

const EPISODES: EpisodeLink[] = [
  { id: 'top', label: 'Opening', kanji: '序' },
  { id: 'letter', label: 'Invitation', kanji: '招' },
  { id: 'couple', label: 'Two Hearts', kanji: '春' },
  { id: 'spring', label: 'First Spring', kanji: '花' },
  { id: 'story', label: 'Our Story', kanji: '話' },
  { id: 'journey', label: 'The Journey', kanji: '結' },
  { id: 'events', label: 'Celebrations', kanji: '宴' },
  { id: 'countdown', label: 'Countdown', kanji: '待' },
  { id: 'family', label: 'Two Clans', kanji: '家' },
  { id: 'keepsake', label: 'Keepsake', kanji: '券' },
  { id: 'rsvp', label: 'RSVP', kanji: '返' },
  { id: 'closing', label: 'Ending', kanji: '終' },
]

function Invite() {
  const [entered, setEntered] = useState(false)
  const reduced = usePrefersReducedMotion()
  const music = useMusic(wedding.music.src)
  const ceremony = parseLocal(wedding.weddingDateTime, wedding.timezoneOffset)
  const dateLine = `${fmt.day(ceremony, wedding.timeZone)}·${fmt.month(ceremony, wedding.timeZone).toUpperCase()}·${fmt.year(ceremony, wedding.timeZone)}`

  useEffect(() => {
    const previousTitle = document.title
    const meta = document.querySelector('meta[name="theme-color"]')
    const previousColor = meta?.getAttribute('content')
    document.title = wedding.meta.pageTitle
    meta?.setAttribute('content', '#1e1b2e')
    document.body.style.background = '#fbf0e2'
    return () => {
      document.title = previousTitle
      if (previousColor) meta?.setAttribute('content', previousColor)
      document.body.style.background = ''
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = entered ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [entered])

  // Smooth scroll is a progressive enhancement, synced to ScrollTrigger.
  useEffect(() => {
    if (!entered || reduced) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, touchMultiplier: 1.4 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [entered, reduced])

  const enter = () => {
    void music.play()
    window.scrollTo(0, 0)
    setEntered(true)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fbf0e2] font-sans text-sumi">
      <AnimatePresence>
        {!entered && (
          <WelcomeScreen
            bride={wedding.bride.name}
            groom={wedding.groom.name}
            dateLine={dateLine}
            blessing={wedding.blessingLine}
            onEnter={enter}
          />
        )}
      </AnimatePresence>

      {entered && (
        <>
          {/* one shared petal field for the whole invitation */}
          <PetalField />
          <RedString />
          <ScrollBranch />
          <KonamiAura />
          <EpisodeNav episodes={EPISODES} />
          <SideDrawer
            playing={music.playing}
            onToggleMusic={music.toggle}
            scoreTitle={wedding.music.title}
            listen={wedding.listen}
          />

          <main className="relative z-10">
            <HeroSection />
            <LetterSection />
            <CoupleSection />
            <SpringSection />
            <StorySection />
            <JourneySection />
            <EventsSection />
            <CountdownSection />
            <FamilySection />
            <KeepsakeSection />
            <RsvpSection />
            <ClosingSection />
          </main>
        </>
      )}
    </div>
  )
}

export default function SakuraInvite() {
  return (
    <EggProvider>
      <Invite />
    </EggProvider>
  )
}
