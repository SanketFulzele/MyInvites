interface Props {
  en: string
  local?: string
  className?: string
  localClassName?: string
  lang?: string
}

/** English first, regional script directly beneath. Keeps lang attributes correct. */
export default function BilingualText({ en, local, className = '', localClassName = '', lang = 'hi' }: Props) {
  return (
    <div className={className}>
      <p>{en}</p>
      {local && (
        <p className={`font-devanagari mt-2 ${localClassName}`} lang={lang}>
          {local}
        </p>
      )}
    </div>
  )
}
