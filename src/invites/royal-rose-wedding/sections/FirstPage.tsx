import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Medallion } from '../art'
import { MarigoldStrings } from '../Decor'
import { TypedName } from '../ui'
import { royalRose as R, W } from '../royalRose.config'
import { useLang, useT } from '../../bodhi-wedding/ui'

/** Page one — exactly one phone screen, centred, never cut. */
export default function FirstPage({ started }: { started: boolean }) {
  const t = useT()
  const { lang } = useLang()
  const groom = W.groom.first
  const bride = W.bride.first
  const brideDelay = 1.2 + groom.length * 0.09
  const fade = (d: number) => ({
    initial: { opacity: 0, filter: 'blur(6px)', y: 8 },
    animate: started ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {},
    transition: { duration: 0.9, delay: d, ease: 'easeOut' as const },
  })
  const small = `text-rr-ink/75 ${lang === 'mr' ? 'font-marathi text-[15px]' : 'font-montserrat text-[13px]'}`

  return (
    <section id="welcome" className="relative flex h-[100svh] min-h-[600px] items-center justify-center overflow-hidden px-5 pt-6">
      <MarigoldStrings />

      {/* thin gold arch with a softly zooming photo */}
      <div className="relative flex h-[min(calc(100svh-96px),720px)] w-[min(88vw,400px)] flex-col items-center justify-center overflow-hidden border border-rr-gold/80 px-5 text-center shadow-[0_30px_60px_-40px_rgba(110,31,47,.55)]" style={{ borderRadius: '999px 999px 18px 18px' }}>
        <img src={R.heroPhoto} alt="" aria-hidden className="rr-zoom absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_45%,rgba(253,247,240,.86)_0%,rgba(253,247,240,.66)_58%,rgba(253,247,240,.3)_100%)]" />
        <div className="pointer-events-none absolute inset-[7px] border border-rr-gold/40" style={{ borderRadius: '999px 999px 13px 13px' }} />

        <div className="relative flex flex-col items-center">
          <motion.div {...fade(0.1)}>
            <Medallion className="h-[clamp(60px,10svh,84px)] w-auto" />
          </motion.div>
          <motion.p {...fade(0.35)} className={`mt-3 uppercase tracking-[0.18em] text-rr-gold-deep ${lang === 'mr' ? 'font-marathi text-sm tracking-normal normal-case' : 'font-montserrat text-xs font-medium'}`}>
            {t(R.copy.together)}
          </motion.p>

          <h1 className="mt-[clamp(10px,2.4svh,22px)] font-playfair text-[clamp(2.9rem,14vw,4.2rem)] leading-none italic text-rr-wine">
            <TypedName text={groom} start={started} delay={0.7} />
          </h1>
          <motion.p {...fade(0.8 + groom.length * 0.09)} className={`mt-1.5 ${small}`}>
            {lang === 'en' ? `${W.families.groom.relation.en} ${W.families.groom.parents.en}` : `${W.families.groom.parents.mr} ${W.families.groom.relation.mr}`}
          </motion.p>

          <motion.p {...fade(brideDelay - 0.25)} className="my-[clamp(6px,1.6svh,14px)] font-playfair text-[1.9rem] leading-none text-rr-gold">
            &amp;
          </motion.p>

          <h1 className="font-playfair text-[clamp(2.9rem,14vw,4.2rem)] leading-none italic text-rr-wine">
            <TypedName text={bride} start={started} delay={brideDelay} />
          </h1>
          <motion.p {...fade(brideDelay + 0.2 + bride.length * 0.09)} className={`mt-1.5 ${small}`}>
            {lang === 'en' ? `${W.families.bride.relation.en} ${W.families.bride.parents.en}` : `${W.families.bride.parents.mr} ${W.families.bride.relation.mr}`}
          </motion.p>

          <motion.p
            {...fade(brideDelay + 0.6 + bride.length * 0.09)}
            className={`mx-auto mt-[clamp(12px,2.6svh,24px)] max-w-[17rem] text-rr-ink/80 ${lang === 'mr' ? 'font-marathi text-base' : 'font-playfair text-[15px] italic leading-snug'}`}
          >
            {t(R.copy.inviteLine)}
          </motion.p>
        </div>
      </div>

      <motion.a
        href="#save-the-date"
        aria-label="Scroll down"
        className="absolute bottom-[max(10px,env(safe-area-inset-bottom))] left-1/2 grid h-11 w-11 -translate-x-1/2 place-items-center text-rr-wine"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ delay: brideDelay + 1.4 }}
      >
        <ChevronDown className="rr-bob h-7 w-7" strokeWidth={1.5} />
      </motion.a>
    </section>
  )
}
