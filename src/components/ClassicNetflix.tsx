import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { netflixAssets } from '../assets/themes/themeAssets'
import NetflixBootIntro from './NetflixBootIntro'
import type { LoveData } from '../types/types'

interface ClassicNetflixProps {
  loveData: LoveData
  showBootIntro?: boolean
}

const netflixMoments = [
  'Nosso Amor, Nosso Para Sempre',
  'Você é meu lugar favorito',
  'Com você tudo faz sentido',
  'Cada dia ao seu lado é especial',
  'Você é meu melhor capítulo',
  'Nosso amor só cresce',
  'Seu sorriso ilumina meu mundo',
  'Eu te escolheria de novo',
  'Nossa história é única',
  'Para sempre eu e você',
]

function buildRelationshipClock(data: LoveData, nowMs: number) {
  const baseMs = (() => {
    if (data.startDate) {
      const parsed = new Date(data.startDate.includes('T') ? data.startDate : `${data.startDate}T00:00:00`)
      if (!Number.isNaN(parsed.getTime())) {
        return parsed.getTime()
      }
    }
    const fallbackSeconds = (data.anos * 365 + data.meses * 30 + data.dias) * 24 * 60 * 60
    return nowMs - fallbackSeconds * 1000
  })()

  const totalSeconds = Math.max(1, Math.floor((nowMs - baseMs) / 1000))
  const years = Math.floor(totalSeconds / (365 * 24 * 60 * 60))
  const afterYears = totalSeconds % (365 * 24 * 60 * 60)
  const months = Math.floor(afterYears / (30 * 24 * 60 * 60))
  const afterMonths = afterYears % (30 * 24 * 60 * 60)
  const days = Math.floor(afterMonths / (24 * 60 * 60))
  const afterDays = afterMonths % (24 * 60 * 60)
  const hours = Math.floor(afterDays / (60 * 60))
  const afterHours = afterDays % (60 * 60)
  const minutes = Math.floor(afterHours / 60)
  const seconds = afterHours % 60

  return {
    years,
    months,
    days,
    hours,
    minutes,
    seconds,
    totalDays: Math.floor(totalSeconds / (24 * 60 * 60)),
  }
}

