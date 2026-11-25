import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarHeart, Languages, MapPin, MessageCircle, Music2, Sparkles } from 'lucide-react'
import Navbar from '../components/site/Navbar'
import Footer from '../components/site/Footer'
import ThemeCard from '../components/site/ThemeCard'
import ThemePreview from '../components/site/ThemePreview'
import { Eyebrow, GoldRule, Sprig, WaxSeal } from '../components/site/Ornaments'
import { ROSE_CLUSTER, RoseImg } from '../invites/royal-rose-wedding/art'
import { themes, type ThemeMeta } from '../themes/registry'
import { CONTACT } from '../lib/contact'

const ease = [0.22, 1, 0.36, 1] as const

export default function HomePage() {
  return (
    <div className="site-paper relative min-h-screen overflow-x-clip text-site-ink">
      <Navbar />
      <main>
        <Hero />
        <Collection />
        <HowItWorks />
        <Features />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function Heading({ eyebrow, children, sub, center = true }: { eyebrow: string; children: ReactNode; sub?: ReactNode; center?: boolean }) {
  return (
    <motion.div
      className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease }}
    >
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 font-playfair text-[2.4rem] leading-[1.08] text-site-ink text-balance sm:text-5xl">{children}</h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-site-muted sm:text-lg">{sub}</p>}
      <GoldRule className={`mt-6 w-40 ${center ? 'mx-auto' : ''}`} />
    </motion.div>
  )
}

