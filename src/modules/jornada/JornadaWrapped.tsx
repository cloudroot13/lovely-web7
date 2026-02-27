import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useLocation } from 'react-router-dom'
import flocoImage from '../../assets/floco.png'
import { WRAPPED_STORY_DURATION_MS } from '../../constants/wrappedTiming'
import type { LoveData } from '../../types/types'

interface JornadaWrappedProps {
  loveData: LoveData
}

type JourneyStoryKind = 'constellation' | 'moon' | 'snow' | 'floating' | 'final'

interface JourneyStory {
  id: string
  title: string
  text: string
  kind: JourneyStoryKind
}

interface MemoryItem {
  title: string
  caption: string
  image: string
  rotation: number
  dateLabel: string
}

const timelineBase = [
  { title: 'Primeiro encontro', caption: 'Nosso lugar preferido' },
  { title: 'Primeiro beijo', caption: 'Nunca fiquei tão nervoso' },
  { title: 'Primeira viagem', caption: 'A nossa melhor aventura' },
  { title: 'Pedido de namoro', caption: 'O sim mais bonito da vida' },
  { title: 'Momento especial', caption: 'Um capítulo que mora em mim' },
]

const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

function randomFromSeed(seed: number) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

function formatPtMonthYear(dateValue?: string) {
  if (!dateValue) {
    return 'Junho 2022'
  }
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) {
    return 'Junho 2022'
  }
  return `${monthNames[parsed.getMonth()]} ${parsed.getFullYear()}`
}

function formatPtDate(dateValue?: string) {
  if (!dateValue) {
    return '11 de Setembro de 2022'
  }
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) {
    return '11 de Setembro de 2022'
  }
  return parsed.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function addMonths(base: Date, months: number) {
  const next = new Date(base)
  next.setMonth(next.getMonth() + months)
  return next
}

function formatCoupleName(data: LoveData) {
  const partA = data.nomeCriador?.trim() || 'Nosso'
  const partB = data.nomePessoa?.trim() || 'Amor'
  return `${partA} e ${partB}`
}

function getMeteorRotation(startX: number, startY: number, endX: number, endY: number) {
  const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI - 90
  return `${angle.toFixed(2)}deg`
}

const loveLanguages = [
  'Eu te amo',
  'I love you',
  "Je t’aime",
  'Ti amo',
  'Te amo',
  'Te quiero',
  'Ich liebe dich',
  'Aishiteru',
  'Saranghae',
  'Ya tebya lyublyu',
  'Ana behibak',
  'Wo ai ni',
  'S’agapo',
  'Mahal kita',
  'Te iubesc',
  'Ik hou van je',
  'T’estimo',
  'Szeretlek',
  'Volim te',
  'Seni seviyorum',
  'Aku cinta kamu',
  'Saya cinta kamu',
  'Phom rak khun',
  'Chan rak khun',
  'Main tumse pyaar karta hoon',
  'Main tumse pyaar karti hoon',
  'Kocham cię',
  'Aloha wau ia oe',
  'Mina armastan sind',
  'Ikh hob dikh',
  'Jeg elsker deg',
  'Jeg elsker dig',
  'Jag älskar dig',
  'Kocham cie',
]

