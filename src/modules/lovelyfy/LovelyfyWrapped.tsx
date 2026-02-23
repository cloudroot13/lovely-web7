import { AnimatePresence, motion } from 'framer-motion'
import { memo } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { LovelyfyCinematicIntro } from './LovelyfyCinematicIntro'
import { spotifyAssets as lovelyfyAssets } from '../../assets/themes/themeAssets'
import type { LoveData } from '../../types/types'

interface LovelyfyWrappedProps {
  loveData: LoveData
}

type StoryType =
  | 'player'
  | 'moments_intro'
  | 'highlight'
  | 'song'
  | 'start'
  | 'stats'
  | 'memory_even'
  | 'memory_odd'
  | 'favorite'
  | 'love'
  | 'final'

interface StoryItem {
  id: string
  type: StoryType
  title: string
  subtitle: string
  phrase?: string
  image?: string
}

interface StoryMotion {
  initial: Record<string, string | number>
  animate: Record<string, string | number>
  exit: Record<string, string | number>
  transition: { duration: number; ease: [number, number, number, number] }
}

function getStoryMotion(): StoryMotion {
  return {
    initial: { opacity: 0, y: 40, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -30, scale: 0.98 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }
}

function getTextAlignmentClass(step: number) {
  if (step % 3 === 0) {
    return 'items-start text-left'
  }
  if (step % 3 === 1) {
    return 'items-center text-center'
  }
  return 'items-end text-right'
}

const StoryBlurBackground = memo(function StoryBlurBackground({ image }: { image?: string }) {
  if (!image) {
    return null
  }

  return (
    <>
      <img
        src={image}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-xs"
        style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/78 via-black/42 to-black/34" />
      <div className="absolute inset-0 bg-black/18 backdrop-blur-xs" />
    </>
  )
})

const fallbackMomentPhrases = [
  'Aqui tudo começou.',
  'Esse dia ficou marcado.',
  'Eu escolheria você mil vezes.',
  'Nossa melhor versão.',
  'Foi aqui que tudo fez sentido.',
]

function extractTrackId(url: string) {
  try {
    const parsed = new URL(url)
    const match = parsed.pathname.match(/track\/([a-zA-Z0-9]+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}

function formatDate(dateString: string) {
  if (!dateString) {
    return 'uma data inesquecível'
  }

  const parsed = new Date(dateString)
  if (Number.isNaN(parsed.getTime())) {
    return dateString
  }

  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function getSlideDuration(story: StoryItem) {
  if (story.type === 'final') {
    return 14000
  }

  if (story.image && story.type !== 'player') {
    return 12000
  }

  return 10000
}

function useAnimatedCounter(target: number, enabled: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!enabled) {
      return
    }

    let raf = 0
    const start = performance.now()
    const duration = 1400

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      setValue(Math.round(target * progress))
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled, target])

  return value
}

function splitDuration(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds)
  const years = Math.floor(safe / (365 * 24 * 60 * 60))
  const afterYears = safe % (365 * 24 * 60 * 60)
  const months = Math.floor(afterYears / (30 * 24 * 60 * 60))
  const afterMonths = afterYears % (30 * 24 * 60 * 60)
  const days = Math.floor(afterMonths / (24 * 60 * 60))
  const afterDays = afterMonths % (24 * 60 * 60)
  const hours = Math.floor(afterDays / (60 * 60))
  const afterHours = afterDays % (60 * 60)
  const minutes = Math.floor(afterHours / 60)
  const seconds = afterHours % 60

  return { years, months, days, hours, minutes, seconds }
}

function getSinceLabel(startDate: string) {
  if (!startDate) {
    return 'Juntos desde o início da história'
  }

  const parsed = new Date(startDate)
  if (Number.isNaN(parsed.getTime())) {
    return `Juntos desde ${startDate}`
  }

  return `Juntos desde ${parsed.getFullYear()}`
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen w-full bg-linear-to-b from-black via-black to-green-950/30 px-6 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full text-center space-y-8"
        >
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Leonardo separou um <span className="text-green-500">presente</span> especial!
            </h1>

            <p className="text-base leading-relaxed text-white/70">
              Um momento único feito com carinho para celebrar a jornada de vocês.
            </p>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="mt-4 rounded-full bg-green-500 px-10 py-4 font-semibold text-black shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-300 hover:scale-105 hover:bg-green-400"
          >
            Ver Presente
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export function LovelyfyWrapped({ loveData }: LovelyfyWrappedProps) {
  const [showIntro, setShowIntro] = useState(true)
  const [started, setStarted] = useState(false)
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [paused, setPaused] = useState(false)
  const [typedLoveText, setTypedLoveText] = useState('')
  const [loveTypingDone, setLoveTypingDone] = useState(false)
  const [runtimeSeconds, setRuntimeSeconds] = useState(0)
  const [showTapHint, setShowTapHint] = useState(false)
  const [currentMediaReady, setCurrentMediaReady] = useState(true)
  const navLockUntilRef = useRef(0)
  const hasShownTapHintRef = useRef(false)

  const trackId = useMemo(() => extractTrackId(loveData.musicaSpotifyUrl), [loveData.musicaSpotifyUrl])
  const embedUrl = trackId ? `https://open.spotify.com/embed/track/${trackId}` : null

  const highlightMoments = useMemo(
    () =>
      loveData.momentHighlights
        .filter((item) => item && item.imageDataUrl)
        .map((item, index) => ({
          text: item.text?.trim() || fallbackMomentPhrases[index % fallbackMomentPhrases.length],
          imageDataUrl: item.imageDataUrl.trim(),
        })),
    [loveData.momentHighlights],
  )

  const extraMoments = useMemo(
    () =>
      loveData.storiesImagesDataUrls
        .map((item, index) => ({
          text: fallbackMomentPhrases[index % fallbackMomentPhrases.length],
          imageDataUrl: item.trim(),
        }))
        .filter((item) => item.imageDataUrl)
        .slice(0, Math.max(1, loveData.totalPhotos)),
    [loveData.storiesImagesDataUrls, loveData.totalPhotos],
  )

  const photoPool = useMemo(() => {
    const extras = extraMoments.map((item) => item.imageDataUrl)
    const uniqueExtras = Array.from(new Set(extras))

    if (uniqueExtras.length >= loveData.totalPhotos) {
      return uniqueExtras.slice(0, loveData.totalPhotos)
    }

    const fallback = [loveData.fotoCasalDataUrl, lovelyfyAssets.bg, lovelyfyAssets.bg]
      .map((item) => item.trim())
      .filter(Boolean)

    return Array.from(new Set([...uniqueExtras, ...fallback])).slice(0, Math.max(1, loveData.totalPhotos))
  }, [extraMoments, loveData.fotoCasalDataUrl, loveData.totalPhotos])

  const stories = useMemo<StoryItem[]>(() => {
    const baseImage = loveData.fotoCasalDataUrl || photoPool[0] || lovelyfyAssets.bg
    const whenStarted = formatDate(loveData.startDate)

    const memorySlides = photoPool.map((image, index) => ({
      id: `memory-${index + 1}`,
      type: index % 2 === 0 ? ('memory_even' as const) : ('memory_odd' as const),
      title: 'Momentos que marcaram nossa história',
      subtitle: `Memória ${index + 1} de ${photoPool.length}`,
      phrase: extraMoments[index]?.text || fallbackMomentPhrases[index % fallbackMomentPhrases.length],
      image,
    }))

    const primaryMoment = highlightMoments[0]
    const activityMoment = highlightMoments[1]

    return [
      {
        id: 'player',
        type: 'player',
        title: 'Sua retrospectiva começa agora',
        subtitle: 'Dê play no Lovelyfy e inicie sua experiência.',
        phrase: 'Seu player oficial já está pronto abaixo.',
        image: baseImage,
      },
      {
        id: 'moments-intro',
        type: 'moments_intro',
        title: 'Os momentos que marcaram nossa relação',
        subtitle: 'Preparado para reviver tudo?',
        phrase: 'Sua história começa agora.',
      },
      {
        id: 'highlight',
        type: 'highlight',
        title: 'A pessoa que mais marcou meu ano foi...',
        subtitle: loveData.nomePessoa || 'Seu amor',
        phrase: 'E eu escolheria você de novo.',
        image: baseImage,
      },
      {
        id: 'song',
        type: 'song',
        title: 'Música da relação',
        subtitle: loveData.musicaNome?.trim() || 'Música especial de vocês',
        phrase: embedUrl
          ? 'Essa é a faixa que traduz a energia de vocês.'
          : 'Adicione uma música no Builder para completar essa parte.',
        image: baseImage,
      },
      {
        id: 'start',
        type: 'start',
        title: `Tudo começou em ${whenStarted}`,
        subtitle: 'Quando tudo começou',
        phrase: 'E desde então, cada detalhe fez sentido.',
        image: activityMoment?.imageDataUrl || photoPool[1] || baseImage,
      },
      {
        id: 'stats',
        type: 'stats',
        title: 'Estatísticas reais',
        subtitle: 'Números que contam essa jornada',
        phrase: 'Respira... esse foi um ano gigante para vocês.',
      },
      ...memorySlides,
      {
        id: 'favorite',
        type: 'favorite',
        title: 'Nosso momento mais especial',
        subtitle: primaryMoment?.text || loveData.momentoEspecial || 'Cada segundo juntos',
        phrase: 'Um quadro que merece replay infinito.',
        image: primaryMoment?.imageDataUrl || photoPool[2] || baseImage,
      },
      {
        id: 'love',
        type: 'love',
        title: 'O que mais me encanta em você',
        subtitle: `Traços que amo em ${loveData.apelido || loveData.nomePessoa || 'você'}`,
        phrase: loveData.oQueMaisAmo || 'Seu jeito de fazer o mundo ficar mais leve.',
        image: photoPool[3] || baseImage,
      },
      {
        id: 'final',
        type: 'final',
        title: 'Momento Especial',
        subtitle: `${loveData.nomePessoa || 'Nosso amor'}${loveData.apelido ? ` & ${loveData.apelido}` : ''}`,
        phrase: 'O nosso amor começou e segue crescendo todos os dias.',
        image: photoPool[4] || baseImage,
      },
    ]
  }, [embedUrl, extraMoments, highlightMoments, loveData, photoPool])

  const current = stories[step]
  const currentDuration = getSlideDuration(current)

  const relationDays = useMemo(
    () => Math.max(1, loveData.anos * 365 + loveData.meses * 30 + loveData.dias),
    [loveData.anos, loveData.dias, loveData.meses],
  )
  const relationshipBaseSeconds = useMemo(
    () => Math.max(1, relationDays) * 24 * 60 * 60,
    [relationDays],
  )
  const relationshipClock = useMemo(
    () => splitDuration(relationshipBaseSeconds + runtimeSeconds),
    [relationshipBaseSeconds, runtimeSeconds],
  )
  const sinceLabel = useMemo(() => getSinceLabel(loveData.startDate), [loveData.startDate])

  const weeksTogether = Math.max(1, Math.round(relationDays / 7))
  const meetupsValue = Math.max(1, weeksTogether * Math.max(1, loveData.weeklyMeetups || 1))
  const momentsValue = Math.max(1, loveData.momentHighlights.length + loveData.storiesImagesDataUrls.length || loveData.memoriesCreated)
  const daysValue = relationDays

  const meetups = useAnimatedCounter(meetupsValue, current.type === 'stats')
  const moments = useAnimatedCounter(momentsValue, current.type === 'stats')
  const days = useAnimatedCounter(daysValue, current.type === 'stats')
  const coupleName = useMemo(() => {
    const first = loveData.nomePessoa?.trim()
    const second = loveData.apelido?.trim()

    if (first && second) {
      return `${first} & ${second}`
    }

    return first || second || 'Nosso Amor'
  }, [loveData.apelido, loveData.nomePessoa])
  const storyMotion = useMemo(() => getStoryMotion(), [])
  const chapterAlignClass = useMemo(() => getTextAlignmentClass(step), [step])
  const lockNavigation = useCallback((ms = 280) => {
    navLockUntilRef.current = performance.now() + ms
  }, [])
  const isNavigationLocked = useCallback(() => performance.now() < navLockUntilRef.current, [])

  useEffect(() => {
    if (current.type !== 'love') {
      setTypedLoveText('')
      setLoveTypingDone(false)
      return
    }

    let index = 0
    const text = current.phrase || ''
    setTypedLoveText('')
    setLoveTypingDone(text.length === 0)
    const perCharDelay = Math.min(170, Math.max(55, Math.floor(3000 / Math.max(1, text.length))))

    const interval = window.setInterval(() => {
      index += 1
      setTypedLoveText(text.slice(0, index))
      if (index >= text.length) {
        window.clearInterval(interval)
        setLoveTypingDone(true)
      }
    }, perCharDelay)

    return () => {
      window.clearInterval(interval)
    }
  }, [current.id, current.phrase, current.type])

  useEffect(() => {
    if (
      !started ||
      paused ||
      !currentMediaReady ||
      current.type === 'player' ||
      (current.type === 'love' && !loveTypingDone)
    ) {
      return
    }

    const interval = window.setInterval(() => {
      setProgress((prev) => {
        const next = prev + 100 / currentDuration
        if (next >= 1) {
          if (!isNavigationLocked()) {
            lockNavigation()
            setStep((curr) => (curr < stories.length - 1 ? curr + 1 : curr))
          }
          return 0
        }
        return next
      })
    }, 100)

    return () => window.clearInterval(interval)
  }, [current.type, currentDuration, currentMediaReady, isNavigationLocked, lockNavigation, loveTypingDone, paused, started, stories.length])

  useEffect(() => {
    if (!current.image || current.type === 'player' || current.type === 'moments_intro') {
      setCurrentMediaReady(true)
      return
    }

    setCurrentMediaReady(false)
    const img = new Image()

    const markReady = () => setCurrentMediaReady(true)
    img.addEventListener('load', markReady)
    img.addEventListener('error', markReady)
    img.src = current.image

    if (img.complete) {
      setCurrentMediaReady(true)
    }

    return () => {
      img.removeEventListener('load', markReady)
      img.removeEventListener('error', markReady)
    }
  }, [current.id, current.image, current.type])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRuntimeSeconds((prev) => prev + 1)
    }, 1000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    const preloadList = [loveData.fotoCasalDataUrl, ...photoPool].filter(Boolean)
    preloadList.forEach((url) => {
      const img = new Image()
      img.src = url
    })
  }, [loveData.fotoCasalDataUrl, photoPool])

  const next = useCallback(() => {
    if (isNavigationLocked()) {
      return
    }
    lockNavigation()
    setStep((s) => Math.min(stories.length - 1, s + 1))
    setProgress(0)
  }, [isNavigationLocked, lockNavigation, stories.length])

  const prev = useCallback(() => {
    if (isNavigationLocked()) {
      return
    }
    lockNavigation()
    setStep((s) => Math.max(0, s - 1))
    setProgress(0)
  }, [isNavigationLocked, lockNavigation])

  const finishCinematicIntro = useCallback(() => {
    if (isNavigationLocked()) {
      return
    }

    lockNavigation()
    setStep((s) => Math.min(stories.length - 1, s + 1))
    setProgress(0)
  }, [isNavigationLocked, lockNavigation, stories.length])

  const handleHoldStart = useCallback((event: ReactPointerEvent<HTMLElement>) => {
    const target = event.target as HTMLElement
    if (!target.closest('button,iframe,a,input')) {
      setPaused(true)
    }
  }, [])

  const handleHoldEnd = useCallback(() => setPaused(false), [])

  useEffect(() => {
    if (!started || step === 0 || hasShownTapHintRef.current) {
      return
    }

    hasShownTapHintRef.current = true
    setShowTapHint(true)
    const timeout = window.setTimeout(() => setShowTapHint(false), 5000)
    return () => window.clearTimeout(timeout)
  }, [started, step])

  if (showIntro) {
    return <IntroScreen onStart={() => setShowIntro(false)} />
  }

  return (
    <section className="fixed inset-0 overflow-hidden bg-black text-white">
      <motion.div
        className="absolute inset-0 -z-40 bg-[radial-gradient(circle_at_30%_20%,#1DB954_0%,#121212_40%,#000000_100%)]"
        animate={{ y: [0, -8, 0], x: [0, 4, 0], opacity: [0.88, 1, 0.88] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      />
      <motion.div
        className="absolute inset-0 -z-30 bg-[radial-gradient(circle_at_65%_70%,rgba(29,185,84,0.28),transparent_46%)]"
        animate={{ y: [0, -6, 0], opacity: [0.28, 0.5, 0.28] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(0,0,0,0.58),transparent_16%,transparent_84%,rgba(0,0,0,0.58)),linear-gradient(180deg,rgba(0,0,0,0.58),transparent_16%,transparent_84%,rgba(0,0,0,0.75))]" />

      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            style={{ left: `${(i * 11) % 100}%`, top: `${(i * 17) % 100}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.55, 0.2] }}
            transition={{ duration: 3.5 + (i % 4), repeat: Infinity, delay: i * 0.14 }}
          />
        ))}
      </div>

      <div className="mx-auto flex h-full items-center justify-center px-4 py-8">
        <div
          className="story-shell relative w-full max-w-107.5 overflow-hidden rounded-4xl border border-zinc-700/70 bg-[linear-gradient(180deg,#181818_0%,#000_100%)] shadow-[0_0_40px_rgba(29,185,84,0.25),0_30px_80px_rgba(0,0,0,0.65)]"
          onPointerDown={handleHoldStart}
          onPointerUp={handleHoldEnd}
          onPointerLeave={handleHoldEnd}
        >
          <div className="absolute left-3 right-3 top-3 z-30 flex gap-1.5">
            {stories.map((story, index) => {
              const done = index < step
              const active = index === step
              const scale = done ? 1 : active ? Math.max(0.06, progress) : 0

              return (
                <div key={story.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-700/90">
                  <motion.div
                    className="h-full origin-left rounded-full bg-[#1DB954] will-change-transform"
                    animate={{ scaleX: scale, x: 0, y: 0 }}
                    transition={{ duration: 0.12 }}
                    style={{ transform: 'translate3d(0,0,0)' }}
                  />
                </div>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={storyMotion.initial}
              animate={storyMotion.animate}
              exit={storyMotion.exit}
              transition={storyMotion.transition}
              className="h-full w-full"
              style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
            >
              {current.type === 'player' && (
                <div className="story-safe relative flex min-h-full flex-col px-6 pb-10 pt-14">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_15%,rgba(29,185,84,0.24),transparent_45%)]" />
                  <div className="relative z-10 h-full min-h-full box-border">
                    <p className="text-center text-sm font-medium text-zinc-200">
                      Para o meu grande amor {loveData.nomeCriador ? `• de ${loveData.nomeCriador}` : ''}
                    </p>

                    <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 shadow-2xl">
                      <img src={current.image} alt="Capa do casal" className="h-72 w-full object-cover" />
                    </div>

                    <div className="mt-4">
                      <p className="text-3xl font-black leading-tight text-white">{loveData.musicaNome?.trim() || 'Nossa música especial'}</p>
                      <p className="mt-1 text-sm text-zinc-300">{loveData.nomePessoa || 'Meu amor'}</p>
                    </div>

                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        width="100%"
                        height="152"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        style={{ borderRadius: '16px', marginTop: '20px' }}
                      />
                    ) : (
                      <div className="mt-5 rounded-2xl border border-zinc-700 bg-zinc-900 p-4 text-sm text-zinc-400">
                        Link Lovelyfy inválido. Volte ao Builder e cole uma URL válida.
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (isNavigationLocked()) {
                          return
                        }
                        lockNavigation()
                        setStarted(true)
                        setStep(1)
                        setProgress(0)
                      }}
                      className="mt-6 w-full rounded-full bg-[#1DB954] py-3 text-sm font-semibold uppercase tracking-[0.14em] text-black"
                    >
                      Iniciar experiência
                    </button>
                  </div>
                </div>
              )}

              {current.type === 'moments_intro' && (
                <div className="story-safe relative flex min-h-full flex-col px-6 pb-10 pt-14">
                  <LovelyfyCinematicIntro
                    coupleName={coupleName}
                    subtitle="Os momentos que marcaram nossa relação"
                    onDone={finishCinematicIntro}
                    autoClose={false}
                  />
                </div>
              )}

              {current.type === 'highlight' && (
                <div className="story-safe relative flex min-h-full flex-col px-6 pb-10 pt-14">
                  <StoryBlurBackground image={current.image} />
                  <motion.div whileHover={{ scale: 1.02 }} className="relative z-10 h-[62%] overflow-hidden rounded-[22px] border border-white/10 shadow-2xl">
                    <motion.img
                      src={current.image}
                      alt="Destaque"
                      className="h-full w-full object-cover"
                      style={{ willChange: 'transform, opacity', transform: 'translate3d(0,0,0) scale(1.03)' }}
                      animate={{ scale: [1, 1.02, 1], rotate: [0, 0.3, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/68 via-black/28 to-transparent" />
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                    className={`story-content mt-6 ${chapterAlignClass}`}
                  >
                    <p className="story-label">Pessoa do Ano</p>
                    <h2 className="story-title">{current.title}</h2>
                    <p className="text-2xl font-semibold text-white">{current.subtitle}</p>
                    <p className="story-description">{current.phrase}</p>
                  </motion.div>
                </div>
              )}

              {current.type === 'song' && (
                <div className="story-safe relative flex min-h-full flex-col justify-center px-7">
                  <StoryBlurBackground image={current.image} />
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                    className={`story-content relative z-10 ${chapterAlignClass}`}
                  >
                    <p className="story-label">Música da Relação</p>
                    <h2 className="story-title">{current.subtitle}</h2>
                    <p className="story-description">{current.phrase}</p>
                  </motion.div>
                </div>
              )}

              {current.type === 'start' && (
                <div className="story-safe relative min-h-full w-full overflow-hidden">
                  <StoryBlurBackground image={current.image} />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent" />
                  <div className="absolute inset-x-4 bottom-30 top-20 z-10 overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                    <img src={current.image} alt="Casal" className="h-full w-full object-cover" />
                  </div>
                  <div className="absolute left-4 top-14 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs uppercase tracking-[0.14em] text-zinc-100 backdrop-blur-sm">
                    Sobre o casal
                  </div>

                  <div className="absolute inset-x-3 bottom-4 z-20 rounded-3xl border border-zinc-700 bg-linear-to-b from-[#1d1d1d]/96 to-[#131313]/96 px-4 pb-4 pt-3 shadow-[0_20px_45px_rgba(0,0,0,0.55)] backdrop-blur-sm">
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#1DB954]/60 to-transparent" />
                    <h3 className="text-[2rem] leading-tight font-black text-white">{loveData.nomePessoa || 'Nosso amor'}</h3>
                    <p className="text-base font-semibold text-zinc-300">{loveData.apelido || 'Uma história especial'}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.12em] text-zinc-400">{sinceLabel}</p>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-zinc-700 bg-[#101010] px-2 py-3 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        <p className="text-3xl font-black">{relationshipClock.years}</p>
                        <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-400">Anos</p>
                      </div>
                      <div className="rounded-xl border border-zinc-700 bg-[#101010] px-2 py-3 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        <p className="text-3xl font-black">{relationshipClock.months}</p>
                        <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-400">Meses</p>
                      </div>
                      <div className="rounded-xl border border-zinc-700 bg-[#101010] px-2 py-3 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        <p className="text-3xl font-black">{relationshipClock.days}</p>
                        <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-400">Dias</p>
                      </div>
                      <div className="rounded-xl border border-zinc-700 bg-[#101010] px-2 py-3 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        <p className="text-3xl font-black">{relationshipClock.hours}</p>
                        <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-400">Horas</p>
                      </div>
                      <div className="rounded-xl border border-zinc-700 bg-[#101010] px-2 py-3 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        <p className="text-3xl font-black">{relationshipClock.minutes}</p>
                        <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-400">Minutos</p>
                      </div>
                      <div className="rounded-xl border border-zinc-700 bg-[#101010] px-2 py-3 text-center shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
                        <p className="text-3xl font-black">{relationshipClock.seconds}</p>
                        <p className="text-[11px] uppercase tracking-[0.08em] text-zinc-400">Segundos</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {current.type === 'stats' && (
                <div className="story-safe relative flex min-h-full flex-col items-center justify-center px-7 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(29,185,84,0.3),transparent_42%),radial-gradient(circle_at_80%_80%,rgba(29,185,84,0.2),transparent_45%),#050505]" />
                  <motion.div
                    className="relative z-10"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                    style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-[#1DB954]">Estatísticas Reais</p>
                    <p className="mt-5 text-[64px] font-black leading-none text-[#1DB954]">{meetups.toLocaleString('pt-BR')}</p>
                    <p className="text-zinc-200">encontros estimados ao longo da relação</p>
                    <p className="mt-6 text-[60px] font-black leading-none text-[#1DB954]">{moments}</p>
                    <p className="text-zinc-200">fotos especiais na retrospectiva</p>
                    <p className="mt-6 text-[60px] font-black leading-none text-[#1DB954]">{days}</p>
                    <p className="text-zinc-200">dias de história compartilhada</p>
                  </motion.div>
                </div>
              )}

              {(current.type === 'memory_even' || current.type === 'memory_odd') && (
                <div className="story-safe relative min-h-full w-full">
                  <StoryBlurBackground image={current.image} />
                  <motion.img
                    src={current.image}
                    alt={current.subtitle}
                    className="relative z-10 mx-4 mt-14 h-[78%] w-[calc(100%-2rem)] rounded-3xl border border-white/10 object-cover shadow-2xl"
                    animate={
                      current.type === 'memory_even'
                        ? { x: [8, 0, -8, 0], scale: [1.02, 1.06, 1.02] }
                        : { x: [-8, 0, 8, 0], scale: [1.02, 1.06, 1.02] }
                    }
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
                  />
                  <div className={`absolute inset-0 ${current.type === 'memory_even' ? 'bg-linear-to-t from-black/80 via-black/35 to-transparent' : 'bg-linear-to-br from-black/65 via-black/35 to-black/10'}`} />
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.55, delay: 0.15 }}
                    className={`story-content absolute ${current.type === 'memory_even' ? 'bottom-8 left-6 right-auto items-start text-left' : 'bottom-10 right-6 left-auto items-end text-right'} z-20 max-w-[75%]`}
                  >
                    <p className="story-label">Retrospectiva</p>
                    <h3 className="story-title">{current.title}</h3>
                    <p className="story-description">{current.phrase}</p>
                  </motion.div>
                </div>
              )}

              {current.type === 'favorite' && (
                <div className="story-safe relative min-h-full w-full">
                  <StoryBlurBackground image={current.image} />
                  <img src={current.image} alt="Momento favorito" className="relative z-10 mx-4 mt-14 h-[78%] w-[calc(100%-2rem)] rounded-3xl border border-white/10 object-cover shadow-2xl" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/45 to-black/20" />
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.55, delay: 0.2 }}
                    className={`story-content absolute inset-0 z-20 flex justify-center px-8 ${chapterAlignClass}`}
                  >
                    <p className="story-label">Momento Favorito</p>
                    <h2 className="story-title">{current.title}</h2>
                    <p className="story-description">{current.subtitle}</p>
                  </motion.div>
                </div>
              )}

              {current.type === 'love' && (
                <div className="story-safe relative flex min-h-full flex-col items-center justify-center px-7 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_30%,rgba(29,185,84,0.2),transparent_42%),#060606]" />
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#1DB954]">O que mais amo em você</p>
                    <p className="mt-5 min-h-28 text-3xl font-black leading-tight text-white">{typedLoveText}</p>
                    <span className="text-xl text-[#1DB954]">|</span>
                  </div>
                </div>
              )}

              {current.type === 'final' && (
                <motion.div
                  className="relative h-full w-full"
                  animate={{ opacity: [1, 0.92, 0.84] }}
                  transition={{ duration: 2.2 }}
                >
                  <StoryBlurBackground image={current.image} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(29,185,84,0.22),transparent_38%),#080808]" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/15" />
                  <div className="relative z-10 mx-auto flex h-full w-full max-w-90 flex-col px-5 pb-8 pt-12">
                    <div className="mx-auto rounded-full bg-zinc-100 px-5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-black">
                      Wrapped do casal
                    </div>

                    <div className="mt-5 mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-white/30">
                      <img src={current.image} alt="Casal" className="h-full w-full object-cover" />
                    </div>

                    <h2 className="mt-5 text-center text-4xl font-black">{current.title}</h2>
                    <p className="mt-1 text-center text-sm font-semibold text-zinc-200">{current.subtitle}</p>

                    <div className="mt-5 rounded-xl border border-zinc-700 bg-zinc-900/80 p-3">
                      <p className="text-center text-sm text-zinc-300">{current.phrase}</p>
                    </div>

                    <div className="mt-3 rounded-xl border border-zinc-700 bg-zinc-900/80 p-3">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Data especial</p>
                      <p className="mt-1 text-lg font-bold text-white">{loveData.dataImportante || formatDate(loveData.startDate)}</p>
                    </div>

                    <div className="mt-4">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-400">Total de dias juntos</p>
                      <p className="mt-1 text-6xl font-black leading-none text-white">
                        {relationDays}
                        <span className="ml-2 text-base font-medium text-zinc-300">dias</span>
                      </p>
                    </div>

                    <div className="mt-auto flex items-end justify-between text-[10px] text-zinc-500">
                      <span>lovely</span>
                      <span>Wrapped 2026</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {step > 0 && (
            <div className="absolute inset-0 z-50 pointer-events-none">
              <button
                type="button"
                aria-label="Story anterior"
                onClick={prev}
                className="pointer-events-auto absolute inset-y-0 left-0 w-[34%]"
              />
              <button
                type="button"
                aria-label="Próximo story"
                onClick={next}
                className="pointer-events-auto absolute inset-y-0 right-0 w-[34%]"
              />
            </div>
          )}

          {showTapHint && (
            <div className="pointer-events-none absolute inset-x-0 bottom-6 z-40 flex justify-center px-4">
              <div className="px-3 py-1 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-[#d9ffe7]/90">
                Clique aqui para avançar e continuar
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
