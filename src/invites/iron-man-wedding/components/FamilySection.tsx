import { Home, Users } from 'lucide-react'
import { HudPanel, Reveal, SectionHeading } from './Hud'
import type { WeddingInviteConfig } from '../../types'

export default function FamilySection({ config }: { config: WeddingInviteConfig }) {
  const names = { groom: config.groom, bride: config.bride }
  return (
    <section id="family" className="relative px-5 py-20">
      <SectionHeading code="FAMILY PROTOCOL" local="सस्नेह निमंत्रण" title={<>With the blessings of our <em className="text-stark-amber">Families</em></>} />

      <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
        {config.families.map((f, i) => {
          const person = names[f.side]
          return (
            <Reveal key={f.side} delay={i * 0.1}>
              <HudPanel glow={i === 0 ? 'reactor' : 'gold'} className="h-full p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stark-gold">{f.title}</p>
                <h3 className="mt-3 font-display text-4xl font-semibold text-white">{person.name}</h3>
                {person.qualification && <p className="mt-1 text-xs text-white/45">({person.qualification})</p>}

                <p className="mt-5 text-sm italic text-white/50">{f.relationLine}</p>
                <p className="mt-1 font-display text-xl leading-snug text-white">{f.parents}</p>

                {f.parentsLocal && (
                  <div className="mx-auto mt-4 max-w-xs rounded-xl border border-white/8 bg-black/20 p-3 font-marathi text-[15px] leading-relaxed text-stark-amber/85">
                    <p>{f.parentsLocal}</p>
                    {f.hometownLocal && <p className="text-white/60">{f.hometownLocal}</p>}
                    {f.relationLineLocal && <p className="text-white/60">{f.relationLineLocal}</p>}
                  </div>
                )}

                <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/60">
                  <Home className="h-4 w-4 text-reactor" /> {f.hometown}
                </p>

                {f.others && f.others.length > 0 && (
                  <ul className="mt-4 space-y-1 text-sm text-white/70">
                    {f.others.map((o) => (
                      <li key={o.relation}>
                        <span className="text-white/40">{o.relation}: </span>
                        {o.names}
                      </li>
                    ))}
                  </ul>
                )}
              </HudPanel>
            </Reveal>
          )
        })}
      </div>

      <Reveal className="mx-auto mt-8 max-w-md text-center" delay={0.15}>
        <HudPanel className="px-6 py-5">
          <p className="inline-flex items-center gap-2 font-hud text-[9px] tracking-[0.35em] text-reactor/80">
            <Users className="h-3.5 w-3.5" /> INVITED BY · निमंत्रक
          </p>
          {config.inviters.textLocal && <p className="mt-3 font-marathi text-2xl text-stark-amber">{config.inviters.textLocal}</p>}
          <p className="mt-1 text-sm text-white/60">{config.inviters.text}</p>
        </HudPanel>
      </Reveal>
    </section>
  )
}