/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  const rise = (d: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: d, ease },
  })
  return (
    <section className="relative overflow-hidden pb-16 pt-28 sm:pt-36 lg:pb-24">
      {/* soft blush washes */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(244,214,208,.9),transparent_65%)]" />
        <div className="absolute -right-32 top-24 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(247,228,205,.85),transparent_65%)]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr]">
        <div className="text-center lg:text-left">
          <motion.div {...rise(0)} className="flex justify-center lg:justify-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-site-line bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-site-rose">
              <Sparkles className="h-3.5 w-3.5" /> Digital invitations
            </span>
          </motion.div>

          <motion.h1 {...rise(0.08)} className="mt-6 font-playfair text-[2.9rem] leading-[1.02] text-site-ink text-balance sm:text-6xl lg:text-[4.5rem]">
            Every celebration deserves <em className="text-site-wine">its own story.</em>
          </motion.h1>

          <motion.p {...rise(0.18)} className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-site-muted lg:mx-0">
            Beautiful, interactive wedding and celebration invitations your guests open straight from WhatsApp — with the venue map, the
            schedule, your music and an RSVP, all in one link.
          </motion.p>

          <motion.div {...rise(0.28)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <a
              href="#collection"
              className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-site-wine px-8 text-[15px] font-semibold text-site-paper shadow-[0_16px_30px_-16px_rgba(107,34,52,.8)] transition hover:bg-[#561a29]"
            >
              Browse the invitations
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-site-line bg-white/70 px-8 text-[15px] font-semibold text-site-ink transition hover:border-site-gold"
            >
              How it works
            </a>
          </motion.div>

          <motion.ul {...rise(0.4)} className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-site-muted lg:justify-start">
            {['Opens from WhatsApp', 'Map & RSVP built in', 'English & मराठी'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1 w-1 rotate-45 bg-site-gold" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <HeroStack />
      </div>
    </section>
  )
}

/** Three real invitations fanned like cards on a table, with roses tucked around them. */
function HeroStack() {
  const pick = (p: ThemeMeta['preview']) => themes.find((t) => t.preview === p)
  const cards = [
    { theme: pick('bodhi'), cls: 'left-[2%] top-[10%] -rotate-[9deg] z-10', delay: 0.35 },
    { theme: pick('sakura'), cls: 'right-[2%] top-[8%] rotate-[8deg] z-10', delay: 0.45 },
    { theme: pick('royal-rose'), cls: 'left-1/2 top-0 -translate-x-1/2 z-20', delay: 0.25 },
  ].filter((c) => c.theme)

  return (
    <div className="relative mx-auto h-[25rem] w-full max-w-[30rem] sm:h-[31rem]">
      <img src={ROSE_CLUSTER} alt="" aria-hidden className="pointer-events-none absolute -left-10 -top-8 z-30 w-32 sm:w-40" />
      <img src={ROSE_CLUSTER} alt="" aria-hidden className="pointer-events-none absolute -bottom-6 -right-8 z-30 w-36 rotate-180 sm:w-44" />
      <Sprig className="pointer-events-none absolute -bottom-2 left-0 z-0 w-40 text-site-gold/60" />

      {cards.map(({ theme, cls, delay }) => (
        <motion.div
          key={theme!.slug}
          className={`absolute ${cls}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay, ease }}
        >
          <Link
            to={`/invite/${theme!.slug}`}
            aria-label={`Open the ${theme!.title} invitation`}
            className={`block w-[10.5rem] rounded-t-[999px] rounded-b-[22px] border border-site-gold/50 bg-white p-1.5 shadow-[0_30px_50px_-28px_rgba(42,29,34,.6)] transition-transform duration-500 hover:-translate-y-2 sm:w-[13rem] ${theme!.preview === 'royal-rose' ? 'site-float' : ''}`}
          >
            <div className="aspect-[3/4.6] overflow-hidden rounded-t-[999px] rounded-b-[18px]">
              <ThemePreview preview={theme!.preview} />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

/* ───────────────────────── Collection ───────────────────────── */

function Collection() {
  return (
    <section id="collection" className="relative scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Heading
          eyebrow="The collection"
          sub="Each one is its own little world — its own opening, artwork, music and story. Open any of them exactly as your guests would."
        >
          {themes.length} invitations, <em className="text-site-wine">{themes.length} little worlds</em>
        </Heading>
        <div className="mt-14 grid gap-7 md:grid-cols-2 lg:gap-9">
          {themes.map((t, i) => (
            <ThemeCard key={t.slug} theme={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── How it works ───────────────────────── */

const STEPS = [
  { title: 'Choose a theme', text: 'Pick the world that feels like your celebration — royal, serene, cinematic or playful.' },
  { title: 'Share your details', text: 'Names, families, dates, venues, photos and your song. We shape the invitation around them.' },
  { title: 'Send one link', text: 'Guests open it on WhatsApp — the map, schedule, countdown and RSVP are all inside.' },
]

function HowItWorks() {
  return (
    <section id="how" className="relative scroll-mt-20 border-y border-site-line bg-site-blush/45 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Heading eyebrow="How it works">
          From your details to <em className="text-site-wine">every guest’s phone</em>
        </Heading>
        <ol className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          <span aria-hidden className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-site-gold/70 to-transparent md:block" />
          {STEPS.map((s, i) => (
            <motion.li
              key={s.title}
              className="relative text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease }}
            >
              <span className="relative mx-auto grid h-16 w-16 place-items-center rounded-full border border-site-gold/60 bg-site-paper font-playfair text-2xl italic text-site-wine shadow-[0_10px_20px_-14px_rgba(107,34,52,.6)]">
                {i + 1}
              </span>
              <h3 className="mt-5 font-playfair text-2xl text-site-ink">{s.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-[15px] leading-relaxed text-site-muted">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ───────────────────────── Features ───────────────────────── */

const FEATURES = [
  { icon: Sparkles, title: 'A memorable opening', text: 'An envelope, a book or a cinematic reveal — the first tap feels like an occasion.' },
  { icon: MapPin, title: 'Directions in one tap', text: 'A map for every venue and a button that opens Google Maps.' },
  { icon: MessageCircle, title: 'RSVP on WhatsApp', text: 'Guests reply in seconds; the message arrives ready to read.' },
  { icon: CalendarHeart, title: 'Countdown & calendar', text: 'A live countdown and one-tap “Add to calendar” for each function.' },
  { icon: Music2, title: 'Your song', text: 'Your music fades in softly once the invitation is opened.' },
  { icon: Languages, title: 'English & मराठी', text: 'Switch languages in a tap, so every elder can read along.' },
]

function Features() {
  return (
    <section id="features" className="relative scroll-mt-20 py-20 sm:py-28">
      <Sprig className="pointer-events-none absolute -left-6 top-24 hidden w-52 text-site-gold/35 lg:block" />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Heading eyebrow="In every invitation" sub="Made for phones first, because that is where your guests will open it.">
          Everything guests need, <em className="text-site-wine">beautifully</em>
        </Heading>
        <div className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              className="flex gap-4"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease }}
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-site-blush text-site-wine">
                <Icon className="h-5 w-5" strokeWidth={1.6} />
              </span>
              <div>
                <h3 className="font-playfair text-xl text-site-ink">{title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-site-muted">{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Contact ───────────────────────── */

function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 px-5 pb-24 pt-4 sm:px-8">
      <motion.div
        className="relative mx-auto max-w-3xl overflow-hidden rounded-[30px] border border-site-line bg-white px-6 py-14 text-center shadow-[0_40px_70px_-50px_rgba(42,29,34,.6)] sm:px-14 sm:py-16"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease }}
      >
        {/* invitation-card double border */}
        <div aria-hidden className="pointer-events-none absolute inset-3 rounded-[22px] border border-site-gold/50" />
        <div aria-hidden className="pointer-events-none absolute inset-[18px] rounded-[18px] border border-site-gold/25" />
        <RoseImg tone="blush" className="absolute -left-8 -top-8 w-28" />
        <RoseImg tone="wine" className="absolute -bottom-8 -right-8 w-28" />

        <div className="relative">
          <WaxSeal className="mx-auto h-14 w-14" />
          <Eyebrow className="mt-5">Planning a celebration?</Eyebrow>
          <h2 className="mt-4 font-playfair text-[2.3rem] leading-[1.1] text-site-ink text-balance sm:text-5xl">
            Let’s begin <em className="text-site-wine">your story.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-site-muted">
            Tell us what you’re celebrating and when. We’ll help you choose a theme and make it unmistakably yours.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={CONTACT.whatsappLink('Hi! I’d love a digital invitation from My Invites.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full bg-site-wine px-8 text-[15px] font-semibold text-site-paper shadow-[0_16px_30px_-16px_rgba(107,34,52,.8)] transition hover:bg-[#561a29]"
            >
              <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
            </a>
            <a
              href="#collection"
              className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-site-line px-8 text-[15px] font-semibold text-site-ink transition hover:border-site-gold"
            >
              See the invitations
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
