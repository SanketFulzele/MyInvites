import { motion } from 'framer-motion'
import Navbar from '../components/site/Navbar'
import Footer from '../components/site/Footer'
import ThemeCard from '../components/site/ThemeCard'
import { Eyebrow, GoldRule, Sprig } from '../components/site/Ornaments'
import { themes } from '../themes/registry'

export default function ThemesPage() {
  return (
    <div className="site-paper relative min-h-screen overflow-x-clip text-site-ink">
      <Navbar />
      <section className="relative overflow-hidden pb-24 pt-32 sm:pt-40">
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-24 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(244,214,208,.85),transparent_65%)]" />
        <Sprig className="pointer-events-none absolute -left-4 top-28 hidden w-48 text-site-gold/40 md:block" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Eyebrow>The collection</Eyebrow>
            <h1 className="mt-4 font-playfair text-[2.7rem] leading-[1.05] text-balance sm:text-6xl">
              Find the world your <em className="text-site-wine">celebration lives in</em>
            </h1>
            <p className="mt-5 text-lg text-site-muted">Open any invitation to experience it exactly as your guests will.</p>
            <GoldRule className="mx-auto mt-6 w-40" />
          </motion.div>

          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:gap-9">
            {themes.map((t, i) => (
              <ThemeCard key={t.slug} theme={t} index={i} />
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-md text-center text-sm text-site-muted">More themes for weddings, engagements and birthdays are on the way.</p>
        </div>
      </section>
      <Footer />
    </div>
  )
}
