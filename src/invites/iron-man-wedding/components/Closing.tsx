import { DESIGNER } from '../../../lib/credits'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Reactor from './Reactor'
import { EASE, FadeUp, MaskLines, Mono, Section } from './ui'
import { useStatus } from './status'
import { signature } from '../copy'
import type { WeddingInviteConfig } from '../../types'

export default function Closing({ config }: { config: WeddingInviteConfig }) {
  const { say } = useStatus()
  const [taps, setTaps] = useState(0)
  const [shareNote, setShareNote] = useState('')
  const couple = `${config.groom.name} & ${config.bride.name}`

  const share = async () => {
    const data = { title: config.meta.pageTitle, text: `You're invited to the wedding of ${couple}.`, url: window.location.href }
    try {
      if (navigator.share) {
        await navigator.share(data)
      } else {
        await navigator.clipboard.writeText(data.url)
        setShareNote('Link copied')
        window.setTimeout(() => setShareNote(''), 2200)
      }
    } catch {
      /* share cancelled */
    }
  }

  const tapSignature = () => {
    const n = taps + 1
    setTaps(n)
    if (n === 5) say('Signature verified. Welcome to the family.')
  }

  return (
    <Section id="closing" className="overflow-hidden bg-obsidian pt-24 pb-16 text-center">
      <div className="absolute left-1/2 top-0 h-[28rem] w-[40rem] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(198,154,83,.12),transparent)]" />
      <div className="relative mx-auto max-w-xl px-6">
        <FadeUp>
          <Reactor lit className="mx-auto h-14 w-14" bloom />
        </FadeUp>
        <MaskLines
          lines={[config.closingLine]}
          as="p"
          className="mt-12 font-display text-[clamp(2rem,8.5vw,3.2rem)] leading-[1.08] italic font-light text-paper text-balance"
        />
        <FadeUp delay={0.15}>
          <p className="mt-10 font-display text-[clamp(2.6rem,12vw,4rem)] leading-none text-iron-gold">{couple}</p>
          {config.inviters.textLocal && <p className="mt-5 font-marathi text-lg text-paper/60">{config.inviters.textLocal}</p>}
        </FadeUp>

        <FadeUp delay={0.2} className="mt-12">
          <motion.button
            onClick={share}
            whileHover="on"
            whileTap="on"
            className="relative inline-flex overflow-hidden border border-iron-gold/60 px-8 py-4 font-body text-[13px] font-medium uppercase tracking-[0.24em] text-paper"
          >
            <motion.span className="absolute inset-0 origin-left bg-iron" initial={{ scaleX: 0 }} variants={{ on: { scaleX: 1 } }} transition={{ duration: 0.45, ease: EASE }} />
            <span className="relative">{shareNote || 'Share the invitation'}</span>
          </motion.button>
        </FadeUp>

        <div className="mx-auto mt-20 h-px w-24 bg-paper/10" />
        <button onClick={tapSignature} className="mt-6 px-4 py-2">
          <Mono className="text-paper/30">Stark Industries · Wedding Division</Mono>
        </button>
        <div className="min-h-[2.5rem]">
          <AnimatePresence>
            {taps >= 5 && (
              <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2 font-display text-lg italic text-champagne/80">
                {signature}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-paper/45">
          {DESIGNER.label} <span className="font-display text-base normal-case tracking-normal italic text-iron-gold">{DESIGNER.name}</span>
        </p>
        <p className="mt-2 font-body text-xs text-paper/35">
          Crafted with love by{' '}
          <Link to="/" className="text-paper/55 underline-offset-4 active:underline">
            My Invites
          </Link>
        </p>
      </div>
    </Section>
  )
}
