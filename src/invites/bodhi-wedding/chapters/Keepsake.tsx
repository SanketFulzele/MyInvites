import { useRef, useState, type ReactNode } from 'react'
import { toPng } from 'html-to-image'
import { Download } from 'lucide-react'
import { AshokChakra, BodhiCanopy, Buddha, Diya, Lotus, LotusPond, Stupa } from '../art'
import { Chapter, ChapterHeading, Reveal, useLang } from '../ui'
import { bodhiWedding as C } from '../bodhiWedding.config'
import { dateText, timeText, toDate } from '../dates'

/** Illustrated stand-ins until the couple's photos arrive. */
const VIGNETTES = [
  { caption: 'Under the Bodhi tree', art: <Buddha className="h-full w-auto" /> },
  { caption: 'Lotus mornings', art: <Lotus className="w-4/5" /> },
  { caption: 'Lamps for the path', art: <Diya className="h-4/5" /> },
  { caption: 'Nagpur, our city', art: <Stupa className="w-4/5" color="#7a1f2b" /> },
]

function Polaroid({ children, caption, index }: { children: ReactNode; caption: string; index: number }) {
  const tilt = [-4, 3, -2, 4][index % 4]
  return (
    <div className="bodhi-sway flex flex-col items-center" style={{ animationDelay: `${-index * 1.3}s`, animationDuration: `${5.5 + index * 0.6}s` }}>
      <span className="h-10 w-px bg-gradient-to-b from-bodhi-gold-deep to-bodhi-gold sm:h-14" />
      <span className="-mt-1 h-2 w-2 rounded-full bg-bodhi-gold" />
      <figure className="mt-1 w-[38vw] max-w-[170px] bg-white p-2 pb-8 shadow-[0_20px_30px_-18px_rgba(59,36,22,.6)]" style={{ transform: `rotate(${tilt}deg)` }}>
        <div className="grid aspect-square place-items-center overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#fff4d6,#f6dfb0)]">{children}</div>
        <figcaption className="mt-2 text-center font-display text-[15px] italic text-bodhi-ink/75">{caption}</figcaption>
      </figure>
    </div>
  )
}

