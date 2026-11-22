/**
 * Theme-agnostic loading state shown while an invitation bundle loads.
 * Neutral paper tones and a simple monogram so it suits every theme.
 */
export default function InviteLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 grid place-items-center bg-[#f6f3ee] text-[#2c2723]"
    >
      <div className="flex flex-col items-center">
        <div className="relative grid h-16 w-16 place-items-center">
          <span className="absolute inset-0 rounded-full border border-current opacity-15" aria-hidden="true" />
          <span
            className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-current opacity-60"
            style={{ animationDuration: '1.6s' }}
            aria-hidden="true"
          />
          <span className="font-display text-2xl" aria-hidden="true">
            M
          </span>
        </div>
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.32em] opacity-70">
          Opening your invitation
        </p>
        <span className="mt-3 h-px w-10 bg-current opacity-20" aria-hidden="true" />
      </div>
    </div>
  )
}
