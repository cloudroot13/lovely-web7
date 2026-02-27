import { useEffect, useState, type CSSProperties } from 'react'
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
  const [liteMode, setLiteMode] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const smallScreen = window.matchMedia('(max-width: 768px)')

    const apply = () => {
      const deviceMemory = typeof navigator !== 'undefined' && 'deviceMemory' in navigator
        ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory
        : undefined

      setLiteMode(reducedMotion.matches || smallScreen.matches || (deviceMemory !== undefined && deviceMemory <= 4))
    }

    apply()
    reducedMotion.addEventListener('change', apply)
    smallScreen.addEventListener('change', apply)

    return () => {
      reducedMotion.removeEventListener('change', apply)
      smallScreen.removeEventListener('change', apply)
    }
  }, [])

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
      <HeartBackground lite={liteMode} />

      <div className="cinematic-intro__text">
        <h1 className="cinematic-intro__title" style={{ '--chars': coupleName.length } as CSSProperties}>
          {coupleName}
        </h1>
        <p className="cinematic-intro__subtitle">{subtitle}</p>
      </div>
    </div>
  )
}
