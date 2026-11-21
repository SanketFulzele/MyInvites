import { Wand2 } from 'lucide-react'
import Navbar from '../components/site/Navbar'
import Footer from '../components/site/Footer'
import ThemeCard from '../components/site/ThemeCard'
import { themes } from '../themes/registry'

export default function ThemesPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <section className="grain relative overflow-hidden pt-32 pb-24 sm:pt-40">
        <div className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-[#f4dfae]/60 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-rose">Explore Themes</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-ink text-balance sm:text-6xl">
              Find the world your celebration lives in
            </h1>
            <p className="mt-4 text-lg text-ink-soft">
              Open a theme to experience the full invitation, exactly as your guests will see it.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-xl gap-8 lg:max-w-[34rem]">
            {themes.map((t, i) => (
              <ThemeCard key={t.slug} theme={t} index={i} />
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-md text-center text-sm text-ink-soft">
            <Wand2 className="mr-1.5 inline h-4 w-4 text-gold" />
            New themes for weddings, engagements and birthdays are on the way.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
