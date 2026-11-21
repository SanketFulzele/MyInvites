import { useCallback, useEffect, useRef, useState } from 'react'
import { AmbientScore } from '../../../lib/ambientScore'

/**
 * Background music that only starts after a user gesture.
 * Uses `src` if provided, otherwise a generated ambient score.
 */
export function useMusic(src?: string) {
  const [playing, setPlaying] = useState(false)
  const audio = useRef<HTMLAudioElement | null>(null)
  const score = useRef<AmbientScore | null>(null)

  useEffect(() => {
    return () => {
      audio.current?.pause()
      score.current?.stop()
    }
  }, [])

  // pause when the tab is hidden (e.g. switching back to WhatsApp)
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden' && playing) {
        audio.current?.pause()
        score.current?.stop()
        setPlaying(false)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [playing])

  const play = useCallback(async () => {
    try {
      if (src) {
        if (!audio.current) {
          audio.current = new Audio(src)
          audio.current.loop = true
          audio.current.volume = 0.5
        }
        await audio.current.play()
      } else {
        score.current ??= new AmbientScore()
        await score.current.start()
      }
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }, [src])

  const pause = useCallback(() => {
    audio.current?.pause()
    score.current?.stop()
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => (playing ? pause() : void play()), [playing, pause, play])

  return { playing, play, pause, toggle }
}