export function ClassicNetflix({ loveData, showBootIntro = true }: ClassicNetflixProps) {
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null)
  const [showIntro, setShowIntro] = useState(showBootIntro)

  useEffect(() => {
    const interval = window.setInterval(() => setNowMs(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    setShowIntro(showBootIntro)
  }, [showBootIntro])

  const relationshipClock = useMemo(() => buildRelationshipClock(loveData, nowMs), [loveData, nowMs])
  const progressPercent = Math.min(95, Math.max(8, Math.round((relationshipClock.totalDays % 1000) / 10)))
  const starring = loveData.classicTitle || loveData.nomePessoa || 'quem você ama'
  const description = loveData.comoConheceram?.trim() || 'o destino juntou vocês'
  const romanticLine =
    loveData.oQueMaisAmo?.trim() ||
    description ||
    `Em cada capítulo, ${starring} faz seu coração bater mais forte e transforma cada detalhe em lembrança inesquecível.`
  const clientDescription = description

  const coverImage =
    loveData.fotoCasalDataUrl ||
    loveData.momentHighlights[0]?.imageDataUrl ||
    loveData.storiesImagesDataUrls[0] ||
    netflixAssets.top10Bg

  const episodeImages = useMemo(() => {
    const base = loveData.storiesImagesDataUrls.filter(Boolean).slice(0, 10)
    if (!base.length) {
      return Array.from({ length: 10 }, () => coverImage)
    }
    return Array.from({ length: 10 }, (_, index) => base[index] || coverImage)
  }, [coverImage, loveData.storiesImagesDataUrls])

  const episodes = useMemo(
    () =>
      netflixMoments.map((fallbackTitle, index) => {
        const highlight = loveData.momentHighlights[index]
        return {
          id: index + 1,
          title: fallbackTitle,
          image: episodeImages[index] || highlight?.imageDataUrl || coverImage,
        }
      }),
    [coverImage, episodeImages, loveData.momentHighlights],
  )

  const activeEpisode = selectedEpisode !== null ? episodes[selectedEpisode] : null

  useEffect(() => {
    if (selectedEpisode === null) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedEpisode(null)
      }

      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
        return
      }

      const delta = event.key === 'ArrowRight' ? 1 : -1
      setSelectedEpisode((prev) => {
        if (prev === null) return 0
        return (prev + delta + episodes.length) % episodes.length
      })
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [episodes.length, selectedEpisode])

  if (showIntro) {
    return <NetflixBootIntro onDone={() => setShowIntro(false)} label="LOVELYFLIX" />
  }

  if (activeEpisode) {
    return (
      <div className="min-h-screen bg-black text-white">
        <section className="relative h-[100dvh] w-full overflow-hidden">
          <motion.img
            src={activeEpisode.image}
            alt={activeEpisode.title}
            className="absolute inset-0 h-full w-full object-cover"
            animate={{ scale: [1.02, 1.06, 1.02], y: [0, -8, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/10" />

          <div className="absolute left-4 top-18 z-20">
            <button
              type="button"
              onClick={() => setSelectedEpisode(null)}
              className="rounded-full border border-zinc-500 bg-black/60 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80"
            >
              ← Voltar
            </button>
          </div>

          <div className="absolute bottom-0 w-full p-5 md:p-8">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#E50914]">MOMENTO {activeEpisode.id}</p>
            <h3 className="mt-1 text-3xl font-black uppercase leading-none md:text-6xl">{activeEpisode.title}</h3>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-200 md:text-sm">
              <span className="rounded bg-green-700/90 px-1.5 py-0.5 font-bold">96% relevante</span>
              <span>
                {relationshipClock.years}a {relationshipClock.months}m {relationshipClock.days}d
              </span>
              <span className="rounded border border-zinc-300/50 px-1">HD</span>
            </div>
            <p className="mt-3 max-w-3xl text-sm text-zinc-100 md:text-base">{clientDescription}</p>
            <p className="mt-2 max-w-3xl text-xs italic text-rose-200 md:text-sm">{romanticLine}</p>
          </div>
        </section>
      </div>
    )
  }

  const seasonDescriptions = [
    'O início de tudo: primeiras mensagens, primeiros olhares e o capítulo que mudou a história.',
    'A fase em que o amor ficou mais forte: cumplicidade, rotina e novas memórias juntos.',
    'O futuro de vocês: sonhos compartilhados, promessas e tudo que ainda vão viver.',
  ]

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <section className="relative h-[100dvh] w-full overflow-hidden">
        <motion.img
          src={coverImage}
          alt="Casal"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: 'center center' }}
          animate={{ scale: [1.02, 1.06, 1.02], y: [0, -8, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

        <div className="absolute bottom-12 left-6 right-6 mx-auto max-w-6xl md:left-10 md:right-10">
          <p className="text-xs font-semibold tracking-[0.3em] text-[#E50914] [text-shadow:0_2px_10px_rgba(0,0,0,0.75)]">LOVELYFLIX ORIGINAL</p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-tight [text-shadow:0_6px_24px_rgba(0,0,0,0.78)] md:text-7xl">Uma História de Amor</h1>
          <p className="mt-3 max-w-xl text-zinc-200 [text-shadow:0_3px_14px_rgba(0,0,0,0.85)]">Estrelando {starring} | {description}</p>
          <div className="mt-4 grid max-w-md grid-cols-3 gap-2 text-xs sm:text-sm">
            <div className="rounded-lg bg-black/55 p-2 text-center"><p className="text-lg font-bold text-[#ff5f67]">{relationshipClock.years}</p><p className="text-zinc-400">anos</p></div>
            <div className="rounded-lg bg-black/55 p-2 text-center"><p className="text-lg font-bold text-[#ff5f67]">{relationshipClock.months}</p><p className="text-zinc-400">meses</p></div>
            <div className="rounded-lg bg-black/55 p-2 text-center"><p className="text-lg font-bold text-[#ff5f67]">{relationshipClock.days}</p><p className="text-zinc-400">dias</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <h2 className="mb-4 text-xl font-bold">Episódios de Destaque</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {episodes.map((episode, index) => (
            <motion.button
              whileHover={{ y: -5 }}
              type="button"
              onClick={() => setSelectedEpisode(index)}
              key={`${episode.title}-${index}`}
              className="group relative min-w-60 overflow-hidden rounded-lg border border-zinc-700 bg-[#1a1a1a] p-4 text-left transition hover:border-[#E50914] hover:shadow-[0_0_22px_rgba(229,9,20,0.45)]"
            >
              <img src={episode.image} alt={episode.title} className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-300 group-hover:opacity-72" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
              <span className="pointer-events-none absolute -left-2 -top-7 text-8xl font-black text-white/12">{index + 1}</span>
              <p className="relative z-10 mt-10 text-base font-semibold text-zinc-100">{episode.title}</p>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-2 md:px-10">
        <h2 className="mb-4 text-xl font-bold">Temporadas</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {['Temporada 1: O Comeco', 'Temporada 2: Crescendo Juntos', 'Temporada 3: Nosso Futuro'].map((season, seasonIndex) => (
            <motion.div
              key={season}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="rounded-lg border border-zinc-700 bg-[#191919] p-4 text-left transition hover:border-[#E50914]"
            >
              <p className="font-semibold">{season}</p>
              <p className="mt-2 text-xs text-zinc-300">{seasonDescriptions[seasonIndex]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <h2 className="mb-3 text-xl font-bold">Continuar Assistindo</h2>
        <div className="rounded-xl border border-zinc-700 bg-[#1a1a1a] p-4">
          <div className="mb-2 flex items-center justify-between text-sm text-zinc-300">
            <span>{starring || 'Nossa história'} - Episódio atual</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
            <div className="h-full rounded-full bg-[#E50914] transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="mt-2 text-xs text-zinc-400">
            Tempo real juntos: {relationshipClock.totalDays} dias, {String(relationshipClock.hours).padStart(2, '0')}:
            {String(relationshipClock.minutes).padStart(2, '0')}:{String(relationshipClock.seconds).padStart(2, '0')}
          </p>
        </div>
      </section>
    </div>
  )
}
