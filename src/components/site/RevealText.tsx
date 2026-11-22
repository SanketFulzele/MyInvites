import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/useReducedMotion'

export interface TextPart {
  text: string
  className?: string
}

/** Motion-style word-by-word reveal with a soft blur, used on the hero headline. */
export default function RevealText({
  parts,
  className = '',
  delay = 0,
}: {
  parts: TextPart[]
  className?: string
  delay?: number
}) {
  const reduced = usePrefersReducedMotion()
  const words = parts.flatMap((part, partIndex) => {
    const tokens = part.text.split(' ')
    return tokens.map((token, tokenIndex) => ({
      token,
      partIndex,
      tokenIndex,
      className: part.className,
      hasSpace: tokenIndex < tokens.length - 1,
    }))
  })

  return (
    <span className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word.partIndex}-${word.tokenIndex}`}
          className={`inline-block ${word.className ?? ''}`}
          initial={{ opacity: 0, y: reduced ? 0 : 20, filter: reduced ? 'none' : 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: reduced ? 0.01 : 0.75,
            delay: reduced ? 0 : delay + index * 0.055,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {word.token}
          {word.hasSpace ? '\u00a0' : ''}
        </motion.span>
      ))}
    </span>
  )
}
