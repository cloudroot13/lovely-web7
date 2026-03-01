import { motion, useReducedMotion } from 'framer-motion'
import { memo, useEffect, useMemo, useState } from 'react'
import type { LoveData } from '../types/types'
import { buildSpotifyTrackEmbedUrl } from '../utils/spotify'
import '../styles/classic-gallery-animation.css'
import { ClassicBackgroundLayer, type BackgroundMode } from './classic-background/ClassicBackgroundLayer'

interface ClassicNormalProps {
  loveData: LoveData
}

type PhotoMode = 'coverflow' | 'cube' | 'cards' | 'flip'
const STORY_DURATION_MS = 9000
const STORY_DURATION_SECONDS = Math.ceil(STORY_DURATION_MS / 1000)

function buildClock(data: LoveData) {
  if (data.startDate) {
    const parsed = new Date(data.startDate.includes('T') ? data.startDate : `${data.startDate}T00:00:00`)
    if (!Number.isNaN(parsed.getTime())) {
      const total = Math.max(1, Math.floor((Date.now() - parsed.getTime()) / 1000))
      const years = Math.floor(total / (365 * 24 * 60 * 60))
      const afterYears = total % (365 * 24 * 60 * 60)
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
  }

  return {
    years: Math.max(0, data.anos),
    months: Math.max(0, data.meses),
    days: Math.max(0, data.dias),
    hours: 0,
    minutes: 0,
    seconds: 0,
  }
}


const InteractiveGallery = memo(function InteractiveGallery({ images, mode }: { images: string[]; mode: PhotoMode }) {
  const [active, setActive] = useState(0)
  const [order, setOrder] = useState<number[]>(() => images.map((_, idx) => idx))

  const safeImages = images.slice(0, 8)
  const activeImage = safeImages[active] ?? safeImages[0]

  if (!safeImages.length) {
    return <div className="flex h-58 items-center justify-center rounded-2xl border border-dashed border-white/20 text-zinc-400">Sem fotos</div>
  }

  if (mode === 'cube') {
    return (
      <div className="grid h-58 grid-cols-2 gap-2">
        {safeImages.slice(0, 4).map((image, idx) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(idx)}
            className={`overflow-hidden rounded-xl border ${active === idx ? 'border-pink-300' : 'border-white/10'}`}
          >
            <img src={image} alt={`Foto ${idx + 1}`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    )
  }

  if (mode === 'flip') {
    return (
      <div className="grid h-58 grid-cols-4 gap-2">
        {safeImages.slice(0, 8).map((image, idx) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(idx)}
            className={`overflow-hidden rounded-lg border ${active === idx ? 'border-pink-300' : 'border-white/10'}`}
            style={{ animation: `classicFlipFloat ${2.8 + (idx % 4) * 0.5}s ease-in-out ${idx * 0.09}s infinite` }}
          >
            <img src={image} alt={`Foto ${idx + 1}`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    )
  }

  if (mode === 'cards') {
    const displayOrder = order.slice(0, Math.min(5, safeImages.length))

    const bringToFront = (imageIndex: number) => {
      setOrder((prev) => {
        const next = prev.filter((idx) => idx !== imageIndex)
        next.push(imageIndex)
        return next
      })
      setActive(imageIndex)
    }

    return (
      <div className="relative h-58">
        {displayOrder.map((imageIndex, idx) => {
          const image = safeImages[imageIndex]
          const depth = displayOrder.length - 1 - idx
          return (
            <button
              key={`${image}-${imageIndex}`}
              type="button"
              onClick={() => bringToFront(imageIndex)}
              className="absolute left-1/2 top-1/2 h-48 w-34 overflow-hidden rounded-xl border border-white/25 shadow-2xl transition-transform duration-300 hover:scale-[1.03]"
              style={{
                transform: `translate(-50%, -50%) rotate(${(idx - 2) * 6}deg) translateX(${(idx - 2) * 26}px)`,
                zIndex: 20 + idx,
                opacity: 1 - depth * 0.08,
              }}
            >
              <img src={image} alt={`Foto ${imageIndex + 1}`} className="h-full w-full object-cover" loading="lazy" decoding="async" />
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative h-50 overflow-hidden rounded-2xl border border-white/20 bg-black/40">
        <img src={activeImage} alt="Foto principal" className="h-full w-full object-cover" loading="lazy" decoding="async" />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {safeImages.slice(0, 5).map((image, idx) => (
          <button
            key={image}
            type="button"
            onClick={() => setActive(idx)}
            className={`overflow-hidden rounded-lg border transition ${active === idx ? 'border-pink-300' : 'border-white/10'}`}
          >
            <img src={image} alt={`Miniatura ${idx + 1}`} className="h-14 w-full object-cover" loading="lazy" decoding="async" />
          </button>
        ))}
      </div>
    </div>
  )
})

export function ClassicNormal({ loveData }: ClassicNormalProps) {
  const prefersReducedMotion = useReducedMotion()
  const clock = buildClock(loveData)

  const title = loveData.classicTitle?.trim() || `${loveData.nomePessoa || 'Seu amor'} & Você`
  const message = loveData.classicMessage?.trim() || `${loveData.apelido || loveData.nomePessoa || 'Você'}, nossa história segue ficando mais linda a cada dia.`
  const backgroundMode = (loveData.classicBackgroundAnimation || 'none') as BackgroundMode
  const photoMode = (loveData.classicPhotoDisplay || 'coverflow') as PhotoMode
  const images = [loveData.fotoCasalDataUrl, ...loveData.storiesImagesDataUrls].filter(Boolean).slice(0, 6)
  const embedUrl = buildSpotifyTrackEmbedUrl(loveData.musicaSpotifyUrl)

  const memories = useMemo(
    () =>
      [...loveData.momentHighlights]
        .filter((item) => item.date && item.imageDataUrl)
        .map((item, index) => ({
          id: item.id ?? `legacy-${index}`,
          date: item.date ?? '',
          title: item.title?.trim() || item.text || 'Memória',
          message: item.message?.trim() || item.text || '',
          imageDataUrl: item.imageDataUrl,
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
    [loveData.momentHighlights],
  )
  const [memoriesOpen, setMemoriesOpen] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [storyOpen, setStoryOpen] = useState(false)
  const [storyItems, setStoryItems] = useState<typeof memories>([])
  const [storyIndex, setStoryIndex] = useState(0)
  const [lastCalendarDate, setLastCalendarDate] = useState('')
  const [storySecondsLeft, setStorySecondsLeft] = useState(STORY_DURATION_SECONDS)

  const memoryMap = useMemo(() => {
    const map = new Map<string, typeof memories>()
    for (const memory of memories) {
      const list = map.get(memory.date) ?? []
      list.push(memory)
      map.set(memory.date, list)
    }
    return map
  }, [memories])

  const activeStory = storyItems[storyIndex] ?? null

  useEffect(() => {
    if (!storyOpen || !activeStory) return
    const reset = window.setTimeout(() => setStorySecondsLeft(STORY_DURATION_SECONDS), 0)
    return () => window.clearTimeout(reset)
  }, [storyOpen, storyIndex, activeStory])

  useEffect(() => {
    if (!storyOpen || !activeStory || prefersReducedMotion) return
    const timer = window.setTimeout(() => {
      if (storyIndex < storyItems.length - 1) {
        setStoryIndex((prev) => prev + 1)
      } else {
        setStoryOpen(false)
      }
    }, STORY_DURATION_MS)
    return () => window.clearTimeout(timer)
  }, [storyOpen, storyItems.length, storyIndex, activeStory, prefersReducedMotion])

  useEffect(() => {
    if (!storyOpen || !activeStory || prefersReducedMotion) return
    const interval = window.setInterval(() => {
      setStorySecondsLeft((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => window.clearInterval(interval)
  }, [storyOpen, storyIndex, activeStory, prefersReducedMotion])

  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1)
  const gridStart = new Date(monthStart)
  gridStart.setDate(1 - monthStart.getDay())
  const calendarDays = Array.from({ length: 42 }).map((_, idx) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + idx)
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    return {
      iso,
      day: date.getDate(),
      inMonth: date.getMonth() === calendarMonth.getMonth(),
      count: memoryMap.get(iso)?.length ?? 0,
    }
  })

  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-12 md:px-8">
      <ClassicBackgroundLayer mode={backgroundMode} />
      <div className="absolute inset-0 z-[3] bg-gradient-to-b from-black/55 via-black/45 to-black/70" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <h1 className="font-serif text-4xl font-semibold text-zinc-100 md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-left text-base leading-relaxed text-zinc-200 md:text-lg">{message}</p>

        <div className="mt-8 w-full max-w-3xl">
          <InteractiveGallery images={images} mode={photoMode} />
          {photoMode === 'cards' && images.length > 1 && <p className="mt-2 text-xs text-zinc-400">Clique na foto de trás para trazê-la para frente.</p>}
        </div>

        <div className="mt-8 w-full max-w-3xl rounded-2xl border border-pink-500/30 bg-black/45 p-4 backdrop-blur-sm">
          {loveData.classicCounterStyle === 'classic' ? (
            <p className="text-2xl font-semibold text-pink-200">{clock.years} anos, {clock.months} meses e {clock.days} dias juntos</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl bg-black/60 p-2"><p className="text-xl font-bold text-pink-200">{clock.years}</p><p className="text-zinc-400">anos</p></div>
              <div className="rounded-xl bg-black/60 p-2"><p className="text-xl font-bold text-pink-200">{clock.months}</p><p className="text-zinc-400">meses</p></div>
              <div className="rounded-xl bg-black/60 p-2"><p className="text-xl font-bold text-pink-200">{clock.days}</p><p className="text-zinc-400">dias</p></div>
              <div className="rounded-xl bg-black/60 p-2"><p className="text-xl font-bold text-pink-200">{clock.hours}</p><p className="text-zinc-400">horas</p></div>
              <div className="rounded-xl bg-black/60 p-2"><p className="text-xl font-bold text-pink-200">{clock.minutes}</p><p className="text-zinc-400">min</p></div>
              <div className="rounded-xl bg-black/60 p-2"><p className="text-xl font-bold text-pink-200">{clock.seconds}</p><p className="text-zinc-400">seg</p></div>
            </div>
          )}
        </div>

        {embedUrl && (
          <div className="mt-7 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#121212]">
            <iframe
              src={`${embedUrl}?theme=0`}
              className="block w-full border-0 align-top"
              height="152"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        )}

        {memories.length > 0 && (
          <button
            type="button"
            onClick={() => setMemoriesOpen(true)}
            className="mt-7 rounded-full bg-gradient-to-r from-[#ff4e8d] to-[#ff6a5a] px-7 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,90,150,0.5)]"
          >
            ✨ Ver memórias
          </button>
        )}
      </div>

      {memoriesOpen && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-2 backdrop-blur-sm sm:p-4"
        >
          <motion.div
            initial={prefersReducedMotion ? false : { y: 12, opacity: 0, scale: 0.98 }}
            animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.22 }}
            className="relative max-h-[94dvh] w-full max-w-2xl overflow-auto rounded-2xl border border-zinc-700 bg-[#0d0f15] p-3 md:p-6"
          >
            {loveData.classicMemoriesBannerDataUrl && (
              <img src={loveData.classicMemoriesBannerDataUrl} alt="" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" />
            )}
            <div className="pointer-events-none absolute inset-0 bg-black/40" />
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-zinc-100">{loveData.classicMemoriesTitle?.trim() || 'Memórias'}</h3>
                <button type="button" onClick={() => setMemoriesOpen(false)} className="rounded-md bg-zinc-800 px-3 py-1 text-sm">Fechar</button>
              </div>

              <div className="mt-4 rounded-xl border border-zinc-700 bg-[#131722] p-2 sm:p-3">
                <div className="mb-3 flex items-center justify-between">
                  <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="rounded bg-zinc-800 px-2 py-1 text-xs">{'<'}</button>
                  <p className="text-sm font-semibold text-zinc-100">
                    {calendarMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                  <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="rounded bg-zinc-800 px-2 py-1 text-xs">{'>'}</button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-zinc-400">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((name) => (
                    <div key={name}>{name}</div>
                  ))}
                </div>

                <div className="mt-1 grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => {
                    const hasMemory = day.count > 0
                    return (
                      <button
                        key={day.iso}
                        type="button"
                        onClick={() => {
                          const dayMemories = memoryMap.get(day.iso) ?? []
                          if (!dayMemories.length) return
                          setMemoriesOpen(false)
                          setLastCalendarDate(day.iso)
                          setStoryItems(dayMemories)
                          setStoryIndex(0)
                          setStoryOpen(true)
                        }}
                        className={`relative min-h-12 overflow-hidden rounded-md px-1 py-2 text-xs sm:min-h-14 ${day.inMonth ? 'text-zinc-100' : 'text-zinc-500'} ${hasMemory ? 'bg-pink-500/20' : 'bg-zinc-900/55'}`}
                      >
                        {hasMemory && (
                          <img
                            src={memoryMap.get(day.iso)?.[0]?.imageDataUrl}
                            alt=""
                            aria-hidden
                            className="absolute inset-0 h-full w-full object-cover opacity-35"
                          />
                        )}
                        <span className="relative z-10">{day.day}</span>
                        {hasMemory && <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-pink-300" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {storyOpen && activeStory && (
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/90 p-2 sm:p-4"
          onClick={() => setStoryOpen(false)}
        >
          <motion.div
            initial={prefersReducedMotion ? false : { scale: 0.96, opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="relative mx-auto flex h-[94dvh] w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-black sm:h-[85vh]"
            onClick={(event) => event.stopPropagation()}
          >
            <motion.img
              key={`${activeStory.id}-image`}
              src={activeStory.imageDataUrl}
              alt={activeStory.title}
              className="absolute inset-0 h-full w-full object-cover"
              initial={prefersReducedMotion ? false : { scale: 1.22, rotate: -2, opacity: 0.2, filter: 'blur(12px)' }}
              animate={prefersReducedMotion ? undefined : { scale: 1, rotate: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/75" />
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(255,120,180,0.28),transparent_56%)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.35, 0.15] }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              />
            )}

            <div className="absolute left-3 right-3 top-3 z-20 flex gap-1">
              {storyItems.map((item, index) => (
                <span key={item.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/30">
                  {index < storyIndex && <span className="block h-full w-full rounded-full bg-white/90" />}
                  {index === storyIndex && (
                    <motion.span
                      key={`${item.id}-${storyIndex}`}
                      className="block h-full rounded-full bg-white/90"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={prefersReducedMotion ? { duration: 0 } : { duration: STORY_DURATION_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </span>
              ))}
            </div>

            <div className="absolute left-3 right-3 top-6 z-30 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setStoryOpen(false)
                  setMemoriesOpen(true)
                  if (lastCalendarDate) {
                    const parsed = new Date(`${lastCalendarDate}T00:00:00`)
                    if (!Number.isNaN(parsed.getTime())) {
                      setCalendarMonth(new Date(parsed.getFullYear(), parsed.getMonth(), 1))
                    }
                  }
                }}
                className="rounded-full bg-black/45 px-3 py-1 text-xs text-white"
              >
                Calendário
              </button>
              <button
                type="button"
                onClick={() => setStoryOpen(false)}
                className="rounded-full bg-black/45 px-3 py-1 text-xs text-white"
              >
                Fechar
              </button>
            </div>

            {!prefersReducedMotion && (
              <div className="absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-zinc-100">
                {storySecondsLeft}s
              </div>
            )}

            <motion.div
              key={`${activeStory.id}-content`}
              className="absolute bottom-0 z-20 w-full p-3 text-white sm:p-4"
              initial={prefersReducedMotion ? false : { y: 56, opacity: 0 }}
              animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
            >
              <motion.p
                className="text-xs uppercase tracking-[0.16em] text-pink-200"
                initial={prefersReducedMotion ? false : { y: 14, opacity: 0 }}
                animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut', delay: 0.08 }}
              >
                {new Date(`${activeStory.date}T00:00:00`).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </motion.p>
              <motion.h4
                className="mt-1 text-xl font-semibold sm:text-2xl"
                initial={prefersReducedMotion ? false : { y: 28, scale: 0.9, opacity: 0, letterSpacing: '0.16em' }}
                animate={prefersReducedMotion ? undefined : { y: 0, scale: 1, opacity: 1, letterSpacing: '0em' }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
              >
                {activeStory.title}
              </motion.h4>
              {activeStory.message && (
                <motion.p
                  className="mt-2 text-sm leading-relaxed text-zinc-100 sm:text-base"
                  initial={prefersReducedMotion ? false : { y: 24, opacity: 0 }}
                  animate={prefersReducedMotion ? undefined : { y: 0, opacity: 1 }}
                  transition={{ duration: 0.65, ease: 'easeOut', delay: 0.28 }}
                >
                  {activeStory.message}
                </motion.p>
              )}
            </motion.div>

            <button
              type="button"
              onClick={() => setStoryIndex((prev) => (prev - 1 + storyItems.length) % storyItems.length)}
              className="absolute bottom-24 left-0 top-16 z-10 w-1/2"
              aria-label="Memória anterior"
            />
            <button
              type="button"
              onClick={() => setStoryIndex((prev) => (prev + 1) % storyItems.length)}
              className="absolute bottom-24 right-0 top-16 z-10 w-1/2"
              aria-label="Próxima memória"
            />
          </motion.div>
        </motion.div>
      )}

      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="fixed bottom-6 right-6 rounded-full bg-pink-500 px-5 py-3 text-2xl shadow-[0_0_30px_rgba(255,47,122,0.6)]"
        aria-label="Coração"
      >
        ❤
      </motion.button>
    </section>
  )
}
