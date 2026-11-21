import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Share2 } from 'lucide-react'
import ArcReactor from './ArcReactor'
import { Reveal } from './Hud'
import { useJarvis } from './Jarvis'
import type { WeddingInviteConfig } from '../../types'

export default function ClosingSection({ config }: { config: WeddingInviteConfig }) {
  const { say } = useJarvis()
  const [clicks, setClicks] = useState(0)
  const couple = `${config.groom.name} & ${config.bride.name}`

  const share = async () => {
    const data = { title: config.meta.pageTitle, text: `You're invited to the wedding of ${couple}!`, url: window.location.href }
    try {
      if (navigator.share) await navigator.share(data)
      else {
        await navigator.clipboard.writeText(data.url)
        say('Invitation link copied. Distribute to the Avengers as needed.')
      }
    } catch {
      /* share cancelled */
    }
  }

  // Hidden: tap the "Stark" signature five times
  const tapSignature = () => {
    const n = clicks + 1
    setClicks(n)
    if (n === 5) say('Sometimes you gotta run before you can walk. Today, they walk down the aisle.', 'signature')
  }

  return (
    <section className="relative px-5 pt-16 pb-36 text-center">
      <Reveal>
        <ArcReactor className="mx-auto h-20 w-20" />
        <p className="mx-auto mt-8 max-w-sm font-display text-3xl leading-snug text-white italic text-balance">{config.closingLine}</p>
        <p className="mt-6 font-script text-5xl text-stark-amber">{couple}</p>
        {config.inviters.textLocal && <p className="mt-4 font-marathi text-lg text-white/60">{config.inviters.textLocal}</p>}

        <button
          onClick={share}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/85 hover:border-reactor/50"
        >
          <Share2 className="h-4 w-4 text-reactor" /> Share invitation
        </button>

        <div className="mx-auto mt-14 h-px w-40 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <button onClick={tapSignature} className="mt-6 font-hud text-[9px] tracking-[0.4em] text-white/25">
          A STARK-GRADE CELEBRATION
        </button>
        <p className="mt-2 text-xs text-white/30">
          Crafted with love by{' '}
          <Link to="/" className="text-white/50 underline-offset-4 hover:underline">
            My Invites
          </Link>
        </p>
      </Reveal>
    </section>
  )
}
