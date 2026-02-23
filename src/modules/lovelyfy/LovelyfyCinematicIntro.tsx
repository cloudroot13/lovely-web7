import { useEffect, type CSSProperties } from 'react'
import './LovelyfyCinematicIntro.css'
import HeartBackground from '../../components/HeartBackground.jsx'

interface LovelyfyCinematicIntroProps {
  coupleName: string
  subtitle: string
  onDone: () => void
  durationMs?: number
  autoClose?: boolean
}

export function LovelyfyCinematicIntro({
  coupleName,
  subtitle,
  onDone,
  durationMs = 2600,
  autoClose = true,
}: LovelyfyCinematicIntroProps) {
  useEffect(() => {
    if (!autoClose) {
      return
    }

    const timer = window.setTimeout(onDone, durationMs)
    return () => window.clearTimeout(timer)
  }, [autoClose, durationMs, onDone])

  return (
    <div className="cinematic-intro" aria-hidden>
      <div className="cinematic-intro__background" />
      <div className="cinematic-intro__energy-glow" />
      <HeartBackground />

      <div className="cinematic-intro__text">
        <h1 className="cinematic-intro__title" style={{ '--chars': coupleName.length } as CSSProperties}>
          {coupleName}
        </h1>
        <p className="cinematic-intro__subtitle">{subtitle}</p>
      </div>
    </div>
  )
}
