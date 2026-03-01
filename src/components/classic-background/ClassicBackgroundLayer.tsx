import { memo, useMemo } from 'react'
import '../../styles/classic-hearts-animation.css'
import '../../styles/classic-cloud-animation.css'
import '../../styles/classic-stars-meteors-animation.css'

export type BackgroundMode = 'none' | 'hearts' | 'stars_meteors' | 'clouds'

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function getMeteorRotation(startX: number, startY: number, endX: number, endY: number) {
  return (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI - 90
}

export const ClassicBackgroundLayer = memo(function ClassicBackgroundLayer({ mode }: { mode: BackgroundMode }) {
  const heartParticles = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, idx) => ({
        key: `heart-${idx}`,
        delay: -randomBetween(0, 10),
        duration: 10 + randomBetween(0, 10),
        left: randomBetween(0, 100),
        size: 20 + randomBetween(0, 40),
        opacity: 0.3 + randomBetween(0, 0.7),
      })),
    [],
  )

  const starParticles = useMemo(
    () =>
      Array.from({ length: 240 }).map((_, idx) => ({
        key: `star-${idx}`,
        x: randomBetween(0, 100),
        y: randomBetween(0, 100),
        size: randomBetween(1, 4),
        opacity: randomBetween(0.18, 0.9),
        twinkleDuration: randomBetween(2, 6.2),
        twinkleDelay: -randomBetween(0, 6),
        shouldTwinkle: idx % 5 !== 0,
      })),
    [],
  )

  const meteorParticles = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, idx) => {
        const startX = randomBetween(-8, 122)
        const startY = randomBetween(-34, 24)
        const endX = startX - randomBetween(52, 146)
        const endY = startY + randomBetween(72, 152)
        const duration = randomBetween(4.2, 7.2)
        return {
          key: `meteor-${idx}`,
          startX,
          endX,
          startY,
          endY,
          trail: randomBetween(64, 104),
          angle: getMeteorRotation(startX, startY, endX, endY),
          duration,
          delay: -randomBetween(0, 24),
        }
      }),
    [],
  )

  if (mode === 'none') {
    return <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-[#09090b] via-[#0a0a0d] to-[#060609]" />
  }

  if (mode === 'hearts') {
    return (
      <div data-no-inview-pause="1" className="pointer-events-none absolute inset-0 overflow-hidden bg-linear-to-b from-[#170d14] via-[#0f0d12] to-[#07070a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,70,152,0.22),transparent_40%),radial-gradient(circle_at_75%_72%,rgba(255,70,152,0.16),transparent_44%)]" />
        <div className="classic-hearts-animation-container">
          {heartParticles.map((particle) => (
            <div
              key={particle.key}
              className="classic-heart-particle"
              style={{
                left: `${particle.left}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: `${particle.duration}s`,
                animationDelay: `${particle.delay}s`,
                ['--heart-opacity' as string]: particle.opacity.toFixed(3),
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (mode === 'clouds') {
    const cloudLayers = [
      { key: 'back', className: 'classic-cloud-layer-back', count: 7, minTop: 10, maxTop: 42, minWidth: 190, maxWidth: 320, minOpacity: 0.24, maxOpacity: 0.4, minDuration: 74, maxDuration: 98 },
      { key: 'mid', className: 'classic-cloud-layer-mid', count: 8, minTop: 22, maxTop: 68, minWidth: 150, maxWidth: 265, minOpacity: 0.32, maxOpacity: 0.52, minDuration: 56, maxDuration: 76 },
      { key: 'front', className: 'classic-cloud-layer-front', count: 10, minTop: 40, maxTop: 90, minWidth: 120, maxWidth: 220, minOpacity: 0.42, maxOpacity: 0.62, minDuration: 44, maxDuration: 62 },
    ] as const

    return (
      <div data-no-inview-pause="1" className="classic-cloud-scene pointer-events-none absolute inset-0">
        {cloudLayers.map((layer) => (
          <div key={layer.key} className={`classic-cloud-layer ${layer.className}`}>
            {Array.from({ length: layer.count }).flatMap((_, idx) => {
              const width = randomBetween(layer.minWidth, layer.maxWidth)
              const opacity = randomBetween(layer.minOpacity, layer.maxOpacity)
              const driftDuration = randomBetween(layer.minDuration, layer.maxDuration)
              const bobDuration = randomBetween(13, 22)
              const delayBase = -randomBetween(0, driftDuration * 2.2)
              const top = randomBetween(layer.minTop, layer.maxTop)

              return [0, 1, 2].map((phase) => {
                const phaseDelay = delayBase - phase * (driftDuration / 3)
                return (
                  <div
                    key={`${layer.key}-${idx}-${phase}`}
                    className="classic-cloud-item"
                    style={{
                      ['--cloud-width' as string]: `${width}px`,
                      ['--cloud-opacity' as string]: opacity.toFixed(3),
                      ['--cloud-top' as string]: `${top}%`,
                      animationDuration: `${driftDuration}s`,
                      animationDelay: `${phaseDelay}s`,
                    }}
                  >
                    <div className="classic-cloud-body" style={{ animation: `classic-cloud-float ${bobDuration}s ease-in-out ${phaseDelay * 0.4}s infinite` }}>
                      <span className="classic-cloud-puff classic-cloud-puff-a" />
                      <span className="classic-cloud-puff classic-cloud-puff-b" />
                      <span className="classic-cloud-puff classic-cloud-puff-c" />
                      <span className="classic-cloud-puff classic-cloud-puff-d" />
                    </div>
                  </div>
                )
              })
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div data-no-inview-pause="1" className="classic-star-scene pointer-events-none absolute inset-0">
      <div className="classic-star-haze" />
      {starParticles.map((particle) => (
        <span
          key={particle.key}
          className={`classic-star-dot ${particle.shouldTwinkle ? 'classic-star-dot-twinkle' : ''}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDuration: particle.shouldTwinkle ? `${particle.twinkleDuration}s` : undefined,
            animationDelay: particle.shouldTwinkle ? `${particle.twinkleDelay}s` : undefined,
          }}
        />
      ))}
      {meteorParticles.map((particle) => (
        <span
          key={particle.key}
          className="classic-star-meteor"
          style={{
            ['--start-x' as string]: `${particle.startX}%`,
            ['--start-y' as string]: `${particle.startY}%`,
            ['--end-x' as string]: `${particle.endX}%`,
            ['--end-y' as string]: `${particle.endY}%`,
            ['--trail' as string]: `${particle.trail}px`,
            ['--angle' as string]: `${particle.angle}deg`,
            ['--duration' as string]: `${particle.duration}s`,
            ['--delay' as string]: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  )
})
