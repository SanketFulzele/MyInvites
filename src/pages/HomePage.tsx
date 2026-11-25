import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarHeart,
  Check,
  Heart,
  MapPin,
  MessageCircle,
  Music2,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  WandSparkles,
} from 'lucide-react'
import Navbar from '../components/site/Navbar'
import Footer from '../components/site/Footer'
import SpotlightCard from '../components/site/SpotlightCard'
import ThemeCard from '../components/site/ThemeCard'
import ThemePreview from '../components/site/ThemePreview'
import Aurora from '../components/site/Aurora'
import Marquee from '../components/site/Marquee'
import RevealText from '../components/site/RevealText'
import MagneticLink from '../components/site/MagneticLink'
import ScrollProgress from '../components/site/ScrollProgress'
import { usePrefersReducedMotion } from '../hooks/useReducedMotion'
import { themes } from '../themes/registry'

const ease = [0.22, 1, 0.36, 1] as const

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-nova-950 text-nova-text">
      <ScrollProgress />
      <Navbar />
      <main className="relative">
        <Hero />
        <MarqueeBand />
        <InvitationsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

/* ---------------------------------- Hero --------------------------------- */

const rotatingWords = ['weddings', 'birthdays', 'engagements', 'celebrations']

function RotatingWord() {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = window.setInterval(() => setIndex((v) => (v + 1) % rotatingWords.length), 2400)
    return () => window.clearInterval(id)
  }, [reduced])

  return (
    <span className="relative inline-grid align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={rotatingWords[index]}
          initial={{ opacity: 0, y: reduced ? 0 : '75%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduced ? 0 : '-75%' }}
          transition={{ duration: reduced ? 0.01 : 0.45, ease }}
          className="col-start-1 row-start-1 whitespace-nowrap font-medium text-nova-cyan"
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
      {/* Reserve space for the longest word so the line never jumps. */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden="true">
        celebrations
      </span>
    </span>
  )
}

function Hero() {
  return (
    <section className="grain relative isolate min-h-[100svh] overflow-hidden pb-20 pt-28 sm:pb-24 sm:pt-36">
      <Aurora />
      <div className="nova-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="nova-starfield pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[32rem] w-[32rem] rounded-full border border-nova-violet/15" />
      <div className="pointer-events-none absolute -left-24 top-[38%] h-[24rem] w-[24rem] rounded-full border border-nova-cyan/10" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:min-h-[calc(100svh-16rem)] lg:grid-cols-[1.06fr_.94fr] lg:gap-6">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-nova-cyan backdrop-blur sm:text-[11px]"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-nova-cyan opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-nova-cyan" />
            </span>
            Digital invitations, reimagined
          </motion.div>

          <h1 className="mx-auto mt-7 max-w-3xl font-display text-[3.15rem] leading-[0.96] font-medium tracking-[-0.04em] text-balance sm:text-6xl lg:mx-0 lg:text-[5.2rem]">
            <RevealText
              parts={[
                { text: 'Your celebration, a ' },
                { text: 'world of its own.', className: 'gradient-text' },
              ]}
              delay={0.12}
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.34, ease }}
            className="mx-auto mt-6 max-w-xl text-base leading-7 text-nova-muted sm:text-lg sm:leading-8 lg:mx-0"
          >
            Cinematic, motion-filled invitations for <RotatingWord />. One thoughtful link your guests can open, share and keep forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.44, ease }}
            className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start"
          >
            <MagneticLink
              to="#invitations"
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-nova-violet to-nova-cyan px-7 text-sm font-bold text-nova-950 shadow-[0_16px_40px_-16px_rgba(95,225,232,.85)] transition hover:brightness-110"
            >
              Explore invitations
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </MagneticLink>
            <Link
              to="/invite/sakura-wedding"
              className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-semibold text-white backdrop-blur transition hover:border-nova-rose/60 hover:bg-white/[0.08]"
            >
              <Sparkles className="h-4 w-4 text-nova-rose" />
              See the Sakura invite
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs font-medium text-nova-muted lg:justify-start"
          >
            {[
              { icon: Smartphone, label: 'Made for phones' },
              { icon: MapPin, label: 'Every detail, one link' },
              { icon: ShieldCheck, label: 'Yours to keep' },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4 text-nova-violet" strokeWidth={1.8} />
                {label}
              </span>
            ))}
          </motion.div>
        </div>

        <Showcase />
      </div>

      <div className="relative z-10 mx-auto mt-16 flex max-w-7xl items-center gap-4 px-5 sm:px-8">
        <span className="hairline-glow h-px flex-1 opacity-50" />
        <span className="text-center font-display text-sm italic text-nova-muted">Made for moments worth keeping</span>
        <span className="hairline-glow h-px flex-1 opacity-50" />
      </div>
    </section>
  )
}

function Showcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 34, rotate: 1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 1, delay: 0.18, ease }}
      className="relative mx-auto h-[24rem] w-full max-w-[30rem] sm:h-[29rem]"
    >
      <div className="pointer-events-none absolute inset-x-10 bottom-0 top-10 rounded-full bg-nova-violet/25 blur-[85px]" />

      {/* Back phone — Iron Man */}
      <Link
        to="/invite/iron-man-wedding"
        aria-label="Open the Iron Man wedding invitation"
        className="absolute right-0 top-10 w-[9.5rem] rotate-[9deg] rounded-[2rem] border border-white/15 bg-nova-800 p-1.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)] transition-transform hover:rotate-[5deg] hover:scale-[1.03] sm:right-2 sm:w-[11.5rem]"
      >
        <div className="relative aspect-[9/18.5] overflow-hidden rounded-[1.6rem]">
          <ThemePreview preview="iron-man" />
        </div>
      </Link>

      {/* Front phone — Sakura */}
      <Link
        to="/invite/sakura-wedding"
        aria-label="Open the Sakura wedding invitation"
        className="absolute left-0 top-2 z-10 w-[10.5rem] -rotate-[6deg] rounded-[2.15rem] border border-white/20 bg-nova-900 p-1.5 shadow-[0_45px_90px_-30px_rgba(143,123,255,.75)] transition-transform hover:-rotate-[2deg] hover:scale-[1.03] sm:left-6 sm:w-[12.5rem]"
      >
        <div className="relative aspect-[9/18.8] overflow-hidden rounded-[1.75rem]">
          <ThemePreview preview="sakura" />
          <div className="absolute left-1/2 top-1.5 h-3.5 w-16 -translate-x-1/2 rounded-full bg-black/70" />
        </div>
      </Link>

      <div className="absolute left-0 top-[30%] z-20 hidden -rotate-3 rounded-2xl border border-white/15 bg-nova-900/85 px-4 py-3 shadow-2xl backdrop-blur sm:block">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-nova-rose">Your people, together</p>
        <p className="mt-1 font-display text-xl italic text-white">All in one place.</p>
      </div>
      <div className="absolute bottom-[12%] right-0 z-20 hidden rotate-3 items-center gap-2 rounded-full border border-white/15 bg-nova-900/85 px-4 py-3 text-xs font-semibold text-white shadow-2xl backdrop-blur sm:flex">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-nova-cyan/15 text-nova-cyan">
          <Check className="h-4 w-4" />
        </span>
        RSVP made simple
      </div>

      <p className="absolute inset-x-0 -bottom-1 z-20 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-nova-muted/70">
        One thoughtful link · everything in its place
      </p>
    </motion.div>
  )
}

/* ------------------------------- Marquee band ------------------------------ */

const celebrationWords = [
  'Weddings',
  'Engagements',
  'Birthdays',
  'Haldi & Mehendi',
  'Anniversaries',
  'Baby Showers',
  'Receptions',
]

function MarqueeBand() {
  return (
    <div className="relative border-y border-white/10 bg-nova-violet/[0.06] py-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#05060e,transparent_18%,transparent_82%,#05060e)]" />
      <Marquee
        items={celebrationWords.map((word) => (
          <span key={word} className="inline-flex items-center gap-6 px-6 font-hud text-xs font-semibold uppercase tracking-[0.28em] text-nova-muted sm:text-sm">
            {word}
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-nova-violet" />
          </span>
        ))}
      />
    </div>
  )
}

/* --------------------------- My Invitations section -------------------------- */

function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-nova-cyan sm:text-[11px]">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl leading-[1.02] font-medium tracking-[-0.03em] text-balance sm:text-6xl">{title}</h2>
      {children && <p className="mt-5 max-w-xl text-base leading-7 text-nova-muted sm:text-lg sm:leading-8">{children}</p>}
    </div>
  )
}

