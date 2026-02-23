import styles from './HeartBackground.module.css'

function buildHeartPixels() {
  const points = []

  for (let i = 0; i < 56; i += 1) {
    const t = (Math.PI * 2 * i) / 56
    const x = 16 * Math.sin(t) ** 3
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)

    const nx = x / 18
    const ny = y / 18

    points.push({
      x: 50 + nx * 36,
      y: 52 - ny * 30,
    })
  }

  return points
    .map((point, index) => ({
      x: Math.max(10, Math.min(90, point.x)),
      y: Math.max(10, Math.min(90, point.y)),
      size: index % 4 === 0 ? 8 : index % 2 === 0 ? 7 : 6,
      delay: index * 0.045,
      duration: 5.8 + (index % 5) * 0.28,
      drift: 6 + (index % 4),
      alpha: 0.88 - (index % 6) * 0.05,
    }))
    .concat([
      { x: 50, y: 74, size: 8, delay: 1.3, duration: 6.2, drift: 8, alpha: 0.95 },
      { x: 49.1, y: 70.5, size: 6, delay: 1.18, duration: 6, drift: 7, alpha: 0.82 },
      { x: 50.9, y: 70.5, size: 6, delay: 1.24, duration: 6.1, drift: 7, alpha: 0.82 },
    ])
}

const HEART_PIXELS = buildHeartPixels()

const CENTER_PIXELS = [
  { x: 45, y: 48, size: 3, delay: 0.4, duration: 3.6 },
  { x: 50, y: 45, size: 4, delay: 0.8, duration: 4.2 },
  { x: 55, y: 48, size: 3, delay: 1.1, duration: 3.8 },
  { x: 47, y: 53, size: 4, delay: 1.4, duration: 4.1 },
  { x: 53, y: 55, size: 3, delay: 1.7, duration: 3.9 },
]

export default function HeartBackground() {
  return (
    <div className={styles.root} aria-hidden>
      <div className={styles.bg} />

      <div className={styles.stage}>
        {HEART_PIXELS.map((pixel, index) => (
          <span
            key={`heart-${index}`}
            className={styles.heartPixel}
            style={{
              left: `${pixel.x}%`,
              top: `${pixel.y}%`,
              width: `${pixel.size}px`,
              height: `${pixel.size}px`,
              opacity: pixel.alpha,
              '--p-delay': `${pixel.delay}s`,
              '--p-duration': `${pixel.duration}s`,
              '--p-drift': `${pixel.drift}px`,
            }}
          />
        ))}
      </div>

      <div className={styles.centerParticles}>
        {CENTER_PIXELS.map((pixel, index) => (
          <span
            key={`center-${index}`}
            className={styles.centerPixel}
            style={{
              left: `${pixel.x}%`,
              top: `${pixel.y}%`,
              width: `${pixel.size}px`,
              height: `${pixel.size}px`,
              '--c-delay': `${pixel.delay}s`,
              '--c-duration': `${pixel.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
