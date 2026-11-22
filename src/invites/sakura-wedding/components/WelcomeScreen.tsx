import { motion } from 'framer-motion'
import { DawnValley } from '../../../art/Landscapes'
import SakuraTree from '../../../art/SakuraTree'
import PetalField from '../../../art/PetalField'
import { usePrefersReducedMotion } from '../../../hooks/useReducedMotion'
import Blossom from './Blossom'

interface Props {
  bride: string
  groom: string
  dateLine: string
  blessing?: string
  onEnter: () => void
}

export default function WelcomeScreen({ bride, groom, dateLine, blessing, onEnter }: Props) {
  const reduced = usePrefersReducedMotion()

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-dawn px-6 text-center text-sumi"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: reduced ? 0 : -40, transition: { duration: reduced ? 0.01 : 0.9, ease: [0.22, 1, 0.36, 1] } }}
    >
      <DawnValley />
      <SakuraTree className="-left-24 top-[-18%] w-[70%] max-w-[520px] opacity-90 sm:-left-16" />
      <PetalField position="absolute" density={22} />

      <motion.div
        className="relative z-20 flex w-full max-w-sm flex-col items-center"
        initial={{ opacity: 0, y: reduced ? 0 : 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0.01 : 1.1, delay: reduced ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <Blossom className="h-6 w-6 text-vermilion" />
        <p className="mt-5 text-[10px] font-semibold tracking-[0.42em] text-sumi/70">एक निमंत्रण · AN INVITATION</p>
        {blessing && <p className="mt-3 font-devanagari text-sm text-sumi/70">{blessing}</p>}

        <p className="mt-7 font-display text-[2.9rem] leading-[0.95] font-medium tracking-tight sm:text-6xl">
          <span className="block">{bride}</span>
          <span className="my-2 block font-script text-4xl text-vermilion/80">&amp;</span>
          <span className="block">{groom}</span>
        </p>

        <div className="hairline mt-7 h-px w-28 bg-gold-leaf/80" />
        <p className="mt-4 text-[11px] font-medium tracking-[0.3em] text-sumi/75">{dateLine}</p>

        <button
          type="button"
          onClick={onEnter}
          className="mt-10 min-h-[52px] rounded-full border border-gold-leaf/70 bg-washi-paper/90 px-9 py-4 text-[11px] font-semibold tracking-[0.28em] text-sumi shadow-[0_18px_40px_-20px_rgba(30,27,46,.55)] transition duration-300 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-vermilion active:translate-y-0"
        >
          ENTER THE CELEBRATION
        </button>
        <p className="mt-5 text-[11px] tracking-wide text-sumi/55">Sound on for the full experience</p>
      </motion.div>
    </motion.div>
  )
}
