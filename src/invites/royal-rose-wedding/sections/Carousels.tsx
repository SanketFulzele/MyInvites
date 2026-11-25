import { CalendarDays, Clock, MapPin } from 'lucide-react'
import { EventIcon, Scene } from '../art'
import { BlurIn, Carousel3D, Section, SectionTitle } from '../ui'
import { EVENT_LOOK, royalRose as R, W } from '../royalRose.config'
import { useLang, useT } from '../../bodhi-wedding/ui'
import { dateText, timeText, toDate } from '../../bodhi-wedding/dates'

/** Wedding Festivities — one card per function. */
export function Festivities() {
  const t = useT()
  const { lang } = useLang()
  return (
    <Section id="festivities" className="py-16">
      <SectionTitle eyebrow={lang === 'en' ? 'Swipe through' : 'बाजूला सरकवा'} title={t(R.copy.festivities)} />
      <div className="mt-10">
        <Carousel3D
          items={W.events}
          label="Wedding festivities"
          height="470px"
          cardClass="w-[min(76vw,300px)] h-[460px]"
          render={(e) => {
            const look = EVENT_LOOK[e.id]
            const d = toDate(e.start)
            return (
              <article className="relative h-full overflow-hidden rounded-[22px] border border-rr-gold/60 bg-rr-ivory shadow-[0_30px_50px_-30px_rgba(110,31,47,.7)]">
                {/* blurred illustrated scene (static blur, small area) */}
                <div className="absolute inset-x-0 top-0 h-[46%] overflow-hidden">
                  <Scene id={e.id} className="h-full w-full scale-110 blur-[3px]" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-rr-ivory" />
                </div>
                <div className="relative flex h-full flex-col px-6 pb-6 pt-[34%]">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-rr-gold/70 bg-rr-ivory shadow-[0_8px_18px_-10px_rgba(110,31,47,.7)]">
                    <EventIcon id={e.id} />
                  </div>
                  <h3 className="mt-3 text-center font-playfair text-[2rem] leading-none italic text-rr-wine">{e.name.en}</h3>
                  <p className="text-center font-marathi text-lg" style={{ color: look.accent }}>
                    {e.name.mr}
                  </p>
                  <ul className={`mt-4 space-y-2 text-[14px] text-rr-ink/85 ${lang === 'mr' ? 'font-marathi' : 'font-montserrat'}`}>
                    <li className="flex items-start gap-2.5">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-rr-gold-deep" /> {dateText(d, lang)}
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-rr-gold-deep" /> {timeText(d, lang)}
                    </li>
                    <li className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-rr-gold-deep" /> {e.address ? t(e.address) : e.venue}
                    </li>
                  </ul>
                  <div className="mt-auto flex items-center gap-3 border-t border-rr-gold/30 pt-3">
                    <div className="flex -space-x-1.5">
                      {look.swatches.map((s) => (
                        <span key={s} className="h-5 w-5 rounded-full border-2 border-rr-ivory shadow-[0_0_0_1px_rgba(154,118,55,.5)]" style={{ background: s }} />
                      ))}
                    </div>
                    <p className={`text-[13px] text-rr-ink/80 ${lang === 'mr' ? 'font-marathi' : 'font-montserrat'}`}>
                      <span className="font-semibold text-rr-wine">{lang === 'en' ? 'Dress code' : 'पोशाख'}:</span> {t(e.dressCode)}
                    </p>
                  </div>
                </div>
              </article>
            )
          }}
        />
      </div>
    </Section>
  )
}

/** Our Story — a swipeable photo carousel with captions. */
export function OurStory() {
  const t = useT()
  const { lang } = useLang()
  const slides = R.story.map((s) => ({ ...s, m: W.story.milestones[s.milestone] }))
  return (
    <Section id="our-story" className="py-16">
      <SectionTitle eyebrow={lang === 'en' ? 'Chapters of us' : 'आमचे क्षण'} title={t(R.copy.ourStory)} />
      <div className="mt-10">
        <Carousel3D
          items={slides}
          label="Our story photos"
          height="520px"
          cardClass="w-[min(70vw,280px)] h-[510px]"
          render={(s, active) => (
            <figure className="flex h-full flex-col">
              <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[18px] border-[3px] border-rr-ivory shadow-[0_0_0_1px_rgba(198,161,91,.7),0_30px_50px_-30px_rgba(110,31,47,.8)]">
                <img src={s.src} alt={s.alt} loading="lazy" draggable={false} className="aspect-[3/4.1] w-full object-cover" />
              </div>
              <figcaption className={`mt-4 px-1 text-center transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`}>
                <p className={`text-rr-wine ${lang === 'mr' ? 'font-marathi text-lg' : 'font-playfair text-xl italic'}`}>{t(s.m.title)}</p>
                <p className={`mt-1 line-clamp-3 text-[13px] leading-relaxed text-rr-ink/70 ${lang === 'mr' ? 'font-marathi' : 'font-montserrat'}`}>{t(s.m.text)}</p>
              </figcaption>
            </figure>
          )}
        />
      </div>
      <BlurIn as="p" className="mx-auto mt-6 max-w-xs text-center font-montserrat text-[11px] uppercase tracking-[0.2em] text-rr-ink/40">
        {lang === 'en' ? 'Swipe for more moments' : 'आणखी क्षणांसाठी सरकवा'}
      </BlurIn>
    </Section>
  )
}
