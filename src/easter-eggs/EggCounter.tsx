import { ORB_IDS } from './registry'
import { useEggs } from './useEasterEggs'

export default function EggCounter({ className }: { className?: string }) {
  const { count, total, orbCount } = useEggs()

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={`Secrets found: ${count} of ${total}`}
      className={`inline-flex items-center gap-1.5 rounded-full border border-gold-leaf/30 washi-paper px-2.5 py-1 font-sans text-[11px] text-sakura-plum sakura-shadow ${className ?? ''}`}
    >
      <span aria-hidden="true">🌸</span>
      <span>
        Secrets found: {count}/{total}
      </span>
      {orbCount === ORB_IDS.length && (
        <span className="rounded-full bg-vermilion/10 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-vermilion">
          7/7
        </span>
      )}
    </span>
  )
}