/** Chapter 10 · Keepsake — polaroids on a Bodhi branch + a downloadable card. */
export default function Keepsake() {
  const { lang } = useLang()
  const card = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const d = toDate(C.weddingDateTime)
  const wedding = C.events.find((e) => e.id === 'wedding')!

  const download = async () => {
    if (!card.current || busy) return
    setBusy(true)
    setMsg('')
    try {
      const url = await toPng(card.current, { pixelRatio: 3, cacheBust: true, backgroundColor: '#fbf5e9' })
      const a = document.createElement('a')
      a.href = url
      a.download = `${C.bride.first}-${C.groom.first}-invitation.png`
      a.click()
      setMsg('Your invitation card has been saved.')
    } catch {
      setMsg('Could not create the image on this device — try a screenshot instead.')
    } finally {
      setBusy(false)
    }
  }

  const photos = C.gallery.length ? C.gallery : null

  return (
    <Chapter id="keepsake" className="bg-[linear-gradient(180deg,#f4ead3_0%,#fbf5e9_100%)]">
      <ChapterHeading accent="स्मृती" number="CHAPTER X" title={lang === 'en' ? 'Keepsakes' : 'आठवणी'} subtitle={lang === 'en' ? 'Little moments, hung from the Bodhi branch.' : 'बोधी फांदीवर टांगलेले छोटे क्षण.'} />

      <div className="relative mx-auto mt-10 max-w-4xl">
        {/* the branch */}
        <svg viewBox="0 0 400 30" preserveAspectRatio="none" className="h-6 w-full" aria-hidden>
          <path d="M0 18 C80 6 160 26 240 14 C300 6 350 18 400 10" stroke="#6b4a2c" strokeWidth="5" fill="none" strokeLinecap="round" />
        </svg>
        <div className="-mt-2 grid grid-cols-2 justify-items-center gap-y-6 sm:grid-cols-4">
          {photos
            ? photos.slice(0, 4).map((p, i) => (
                <Polaroid key={p.src} caption={p.caption} index={i}>
                  <img src={p.src} alt={p.caption} loading="lazy" className="h-full w-full object-cover" />
                </Polaroid>
              ))
            : VIGNETTES.map((v, i) => (
                <Polaroid key={v.caption} caption={v.caption} index={i}>
                  {v.art}
                </Polaroid>
              ))}
        </div>
      </div>

      {/* blessings */}
      <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
        {C.blessings.map((b, i) => (
          <Reveal key={b.pali} delay={i * 0.1} className="rounded-[4px] border border-bodhi-gold/50 bg-bodhi-ivory/80 px-5 py-6 text-center">
            <Lotus className="mx-auto h-6 w-8" tone={i === 1 ? 'white' : 'pink'} />
            <p className="mt-3 font-display text-xl italic text-bodhi-maroon">{b.pali}</p>
            <p className={`mt-2 text-[15px] leading-relaxed text-bodhi-ink/75 ${lang === 'mr' ? 'font-marathi' : 'font-mukta'}`}>{b[lang]}</p>
          </Reveal>
        ))}
      </div>

      {/* downloadable card */}
      <Reveal className="mx-auto mt-16 flex max-w-3xl flex-col items-center gap-8 md:flex-row md:items-center md:justify-center">
        <div
          ref={card}
          className="bodhi-parchment relative aspect-[4/5] w-[min(80vw,300px)] shrink-0 overflow-hidden border-[3px] border-bodhi-gold text-center shadow-[0_30px_60px_-30px_rgba(59,36,22,.7)]"
        >
          <BodhiCanopy className="absolute inset-x-0 top-0 h-[30%] w-full" />
          <div className="absolute inset-x-0 top-[22%] flex flex-col items-center">
            <div className="relative">
              <AshokChakra className="absolute left-1/2 top-[22%] h-24 w-24 -translate-x-1/2 -translate-y-1/2 opacity-25" />
              <Buddha className="relative h-24 w-auto" />
            </div>
            <p className="mt-3 font-cinzel text-[8px] tracking-[0.3em] text-bodhi-ink/60">THE WEDDING OF</p>
            <p className="mt-1 font-display text-[1.7rem] leading-none text-bodhi-maroon">
              {C.bride.first} <span className="text-bodhi-gold">❀</span> {C.groom.first}
            </p>
            <p className="mt-2 font-cinzel text-[9px] tracking-[0.25em] text-bodhi-gold-deep">{wedding.venue.toUpperCase()}</p>
            <p className="mt-1 font-mukta text-[11px] text-bodhi-ink/70">
              {dateText(d)}
              {d && ` · ${timeText(d)}`}
            </p>
          </div>
          <LotusPond className="absolute inset-x-0 bottom-0 !h-16" />
        </div>
        <div className="max-w-xs text-center md:text-left">
          <h3 className="font-display text-3xl text-bodhi-maroon">Keep the invitation</h3>
          <p className="mt-2 font-mukta text-[15px] text-bodhi-ink/70">Save this card to your phone — perfect for sharing with family who prefer a picture.</p>
          <button
            type="button"
            onClick={() => void download()}
            disabled={busy}
            className="mt-5 inline-flex min-h-[52px] items-center gap-2 rounded-full bg-bodhi-maroon px-7 font-mukta font-medium text-bodhi-ivory transition hover:bg-[#61161f] disabled:opacity-60 active:scale-[.98]"
          >
            <Download className="h-4 w-4" /> {busy ? 'Preparing…' : 'Download card (PNG)'}
          </button>
          <p className="mt-3 min-h-[1.25rem] font-mukta text-sm text-bodhi-leaf" aria-live="polite">
            {msg}
          </p>
        </div>
      </Reveal>
    </Chapter>
  )
}