function InvitationsSection() {
  return (
    <section id="invitations" className="grain relative scroll-mt-20 overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-nova-violet/12 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-nova-cyan/10 blur-[110px]" />
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle eyebrow="My Invitations" title={<>Pick a world. <em className="font-medium text-nova-violet">Open the door.</em></>}>
            Each card below is a real, working invitation. Tap <span className="font-semibold text-white">Open this invitation</span> to step inside — just like opening the card on WhatsApp.
          </SectionTitle>
          <Link
            to="/themes"
            className="group inline-flex shrink-0 items-center gap-2 self-start border-b border-nova-violet/50 pb-1 text-sm font-semibold text-white transition hover:border-nova-cyan md:mb-1 md:self-auto"
          >
            See all invitations <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Direct, always-visible routes — no hunting required. */}
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            to="/invite/sakura-wedding"
            className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-nova-rose/40 bg-nova-rose/10 px-5 text-sm font-bold text-white transition hover:bg-nova-rose/20"
          >
            <Sparkles className="h-4 w-4 text-nova-rose" />
            Open Sakura Wedding
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/invite/iron-man-wedding"
            className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-nova-gold/40 bg-nova-gold/10 px-5 text-sm font-bold text-white transition hover:bg-nova-gold/20"
          >
            <Play className="h-4 w-4 text-nova-gold" />
            Open Iron Man Wedding
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/invite/bodhi-wedding"
            className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-nova-gold/40 bg-nova-gold/10 px-5 text-sm font-bold text-white transition hover:bg-nova-gold/20"
          >
            <Sparkles className="h-4 w-4 text-nova-gold" />
            Open Bodhi Wedding
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            to="/invite/royal-rose-wedding"
            className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-nova-rose/40 bg-nova-rose/10 px-5 text-sm font-bold text-white transition hover:bg-nova-rose/20"
          >
            <Sparkles className="h-4 w-4 text-nova-rose" />
            Open Royal Rose Wedding
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid items-stretch gap-7 md:grid-cols-2">
          {themes.map((theme, index) => (
            <ThemeCard key={theme.slug} theme={theme} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------------------------------- About ---------------------------------- */

const moments = [
  { number: '01', icon: Heart, title: 'Personal by nature', text: 'Your names, your people, your little details. The things that make the day unmistakably yours.' },
  { number: '02', icon: WandSparkles, title: 'A little unexpected', text: 'Cinematic openings, original music and hidden surprises turn a link into a lovely discovery.' },
  { number: '03', icon: Smartphone, title: 'Ready to share', text: 'Made for the phones guests already use, and easy to pass along to the people they love.' },
]

function AboutSection() {
  return (
    <section id="about" className="grain relative scroll-mt-20 border-t border-white/10 bg-nova-900/60 py-20 sm:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-nova-gold sm:text-[11px]">Not just an invite</p>
            <h2 className="mt-4 max-w-md font-display text-4xl leading-[1.02] font-medium tracking-[-0.03em] text-balance sm:text-6xl">
              A card gets opened.
              <br />
              <em className="font-medium text-nova-cyan">A story stays.</em>
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-nova-muted">
              My Invites turns a celebration into a little place of its own — one link for the story, the schedule and everyone who matters.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {moments.map(({ number, icon: Icon, title, text }, index) => (
              <motion.div
                key={number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: index * 0.07, ease }}
              >
                <SpotlightCard
                  spotlightColor="rgba(95,225,232,.18)"
                  className="glass-panel h-full rounded-2xl p-5 transition-colors hover:border-white/20 sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg italic text-nova-cyan">{number}</span>
                    <Icon className="h-5 w-5 text-nova-violet" strokeWidth={1.6} />
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-medium text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-nova-muted">{text}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>

        <div id="how-it-works" className="mt-20 scroll-mt-24 border-t border-white/10 pt-8 sm:mt-24 sm:pt-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-nova-gold sm:text-[11px]">A lovely little process</p>
              <h3 className="mt-3 font-display text-3xl font-medium">Three steps. Then let the celebrating begin.</h3>
            </div>
            <div className="grid flex-1 gap-6 sm:grid-cols-3 md:max-w-[52rem] md:gap-8">
              {[
                { icon: CalendarHeart, title: 'Choose a theme', text: 'Find the look that feels like your celebration.' },
                { icon: Music2, title: 'Make it yours', text: 'Bring in your details, people and plans.' },
                { icon: MessageCircle, title: 'Share the joy', text: 'Send one link and let everyone in.' },
              ].map(({ icon: Icon, title, text }, i) => (
                <div key={title} className="border-t border-white/15 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-nova-violet">0{i + 1}</span>
                    <Icon className="h-4 w-4 text-nova-muted" />
                  </div>
                  <h4 className="mt-3 font-display text-xl font-medium text-white">{title}</h4>
                  <p className="mt-1 text-sm leading-6 text-nova-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- Contact --------------------------------- */

function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="glass-panel relative overflow-hidden rounded-[2rem] px-6 py-12 sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-24 -top-36 h-96 w-96 rounded-full bg-nova-violet/25 blur-[90px]" />
          <div className="nova-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-nova-cyan sm:text-[11px]">Your story goes here</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.02] font-medium tracking-[-0.03em] text-balance sm:text-6xl">
              Let&apos;s make the first impression <em className="font-medium text-nova-rose">a lovely one.</em>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-nova-muted">
              Tell us what you&apos;re celebrating. We&apos;ll help you find an invitation that feels like the start of your story.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:hello@example.com"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-nova-violet to-nova-cyan px-7 text-sm font-bold text-nova-950 transition hover:brightness-110"
              >
                Tell us about it <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/?text=Hi%20My%20Invites!%20I%27d%20love%20a%20digital%20invitation."
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-7 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
