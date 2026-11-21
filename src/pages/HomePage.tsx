import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, MapPin, Music2, Smartphone, Sparkles, Wand2, Mail, MessageCircle, CalendarHeart } from 'lucide-react'
import Navbar from '../components/site/Navbar'
import Footer from '../components/site/Footer'
import ThemeCard from '../components/site/ThemeCard'
import ThemePreview from '../components/site/ThemePreview'
import { themes } from '../themes/registry'

const ease = [0.22, 1, 0.36, 1] as const

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <Hero />
      <ThemesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  )
}

function Hero() {
  return (
    <section className="grain relative overflow-hidden pt-28 pb-20 sm:pt-36 md:pb-28">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#f2c9b4]/60 blur-3xl" />
        <div className="absolute top-20 -right-32 h-[30rem] w-[30rem] rounded-full bg-[#f4dfae]/70 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#e8c7d2]/50 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1.1fr_.9fr]">
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-rose backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5" /> Every Celebration Deserves Its Own Story
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="mt-6 font-display text-[3.1rem] leading-[0.98] font-semibold tracking-tight text-ink text-balance sm:text-7xl lg:text-[5.4rem]"
          >
            Make Every Invitation <em className="font-medium text-rose">Unforgettable.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-soft lg:mx-0"
          >
            Discover beautifully crafted digital invitations that turn your special moments into unforgettable
            experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.34, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link
              to="/themes"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-semibold text-ivory shadow-xl shadow-ink/25 transition hover:-translate-y-0.5 hover:bg-plum"
            >
              Explore Invitations
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#themes"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/60 px-7 py-4 font-semibold text-ink backdrop-blur transition hover:border-ink/30 hover:bg-white"
            >
              Discover Our Themes
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-soft lg:justify-start"
          >
            {[
              [Smartphone, 'Made for WhatsApp'],
              [MapPin, 'One-tap directions'],
              [Music2, 'Music & motion'],
            ].map(([Icon, label]) => {
              const I = Icon as typeof Smartphone
              return (
                <li key={label as string} className="flex items-center gap-2">
                  <I className="h-4 w-4 text-gold" /> {label as string}
                </li>
              )
            })}
          </motion.ul>
        </div>

        <PhoneShowcase />
      </div>
    </section>
  )
}

function PhoneShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 4 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 1, delay: 0.2, ease }}
      className="relative mx-auto w-full max-w-[19rem] sm:max-w-[21rem]"
    >
      {/* floating paper cards */}
      <div className="absolute -left-14 top-16 hidden h-44 w-32 -rotate-12 rounded-2xl border border-gold/30 bg-gradient-to-b from-white to-cream p-3 shadow-xl sm:block">
        <div className="h-full rounded-xl border border-gold/40 p-2 text-center">
          <Heart className="mx-auto h-4 w-4 text-rose" />
          <p className="mt-2 font-script text-xl text-rose">Save the date</p>
          <div className="mx-auto mt-2 h-px w-12 bg-gold/60" />
          <p className="mt-2 font-display text-xs text-ink-soft">Engagement</p>
        </div>
      </div>
      <div className="absolute -right-12 bottom-16 hidden h-40 w-32 rotate-12 rounded-2xl border border-gold/30 bg-gradient-to-b from-[#fff4e4] to-[#f6e2c4] p-3 shadow-xl sm:block">
        <div className="grid h-full place-items-center rounded-xl border border-dashed border-gold/50 text-center">
          <div>
            <CalendarHeart className="mx-auto h-5 w-5 text-gold" />
            <p className="mt-2 font-display text-lg text-ink">Haldi</p>
            <p className="text-[10px] uppercase tracking-widest text-ink-soft">Coming soon</p>
          </div>
        </div>
      </div>

      {/* phone */}
      <div className="animate-float relative rounded-[2.8rem] bg-ink p-2.5 shadow-[0_50px_100px_-30px_rgba(58,31,43,.6)] ring-1 ring-black/40">
        <div className="relative aspect-[9/19] overflow-hidden rounded-[2.3rem]">
          <ThemePreview preview="iron-man" />
          <div className="absolute left-1/2 top-2 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
          <div className="absolute inset-x-4 bottom-24 rounded-2xl border border-reactor/30 bg-black/40 p-3 backdrop-blur">
            <p className="font-hud text-[8px] tracking-[0.35em] text-reactor">J.A.R.V.I.S.</p>
            <p className="mt-1 font-tech text-sm text-white/85">Guest identified. Your seat at the celebration is reserved.</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink text-balance sm:text-5xl">{title}</h2>
      {children && <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">{children}</p>}
    </div>
  )
}

