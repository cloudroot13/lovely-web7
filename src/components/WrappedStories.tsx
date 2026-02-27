import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { wrappedStoriesThemes } from '../assets/themes/themeAssets'
import { WRAPPED_STORY_DURATION_MS } from '../constants/wrappedTiming'
import type { LoveData } from '../types/types'

interface WrappedStoriesProps {
  loveData: LoveData
  theme: string
}

type StoryKind = 'intro-player' | 'highlight' | 'connection' | 'memory' | 'stats' | 'final'
type StoryAnimation = 'cinematic' | 'blurScale' | 'glowFade' | 'slide' | 'zoom' | 'fadeUp' | 'slowReveal'

interface StoryItem {
  id: string
  kind: StoryKind
  title: string
  subtitle?: string
  body?: string
  image?: string
  animation: StoryAnimation
}

const animationVariants: Record<StoryAnimation, { opacity: number[]; scale?: number[]; x?: number[]; y?: number[]; filter?: string[] }> = {
  cinematic: {
    opacity: [0, 1],
    scale: [0.8, 1],
    filter: ['blur(20px)', 'blur(0px)'],
  },
  blurScale: {
    opacity: [0, 1],
    scale: [0.85, 1],
    filter: ['blur(14px)', 'blur(0px)'],
  },
  glowFade: {
    opacity: [0, 1],
    y: [28, 0],
    filter: ['blur(8px)', 'blur(0px)'],
  },
  slide: {
    opacity: [0, 1],
    x: [90, 0],
  },
  zoom: {
    opacity: [0, 1],
    scale: [0.88, 1],
  },
  fadeUp: {
    opacity: [0, 1],
    y: [40, 0],
  },
  slowReveal: {
    opacity: [0, 1],
    scale: [0.94, 1],
    y: [20, 0],
  },
}

function useAnimatedCount(target: number, enabled: boolean) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!enabled) {
      return
    }

    let frameId = 0
    const start = performance.now()
    const duration = 1250

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      setValue(Math.round(target * progress))
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frameId)
  }, [enabled, target])

  return value
}

const emotionalPhrases = [
  'Esse dia mudou tudo.',
  'Aqui eu sabia que era você.',
  'Se eu pudesse repetir, repetiria.',
  'Foi aqui que tudo fez sentido.',
]

