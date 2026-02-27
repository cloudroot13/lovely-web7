import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { netflixAssets as lovelyflixAssets } from '../../assets/themes/themeAssets'
import { WRAPPED_STORY_DURATION_MS } from '../../constants/wrappedTiming'
import { useAppContext } from '../../context/appStore'
import type { LoveData } from '../../types/types'

type Screen = 'home' | 'detail' | 'stories'

interface Tile {
  id: string
  title: string
  subtitle?: string
  text: string
  image: string
}

interface LovelyflixExperienceProps {
  demoData?: LoveData
  demoMode?: boolean
}

interface HeartNote {
  id: number
  text: string
  left: number
  top: number
}

function formatCompactNumber(value: number) {
  if (!Number.isFinite(value)) return '0'
  return new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

interface FinalLoveWord {
  id: string
  text: string
  x: number
  y: number
  rotate: number
  duration: number
  delay: number
}

interface FinalLoveParticle {
  id: string
  x: number
  y: number
  size: number
  delay: number
  color: string
  heart: boolean
}

function firstLine(value: string, fallback: string) {
  const clean = value.trim()
  if (!clean) return fallback
  const line = clean.split(/[.!?]/)[0]?.trim()
  return line && line.length > 4 ? `${line}.` : clean
}

function hasLovelyflixData(data: LoveData) {
  return Boolean(data.nomePessoa.trim() && data.fotoCasalDataUrl && data.storiesImagesDataUrls.length > 0)
}

function uniqueImages(images: Array<string | undefined>) {
  return images
    .map((item) => item?.trim() || '')
    .filter(Boolean)
    .filter((item, index, self) => self.indexOf(item) === index)
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function buildFinalLoveWords() {
  const words = [
    'Eu te amo',
    'I love you',
    "Je t’aime",
    'Ti amo',
    'Ich liebe dich',
    'Te quiero',
    'Aishiteru',
    'Saranghae',
    'Ya tebya lyublyu',
    'Je t’aime bien',
    'Eu te adoro',
    'Ily',
    'Te amo',
    'Te iubesc',
    'Kocham cię',
    'Ik hou van jou',
    'Jag älskar dig',
    'Jeg elsker deg',
    'Jeg elsker dig',
    'Jag elsker dig',
    'Te amo mucho',
    'Seni seviyorum',
    'Ana behibak',
    'Wo ai ni',
    'Ngo oi nei',
    'Mahal kita',
    'Aku cinta kamu',
    'Saya cinta kamu',
    'Amo-te',
    'Aroha ahau ki a koe',
    'Minä rakastan sinua',
    'Τα αγαπώ',
    'Я люблю тебя',
    'ฉันรักคุณ',
    'Tôi yêu bạn',
    'Saya sayang kamu',
  ]
  return words.map((text, idx) => {
    const spreadX = clamp((Math.random() - 0.5) * 250, -125, 125)
    const spreadY = clamp((Math.random() - 0.5) * 330, -175, 165)
    return {
      id: `${text}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
      text,
      x: spreadX,
      y: spreadY,
      rotate: (Math.random() - 0.5) * 16,
      duration: 3.8 + Math.random() * 1.8,
      delay: idx * 0.06,
    }
  })
}

function buildFinalLoveParticles() {
  return Array.from({ length: 28 }).map((_, idx) => {
    const angle = (idx / 28) * Math.PI * 2 + Math.random() * 0.45
    const distance = 46 + Math.random() * 110
    return {
      id: `p-${idx}-${Math.random().toString(36).slice(2, 7)}`,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 0.12,
      color: idx % 3 === 0 ? '#ffffff' : idx % 2 === 0 ? '#ffd6ea' : '#ff9dc5',
      heart: idx % 6 === 0,
    }
  })
}

function buildDetailNarrative(tile: Tile, data: LoveData) {
  const person = data.nomePessoa || 'você'
  return `${tile.text} Esse capítulo mostra como ${person} transformou dias comuns em memórias que valem replay. Cada nova cena mantém a mesma intensidade do começo.`
}

function getRelationshipDays(data: LoveData, nowMs: number) {
  if (data.startDate) {
    const startRaw = data.startDate.includes('T') ? data.startDate : `${data.startDate}T00:00:00`
    const start = new Date(startRaw)
    if (!Number.isNaN(start.getTime())) {
      const diff = nowMs - start.getTime()
      return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)))
    }
  }
  return Math.max(1, data.anos * 365 + data.meses * 30 + data.dias)
}

function getRelationshipMetrics(data: LoveData, nowMs: number) {
  const days = getRelationshipDays(data, nowMs)
  const minutes = Math.max(1, Math.floor((days * 24 * 60)))
  const months = Math.max(1, Math.floor(days / 30))
  const monthlyMeetups = Math.max(1, data.monthlyMeetups || 1)
  const outingsSinceStart = Math.max(monthlyMeetups, monthlyMeetups * months)
  return { days, minutes, outingsSinceStart, monthlyMeetups }
}

function getRelationshipElapsedSeconds(data: LoveData, nowMs: number) {
  if (data.startDate) {
    const startRaw = data.startDate.includes('T') ? data.startDate : `${data.startDate}T00:00:00`
    const start = new Date(startRaw)
    if (!Number.isNaN(start.getTime())) {
      const diffSeconds = Math.floor((nowMs - start.getTime()) / 1000)
      return Math.max(1, diffSeconds)
    }
  }

  const fallbackDays = Math.max(1, data.anos * 365 + data.meses * 30 + data.dias)
  return fallbackDays * 24 * 60 * 60
}

function splitDuration(totalSeconds: number) {
  const safe = Math.max(1, totalSeconds)
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

function getStartDateLabel(startDate: string) {
  if (!startDate) {
    return 'Desde o início da história'
  }

  const parsed = new Date(startDate)
  if (Number.isNaN(parsed.getTime())) {
    return `Desde ${startDate}`
  }

  return `Desde ${parsed.toLocaleDateString('pt-BR')}`
}

function buildContent(data: LoveData, metrics: ReturnType<typeof getRelationshipMetrics>) {
  const fallback = data.fotoCasalDataUrl || data.storiesImagesDataUrls[0] || data.momentHighlights[0]?.imageDataUrl || lovelyflixAssets.top10Bg
  const images = uniqueImages([
    data.fotoCasalDataUrl,
    data.momentHighlights[0]?.imageDataUrl,
    data.momentHighlights[1]?.imageDataUrl,
    data.storiesImagesDataUrls[0],
    data.storiesImagesDataUrls[1],
    data.storiesImagesDataUrls[2],
    data.storiesImagesDataUrls[3],
    data.storiesImagesDataUrls[4],
  ])

  const pickImage = (idx: number) => images[idx] || fallback

  const heroTitle = firstLine(data.momentoEspecial, `Uma história com ${data.nomePessoa || 'amor'}`)
  const heroPhrase = firstLine(data.oQueMaisAmo, 'Cada capítulo dessa história tem carinho, verdade e memória.')

  const continueWatching: Tile[] = [
    {
      id: 'cw1',
      title: 'Ep. 1 - Comecinho',
      subtitle: 'Nosso primeiro capítulo',
      text: 'Foi aqui que começou.',
      image: pickImage(3),
    },
    {
      id: 'cw2',
      title: 'Ep. 2 - Dia favorito',
      subtitle: 'Uma memória linda',
      text: 'Um momento que mora no coração.',
      image: pickImage(1),
    },
    {
      id: 'cw3',
      title: 'Ep. 3 - Jeito nosso',
      subtitle: 'Pequenos momentos',
      text: 'O simples com você é perfeito.',
      image: pickImage(2),
    },
    {
      id: 'cw4',
      title: data.dataImportante?.trim() ? `Ep. 4 - Data especial` : 'Ep. 4 - Data especial',
      subtitle: 'Nosso dia',
      text: 'Um dia lindo pra lembrar sempre.',
      image: pickImage(4),
    },
  ]

  const top5: Tile[] = [
    { id: 't1', title: 'Top 5 momentos', subtitle: 'Top 5 - #1', text: continueWatching[0].text, image: pickImage(3) },
    { id: 't2', title: 'Top 5 momentos', subtitle: 'Top 5 - #2', text: continueWatching[1].text, image: pickImage(1) },
    { id: 't3', title: 'Top 5 momentos', subtitle: 'Top 5 - #3', text: continueWatching[2].text, image: pickImage(5) },
    { id: 't4', title: 'Top 5 momentos', subtitle: 'Top 5 - #4', text: continueWatching[2].text, image: pickImage(2) },
    { id: 't5', title: 'Top 5 momentos', subtitle: 'Top 5 - #5', text: continueWatching[3].text, image: pickImage(6) },
  ]

  const daysTogether = metrics.days

  const stories: Tile[] = [
    { id: 's1', title: 'Capítulo 1', subtitle: 'O episódio piloto', text: continueWatching[0].text, image: continueWatching[0].image },
    { id: 's2', title: 'Capítulo 2', subtitle: 'Cena principal da temporada', text: continueWatching[1].text, image: continueWatching[1].image },
    { id: 's3', title: 'Capítulo 3', subtitle: 'O que sempre vale replay', text: continueWatching[2].text, image: continueWatching[2].image },
    { id: 's4', title: 'Capítulo 4', subtitle: 'Nosso destaque', text: 'Mais um capítulo especial da nossa história.', image: top5[2].image },
    { id: 's5', title: 'Capítulo 5', subtitle: 'Nosso contador', text: `${daysTogether} dias de história e cada dia parece estreia.`, image: pickImage(0) },
    { id: 's6', title: 'Jogo 1', subtitle: 'Corações clicáveis', text: 'Clique em pelo menos 5 corações para continuar.', image: pickImage(1) },
    {
      id: 's7',
      title: 'Capítulo Especial',
      subtitle: 'Estatísticas da nossa história',
      text: `Vocês saem em média ${metrics.monthlyMeetups}x por mês. Olha o total desde o começo.`,
      image: pickImage(2),
    },
    { id: 's8', title: 'Jogo 3', subtitle: 'Revelação segurando', text: 'Segure por 2 segundos para revelar a frase final.', image: pickImage(3) },
  ]

  return { fallback, heroTitle, heroPhrase, continueWatching, top5, stories, metrics }
}

export default function LovelyflixExperience({ demoData, demoMode = false }: LovelyflixExperienceProps) {
  const navigate = useNavigate()
  const { config, loveData: contextLoveData, setConfig } = useAppContext()
  const loveData = demoMode && demoData ? demoData : contextLoveData
  const [screen, setScreen] = useState<Screen>('home')
  const [selected, setSelected] = useState<Tile | null>(null)
  const [storyIndex, setStoryIndex] = useState(0)
  const [storyProgress, setStoryProgress] = useState(0)
  const [storyElapsedMs, setStoryElapsedMs] = useState(0)
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [typedStoryText, setTypedStoryText] = useState('')
  const [storyTextSnapshot, setStoryTextSnapshot] = useState('')
  const [clickedHearts, setClickedHearts] = useState(0)
  const [hiddenHearts, setHiddenHearts] = useState<number[]>([])
  const [heartNotes, setHeartNotes] = useState<HeartNote[]>([])
  const [animatedOutings, setAnimatedOutings] = useState(0)
  const [animatedMinutes, setAnimatedMinutes] = useState(0)
  const [metricsSnapshot, setMetricsSnapshot] = useState(() => getRelationshipMetrics(loveData, Date.now()))
  const [loveBurstCount, setLoveBurstCount] = useState(0)
  const [heartTapBoost, setHeartTapBoost] = useState(false)
  const [showLoveWords, setShowLoveWords] = useState(false)
  const [finalHeartGone, setFinalHeartGone] = useState(false)
  const [finalLoveWords, setFinalLoveWords] = useState<FinalLoveWord[]>([])
  const [finalLoveParticles, setFinalLoveParticles] = useState<FinalLoveParticle[]>([])
  const statsAnimatedForRef = useRef<number | null>(null)

  useEffect(() => {
    if (demoMode) return
    if (!(config.mode === 'wrapped' && config.variant === 'stories')) {
      setConfig({ mode: 'wrapped', variant: 'stories' })
      return
    }

    if (!hasLovelyflixData(loveData)) {
      setScreen('home')
      setStoryIndex(0)
      return
    }
  }, [config.mode, config.variant, loveData, navigate, demoMode, setConfig])

  useEffect(() => {
    const interval = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const content = useMemo(() => buildContent(loveData, metricsSnapshot), [loveData, metricsSnapshot])
  const detailNarrative = useMemo(() => (selected ? buildDetailNarrative(selected, loveData) : ''), [selected, loveData])
  const relationshipCounter = useMemo(
    () => splitDuration(getRelationshipElapsedSeconds(loveData, nowMs)),
    [loveData, nowMs],
  )
  const relationshipStartLabel = useMemo(() => getStartDateLabel(loveData.startDate), [loveData.startDate])

  useEffect(() => {
    if (screen !== 'stories') {
      return
    }

    const currentStory = content.stories[storyIndex]
    const isGameStory = currentStory?.id === 's6' || currentStory?.id === 's7' || currentStory?.id === 's8'
    if (isGameStory) {
      const reset = window.setTimeout(() => setStoryProgress(0), 0)
      return () => window.clearTimeout(reset)
    }

    setStoryProgress(0)
    setStoryElapsedMs(0)
    let raf = 0
    const startedAt = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const progress = Math.min(100, (elapsed / WRAPPED_STORY_DURATION_MS) * 100)
      setStoryProgress(progress)
      setStoryElapsedMs(elapsed)

      if (elapsed >= WRAPPED_STORY_DURATION_MS) {
        if (storyIndex >= content.stories.length - 1) {
          setScreen('home')
          setStoryIndex(0)
          return
        }
        setStoryIndex((prev) => prev + 1)
        return
      }

      raf = window.requestAnimationFrame(tick)
    }

    raf = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf)
  }, [screen, storyIndex, content.stories.length])

  useEffect(() => {
    if (screen !== 'stories') {
      return
    }
    const resetHearts = window.setTimeout(() => {
      setClickedHearts(0)
      setHiddenHearts([])
      setHeartNotes([])
      setAnimatedOutings(0)
      setAnimatedMinutes(0)
      setHeartTapBoost(false)
      setShowLoveWords(false)
      setFinalHeartGone(false)
      setLoveBurstCount(0)
      setFinalLoveWords([])
      setFinalLoveParticles([])
    }, 0)
    return () => window.clearTimeout(resetHearts)
  }, [screen, storyIndex])

  useEffect(() => {
    if (screen !== 'stories' || content.stories[storyIndex]?.id !== 's7') {
      return
    }

    if (statsAnimatedForRef.current === storyIndex) {
      return
    }
    statsAnimatedForRef.current = storyIndex

    let frame = 0
    const duration = 1400
    const startedAt = performance.now()
    const targetOutings = metricsSnapshot.outingsSinceStart
    const targetMinutes = metricsSnapshot.minutes

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - (1 - progress) * (1 - progress)
      setAnimatedOutings(Math.floor(targetOutings * eased))
      setAnimatedMinutes(Math.floor(targetMinutes * eased))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setAnimatedOutings(targetOutings)
        setAnimatedMinutes(targetMinutes)
      }
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [screen, storyIndex, metricsSnapshot, content.stories])

  useEffect(() => {
    if (screen !== 'stories') {
      statsAnimatedForRef.current = null
    }
  }, [screen])

  useEffect(() => {
    if (screen !== 'stories') {
      return
    }
    setMetricsSnapshot(getRelationshipMetrics(loveData, Date.now()))
  }, [screen, storyIndex, loveData.startDate, loveData.anos, loveData.meses, loveData.dias, loveData.monthlyMeetups])

  useEffect(() => {
    if (screen !== 'stories') {
      const reset = window.setTimeout(() => {
        setTypedStoryText('')
        setStoryTextSnapshot('')
      }, 0)
      return () => window.clearTimeout(reset)
    }

    const snapshot = content.stories[storyIndex]?.text ?? ''
    setStoryTextSnapshot(snapshot)
  }, [screen, storyIndex, content.stories])

  useEffect(() => {
    if (screen !== 'stories') {
      return
    }

    const storyText = storyTextSnapshot
    const reset = window.setTimeout(() => setTypedStoryText(''), 0)
    let index = 0
    const interval = window.setInterval(() => {
      index += 1
      setTypedStoryText(storyText.slice(0, index))
      if (index >= storyText.length) {
        window.clearInterval(interval)
      }
    }, 18)

    return () => {
      window.clearTimeout(reset)
      window.clearInterval(interval)
    }
  }, [screen, storyTextSnapshot, storyIndex])

  if (screen === 'stories') {
    const current = content.stories[storyIndex]
    const isChapterFour = current.id === 's4'
    const isCounterStory = current.id === 's5'
    const isHeartsStory = current.id === 's6'
    const isStatsStory = current.id === 's7'
    const isLoveFinalStory = current.id === 's8'
    const canContinueHearts = clickedHearts >= 5
    const canContinueLoveFinal = showLoveWords
    const romanticPhrases = ['Você é meu lugar favorito', 'Meu melhor capítulo é com você', 'Nosso filme nunca acaba', 'Seu abraço é meu final feliz']

    const goNextStory = () => {
      if (storyIndex === content.stories.length - 1) {
        setScreen('home')
        setStoryIndex(0)
        return
      }
      setStoryIndex((prev) => prev + 1)
    }

    return (
      <main className="min-h-screen bg-black px-3 py-4 text-white">
        <div className="mx-auto h-[calc(100vh-2rem)] w-full max-w-[390px] overflow-hidden rounded-[28px] border border-zinc-800 bg-[#121212] shadow-[0_26px_70px_rgba(0,0,0,0.75)] transition-all duration-300">
          <div className="relative flex h-full flex-col px-3 pb-4 pt-3">
            <div className="mb-3 flex gap-1.5">
              {content.stories.map((story, idx) => (
                <span key={story.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-700">
                  {idx < storyIndex && <span className="block h-full w-full bg-red-500" />}
                  {idx === storyIndex && (
                    <motion.span
                      className="block h-full bg-red-500"
                      initial={{ width: '0%' }}
                      animate={{ width: `${storyProgress}%` }}
                      transition={{ duration: 0.08, ease: 'linear' }}
                    />
                  )}
                </span>
              ))}
            </div>

            <div className="mb-3 flex items-center justify-between px-1 text-[11px] uppercase tracking-[0.12em] text-zinc-300">
              <span>Story {storyIndex + 1}/{content.stories.length}</span>
              <span>{Math.max(0, Math.ceil((WRAPPED_STORY_DURATION_MS - storyElapsedMs) / 1000))}s</span>
            </div>

            <article className="relative flex-1 overflow-hidden rounded-3xl border border-white/10">
              <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
                {isChapterFour ? (
                  Array.from({ length: 26 }).map((_, idx) => (
                    <motion.span
                      key={`${current.id}-cap4-heart-${idx}`}
                      className="absolute text-red-300/90"
                      style={{
                        left: `${2 + (idx % 13) * 7.4}%`,
                        bottom: '-14%',
                        fontSize: `${18 + (idx % 5) * 5}px`,
                        filter: 'drop-shadow(0 0 8px rgba(229,9,20,0.45))',
                      }}
                      animate={{ y: [0, -860], x: [0, idx % 2 === 0 ? 14 : -14, 0], opacity: [0, 0.95, 0.7, 0], rotate: [0, idx % 2 === 0 ? 8 : -8, 0] }}
                      transition={{ duration: 6.8 + (idx % 6) * 0.55, repeat: Infinity, delay: idx * 0.14, ease: 'easeInOut' }}
                    >
                      ❤
                    </motion.span>
                  ))
                ) : (
                  <>
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <motion.span
                        key={`${current.id}-spark-${idx}`}
                        className="absolute h-1.5 w-1.5 rounded-full bg-red-500/60"
                        style={{ left: `${8 + idx * 9}%`, bottom: `${8 + (idx % 3) * 8}%` }}
                        animate={{ y: [0, -12, 0], opacity: [0.2, 0.7, 0.2], scale: [0.9, 1.2, 0.9] }}
                        transition={{ duration: 2.8 + (idx % 4) * 0.4, repeat: Infinity, delay: idx * 0.14, ease: 'easeInOut' }}
                      />
                    ))}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
                      animate={{ y: ['-100%', '120%'] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
                    />
                  </>
                )}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <motion.img
                    src={current.image}
                    alt={current.title}
                    className="h-full w-full object-cover"
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-black/88" />
                  {isLoveFinalStory && (
                    <div className="absolute inset-0 z-20 pointer-events-none bg-[#050505]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,167,210,0.2)_0%,rgba(255,167,210,0.08)_34%,rgba(0,0,0,0)_72%)]" />
                      {Array.from({ length: 14 }).map((_, idx) => (
                        <motion.span
                          key={`final-bg-dot-${idx}`}
                          className="absolute h-1 w-1 rounded-full bg-white/35"
                          style={{ left: `${8 + (idx % 7) * 13}%`, top: `${12 + Math.floor(idx / 7) * 34}%` }}
                          animate={{ opacity: [0.18, 0.52, 0.2] }}
                          transition={{ duration: 2.3 + (idx % 4) * 0.6, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.12 }}
                        />
                      ))}

                      {!finalHeartGone && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.button
                            type="button"
                            onClick={() => {
                              setHeartTapBoost(true)
                              setLoveBurstCount((prev) => prev + 1)
                              setShowLoveWords(true)
                              setFinalLoveParticles(buildFinalLoveParticles())
                              setFinalLoveWords(buildFinalLoveWords())
                              window.setTimeout(() => {
                                setHeartTapBoost(false)
                                setFinalHeartGone(true)
                              }, 240)
                            }}
                            className="pointer-events-auto relative flex h-[100px] w-[100px] cursor-pointer items-center justify-center text-[100px] text-white [text-shadow:0_0_20px_rgba(255,170,210,0.55)]"
                            animate={heartTapBoost ? { scale: [1, 1.2, 0.94], rotate: [0, -6, 5, -3, 0], opacity: [1, 1, 0] } : { scale: [1, 1.07, 1] }}
                            transition={{ duration: heartTapBoost ? 0.24 : 2, repeat: heartTapBoost ? 0 : Infinity, ease: 'easeInOut' }}
                            aria-label="Explodir coração"
                          >
                            ❤
                          </motion.button>
                          <div className="pointer-events-none absolute top-[58%] left-1/2 -translate-x-1/2 rounded-full border border-white/25 bg-black/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_0_20px_rgba(255,167,210,0.35)]">
                            Clique no coração
                          </div>
                        </div>
                      )}

                      {loveBurstCount > 0 && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                          <motion.span
                            className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
                            initial={{ opacity: 0.95, scale: 0.5 }}
                            animate={{ opacity: 0, scale: 1.9 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                          />
                          {finalLoveParticles.map((dot) => (
                            <motion.span
                              key={`final-particle-${loveBurstCount}-${dot.id}`}
                              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${dot.heart ? 'text-[12px]' : 'rounded-full'}`}
                              style={dot.heart ? { color: dot.color } : { width: `${dot.size}px`, height: `${dot.size}px`, background: dot.color }}
                              initial={{ x: 0, y: 0, opacity: 0.95, filter: 'blur(0px)' }}
                              animate={{ x: dot.x, y: dot.y, opacity: 0, filter: 'blur(1.2px)' }}
                              transition={{ duration: 1.2, ease: 'easeOut', delay: dot.delay }}
                            >
                              {dot.heart ? '❤' : ''}
                            </motion.span>
                          ))}
                        </div>
                      )}

                      {showLoveWords && (
                        <div className="absolute inset-0">
                          {finalLoveWords.map((word) => (
                            <motion.span
                              key={`final-word-${word.id}`}
                              className="absolute left-1/2 top-1/2 text-base font-semibold text-white/90 [text-shadow:0_0_10px_rgba(255,255,255,0.4)]"
                              initial={{ x: 0, y: 0, opacity: 0, rotate: 0 }}
                              animate={{
                                x: [0, word.x, word.x + 8, word.x - 6, word.x + 3],
                                y: [0, word.y, word.y - 7, word.y + 5, word.y - 4],
                                opacity: [0, 1, 0.9, 1, 0.85],
                                rotate: [0, word.rotate, word.rotate + 2, word.rotate - 2, word.rotate + 1],
                              }}
                              transition={{ duration: word.duration, repeat: Infinity, ease: 'easeInOut', delay: word.delay }}
                            >
                              {word.text}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {isHeartsStory && heartNotes.length > 0 && (
                    <div className="pointer-events-none absolute inset-0 z-20">
                      {heartNotes.map((note, index) => (
                        <motion.div
                          key={note.id}
                          className="absolute rounded-full border border-white/25 bg-black/60 px-3 py-1 text-xs font-medium text-white shadow-[0_0_18px_rgba(229,9,20,0.28)]"
                          style={{ left: `${note.left}%`, top: `${note.top}%` }}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                          transition={{
                            opacity: { duration: 0.25 },
                            scale: { duration: 0.25 },
                            y: { duration: 1 + (index % 3) * 0.2, repeat: Infinity, ease: 'easeInOut' },
                          }}
                        >
                          {note.text}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <motion.div
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.35, delay: 0.12 }}
                    className="absolute bottom-0 left-0 right-0 p-5"
                  >
                    {!isLoveFinalStory && (
                      <>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#46d369]">Stories</p>
                        <motion.h1 className="mt-2 text-2xl font-black" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                          {current.title}
                        </motion.h1>
                        {current.subtitle && <p className="mt-2 text-base font-semibold text-white">{current.subtitle}</p>}
                        <p className="mt-2 text-sm leading-relaxed text-zinc-200">
                          {typedStoryText}
                          <span className="ml-1 animate-pulse text-zinc-300">|</span>
                        </p>
                      </>
                    )}

                    {isCounterStory && (
                      <div className="mt-4 rounded-2xl border border-white/20 bg-black/45 p-4 backdrop-blur-sm">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-300">Tempo juntos</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-zinc-400">{relationshipStartLabel}</p>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          <motion.div className="rounded-xl bg-[#181818] px-2 py-3 text-center" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}>
                            <p className="text-2xl font-black">{relationshipCounter.years}</p>
                            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Anos</p>
                          </motion.div>
                          <motion.div className="rounded-xl bg-[#181818] px-2 py-3 text-center" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.15, ease: 'easeInOut' }}>
                            <p className="text-2xl font-black">{relationshipCounter.months}</p>
                            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Meses</p>
                          </motion.div>
                          <motion.div className="rounded-xl bg-[#181818] px-2 py-3 text-center" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.3, ease: 'easeInOut' }}>
                            <p className="text-2xl font-black">{relationshipCounter.days}</p>
                            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Dias</p>
                          </motion.div>
                          <motion.div className="rounded-xl bg-[#181818] px-2 py-3 text-center" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.45, ease: 'easeInOut' }}>
                            <p className="text-2xl font-black">{relationshipCounter.hours}</p>
                            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Horas</p>
                          </motion.div>
                          <motion.div className="rounded-xl bg-[#181818] px-2 py-3 text-center" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.6, ease: 'easeInOut' }}>
                            <p className="text-2xl font-black">{relationshipCounter.minutes}</p>
                            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Min</p>
                          </motion.div>
                          <motion.div className="rounded-xl bg-[#181818] px-2 py-3 text-center" animate={{ y: [0, -2, 0] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.75, ease: 'easeInOut' }}>
                            <p className="text-2xl font-black">{relationshipCounter.seconds}</p>
                            <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-400">Seg</p>
                          </motion.div>
                        </div>
                      </div>
                    )}

                    {isHeartsStory && (
                      <div className="mt-4 rounded-2xl border border-white/20 bg-black/45 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs text-zinc-200">Toque em 5 corações para liberar.</p>
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-zinc-100">{clickedHearts}/5</span>
                        </div>
                        <div className="mt-3 grid grid-cols-5 gap-2.5">
                          {Array.from({ length: 10 }).map((_, idx) => {
                            const hidden = hiddenHearts.includes(idx)
                            return (
                              <motion.button
                                key={`heart-${idx}`}
                                disabled={hidden}
                                className="flex h-12 w-full items-center justify-center rounded-xl border border-white/20 bg-black/35 text-2xl"
                                onClick={() => {
                                  if (hidden) return
                                  setHiddenHearts((prev) => [...prev, idx])
                                  setClickedHearts((prev) => prev + 1)
                                  const phrase = romanticPhrases[(idx + clickedHearts) % romanticPhrases.length]
                                  setHeartNotes((prev) => [
                                    ...prev,
                                    {
                                      id: Date.now() + idx,
                                      text: phrase,
                                      ...(function getSpreadPosition() {
                                        for (let attempt = 0; attempt < 14; attempt += 1) {
                                          const left = 6 + Math.random() * 70
                                          const top = 10 + Math.random() * 56
                                          const hasCollision = prev.some((note) => Math.abs(note.left - left) < 16 && Math.abs(note.top - top) < 8)
                                          if (!hasCollision) return { left, top }
                                        }
                                        return {
                                          left: 8 + ((prev.length * 17) % 66),
                                          top: 12 + ((prev.length * 11) % 52),
                                        }
                                      })(),
                                    },
                                  ])
                                }}
                                whileTap={{ scale: 0.92 }}
                                animate={{ y: [0, -8, 0], opacity: hidden ? 0 : 1, scale: hidden ? 0.55 : 1 }}
                                transition={{ duration: 1.6 + (idx % 3) * 0.3, repeat: Infinity, ease: 'easeInOut' }}
                              >
                                ❤️
                              </motion.button>
                            )
                          })}
                        </div>
                        {canContinueHearts && (
                          <button
                            className="mt-3 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.14em]"
                            onClick={goNextStory}
                          >
                            Continuar
                          </button>
                        )}
                      </div>
                    )}

                    {isStatsStory && (
                      <div className="mt-4 rounded-2xl border border-white/20 bg-black/45 p-4">
                        <p className="text-xs text-zinc-300">Baseado no que você respondeu no chat:</p>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <motion.div
                            className="rounded-xl border border-red-500/40 bg-[#1b1b1b] p-3 text-center"
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">Saídas por mês</p>
                            <p className="mt-1 text-2xl font-black text-white">{Math.max(1, content.metrics.monthlyMeetups)}x</p>
                          </motion.div>
                          <motion.div
                            className="rounded-xl border border-red-500/40 bg-[#1b1b1b] p-3 text-center"
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: 0.15, ease: 'easeInOut' }}
                          >
                            <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">Desde o início</p>
                            <p className="mt-1 text-2xl font-black text-white">{formatCompactNumber(animatedOutings)} saídas</p>
                          </motion.div>
                        </div>
                        <motion.div
                          className="mt-2 rounded-xl border border-red-500/40 bg-[#1b1b1b] p-3 text-center"
                          animate={{ boxShadow: ['0 0 0 rgba(229,9,20,0)', '0 0 24px rgba(229,9,20,0.25)', '0 0 0 rgba(229,9,20,0)'] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <p className="text-[11px] uppercase tracking-[0.12em] text-zinc-400">Minutos juntos nessa história</p>
                          <p className="mt-1 text-2xl font-black text-white">{formatCompactNumber(animatedMinutes)} min</p>
                        </motion.div>
                        <div className="mt-3">
                          <button className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.14em]" onClick={goNextStory}>
                            Próximo
                          </button>
                        </div>
                      </div>
                    )}

                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <button
                aria-label="Story anterior"
                className="absolute left-0 top-1/4 z-20 h-1/2 w-1/4"
                onClick={() => setStoryIndex((prev) => (prev > 0 ? prev - 1 : prev))}
              />
              <button
                aria-label="Próximo story"
                className="absolute right-0 top-1/4 z-20 h-1/2 w-1/4"
                onClick={() => {
                  if (isHeartsStory && !canContinueHearts) return
                  if (isLoveFinalStory && !canContinueLoveFinal) return
                  goNextStory()
                }}
              />
            </article>
          </div>
        </div>
      </main>
    )
  }

  if (screen === 'detail' && selected) {
    return (
      <main className="min-h-screen bg-black px-3 py-4 text-white">
        <div className="mx-auto h-[calc(100vh-2rem)] w-full max-w-[390px] overflow-hidden rounded-[28px] border border-zinc-800 bg-[#141414] shadow-[0_26px_70px_rgba(0,0,0,0.75)] transition-all duration-300">
          <div className="flex h-full flex-col p-4">
            <button onClick={() => setScreen('home')} className="app-nav-btn app-nav-btn-main w-fit">
              Voltar
            </button>

            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mt-4 flex-1 overflow-hidden rounded-3xl border border-white/10 bg-[#181818] shadow-[0_20px_55px_rgba(0,0,0,0.55)]">
              <motion.img src={selected.image} alt={selected.title} className="h-[52%] w-full object-cover" animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
              <div className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[#46d369]">Detalhes</p>
                <h1 className="text-3xl font-black leading-tight">{selected.title}</h1>
                {selected.subtitle && <p className="text-base font-semibold text-zinc-100">{selected.subtitle}</p>}
                <p className="text-base leading-relaxed text-zinc-200">{selected.text}</p>
                <p className="text-sm leading-relaxed text-zinc-300">{detailNarrative}</p>
              </div>
            </motion.article>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black px-3 py-4 text-white">
      <div className="mx-auto h-[calc(100vh-2rem)] w-full max-w-[390px] overflow-hidden rounded-[28px] border border-zinc-800 bg-[#141414] shadow-[0_26px_70px_rgba(0,0,0,0.75)] transition-all duration-300">
        <div className="h-full overflow-y-auto bg-gradient-to-b from-[#5f1111] via-[#2a0a0a] to-[#141414]">
          <section className="px-4 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-[2rem] font-black leading-none">Para {loveData.nomePessoa || 'você'}</h1>
            </div>

            <article className="relative overflow-hidden rounded-3xl border border-white/15 bg-black/35">
              <motion.img
                src={loveData.fotoCasalDataUrl || content.fallback}
                alt="Destaque do episódio"
                className="h-[56vh] w-full object-cover"
                initial={{ scale: 1.04 }}
                animate={{ scale: [1.04, 1.09, 1.04] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/25" />
              <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-20 text-center">
                <h2 className="text-4xl font-black leading-none">{content.heroTitle}</h2>
                <p className="mt-2 text-lg text-zinc-200">Fofo • Romântico • Só nosso</p>
                <div className="mt-4 flex gap-2">
                  <motion.button
                    onClick={() => {
                      setStoryIndex(0)
                      setScreen('stories')
                    }}
                    className="flex-1 rounded-lg bg-white px-4 py-3 text-lg font-bold text-black"
                    whileTap={{ scale: 0.97 }}
                  >
                    Descobrir
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setSelected(content.continueWatching[0])
                      setScreen('detail')
                    }}
                    className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-lg font-semibold text-zinc-100"
                    whileTap={{ scale: 0.97 }}
                  >
                    + Minha lista
                  </motion.button>
                </div>
              </div>
            </article>
          </section>

          <section className="px-4 pb-4 pt-6">
            <h2 className="mb-3 text-[2rem] font-black leading-tight">Continuar assistindo como {loveData.nomePessoa || 'você'}</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {content.continueWatching.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setSelected(item)
                    setScreen('detail')
                  }}
                  className="group relative w-40 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#1b1b1b] text-left transition duration-300 hover:scale-[1.03]"
                  whileTap={{ scale: 0.98 }}
                >
                  <img src={item.image} alt={item.title} className="h-36 w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="relative p-2">
                    <p className="truncate text-sm font-semibold">{item.title}</p>
                    <p className="truncate text-xs text-zinc-300">{item.subtitle}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>

          <section className="px-4 pb-6 pt-2">
            <h2 className="mb-3 text-xl font-bold">Top 5 do relacionamento</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {content.top5.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    setSelected(item)
                    setScreen('detail')
                  }}
                  className="group relative h-44 w-36 shrink-0 text-left"
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="pointer-events-none absolute -left-1 top-1/2 z-0 -translate-y-1/2 text-[108px] leading-none font-black text-white/20">
                    {index + 1}
                  </span>
                  <div className="absolute bottom-0 right-0 z-10 w-[84%] overflow-hidden rounded-lg border border-white/15 bg-[#1b1b1b] shadow-[0_8px_26px_rgba(0,0,0,0.45)]">
                    <img src={item.image} alt={item.title} className="h-28 w-full object-cover" />
                    <div className="px-2 py-2">
                      <p className="truncate text-xs font-semibold text-white">TOP 5</p>
                      <span className="mt-1 inline-block rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">Novidade</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