function ThemesSection() {
  return (
    <section id="themes" className="relative scroll-mt-20 bg-cream/60 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionTitle eyebrow="Explore Themes" title={<>Invitations with a <em className="text-rose">personality</em></>}>
          Each theme is its own little world — designed, animated and crafted around the people celebrating.
        </SectionTitle>

        <div className="mx-auto mt-14 grid max-w-[34rem] gap-8">
          {themes.map((t, i) => (
            <ThemeCard key={t.slug} theme={t} index={i} />
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-md text-center text-sm text-ink-soft">
          <Wand2 className="mr-1.5 inline h-4 w-4 text-gold" />
          More themes are being crafted — new worlds for weddings, birthdays and engagements are on the way.
        </p>
      </div>
    </section>
  )
}

const features = [
  {
    icon: Heart,
    title: 'Personal',
    text: 'Your names, your photographs, your story and your families — told the way you would tell it.',
  },
  {
    icon: Wand2,
    title: 'Creative',
    text: 'From royal and traditional to fandom-inspired worlds, every theme has its own design language.',
  },
  {
    icon: Sparkles,
    title: 'Interactive',
    text: 'Cinematic openings, music, countdowns, maps and hidden surprises that make guests smile.',
  },
  {
    icon: Smartphone,
    title: 'Made for phones',
    text: 'Most guests open invitations on WhatsApp, so every theme is designed mobile-first and loads fast.',
  },
]

function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionTitle eyebrow="About My Invites" title={<>A card is read once. <em className="text-rose">A story is remembered.</em></>}>
          My Invites transforms ordinary invitation cards into beautiful interactive websites — one link that carries
          every detail, every event and every bit of joy.
        </SectionTitle>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.07, ease }}
              className="rounded-3xl border border-ink/8 bg-white p-7 shadow-[0_20px_40px_-30px_rgba(29,21,18,.35)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#fbe6c7] to-[#f3cdbb] text-rose">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-ink">{f.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{f.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 rounded-[2rem] bg-ink p-8 text-ivory sm:p-12 md:grid-cols-3">
          {[
            ['01', 'Choose a theme', 'Pick the world that feels like you.'],
            ['02', 'Share your details', 'Names, events, venues, photos and family.'],
            ['03', 'Send one link', 'Guests open it on WhatsApp — maps, music and RSVP included.'],
          ].map(([n, t, d]) => (
            <div key={n}>
              <p className="font-display text-5xl text-gold-soft/80">{n}</p>
              <h4 className="mt-3 font-display text-2xl">{t}</h4>
              <p className="mt-1 text-sm text-ivory/60">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-20 pb-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-gold/25 bg-gradient-to-br from-[#fff7ea] via-[#fbe9dc] to-[#f4dcc9] p-8 text-center sm:p-14">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/50 blur-2xl" />
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose">Contact</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold text-ink text-balance sm:text-5xl">
            Planning a celebration? Let&apos;s give it its own story.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-soft">
            Tell us about your occasion and we&apos;ll help you craft an invitation your guests will talk about.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {/* Placeholder contact links — replace with real email / WhatsApp number */}
            <a
              href="mailto:hello@example.com"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 font-semibold text-ivory transition hover:bg-plum"
            >
              <Mail className="h-4 w-4" /> Write to us
            </a>
            <a
              href="https://wa.me/?text=Hi%20My%20Invites!%20I%27d%20love%20a%20digital%20invitation."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/15 bg-white/70 px-7 py-4 font-semibold text-ink transition hover:bg-white"
            >
              <MessageCircle className="h-4 w-4 text-emerald-600" /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
