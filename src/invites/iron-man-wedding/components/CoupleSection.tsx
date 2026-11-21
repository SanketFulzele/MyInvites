import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { HudPanel, Reveal, SectionHeading } from './Hud'
import type { Person, WeddingInviteConfig } from '../../types'

export default function CoupleSection({ config }: { config: WeddingInviteConfig }) {
  const [main, second] = config.gallery
  return (
    <section id="couple" className="relative scroll-mt-4 px-5 py-20">
      <SectionHeading code="SUBJECTS IDENTIFIED" title={<>The <em className="text-stark-amber">Couple</em></>} subtitle={config.intro} />

      {/* Feature photo in a HUD frame */}
      {main && (
        <Reveal className="mx-auto max-w-md">
          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-stark-red/50 via-transparent to-stark-gold/40 blur-xl" />
            <HudPanel glow="gold" className="relative overflow-hidden p-2">
              <div className="relative overflow-hidden rounded-xl">
                <motion.img
                  src={main.src}
                  alt={main.alt}
                  loading="lazy"
                  className="aspect-[5/4.4] w-full object-cover"
                  initial={{ scale: 1.12 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
                  <p className="font-script text-3xl text-white drop-shadow">{main.caption}</p>
                  <p className="font-hud text-[9px] tracking-[0.3em] text-reactor">MATCH 100%</p>
                </div>
                {/* targeting reticle */}
                <svg viewBox="0 0 100 100" className="pointer-events-none absolute right-3 top-3 h-12 w-12 animate-spin-slow opacity-70" aria-hidden>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#7fe9ff" strokeWidth="2" strokeDasharray="10 14" />
                  <circle cx="50" cy="50" r="6" fill="#7fe9ff" />
                </svg>
              </div>
            </HudPanel>
          </div>
        </Reveal>
      )}

      <div className="mx-auto mt-10 grid max-w-3xl gap-5 sm:grid-cols-2">
        <PersonCard person={config.groom} role="The Groom" code="MARK · N" delay={0} />
        <PersonCard person={config.bride} role="The Bride" code="MARK · H" delay={0.12} />
      </div>

      {second && (
        <Reveal className="mx-auto mt-10 max-w-sm" delay={0.1}>
          <div className="relative overflow-hidden rounded-[1.6rem] border border-white/10">
            <img src={second.src} alt={second.alt} loading="lazy" className="aspect-[4/4.2] w-full object-cover object-top" />
            <div className="absolute inset-0 bg-gradient-to-t from-stark-night via-transparent to-transparent" />
            <p className="absolute inset-x-0 bottom-4 text-center font-script text-3xl text-stark-amber">{second.caption}</p>
          </div>
        </Reveal>
      )}
    </section>
  )
}

function PersonCard({ person, role, code, delay }: { person: Person; role: string; code: string; delay: number }) {
  return (
    <Reveal delay={delay}>
      <HudPanel className="p-6 text-center">
        <p className="font-hud text-[9px] tracking-[0.4em] text-reactor/70">{code}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.3em] text-stark-gold">{role}</p>
        <h3 className="mt-2 font-display text-5xl font-semibold text-white">{person.name}</h3>
        {person.nameLocal && (
          <p className="mt-1 font-marathi text-xl text-stark-amber/85">
            {person.honorificLocal && <span className="mr-1 text-sm text-white/50">{person.honorificLocal}</span>}
            {person.nameLocal}
          </p>
        )}
        {person.qualification && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75">
            <GraduationCap className="h-3.5 w-3.5 text-reactor" /> {person.qualification}
          </p>
        )}
        {person.bio && <p className="mt-4 text-sm leading-relaxed text-white/60">{person.bio}</p>}
      </HudPanel>
    </Reveal>
  )
}
