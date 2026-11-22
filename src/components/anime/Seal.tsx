interface Props {
  label: string
  sub?: string
  onClick?: () => void
  active?: boolean
  size?: 'sm' | 'md' | 'lg'
  ariaLabel?: string
}

const SIZES = {
  sm: 'h-16 w-16 text-[10px]',
  md: 'h-24 w-24 text-xs',
  lg: 'h-32 w-32 text-sm',
}

/** A vermilion hanko / wax seal. Becomes a button when onClick is supplied. */
export default function Seal({ label, sub, onClick, active = false, size = 'md', ariaLabel }: Props) {
  const content = (
    <>
      <span className="absolute inset-[6px] rounded-full border border-sakura-cream/45" aria-hidden="true" />
      <span className="relative leading-tight">{label}</span>
      {sub && <span className="relative mt-1 text-[0.62em] tracking-[0.18em] opacity-80">{sub}</span>}
    </>
  )
  const classes = `relative grid place-items-center rounded-full bg-vermilion text-sakura-cream shadow-[0_12px_30px_-14px_rgba(200,55,45,.85)] ${
    SIZES[size]
  } ${active ? 'rotate-6 scale-105' : ''}`

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel ?? label}
        aria-pressed={active}
        className={`${classes} min-h-[44px] min-w-[44px] transition-transform duration-500 hover:rotate-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-leaf`}
      >
        {content}
      </button>
    )
  }
  return <div className={classes}>{content}</div>
}
