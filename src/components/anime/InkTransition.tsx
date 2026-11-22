/** A thin ink wipe used between ceremony arcs. Purely decorative. */
export default function InkTransition({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <div className="pointer-events-none relative h-16 overflow-hidden" aria-hidden="true">
      <div
        className={`absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 animate-ink-wipe ${
          tone === 'dark' ? 'bg-sumi/70' : 'bg-sakura-cream/70'
        }`}
      />
    </div>
  )
}