export function WrappedStories({ loveData, theme }: WrappedStoriesProps) {
  const [started, setStarted] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)

  const selectedTheme = wrappedStoriesThemes[theme as keyof typeof wrappedStoriesThemes] ?? wrappedStoriesThemes['Pink Gradient']

  const allImages = [loveData.fotoCasalDataUrl, ...loveData.storiesImagesDataUrls].map((item) => item.trim()).filter(Boolean)
  const fallbackPool = Object.values(wrappedStoriesThemes).flatMap((item) => [item.bg, item.accent])
  const uniqueImages = Array.from(new Set([...allImages, ...fallbackPool]))

  const stories = useMemo<StoryItem[]>(() => {
    const introPlayer: StoryItem = {
      id: 'intro-player',
      kind: 'intro-player',
      title: 'Sua retrospectiva começa agora...',
      subtitle: 'Aperte iniciar e viva sua experiência Lovelyflix Wrapped.',
      animation: 'cinematic',
      image: uniqueImages[0] || selectedTheme.bg,
    }

    const highlight: StoryItem = {
      id: 'highlight',
      kind: 'highlight',
      title: 'A pessoa que mais marcou meu ano foi...',
      subtitle: loveData.nomePessoa || 'Seu amor',
      body: 'E eu escolheria você de novo.',
      image: uniqueImages[0] || selectedTheme.bg,
      animation: 'blurScale',
    }

    const connection: StoryItem = {
      id: 'connection',
      kind: 'connection',
      title: 'Nossa conexão foi diferente.',
      subtitle: 'E isso ficou claro em cada momento.',
      image: uniqueImages[1] || selectedTheme.accent,
      animation: 'glowFade',
    }

    const memoryAnimations: StoryAnimation[] = ['slide', 'zoom', 'fadeUp']
    const memories: StoryItem[] = uniqueImages.slice(2, 7).map((image, index) => ({
      id: `memory-${index + 1}`,
      kind: 'memory',
      title: 'Top momentos com quem mais amo',
      subtitle: emotionalPhrases[index % emotionalPhrases.length],
      image,
      animation: memoryAnimations[index % memoryAnimations.length],
    }))

    const stats: StoryItem = {
      id: 'stats',
      kind: 'stats',
      title: 'Estatística Emocional',
      subtitle: 'Números que contam o que vocês viveram.',
      animation: 'zoom',
    }

    const finalSlide: StoryItem = {
      id: 'final',
      kind: 'final',
      title: 'E essa é só a nossa primeira temporada.',
      subtitle: 'Ainda temos muitos capítulos pela frente.',
      image: uniqueImages[1] || selectedTheme.bg,
      animation: 'slowReveal',
    }

    return [introPlayer, highlight, connection, ...memories, stats, finalSlide]
  }, [loveData.nomePessoa, selectedTheme.accent, selectedTheme.bg, uniqueImages])

  const currentStory = stories[currentSlide]

  const minutesTarget = Math.max(320, loveData.anos * 525600 + loveData.meses * 43800 + loveData.dias * 1440)
  const memoriesTarget = Math.max(12, uniqueImages.length * 3)
  const laughsTarget = Math.max(120, loveData.anos * 120 + loveData.meses * 10 + loveData.dias)

  const minutesCount = useAnimatedCount(minutesTarget, started && currentStory.kind === 'stats')
  const memoriesCount = useAnimatedCount(memoriesTarget, started && currentStory.kind === 'stats')
  const laughsCount = useAnimatedCount(laughsTarget, started && currentStory.kind === 'stats')

  useEffect(() => {
    if (!started) {
      return
    }

    setElapsedMs(0)

    if (currentSlide >= stories.length - 1) {
      return
    }

    const interval = window.setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + 100
        if (next >= WRAPPED_STORY_DURATION_MS) {
          setCurrentSlide((slide) => (slide < stories.length - 1 ? slide + 1 : slide))
          return 0
        }
        return next
      })
    }, 100)

    return () => window.clearInterval(interval)
  }, [started, currentSlide, stories.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < stories.length - 1 ? prev + 1 : prev))
    setElapsedMs(0)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev))
    setElapsedMs(0)
  }

  const progress = elapsedMs / WRAPPED_STORY_DURATION_MS

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black px-3 sm:px-4">
      <motion.div
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_center,rgba(255,47,122,0.22),#000_70%)]"
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_80%,rgba(255,47,122,0.14),transparent_45%),radial-gradient(circle_at_75%_15%,rgba(255,47,122,0.22),transparent_38%)] blur-xl" />

      <div className="relative h-[94dvh] w-full max-w-[430px] overflow-hidden rounded-[24px] border border-zinc-700/70 bg-black shadow-[0_20px_65px_rgba(0,0,0,0.7)] sm:h-[90vh]">
        <div className="absolute left-0 right-0 top-0 z-30 px-3 pt-3">
          <div className="flex gap-1.5">
            {stories.map((story, index) => {
              const done = index < currentSlide
              const active = index === currentSlide
              const width = done ? '100%' : active ? `${Math.min(100, Math.max(6, progress * 100))}%` : '0%'

              return (
                <div key={story.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/30">
                  <div className="h-full rounded-full bg-pink-500 transition-all duration-100" style={{ width }} />
                </div>
              )
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStory.id}
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            animate={animationVariants[currentStory.animation]}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.8 }}
            className="h-full w-full"
            aria-live="polite"
          >
            {currentStory.kind === 'intro-player' && (
              <div className="relative flex h-full flex-col justify-center px-6 pb-12 pt-14 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,47,122,0.2),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,47,122,0.16),transparent_40%)]" />
                <div className="relative z-10 rounded-[20px] border border-zinc-700 bg-[#121212]/85 p-5 shadow-2xl">
                  <p className="text-xs uppercase tracking-[0.24em] text-pink-400">LOVELYFLIX WRAPPED</p>
                  <h2 className="mt-4 text-4xl font-black text-white">{currentStory.title}</h2>
                  <p className="mt-3 text-zinc-300">{currentStory.subtitle}</p>

                  <div className="mx-auto mt-5 w-full max-w-[280px] overflow-hidden rounded-[16px]">
                    <img src={currentStory.image} alt="Capa principal" className="aspect-square w-full object-cover" />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStarted(true)
                      setElapsedMs(0)
                    }}
                    className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl text-black shadow-[0_0_30px_rgba(255,47,122,0.45)]"
                    aria-label="Iniciar experiência"
                  >
                    ▶
                  </button>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-zinc-400">Iniciar Experiência</p>
                </div>
              </div>
            )}

            {started && currentStory.kind === 'highlight' && (
              <div className="relative flex h-full flex-col px-6 pb-10 pt-14">
                <motion.div whileHover={{ scale: 1.02 }} className="relative h-[70%] overflow-hidden rounded-[20px]">
                  <div className="absolute inset-0 -z-10 blur-2xl" style={{ backgroundImage: `url(${currentStory.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                  <img src={currentStory.image} alt="Pessoa do ano" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                </motion.div>
                <div className="mt-6 text-left">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#1DB954]">Pessoa do Ano</p>
                  <h2 className="mt-3 text-4xl font-black leading-tight text-white">{currentStory.title}</h2>
                  <p className="mt-2 text-2xl font-semibold text-white">{currentStory.subtitle}</p>
                  <p className="mt-2 text-zinc-300">{currentStory.body}</p>
                </div>
              </div>
            )}

            {started && currentStory.kind === 'connection' && (
              <div className="relative flex h-full items-center justify-center px-7 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(29,185,84,0.2),transparent_45%),#050505]" />
                <div className="relative">
                  <h2 className="text-4xl font-black text-white">{currentStory.title}</h2>
                  <p className="mt-4 text-zinc-200">{currentStory.subtitle}</p>
                </div>
              </div>
            )}

            {started && currentStory.kind === 'memory' && (
              <div className="relative h-full w-full">
                <motion.img
                  src={currentStory.image}
                  alt={currentStory.subtitle}
                  className="h-[85%] w-full object-cover"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-8 left-6 right-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#1DB954]">Retrospectiva</p>
                  <h3 className="mt-2 text-3xl font-black text-white">{currentStory.title}</h3>
                  <p className="mt-1 text-sm text-zinc-200">{currentStory.subtitle}</p>
                </div>
              </div>
            )}

            {started && currentStory.kind === 'stats' && (
              <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_20%_20%,rgba(29,185,84,0.28),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(255,79,163,0.25),transparent_42%),#060606] px-7 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-[#1DB954]">Estatística Emocional</p>
                <p className="mt-6 text-4xl font-black text-white">{minutesCount.toLocaleString('pt-BR')}</p>
                <p className="text-zinc-200">minutos juntos</p>
                <p className="mt-5 text-3xl font-black text-white">{memoriesCount}</p>
                <p className="text-zinc-200">memórias inesquecíveis</p>
                <p className="mt-5 text-3xl font-black text-white">{laughsCount}</p>
                <p className="text-zinc-200">risadas compartilhadas</p>
              </div>
            )}

            {started && currentStory.kind === 'final' && (
              <div className="relative h-full w-full">
                <img src={currentStory.image} alt="Final" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/65" />
                <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                  <h2 className="text-4xl font-black text-white">{currentStory.title}</h2>
                  <p className="mt-4 text-zinc-200">{currentStory.subtitle}</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {started && (
          <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between gap-2">
            <button type="button" onClick={prevSlide} className="rounded-full border border-zinc-500 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.14em] text-white">
              Voltar
            </button>
            <button type="button" onClick={nextSlide} className="rounded-full bg-[#1DB954] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black">
              Próximo
            </button>
            <button
              type="button"
              onClick={async () => {
                const shareData = {
                  title: 'Meu Wrapped Romântico',
                  text: 'Olha meu Wrapped romântico personalizado 💖',
                  url: window.location.href,
                }
                if (navigator.share) {
                  try {
                    await navigator.share(shareData)
                    return
                  } catch {
                    return
                  }
                }
                try {
                  await navigator.clipboard.writeText(shareData.url)
                  alert('Link copiado para compartilhar!')
                } catch {
                  alert('Não foi possível compartilhar automaticamente.')
                }
              }}
              className="rounded-full border border-[#1DB954]/80 bg-[#1DB954]/20 px-4 py-2 text-xs uppercase tracking-[0.14em] text-white"
            >
              Compartilhar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
