import { Link } from 'react-router-dom'
import { ArrowUpRight, Sparkles, Wand2 } from 'lucide-react'
import Navbar from '../components/site/Navbar'
import Footer from '../components/site/Footer'
import ThemeCard from '../components/site/ThemeCard'
import Aurora from '../components/site/Aurora'
import RevealText from '../components/site/RevealText'
import ScrollProgress from '../components/site/ScrollProgress'
import { themes } from '../themes/registry'

export default function ThemesPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-nova-950 text-nova-text">
      <ScrollProgress />
      <Navbar />
      <section className="grain relative isolate overflow-hidden pb-24 pt-32 sm:pt-40">
        <Aurora />
        <div className="nova-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="nova-starfield pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-nova-cyan sm:text-[11px]">
              <Sparkles className="h-3.5 w-3.5" /> My Invitations
            </p>
            <h1 className="mt-5 font-display text-5xl leading-[1.02] font-medium tracking-[-0.03em] text-balance sm:text-6xl">
              <RevealText parts={[{ text: 'Find the world your ' }, { text: 'celebration lives in.', className: 'gradient-text' }]} />
            </h1>
            <p className="mt-5 text-lg text-nova-muted">
              Open a theme to experience the full invitation, exactly as your guests will see it.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-xl flex-wrap justify-center gap-3">
            {themes.map((theme) => (
              <Link
                key={theme.slug}
                to={`/invite/${theme.slug}`}
                className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 text-sm font-semibold text-white backdrop-blur transition hover:border-nova-violet/60 hover:bg-white/[0.09]"
              >
                <Sparkles className="h-4 w-4 text-nova-violet" />
                Open {theme.title} Invitation
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </div>

          <div className="mx-auto mt-14 grid max-w-xl gap-8 lg:max-w-[34rem]">
            {themes.map((t, i) => (
              <ThemeCard key={t.slug} theme={t} index={i} />
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-md text-center text-sm text-nova-muted">
            <Wand2 className="mr-1.5 inline h-4 w-4 text-nova-gold" />
            New themes for weddings, engagements and birthdays are on the way.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
