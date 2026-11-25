import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarPlus, Hand } from 'lucide-react'
import { Medallion, RoseImg, Tassel } from '../art'
import { Burst, EASE, Section, SectionTitle } from '../ui'
import { royalRose as R, W } from '../royalRose.config'
import { useLang, useT } from '../../bodhi-wedding/ui'
import { calendarUrl, dateText, timeText, toDate, weddingEvent } from '../../bodhi-wedding/dates'
import { useCountdown } from '../../../hooks/useCountdown'

const PANEL = 360 // px — fixed so the unroll never shifts the page

export default function SaveTheDate() {
  const t = useT()
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const [fire, setFire] = useState(0)
  const ev = weddingEvent()
  const d = toDate(W.weddingDateTime)
  const c = useCountdown(d ?? new Date(8.64e15))
  const cal = calendarUrl(ev)
  const [yy, mm, dd] = (W.weddingDateTime ?? '').slice(0, 10).split('-')

  const reveal = () => {
    if (open) return
    setOpen(true)
    window.setTimeout(() => setFire((f) => f + 1), 900)
  }

  return (
    <Section id="save-the-date" className="py-20">
      <SectionTitle eyebrow={lang === 'en' ? 'Pull to reveal' : 'उलगडण्यासाठी ओढा'} title={t(R.copy.saveTheDate)} />

      <div className="relative mx-auto mt-10 w-[min(76vw,340px)]" style={{ height: PANEL + 150 }}>
        {/* golden rod with finials */}
        <div className="absolute inset-x-[-12px] top-0 z-20 h-4 rounded-full bg-[linear-gradient(180deg,#f6e6b8,#c6a15b_45%,#8f6c30)] shadow-[0_4px_8px_-2px_rgba(90,60,20,.5)]">
          <span className="absolute -left-3 -top-1.5 h-7 w-7 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff1c8,#c6a15b_55%,#7d5c25)]" />
          <span className="absolute -right-3 -top-1.5 h-7 w-7 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff1c8,#c6a15b_55%,#7d5c25)]" />
        </div>

        {/* the scroll paper — unrolls via clip-path (no layout change) */}
        <div
          className="rr-paper absolute inset-x-0 top-2 z-10 overflow-hidden border-x border-rr-gold/40 transition-[clip-path] duration-[1300ms] ease-[cubic-bezier(.65,0,.35,1)]"
          style={{ height: PANEL, clipPath: open ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)' }}
          aria-hidden={!open}
        >
          <div className="absolute inset-3 border border-rr-gold/70" />
          <div className="absolute inset-[18px] border border-rr-gold/35" />
          <RoseImg tone="wine" className="absolute -left-5 -top-5 w-20" />
          <RoseImg tone="blush" className="absolute -right-5 -top-5 w-16" />
          <RoseImg tone="blush" className="absolute -bottom-5 -left-5 w-16" />
          <RoseImg tone="wine" className="absolute -bottom-5 -right-5 w-20" />
          <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
            <Medallion className="h-14 w-14" />
            <p className="mt-3 font-montserrat text-xs font-medium uppercase tracking-[0.3em] text-rr-gold-deep">{d ? dateText(d, 'en').split(',')[0] : ''}</p>
            <p className="mt-2 whitespace-nowrap font-playfair text-[clamp(2rem,10.5vw,3.2rem)] leading-none text-rr-wine">
              {dd}
              <span className="mx-1.5 text-rr-gold">·</span>
              {mm}
              <span className="mx-1.5 text-rr-gold">·</span>
              {yy}
            </p>
            <p className={`mt-3 text-rr-ink/80 ${lang === 'mr' ? 'font-marathi text-base' : 'font-playfair text-lg italic'}`}>{dateText(d, lang)}</p>
            <div className="my-3 h-px w-20 bg-rr-gold/60" />
            <p className="font-montserrat text-sm font-medium text-rr-wine">{timeText(d, lang)}</p>
            <p className="mt-1 font-montserrat text-[13px] text-rr-ink/70">{ev.venue}</p>
          </div>
        </div>

        {/* bottom roller + tassel — travels down as the scroll opens */}
        <motion.div
          className="absolute inset-x-0 top-2 z-20"
          initial={false}
          animate={{ y: open ? PANEL - 6 : 6 }}
          transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="mx-auto h-6 w-full rounded-full bg-[linear-gradient(180deg,#fdf3e3,#e7d3b4_50%,#b99a72)] shadow-[0_6px_10px_-4px_rgba(90,60,20,.45)]" />
          <motion.button
            type="button"
            onClick={reveal}
            aria-label={t(R.copy.pullHint)}
            aria-expanded={open}
            drag={open ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 70 }}
            dragElastic={0.2}
            dragSnapToOrigin
            onDragEnd={(_, info) => info.offset.y > 28 && reveal()}
            className="relative mx-auto -mt-1 block h-[120px] w-16 cursor-grab touch-none active:cursor-grabbing"
            whileTap={{ scale: 0.96 }}
          >
            <Tassel className="mx-auto h-full w-10 drop-shadow-[0_6px_6px_rgba(90,60,20,.35)]" />
          </motion.button>
          {!open && (
            <div className="pointer-events-none absolute left-1/2 top-10 ml-7">
              <Hand className="h-8 w-8 text-rr-wine" strokeWidth={1.4} style={{ animation: 'rr-finger 2.2s ease-in-out infinite' }} />
              </div>
          )}
          {!open && (
            <p className="pointer-events-none mt-2 text-center font-montserrat text-xs font-medium uppercase tracking-[0.2em] text-rr-wine/80">{t(R.copy.pullHint)}</p>
          )}
        </motion.div>

        <div className="absolute left-1/2 top-1/2">
          <Burst fire={fire} />
        </div>
      </div>

      {/* one-line countdown + calendar */}
      <motion.div
        className="mx-auto -mt-2 max-w-sm text-center"
        initial={false}
        animate={{ opacity: open ? 1 : 0.55 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        {d && !c.isPast ? (
          <p className="font-montserrat text-[15px] font-medium tabular-nums text-rr-wine" aria-live="off">
            {c.days} {lang === 'en' ? 'days' : 'दिवस'} <span className="text-rr-gold">·</span> {String(c.hours).padStart(2, '0')} {lang === 'en' ? 'hrs' : 'तास'}{' '}
            <span className="text-rr-gold">·</span> {String(c.minutes).padStart(2, '0')} {lang === 'en' ? 'min' : 'मि.'} <span className="text-rr-gold">·</span>{' '}
            {String(c.seconds).padStart(2, '0')} {lang === 'en' ? 'sec' : 'से.'}
          </p>
        ) : (
          <p className="font-playfair text-lg italic text-rr-wine">{lang === 'en' ? 'Happily married' : 'शुभविवाह संपन्न'}</p>
        )}
        {cal && (
          <a
            href={cal}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-rr-wine/40 bg-rr-ivory px-6 font-montserrat text-sm font-medium text-rr-wine shadow-[0_10px_24px_-16px_rgba(110,31,47,.8)] transition hover:bg-white active:scale-[.98]"
          >
            <CalendarPlus className="h-4 w-4" /> {lang === 'en' ? 'Add to calendar' : 'कॅलेंडरमध्ये जोडा'}
          </a>
        )}
      </motion.div>
    </Section>
  )
}