function FinalLoveBurstSlide() {
  const [burstId, setBurstId] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [heartGone, setHeartGone] = useState(false)
  const [words, setWords] = useState<
    Array<{
      id: string
      text: string
      x: number
      y: number
      r: number
      d: number
      delay: number
    }>
  >([])

  const particles = useMemo(
    () =>
      Array.from({ length: 48 }).map((_, idx) => {
        const angle = (idx / 36) * Math.PI * 2
        const radius = 70 + (idx % 7) * 18
        return { id: idx, x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
      }),
    [],
  )

  return (
    <div className="story-card relative h-full w-full rounded-[26px] bg-black">
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,160,210,0.15)_0%,rgba(255,160,210,0.04)_38%,rgba(0,0,0,0)_72%)]" />
      <div className="stars-canvas">
        {Array.from({ length: 26 }).map((_, idx) => (
          <div
            key={`final-star-${idx}`}
            className="const-star-wrap"
            style={{
              '--angle': `${Math.round(randomFromSeed(idx + 72.9) * 360)}deg`,
              '--radius': `${26 + Math.round(randomFromSeed(idx + 78.4) * 188)}px`,
              '--delay': `${(randomFromSeed(idx + 83.3) * 2.6).toFixed(2)}s`,
              '--duration': `${(2.2 + randomFromSeed(idx + 91.7) * 2.6).toFixed(2)}s`,
            } as CSSProperties}
          >
            <span className="journey-final-star" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        {!heartGone && (
          <button
            type="button"
            onClick={() => {
              setBurstId((prev) => prev + 1)
              setRevealed(true)
              setWords(
                loveLanguages.map((text, idx) => ({
                  id: `${text}-${idx}-${Date.now()}`,
                  text,
                  x: (Math.random() - 0.5) * 340,
                  y: (Math.random() - 0.5) * 520,
                  r: (Math.random() - 0.5) * 22,
                  d: 4.4 + Math.random() * 2.8,
                  delay: idx * 0.04,
                })),
              )
              window.setTimeout(() => setHeartGone(true), 260)
            }}
            className="journey-love-heart"
            aria-label="Explodir coração"
          >
            ❤
          </button>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        {Array.from({ length: burstId }).map((_, effectIndex) => (
          <div key={`burst-${effectIndex}`} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="journey-love-flash" />
            {particles.map((particle) => (
              <span
                key={`particle-${effectIndex}-${particle.id}`}
                className="journey-love-particle"
                style={{ '--x': `${particle.x}px`, '--y': `${particle.y}px` } as CSSProperties}
              />
            ))}
          </div>
        ))}

        {revealed && (
          <div className="absolute inset-0">
            {words.map((word) => (
              <span
                key={word.id}
                className="journey-love-word"
                style={{
                  left: '50%',
                  top: '50%',
                  '--x': `${word.x}px`,
                  '--y': `${word.y}px`,
                  '--r': `${word.r}deg`,
                  animationDuration: `${word.d}s`,
                  animationDelay: `${word.delay}s`,
                } as CSSProperties}
              >
                {word.text}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StorySlide({
  story,
  coupleName,
  loveData,
  onAdvance,
  isBuilderPreview,
}: {
  story: JourneyStory
  coupleName: string
  loveData: LoveData
  onAdvance: () => void
  isBuilderPreview: boolean
}) {
  if (story.kind === 'constellation') {
    const field = Array.from({ length: 56 }).map((_, idx) => {
      const angle = `${Math.round(randomFromSeed(idx + 2.1) * 360)}deg`
      const radius = `${35 + Math.round(randomFromSeed(idx + 7.3) * 120)}px`
      const delay = `${(randomFromSeed(idx + 9.9) * 2.7).toFixed(2)}s`
      const duration = `${(1.4 + randomFromSeed(idx + 11.4) * 2.2).toFixed(2)}s`
      return { angle, radius, delay, duration }
    })
    const shooting = Array.from({ length: 8 }).map((_, idx) => ({
      delay: `${(idx * 0.55).toFixed(2)}s`,
      duration: `${(4.4 + (idx % 3) * 0.7).toFixed(2)}s`,
      sx: 260 - (idx % 4) * 28,
      sy: -170 - (idx % 3) * 24,
      ex: -200 - (idx % 3) * 44,
      ey: 620 + (idx % 2) * 75,
    }))

    return (
      <div className="story-card relative h-full w-full rounded-[26px] bg-black">
        <div className="absolute inset-0 journey-deep-sky" />
        <div className="stars-canvas">
          {field.map((star, idx) => (
            <div
              key={`const-field-${idx}`}
              className="const-star-wrap"
              style={{ '--angle': star.angle, '--radius': star.radius, '--delay': star.delay, '--duration': star.duration } as CSSProperties}
            >
              <span className="journey-const-star" />
            </div>
          ))}
          {shooting.map((item, idx) => (
            <div
              key={`shoot-${idx}`}
              className="const-shooting-wrap"
              style={
                {
                  '--delay': item.delay,
                  '--shoot-duration': item.duration,
                  '--shoot-start-x': `${item.sx}px`,
                  '--shoot-start-y': `${item.sy}px`,
                  '--shoot-end-x': `${item.ex}px`,
                  '--shoot-end-y': `${item.ey}px`,
                  '--shoot-rot': getMeteorRotation(item.sx, item.sy, item.ex, item.ey),
                } as CSSProperties
              }
            >
              <span className="shooting-star" />
            </div>
          ))}
        </div>

        <div className="animation-wrapper">
          <div className="constellation-core">
            <svg className="constellation-svg" viewBox="0 0 320 320" aria-hidden>
              <circle cx="160" cy="160" r="132" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <circle cx="160" cy="160" r="100" fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
              <circle cx="160" cy="160" r="68" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <circle cx="160" cy="160" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="28" y1="160" x2="292" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="160" y1="28" x2="160" y2="292" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
              <line x1="55" y1="65" x2="265" y2="255" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <line x1="55" y1="255" x2="265" y2="65" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

              <polyline points="82,186 102,180 116,190 121,178 131,184" fill="none" stroke="rgba(255,255,255,0.82)" strokeWidth="1.4" />
              <polyline points="94,242 104,232 112,238 117,229" fill="none" stroke="rgba(255,255,255,0.82)" strokeWidth="1.4" />

              <circle cx="82" cy="186" r="3" fill="white" className="journey-node" />
              <circle cx="102" cy="180" r="3" fill="white" className="journey-node" />
              <circle cx="116" cy="190" r="3" fill="white" className="journey-node" />
              <circle cx="121" cy="178" r="3" fill="white" className="journey-node" />
              <circle cx="131" cy="184" r="3" fill="white" className="journey-node" />
              <circle cx="94" cy="242" r="3" fill="white" className="journey-node" />
              <circle cx="104" cy="232" r="3" fill="white" className="journey-node" />
              <circle cx="112" cy="238" r="3" fill="white" className="journey-node" />
              <circle cx="117" cy="229" r="3" fill="white" className="journey-node" />
            </svg>
          </div>
        </div>

        <div className="story-top-zone px-6 text-center">
          <p className="journey-title-main text-white" style={{ fontFamily: 'cursive' }}>
            {coupleName}
          </p>
        </div>

        <div className="story-bottom-zone px-6 text-center">
          <p className="journey-story-quote">"Foi ali que o universo decidiu escrever nossa história"</p>
          <p className="journey-small mt-3 uppercase tracking-[0.22em] text-zinc-300/85">
            {loveData.localConheceram || loveData.comoConheceram || 'Onde tudo começou'}
          </p>
          <p className="journey-small mt-1 uppercase tracking-[0.18em] text-zinc-400">
            {formatPtDate(loveData.startDate)}
          </p>
          <button
            type="button"
            onClick={() => {
              if (isBuilderPreview) return
              onAdvance()
            }}
            className="mt-5 rounded-full bg-zinc-200 px-6 py-2 text-sm font-semibold text-black transition duration-300 ease-in-out hover:scale-105"
          >
            Próxima seção
          </button>
          {isBuilderPreview && <p className="mt-3 text-xs text-zinc-300">Conclua os passos para ter acesso.</p>}
        </div>
      </div>
    )
  }

  if (story.kind === 'moon') {
    return (
      <div className="story-card relative h-full w-full rounded-[26px] bg-[#030407]">
        <div className="absolute inset-0 journey-deep-sky" />
        <div className="stars-canvas">
          {Array.from({ length: 22 }).map((_, idx) => (
            <div
              key={`moon-field-${idx}`}
              className="const-star-wrap"
              style={{
                '--angle': `${Math.round(randomFromSeed(idx + 10.1) * 360)}deg`,
                '--radius': `${26 + Math.round(randomFromSeed(idx + 14.6) * 150)}px`,
                '--delay': `${(randomFromSeed(idx + 19.4) * 2.6).toFixed(2)}s`,
                '--duration': `${(2.4 + randomFromSeed(idx + 22.7) * 2.8).toFixed(2)}s`,
              } as CSSProperties}
            >
              <span className="journey-bg-star" />
            </div>
          ))}
        </div>

        <div className="story-top-zone px-7 text-center">
          <p className="journey-title-main text-white">Naquela noite, a lua foi testemunha do nosso começo</p>
        </div>

        <div className="moon-wrapper">
          <div className="moon-stack">
            <div className="moon journey-moon-disk">
              <span className="absolute left-[22%] top-[34%] h-7 w-7 rounded-full bg-zinc-300/80 blur-[1px]" />
              <span className="absolute left-[53%] top-[23%] h-5 w-5 rounded-full bg-zinc-300/80 blur-[1px]" />
              <span className="absolute left-[61%] top-[57%] h-9 w-9 rounded-full bg-zinc-300/80 blur-[1px]" />
            </div>
          </div>
        </div>

        <div className="story-bottom-zone text-center">
          <p className="journey-title-main text-zinc-100 [text-shadow:0_0_18px_rgba(255,255,255,0.35)]">Cheia</p>
        </div>
      </div>
    )
  }

  if (story.kind === 'snow') {
    const snowParticles = Array.from({ length: 14 }).map((_, idx) => ({
      angle: `${Math.round((idx / 14) * 360)}deg`,
      radius: `${90 + (idx % 4) * 14}px`,
      delay: `${(idx % 7) * 0.28}s`,
      duration: `${(5.2 + (idx % 6) * 0.4).toFixed(2)}s`,
    }))

    return (
      <div className="story-card winter-story-card relative h-full w-full rounded-[26px]">
        <div className="absolute inset-0 journey-deep-sky" />
        <div className="stars-canvas">
          {Array.from({ length: 24 }).map((_, idx) => (
            <div
              key={`snow-field-${idx}`}
              className="const-star-wrap"
              style={{
                '--angle': `${Math.round(randomFromSeed(idx + 31.8) * 360)}deg`,
                '--radius': `${24 + Math.round(randomFromSeed(idx + 41.2) * 150)}px`,
                '--delay': `${(randomFromSeed(idx + 52.1) * 3).toFixed(2)}s`,
                '--duration': `${(2.3 + randomFromSeed(idx + 63.4) * 2.7).toFixed(2)}s`,
              } as CSSProperties}
            >
              <span className="winter-particle" />
            </div>
          ))}
        </div>

        <div className="story-top-zone px-8 text-center">
          <p className="journey-title-main text-white">No silêncio do inverno</p>
        </div>

        <div className="animation-wrapper">
          <div className="snow-stack">
            <div className="winter-halo journey-snow-halo">
              <div className="snow-halo snow-halo-inner journey-snow-halo-soft" />
              <img src={flocoImage} alt="Floco de neve" className="snowflake-img" />
            </div>
            {snowParticles.map((particle, idx) => (
              <div
                key={`snow-orb-${idx}`}
                className="orbit-wrap"
                style={{
                  '--angle': particle.angle,
                  '--radius': particle.radius,
                  '--delay': particle.delay,
                  '--duration': particle.duration,
                } as CSSProperties}
              >
                <span className="journey-snow-dot" />
              </div>
            ))}
          </div>
        </div>

        <div className="story-bottom-zone text-center">
          <p className="winter-title journey-title-main">Na estação mais fria, encontramos o calor um no outro</p>
        </div>
      </div>
    )
  }

  if (story.kind === 'floating') {
    const field = Array.from({ length: 72 }).map((_, idx) => ({
      angle: `${Math.round(randomFromSeed(idx + 40.2) * 360)}deg`,
      radius: `${22 + Math.round(randomFromSeed(idx + 45.1) * 195)}px`,
      delay: `${(randomFromSeed(idx + 50.5) * 2.2).toFixed(2)}s`,
      duration: `${(1.2 + randomFromSeed(idx + 55.7) * 2.1).toFixed(2)}s`,
    }))
    const shooting = Array.from({ length: 10 }).map((_, idx) => ({
      delay: `${(idx * 0.45).toFixed(2)}s`,
      duration: `${(4.8 + (idx % 4) * 0.65).toFixed(2)}s`,
      sx: 240 - (idx % 5) * 24,
      sy: -190 - (idx % 4) * 18,
      ex: -210 - (idx % 4) * 45,
      ey: 640 + (idx % 3) * 70,
    }))

    return (
      <div className="story-card relative h-full w-full rounded-[26px] bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0c] via-[#060608] to-black" />
        <div className="stars-canvas">
          {field.map((star, idx) => (
            <div
              key={`floating-${idx}`}
              className="const-star-wrap"
              style={{ '--angle': star.angle, '--radius': star.radius, '--delay': star.delay, '--duration': star.duration } as CSSProperties}
            >
              <span className="journey-bg-star" />
            </div>
          ))}
          {shooting.map((item, idx) => (
            <div
              key={`floating-shoot-${idx}`}
              className="const-shooting-wrap"
              style={
                {
                  '--delay': item.delay,
                  '--shoot-duration': item.duration,
                  '--shoot-start-x': `${item.sx}px`,
                  '--shoot-start-y': `${item.sy}px`,
                  '--shoot-end-x': `${item.ex}px`,
                  '--shoot-end-y': `${item.ey}px`,
                  '--shoot-rot': getMeteorRotation(item.sx, item.sy, item.ex, item.ey),
                } as CSSProperties
              }
            >
              <span className="shooting-star" />
            </div>
          ))}
        </div>

        <div className="story-top-zone px-8 text-center">
          <p className="journey-title-main text-white">{coupleName}</p>
          <p className="journey-subtitle mt-3 text-zinc-200">cada estrela guarda um pedacinho nosso</p>
        </div>

        <div className="animation-wrapper">
          <div className="floating-center">
            <div className="h-20 w-20 rounded-full bg-pink-300/15 blur-2xl journey-heart-halo" />
            <div className="absolute text-3xl text-pink-200/90 journey-heart-bob">♥</div>
          </div>
        </div>
      </div>
    )
  }

  return <FinalLoveBurstSlide />
}

export function JornadaWrapped({ loveData }: JornadaWrappedProps) {
  const location = useLocation()
  const isBuilderPreview = new URLSearchParams(location.search).get('builderPreview') === '1'
  const [showStories, setShowStories] = useState(false)
  const [storyIndex, setStoryIndex] = useState(0)
  const [storyProgress, setStoryProgress] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const coupleName = useMemo(() => formatCoupleName(loveData), [loveData])

  const memories = useMemo<MemoryItem[]>(() => {
    const rotations = [-2.6, 1.8, -1.2, 2.2, -0.8]
    const fallback = loveData.fotoCasalDataUrl || loveData.storiesImagesDataUrls[0] || ''
    const start = !Number.isNaN(new Date(loveData.startDate).getTime()) ? new Date(loveData.startDate) : new Date('2022-06-01')

    const highlights = loveData.momentHighlights.slice(0, 5)
    const base = timelineBase.map((entry, index) => {
      const dateLabel = formatPtMonthYear(addMonths(start, index * 2).toISOString())
      return {
        title: entry.title,
        caption: entry.caption,
        image: fallback,
        dateLabel,
      }
    })

    const merged = base.map((entry, index) => {
      const highlight = highlights[index]
      const title = highlight?.title?.trim() || highlight?.text?.trim() || entry.title
      const caption = highlight?.message?.trim() || highlight?.text?.trim() || highlight?.title?.trim() || entry.caption
      const image = highlight?.imageDataUrl || entry.image
      const dateLabel = highlight?.date ? formatPtMonthYear(highlight.date) : entry.dateLabel
      return { title, caption, image, dateLabel }
    })

    return merged.map((item, index) => ({
      ...item,
      rotation: rotations[index % rotations.length],
    }))
  }, [loveData])

  const stories = useMemo<JourneyStory[]>(
    () => [
      {
        id: 'journey-1',
        title: 'Constelação',
        text: 'Foi ali que o universo decidiu escrever nossa história',
        kind: 'constellation',
      },
      {
        id: 'journey-2',
        title: 'Lua',
        text: 'Naquela noite, a lua foi testemunha do nosso começo',
        kind: 'moon',
      },
      {
        id: 'journey-3',
        title: 'Cristal de Neve',
        text: 'Durante o inverno mais especial',
        kind: 'snow',
      },
      {
        id: 'journey-4',
        title: 'Estrelas',
        text: `${coupleName}, cada detalhe nosso virou luz.`,
        kind: 'floating',
      },
      {
        id: 'journey-5',
        title: 'Final',
        text: 'Essa é apenas o começo da nossa Jornada',
        kind: 'final',
      },
    ],
    [coupleName],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || showStories) {
      return
    }

    const context = canvas.getContext('2d')
    if (!context) {
      return
    }

    const stars = Array.from({ length: 64 }).map((_, idx) => ({
      x: randomFromSeed(idx + 1.2) * 390,
      y: randomFromSeed(idx + 4.4) * 920,
      r: 0.3 + randomFromSeed(idx + 8.1) * 1.1,
      speed: 0.09 + randomFromSeed(idx + 9.2) * 0.22,
      twinkle: randomFromSeed(idx + 11.9) * Math.PI * 2,
    }))

    const shooting = Array.from({ length: 2 }).map((_, idx) => ({
      x: -120 - idx * 140,
      y: 80 + idx * 180,
      speed: 1.9 + idx * 0.45,
      active: false,
      wait: 260 + idx * 180,
    }))

    let rafId = 0

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) {
        return
      }
      const width = parent.clientWidth
      const height = parent.clientHeight
      canvas.width = Math.floor(width * window.devicePixelRatio)
      canvas.height = Math.floor(height * window.devicePixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    }

    resize()

    const draw = (t: number) => {
      const width = canvas.clientWidth
      const height = canvas.clientHeight

      context.clearRect(0, 0, width, height)

      stars.forEach((star, idx) => {
        const alpha = 0.24 + ((Math.sin(t * 0.001 * star.speed + star.twinkle + idx) + 1) / 2) * 0.5
        context.beginPath()
        context.arc((star.x + t * 0.0018 * star.speed) % width, star.y % height, star.r, 0, Math.PI * 2)
        context.fillStyle = `rgba(255,255,255,${alpha})`
        context.fill()
      })

      shooting.forEach((item) => {
        if (!item.active) {
          item.wait -= 1
          if (item.wait <= 0) {
            item.active = true
            item.x = -90
            item.y = 50 + randomFromSeed(t * 0.0002 + item.speed) * (height * 0.55)
          }
          return
        }

        item.x += item.speed
        item.y += item.speed * 0.35

        const gradient = context.createLinearGradient(item.x, item.y, item.x - 54, item.y - 18)
        gradient.addColorStop(0, 'rgba(255,255,255,0.55)')
        gradient.addColorStop(1, 'rgba(255,255,255,0)')

        context.strokeStyle = gradient
        context.lineWidth = 1.3
        context.beginPath()
        context.moveTo(item.x, item.y)
        context.lineTo(item.x - 46, item.y - 14)
        context.stroke()

        if (item.x > width + 90 || item.y > height + 90) {
          item.active = false
          item.wait = 300 + Math.floor(randomFromSeed(item.x + item.y) * 280)
        }
      })

      rafId = window.requestAnimationFrame(draw)
    }

    rafId = window.requestAnimationFrame(draw)
    window.addEventListener('resize', resize)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [showStories])

  useEffect(() => {
    if (!showStories) {
      return
    }

    let rafId = 0
    const startedAt = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const progress = Math.min(1, elapsed / WRAPPED_STORY_DURATION_MS)
      setStoryProgress(progress)

      if (progress >= 1) {
        setStoryIndex((prev) => (prev < stories.length - 1 ? prev + 1 : prev))
        return
      }

      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [showStories, storyIndex, stories.length])

  const openStories = () => {
    setStoryProgress(0)
    setStoryIndex(0)
    setShowStories(true)
  }

  const nextStory = () => {
    setStoryProgress(0)
    setStoryIndex((prev) => (prev < stories.length - 1 ? prev + 1 : prev))
  }

  const prevStory = () => {
    setStoryProgress(0)
    setStoryIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  return (
    <>
      <main className="relative min-h-screen bg-[#0a0a0a] text-white">
        <div className="journey-shell flex flex-col border border-zinc-800/70 bg-black shadow-[0_0_80px_rgba(0,0,0,0.7)]">
          {!showStories && (
            <section className="relative flex-1 overflow-y-auto overscroll-contain px-4 pb-8 pt-8">
              <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 will-change-transform" aria-hidden />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/85" />

              <div className="relative z-10 mx-auto max-w-[334px]">
                <h1 className="journey-title-main text-center tracking-[0.06em]">Jornada</h1>
                <p className="journey-small mt-2 text-center text-zinc-300">Nossa linha do tempo em forma de estrelas.</p>

                <div className="relative mt-8 pb-6">
                  <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/16" aria-hidden />

                  {memories.map((item, idx) => {
                    const card = (
                      <article
                        className="journey-polaroid group relative rounded-[8px] border border-white/20 bg-[#f6f1df] p-3 text-black shadow-[0_12px_28px_rgba(0,0,0,0.38)] transition duration-300 ease-in-out will-change-transform hover:-translate-y-2.5 hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(255,255,255,0.18)]"
                        style={{ transform: `rotate(${item.rotation}deg)` }}
                      >
                        <div className="journey-polaroid-photo overflow-hidden rounded-[6px] bg-zinc-200">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="h-40 w-full object-cover" loading="lazy" />
                          ) : (
                            <div className="flex h-40 items-center justify-center bg-zinc-300 text-sm text-zinc-700">Sem foto</div>
                          )}
                        </div>
                        <p className="journey-polaroid-caption mt-2.5 font-medium text-zinc-800" style={{ fontFamily: 'cursive' }}>
                          {item.caption}
                        </p>
                      </article>
                    )

                    const text = (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <p className="journey-timeline-date font-bold text-pink-400">{item.dateLabel}</p>
                        <p className="journey-timeline-label mt-1.5 font-medium leading-tight text-zinc-100">{item.title}</p>
                      </div>
                    )

                    return (
                    <div key={`${item.title}-${idx}`} className="relative mb-11 grid grid-cols-2 gap-5">
                        <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400/80 shadow-[0_0_16px_rgba(244,114,182,0.65)]" />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-pink-300">♥</span>

                        {idx % 2 === 0 ? (
                          <>
                            <div>{card}</div>
                            <div>{text}</div>
                          </>
                        ) : (
                          <>
                            <div>{text}</div>
                            <div>{card}</div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mb-2 mt-2 rounded-2xl border border-white/10 bg-black/45 px-4 py-7 text-center">
                  <p className="journey-title-main leading-tight">E estamos apenas começando...</p>
                  <button
                    type="button"
                    onClick={openStories}
                    className="mt-5 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition duration-300 ease-in-out hover:scale-110 hover:shadow-[0_0_24px_rgba(255,255,255,0.35)]"
                  >
                    Começar Nossa História
                  </button>
                </div>
              </div>
            </section>
          )}

          {showStories && (
            <section className="relative flex h-full flex-col bg-black">
              <div className="pointer-events-none absolute inset-0 bg-black" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
              <div className="relative z-10 flex-1 overflow-hidden px-2 pb-3 pt-2">
                <div className="flex h-full transition-transform duration-[400ms] ease-in-out" style={{ transform: `translateX(-${storyIndex * 100}%)` }}>
                  {stories.map((slide) => (
                    <div key={slide.id} className="h-full min-w-full px-1">
                      <StorySlide story={slide} coupleName={coupleName} loveData={loveData} onAdvance={nextStory} isBuilderPreview={isBuilderPreview} />
                    </div>
                  ))}
                </div>

                <header
                  className="pointer-events-none absolute left-3 right-3 z-30"
                  style={{ top: 'calc(env(safe-area-inset-top, 0px) + 8px)' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="mr-1 flex flex-1 gap-1.5">
                      {stories.map((slide, idx) => (
                        <span key={slide.id} className="relative h-1 flex-1 overflow-hidden rounded-full bg-zinc-700/90">
                          <span
                            className="absolute inset-y-0 left-0 rounded-full bg-red-500 transition-[width] duration-100 ease-linear"
                            style={{
                              width: idx < storyIndex ? '100%' : idx === storyIndex ? `${Math.round(storyProgress * 100)}%` : '0%',
                            }}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-2 text-xs uppercase tracking-[0.2em] text-zinc-300">Story {storyIndex + 1}/{stories.length}</div>
                </header>

                <button
                  type="button"
                  aria-label="Voltar story"
                  className="absolute inset-y-0 left-0 z-30 w-[34%]"
                  onClick={prevStory}
                />
                <button
                  type="button"
                  aria-label="Avancar story"
                  className="absolute inset-y-0 right-0 z-30 w-[34%]"
                  onClick={nextStory}
                />
              </div>
            </section>
          )}
        </div>
      </main>

      <style>{`
        .story-card {
          position: relative;
          overflow: hidden;
          background: radial-gradient(circle at center, #0b1220 0%, #05080f 70%);
        }

        .journey-shell {
          max-width: 390px;
          width: 100%;
          height: 100vh;
          aspect-ratio: 9 / 19.5;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          border-radius: 28px;
        }

        .journey-title-main {
          font-size: 28px;
          line-height: 34px;
          font-weight: 700;
        }

        .journey-subtitle {
          font-size: 18px;
          line-height: 24px;
        }

        .journey-small {
          font-size: 14px;
          line-height: 20px;
        }

        .journey-timeline-date {
          font-size: 18px;
          line-height: 24px;
          letter-spacing: 0.02em;
        }

        .journey-timeline-label {
          font-size: 16px;
          line-height: 22px;
        }

        .journey-polaroid-caption {
          font-size: 16px;
          line-height: 22px;
          text-align: center;
        }

        .journey-polaroid {
          background: linear-gradient(180deg, #fff9f2 0%, #f1e4d6 100%);
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: 0 18px 38px rgba(0, 0, 0, 0.45);
        }

        .journey-polaroid::before,
        .journey-polaroid::after {
          content: '';
          position: absolute;
          top: -10px;
          width: 52px;
          height: 16px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 6px 14px rgba(0, 0, 0, 0.18);
          transform: rotate(-4deg);
          opacity: 0.9;
          pointer-events: none;
        }

        .journey-polaroid::after {
          right: 16px;
          transform: rotate(4deg);
        }

        .journey-polaroid::before {
          left: 16px;
        }

        .journey-polaroid-photo {
          border: 1px solid rgba(0, 0, 0, 0.12);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
        }

        .story-top-zone {
          position: absolute;
          inset-inline: 0;
          top: 9%;
          z-index: 10;
        }

        .story-bottom-zone {
          position: absolute;
          inset-inline: 0;
          bottom: 8%;
          z-index: 10;
        }

        .animation-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .stars-canvas {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.08; transform: scale(0.72); }
          50% { opacity: 1; transform: scale(1.35); }
        }

        @keyframes deepSky {
          0%, 100% { filter: brightness(0.95); }
          50% { filter: brightness(1.08); }
        }

        @keyframes nodePulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes moonGlow {
          from {
            box-shadow: 0 0 24px rgba(255,255,255,0.2);
          }
          to {
            box-shadow: 0 0 40px rgba(255,255,255,0.25);
          }
        }

        @keyframes moonScale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }

        @keyframes snowGlow {
          from { opacity: 0.7; transform: scale(1); }
          to { opacity: 1; transform: scale(1.05); }
        }

        @keyframes snowSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes floatStar {
          0% { transform: translateY(14px); opacity: 0; }
          18% { opacity: 0.72; }
          78% { opacity: 0.58; }
          100% { transform: translateY(-220px); opacity: 0; }
        }

        @keyframes heartBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes heartHalo {
          0%, 100% { opacity: 0.24; transform: scale(1); }
          50% { opacity: 0.44; transform: scale(1.18); }
        }

        @keyframes shooting {
          0% {
            transform: translate3d(var(--shoot-start-x, 220px), var(--shoot-start-y, -140px), 0) rotate(var(--shoot-rot, -35deg)) scale(0.92);
            opacity: 0;
          }
          8% { opacity: 0.96; }
          72% { opacity: 0.74; }
          100% {
            transform: translate3d(var(--shoot-end-x, -220px), var(--shoot-end-y, 660px), 0) rotate(var(--shoot-rot, -35deg)) scale(1.04);
            opacity: 0;
          }
        }

        .journey-deep-sky {
          background:
            radial-gradient(circle at 20% 12%, rgba(50,76,132,0.25), transparent 42%),
            radial-gradient(circle at 80% 78%, rgba(98,35,84,0.2), transparent 45%),
            radial-gradient(circle at 50% 54%, rgba(16,20,32,0.55), transparent 62%),
            linear-gradient(180deg, #07090f 0%, #04050a 45%, #020204 100%);
          animation: deepSky 8.2s ease-in-out infinite;
          will-change: filter;
        }

        .constellation-core {
          width: 320px;
          height: 320px;
          border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .constellation-svg {
          width: 320px;
          height: 320px;
        }

        .const-star-wrap,
        .const-shooting-wrap,
        .orbit-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .const-star-wrap {
          transform: rotate(var(--angle)) translateY(var(--radius));
        }

        .const-shooting-wrap {
          opacity: 1;
        }

        .journey-const-star,
        .journey-bg-star {
          width: 2.5px;
          height: 2.5px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.92);
          animation: twinkle var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: transform, opacity;
        }

        .shooting-star {
          width: 2px;
          height: 90px;
          background: linear-gradient(to top, rgba(255,255,255,0.95), transparent);
          opacity: 0;
          transform: rotate(var(--shoot-rot, -35deg));
          filter: blur(0.25px);
          animation: shooting var(--shoot-duration, 4.8s) cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
          animation-delay: var(--delay);
          transform-origin: center;
          will-change: transform, opacity;
        }

        .journey-node {
          animation: nodePulse 2.2s ease-in-out infinite;
        }

        .journey-story-quote {
          font-size: 18px;
          line-height: 24px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #fff;
          text-transform: uppercase;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.75);
        }

        .moon-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .moon-stack,
        .snow-stack {
          position: relative;
          width: 250px;
          height: 250px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .snow-halo {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
        }

        .snow-halo-inner {
          inset: 18px;
        }

        .moon {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #ffffff 0%, #e8e8e8 60%, #dcdcdc 100%);
          position: relative;
          box-shadow: 0 0 40px rgba(255,255,255,0.25);
          animation: moonScale 3.2s ease-in-out infinite;
        }

        .journey-moon-disk {
          box-shadow: 0 0 40px rgba(255,255,255,0.25);
        }

        .orbit-wrap {
          transform: rotate(var(--angle)) translateY(var(--radius));
          animation: twinkle var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .journey-snow-dot {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: rgba(240,249,255,0.9);
          box-shadow: 0 0 10px rgba(240,249,255,0.65);
        }

        .journey-snow-halo {
          box-shadow: 0 0 38px rgba(186, 230, 253, 0.24);
          animation: snowGlow 4s ease-in-out infinite alternate;
        }

        .winter-story-card {
          background: radial-gradient(circle at center, #0b1220 0%, #05080f 70%);
        }

        .winter-particle {
          width: 3px;
          height: 3px;
          border-radius: 9999px;
          background: rgba(230, 247, 255, 0.5);
          opacity: 0.32;
          animation: twinkle var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .winter-halo {
          position: relative;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(20,25,40,0.9) 40%, rgba(0,0,0,0.95) 100%);
          box-shadow:
            0 0 60px rgba(0,0,0,0.9),
            inset 0 0 40px rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .journey-snow-halo-soft {
          background: radial-gradient(circle, rgba(186,230,253,0.2) 0%, rgba(186,230,253,0.06) 46%, rgba(186,230,253,0) 70%);
          animation: snowGlow 4s ease-in-out infinite alternate;
          animation-delay: 0.35s;
        }

        .snowflake-img {
          width: 170px;
          height: 170px;
          object-fit: contain;
          filter: drop-shadow(0 0 25px rgba(255,255,255,0.6));
          animation: snowPulse 3s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .winter-title {
          color: #d8f6ff;
          text-shadow:
            0 0 10px rgba(180,240,255,0.8),
            0 0 25px rgba(120,200,255,0.6);
        }

        @keyframes snowPulse {
          0% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); opacity: 0.9; }
        }

        .journey-floating-star {
          color: rgba(255, 255, 255, 0.68);
          font-size: 16px;
          animation: floatStar var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          will-change: transform, opacity;
        }

        .floating-center {
          position: relative;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .journey-heart-halo {
          animation: heartHalo 3.2s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .journey-heart-bob {
          animation: heartBob 2.8s ease-in-out infinite;
          will-change: transform;
        }

        @keyframes loveHeartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }

        .journey-love-heart {
          width: 100px;
          height: 100px;
          color: #ffffff;
          font-size: 92px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-shadow: 0 0 22px rgba(255, 170, 210, 0.6);
          animation: loveHeartPulse 2.2s ease-in-out infinite;
          transition: transform 220ms ease-in-out;
          cursor: pointer;
          background: transparent;
          border: 0;
          padding: 0;
        }

        .journey-love-heart:active {
          transform: scale(1.2);
        }

        .journey-love-flash {
          position: absolute;
          width: 56px;
          height: 56px;
          border-radius: 9999px;
          background: radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(255,208,228,0.5) 48%, rgba(255,208,228,0) 100%);
          animation: loveFlash 240ms ease-out forwards;
        }

        .journey-love-particle {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: rgba(255, 213, 234, 0.96);
          box-shadow: 0 0 14px rgba(255, 213, 234, 0.88);
          animation: loveParticleBurst 1.2s ease-out forwards;
        }

        .journey-love-word {
          position: absolute;
          transform: translate(-50%, -50%);
          font-size: 18px;
          font-weight: 600;
          color: rgba(255, 245, 250, 0.95);
          text-shadow: 0 0 10px rgba(255,180,220,0.55);
          white-space: nowrap;
          animation-name: loveWordSpread;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .journey-final-star {
          width: 2px;
          height: 2px;
          border-radius: 9999px;
          background: rgba(255,255,255,0.7);
          animation: twinkle var(--duration) ease-in-out infinite;
          animation-delay: var(--delay);
          opacity: 0.28;
        }

        @keyframes loveFlash {
          0% { transform: scale(0.15); opacity: 0.9; }
          35% { transform: scale(1.6); opacity: 0.7; }
          100% { transform: scale(2.6); opacity: 0; }
        }

        @keyframes loveParticleBurst {
          0% { transform: translate(0, 0) scale(0.6); opacity: 1; }
          45% { opacity: 0.9; }
          100% { transform: translate(var(--x), var(--y)) scale(1.25); opacity: 0; }
        }

        @keyframes loveWordSpread {
          0% { opacity: 0; transform: translate(-50%, -50%) translate(0, 0) rotate(0deg) scale(0.9); }
          18% { opacity: 1; transform: translate(-50%, -50%) translate(calc(var(--x) * 0.65), calc(var(--y) * 0.65)) rotate(var(--r)) scale(1); }
          60% { opacity: 0.96; transform: translate(-50%, -50%) translate(var(--x), var(--y)) rotate(var(--r)) scale(1.04); }
          100% { opacity: 0.7; transform: translate(-50%, -50%) translate(calc(var(--x) + 12px), calc(var(--y) - 12px)) rotate(var(--r)) scale(1.08); }
        }

        @media (max-width: 768px) {
          .moon {
            width: 140px;
            height: 140px;
          }

          .snowflake-img {
            width: 150px;
            height: 150px;
          }

          .journey-title-main {
            font-size: 24px;
            line-height: 30px;
          }

          .journey-subtitle {
            font-size: 17px;
            line-height: 22px;
          }
        }
      `}</style>
    </>
  )
}
