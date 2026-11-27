import { motion, type MotionValue } from 'framer-motion'
import Reactor from './Reactor'
import { EASE } from './ui'

/**
 * Hero centrepiece: the arc reactor as the couple's heart. HUD rings with a
 * sweeping scan arc, a holographic heart outline that beats, readouts, and a
 * live heartbeat line. Loops are small CSS transforms on composited layers.
 */
export default function HeartReactor({ ready, rotate, y }: { ready: boolean; rotate: MotionValue<number>; y: MotionValue<string> }) {
  const draw = (delay: number) => ({
    initial: { pathLength: 0, opacity: 0 },
    animate: ready ? { pathLength: 1, opacity: 1 } : {},
    transition: { delay, duration: 1.8, ease: [0.65, 0, 0.35, 1] as const },
  })
  const show = (delay: number) => ({
    initial: { opacity: 0 },
    animate: ready ? { opacity: 1 } : {},
    transition: { delay, duration: 1, ease: EASE },
  })

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[9svh] w-[min(88vw,430px)] -translate-x-1/2 lg:left-auto lg:right-[4%] lg:top-1/2 lg:w-[min(44vw,560px)] lg:-translate-y-1/2 lg:translate-x-0"
      style={{ y }}
    >
      <div className="relative aspect-square">
        {/* soft blue + red light behind */}
        <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(102,217,255,.16),transparent_62%)]" />
        <div className="absolute inset-[18%] translate-y-[14%] rounded-full bg-[radial-gradient(circle,rgba(143,24,32,.35),transparent_65%)]" />

        {/* HUD rings + tick scale (turns gently with scroll) */}
        <motion.svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" style={{ rotate }}>
          <motion.circle cx="200" cy="200" r="194" fill="none" stroke="#d7c29a" strokeOpacity=".22" strokeWidth=".8" {...draw(0.2)} />
          <motion.circle cx="200" cy="200" r="160" fill="none" stroke="#66d9ff" strokeOpacity=".18" strokeWidth=".8" strokeDasharray="2 6" {...draw(0.35)} />
          <motion.circle cx="200" cy="200" r="128" fill="none" stroke="#d7c29a" strokeOpacity=".16" strokeWidth=".8" {...draw(0.5)} />
          <motion.path d="M200 6 A194 194 0 0 1 368 103" fill="none" stroke="#c69a53" strokeOpacity=".8" strokeWidth="2.2" {...draw(0.7)} />
          <motion.path d="M32 297 A194 194 0 0 1 12 230" fill="none" stroke="#8f1820" strokeWidth="3" {...draw(0.9)} />
          <motion.g {...show(0.8)}>
            {Array.from({ length: 72 }).map((_, i) => {
              const a = (i / 72) * Math.PI * 2
              const long = i % 6 === 0
              const r1 = long ? 172 : 178
              return (
                <line
                  key={i}
                  x1={200 + r1 * Math.cos(a)}
                  y1={200 + r1 * Math.sin(a)}
                  x2={200 + 184 * Math.cos(a)}
                  y2={200 + 184 * Math.sin(a)}
                  stroke="#d7c29a"
                  strokeOpacity={long ? 0.45 : 0.16}
                  strokeWidth={long ? 1.1 : 0.7}
                />
              )
            })}
          </motion.g>
        </motion.svg>

        {/* sweeping scan arc (composited rotation) */}
        <motion.div className="absolute inset-[9%]" {...show(1.2)}>
          <div className="h-full w-full animate-[spin_7s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,rgba(102,217,255,0)_0deg,rgba(102,217,255,0)_300deg,rgba(102,217,255,.18)_350deg,rgba(102,217,255,.45)_360deg)] [mask-image:radial-gradient(circle,transparent_58%,black_59%,black_70%,transparent_71%)]" />
        </motion.div>

        {/* holographic heart that beats around the reactor */}
        <motion.div className="absolute inset-[22%]" {...show(1.4)}>
          <svg viewBox="0 0 100 92" className="ironheart-beat h-full w-full overflow-visible">
            <path
              d="M50 88 C50 88 6 62 6 30 C6 14 18 4 31 4 C40 4 47 9 50 16 C53 9 60 4 69 4 C82 4 94 14 94 30 C94 62 50 88 50 88Z"
              fill="rgba(102,217,255,.04)"
              stroke="#66d9ff"
              strokeOpacity=".55"
              strokeWidth=".8"
            />
            <path
              d="M50 80 C50 80 13 58 13 31 C13 18 22 10 32 10 C40 10 46 15 50 22 C54 15 60 10 68 10 C78 10 87 18 87 31 C87 58 50 80 50 80Z"
              fill="none"
              stroke="#66d9ff"
              strokeOpacity=".22"
              strokeWidth=".6"
              strokeDasharray="1.5 2.5"
            />
          </svg>
        </motion.div>

        {/* the reactor itself */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-[36%] -translate-x-1/2 -translate-y-[58%]"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 1.4, ease: EASE }}
        >
          <Reactor lit bloom className="aspect-square h-auto w-full" />
        </motion.div>

        {/* readouts */}
        <motion.div className="absolute left-[2%] top-[14%] font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-arc/75" {...show(1.8)}>
          <p>Vitals</p>
          <p className="text-paper/80">In love</p>
        </motion.div>
        <motion.div className="absolute right-[2%] top-[14%] text-right font-mono text-[11px] uppercase leading-relaxed tracking-[0.18em] text-arc/75" {...show(2)}>
          <p>Output</p>
          <p className="text-iron-gold">3000%</p>
        </motion.div>

        {/* heartbeat line */}
        <motion.svg viewBox="0 0 400 60" className="absolute inset-x-[4%] bottom-[6%] h-[13%] w-[92%] overflow-visible" {...show(2.1)}>
          <path d="M0 30 H120 L134 30 L142 12 L152 50 L162 4 L172 44 L180 30 H400" fill="none" stroke="#66d9ff" strokeOpacity=".18" strokeWidth="1.2" />
          <path
            className="ironheart-ecg"
            d="M0 30 H120 L134 30 L142 12 L152 50 L162 4 L172 44 L180 30 H400"
            fill="none"
            stroke="#66d9ff"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
          />
        </motion.svg>
      </div>
    </motion.div>
  )
}
