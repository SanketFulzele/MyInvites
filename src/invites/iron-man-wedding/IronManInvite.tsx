import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { config } from './config'
import { fmt, parseLocal } from '../../lib/date'
import { playPowerUp } from '../../lib/ambientScore'
import { StatusProvider } from './components/status'
import { useMusic } from './components/useMusic'
import Opening from './components/Opening'
import TopBar, { type NavItem } from './components/TopBar'
import Hero from './components/Hero'
import Story from './components/Story'
import Events from './components/Events'
import Family from './components/Family'
import Venue from './components/Venue'
import Countdown from './components/Countdown'
import Rsvp from './components/Rsvp'
import Closing from './components/Closing'

export default function IronManInvite() {
  return (
    <StatusProvider>
      <Invitation />
    </StatusProvider>
  )
}

function Invitation() {
  const [entered, setEntered] = useState(false)
  const music = useMusic(config.music.src)

  const tz = config.timeZone
  const wedding = useMemo(() => parseLocal(config.weddingDateTime, config.timezoneOffset), [])
  const [y, m, d] = config.weddingDateTime.slice(0, 10).split('-')
  const numeric = `${d} · ${m} · ${y}`
  const heroDate = { numeric, weekday: fmt.weekday(wedding, tz), time: fmt.time(wedding, tz) }

  const nav: NavItem[] = [
    { id: 'hero', label: 'The Couple' },
    { id: 'story', label: 'Our Story' },
    { id: 'events', label: 'Celebrations' },
    { id: 'family', label: 'Families' },
    { id: 'venue', label: 'Venue' },
    { id: 'countdown', label: 'Countdown' },
    ...(config.rsvp.enabled ? [{ id: 'rsvp', label: 'RSVP' }] : []),
  ]

  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="theme-color"]')
    const prevColor = meta?.getAttribute('content')
    document.title = config.meta.pageTitle
    meta?.setAttribute('content', '#080a0f')
    document.body.style.background = '#080a0f'
    console.log(
      '%cJ.A.R.V.I.S.%c Hello, curious one. A few things in this invitation respond to a touch — the reactor, the numbers, the gauntlet, the signature.',
      'color:#66d9ff;font-weight:bold',
      'color:inherit',
    )
    return () => {
      document.title = prevTitle
      if (prevColor) meta?.setAttribute('content', prevColor)
      document.body.style.background = ''
    }
  }, [])

  // keep the page still behind the opening sequence
  useEffect(() => {
    document.body.style.overflow = entered ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [entered])

  const handleEnter = () => {
    playPowerUp()
    window.setTimeout(() => void music.play(), 500)
    window.scrollTo(0, 0)
  }

  return (
    <div className="relative min-h-screen overflow-x-clip bg-obsidian font-body text-paper antialiased">
      <AnimatePresence>
        {!entered && (
          <Opening
            presenter={config.opening.presenter}
            occasion={config.opening.occasion}
            tagline={config.opening.tagline}
            groom={config.groom.name}
            bride={config.bride.name}
            dateLine={numeric}
            placeLine={`${fmt.weekday(wedding, tz)} · ${config.placeLine}`}
            onEnter={handleEnter}
            onComplete={() => setEntered(true)}
          />
        )}
      </AnimatePresence>

      {entered && (
        <TopBar monogram={`${config.groom.name[0]} × ${config.bride.name[0]}`} nav={nav} playing={music.playing} onToggleMusic={music.toggle} />
      )}

      <main>
        <Hero config={config} ready={entered} date={heroDate} />
        <Story config={config} />
        <Events config={config} />
        <Family config={config} />
        <Venue config={config} />
        <Countdown target={wedding} dateText={`${fmt.full(wedding, tz)} · ${fmt.time(wedding, tz)}`} />
        {config.rsvp.enabled && <Rsvp config={config} />}
        <Closing config={config} />
      </main>
    </div>
  )
}
