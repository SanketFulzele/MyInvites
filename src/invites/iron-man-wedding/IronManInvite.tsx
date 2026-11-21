import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { config } from './config'
import { fmt, parseLocal } from '../../lib/date'
import { JarvisProvider, useJarvis } from './components/Jarvis'
import { useMusic } from './components/useMusic'
import Particles from './components/Particles'
import WelcomeScreen from './components/WelcomeScreen'
import HeroSection from './components/HeroSection'
import CoupleSection from './components/CoupleSection'
import StorySection from './components/StorySection'
import EventsSection from './components/EventsSection'
import CountdownSection from './components/CountdownSection'
import FamilySection from './components/FamilySection'
import VenueSection from './components/VenueSection'
import CardsSection from './components/CardsSection'
import RsvpSection from './components/RsvpSection'
import ClosingSection from './components/ClosingSection'
import Dock from './components/Dock'

export default function IronManInvite() {
  return (
    <JarvisProvider>
      <Invitation />
    </JarvisProvider>
  )
}

function Invitation() {
  const [entered, setEntered] = useState(false)
  const music = useMusic(config.music.src)
  const { say } = useJarvis()

  const wedding = useMemo(() => parseLocal(config.weddingDateTime, config.timezoneOffset), [])
  const tz = config.timeZone
  const dateParts = {
    weekday: fmt.weekday(wedding, tz),
    day: fmt.day(wedding, tz),
    month: fmt.month(wedding, tz),
    year: fmt.year(wedding, tz),
    time: fmt.time(wedding, tz),
  }
  const dateLine = `${dateParts.weekday.slice(0, 3).toUpperCase()} · ${dateParts.day} · ${fmt.monthShort(wedding, tz).toUpperCase()} · ${dateParts.year}`

  // page chrome: title, dark theme colour, lock scroll behind the welcome screen
  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="theme-color"]')
    const prevColor = meta?.getAttribute('content')
    document.title = config.meta.pageTitle
    meta?.setAttribute('content', '#07080c')
    document.body.style.background = '#07080c'
    console.log('%cJ.A.R.V.I.S.%c Hello, curious guest. There are a few secrets hidden in this invitation — tap things.', 'color:#7fe9ff;font-weight:bold', 'color:inherit')
    return () => {
      document.title = prevTitle
      if (prevColor) meta?.setAttribute('content', prevColor)
      document.body.style.background = ''
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = entered ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [entered])

  const enter = () => {
    void music.play()
    window.scrollTo(0, 0)
    setEntered(true)
    window.setTimeout(() => say('Welcome. You have been personally invited — this is not a drill.', 'welcome'), 1800)
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-stark-night font-sans text-white">
      {/* fixed cinematic backdrop */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_0%,#2a0a0e_0%,#07080c_55%)]" />
        <div className="absolute inset-0 opacity-[.07] [background-image:linear-gradient(rgba(127,233,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(127,233,255,.6)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-stark-red/10 blur-3xl" />
        <div className="absolute -right-32 top-2/3 h-96 w-96 rounded-full bg-stark-gold/[.07] blur-3xl" />
      </div>
      <Particles />

      <AnimatePresence>
        {!entered && (
          <WelcomeScreen groom={config.groom.name} bride={config.bride.name} dateLine={dateLine} blessing={config.blessingLine} onEnter={enter} />
        )}
      </AnimatePresence>

      <main className="relative z-10">
        <HeroSection config={config} dateParts={dateParts} />
        <CoupleSection config={config} />
        <StorySection config={config} />
        <EventsSection config={config} />
        <CountdownSection target={wedding} names={`${config.groom.name} & ${config.bride.name}`} />
        <FamilySection config={config} />
        <VenueSection config={config} />
        <CardsSection config={config} />
        <RsvpSection config={config} />
        <ClosingSection config={config} />
      </main>

      {entered && <Dock playing={music.playing} onToggleMusic={music.toggle} />}
    </div>
  )
}
