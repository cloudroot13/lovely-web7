import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/appStore'
import { classicNormalThemes, netflixAssets, spotifyAssets, wrappedStoriesThemes } from '../assets/themes/themeAssets'
import type { ClassicVariant, Mode, WrappedVariant } from '../types/types'
import wrappedLovelyflixVideo from '../assets/lovelyflix/lovelyflix.mp4'
import wrappedLovelyfyVideo from '../assets/lovelyfy/lovelyfy.mp4'
import wrappedJornadaVideo from '../assets/jornada/jornada.mp4'
import wrappedGameVideo from '../assets/game/game.mp4'
import classicNormalVideo from '../assets/classico-normal/classico-normal.mp4'
import classicLovelyflixVideo from '../assets/classico-lovelyflix/classico-lovelyflix.mp4'

type VariantOption = {
  id: string
  label: string
  value: ClassicVariant | WrappedVariant
  themeLocked: boolean
  preview: string
  previewVideo: string
  caption: string
}

const variantsByMode: Record<Mode, VariantOption[]> = {
  classic: [
    {
      id: 'classic-normal',
      label: 'Clássica Normal',
      value: 'normal',
      themeLocked: true,
      preview: classicNormalThemes['Romantic Pink'].bg,
      previewVideo: classicNormalVideo,
      caption: 'Romântica e delicada',
    },
    {
      id: 'classic-lovelyflix',
      label: 'Clássica Lovelyflix',
      value: 'netflix',
      themeLocked: true,
      preview: netflixAssets.top10Bg,
      previewVideo: classicLovelyflixVideo,
      caption: 'Cinematográfica',
    },
  ],
  wrapped: [
    {
      id: 'wrapped-lovelyflix',
      label: 'Lovelyflix',
      value: 'stories',
      themeLocked: true,
      preview: wrappedStoriesThemes['Dark Abstract'].bg,
      previewVideo: wrappedLovelyflixVideo,
      caption: 'Stories com vibe Netflix',
    },
    {
      id: 'wrapped-lovelyfy',
      label: 'Wrapped Lovelyfy',
      value: 'spotify',
      themeLocked: true,
      preview: spotifyAssets.bg,
      previewVideo: wrappedLovelyfyVideo,
      caption: 'Player musical premium',
    },
    {
      id: 'wrapped-jornada',
      label: 'Jornada',
      value: 'jornada',
      themeLocked: true,
      preview: wrappedStoriesThemes['Pink Gradient'].bg,
      previewVideo: wrappedJornadaVideo,
      caption: 'Story poético',
    },
    {
      id: 'wrapped-game',
      label: 'Game',
      value: 'game',
      themeLocked: true,
      preview: classicNormalThemes['Dark Love'].bg,
      previewVideo: wrappedGameVideo,
      caption: 'Interativo e divertido',
    },
  ],
}

export default function ChooseMode() {
  const navigate = useNavigate()
  const { setConfig } = useAppContext()
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null)
  const [homeTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    return window.localStorage.getItem('lovely-home-theme') === 'light' ? 'light' : 'dark'
  })
  const [hoveredVariantId, setHoveredVariantId] = useState<string | null>(null)
  const [tappedVariantId, setTappedVariantId] = useState<string | null>(null)
  const [isPageVisible, setIsPageVisible] = useState(() => (typeof document === 'undefined' ? true : document.visibilityState === 'visible'))
  const [isDataSaver, setIsDataSaver] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [inViewVariantIds, setInViewVariantIds] = useState<Set<string>>(new Set())
  const variantsContainerRef = useRef<HTMLDivElement | null>(null)
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
  const isDark = homeTheme === 'dark'

  const chooseVariant = (variant: ClassicVariant | WrappedVariant, themeLocked: boolean) => {
    if (!selectedMode) {
      return
    }

    if (selectedMode === 'wrapped' && variant === 'stories') {
      setConfig({ mode: selectedMode, variant, theme: 'Lovelyflix Signature' })
      navigate('/builder')
      return
    }

    const fixedTheme =
      variant === 'netflix'
        ? 'Lovelyflix Signature'
        : variant === 'spotify'
          ? 'Lovelyfy Signature'
          : variant === 'jornada'
            ? 'Jornada Signature'
            : variant === 'game'
              ? 'Game Signature'
              : undefined

    setConfig({ mode: selectedMode, variant, ...(fixedTheme ? { theme: fixedTheme } : {}) })
    navigate(themeLocked ? '/builder' : '/theme')
  }

  useEffect(() => {
    if (typeof document === 'undefined') return
    const onVisibilityChange = () => setIsPageVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => document.removeEventListener('visibilitychange', onVisibilityChange)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(hover: none), (pointer: coarse)')
    const apply = () => setIsTouchDevice(media.matches || navigator.maxTouchPoints > 0)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    type NavigatorConnection = {
      saveData?: boolean
      effectiveType?: string
      addEventListener?: (type: 'change', listener: () => void) => void
      removeEventListener?: (type: 'change', listener: () => void) => void
    }
    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection
    if (!connection) return

    const apply = () => {
      const slowNetwork = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
      setIsDataSaver(Boolean(connection.saveData || slowNetwork))
    }

    apply()
    connection.addEventListener?.('change', apply)
    return () => connection.removeEventListener?.('change', apply)
  }, [])

  useEffect(() => {
    setHoveredVariantId(null)
    setTappedVariantId(null)
    const container = variantsContainerRef.current
    if (!container || !selectedMode) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setInViewVariantIds((prev) => {
          const next = new Set(prev)
          entries.forEach((entry) => {
            const id = (entry.target as HTMLElement).dataset.variantId
            if (!id) return
            if (entry.isIntersecting) {
              next.add(id)
            } else {
              next.delete(id)
            }
          })
          return next
        })
      },
      { threshold: 0.5 },
    )

    container.querySelectorAll<HTMLElement>('[data-variant-id]').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [selectedMode])

  const pointerPreviewId = hoveredVariantId && inViewVariantIds.has(hoveredVariantId) ? hoveredVariantId : null
  const touchPreviewId = tappedVariantId && inViewVariantIds.has(tappedVariantId) ? tappedVariantId : null
  const activePreviewId = !isDataSaver && isPageVisible ? (isTouchDevice ? touchPreviewId : pointerPreviewId) : null

  useEffect(() => {
    if (!selectedMode) return
    const variants = variantsByMode[selectedMode]

    variants.forEach(({ id }) => {
      const video = videoRefs.current[id]
      if (!video) return
      const shouldPlay = Boolean(activePreviewId === id && inViewVariantIds.has(id) && !isDataSaver && isPageVisible)

      if (shouldPlay) {
        const playPromise = video.play()
        playPromise?.catch(() => undefined)
        return
      }

      video.pause()
      video.currentTime = 0
    })
  }, [activePreviewId, inViewVariantIds, isDataSaver, isPageVisible, selectedMode])

  const handleVariantCardClick = (
    event: MouseEvent<HTMLButtonElement>,
    item: VariantOption,
  ) => {
    if (isTouchDevice && tappedVariantId !== item.id) {
      event.preventDefault()
      setTappedVariantId(item.id)
      return
    }
    chooseVariant(item.value, item.themeLocked)
  }

  return (
    <main className={`min-h-[100dvh] px-4 py-8 sm:px-5 sm:py-10 md:px-8 ${isDark ? 'bg-[#0f0f0f] text-[#f5f5f5]' : 'bg-[#f7f3fa] text-[#1f1420]'}`}>
      <div className="mx-auto max-w-5xl">
        <h1 id="choose-mode-title" className="text-center text-3xl font-bold md:text-5xl">
          Escolha o seu formato
        </h1>
        <p className={`mt-3 text-center ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>Página Clássica ou Wrapped e depois a variação visual.</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2" role="group" aria-labelledby="choose-mode-title">
          <button
            type="button"
            onClick={() => setSelectedMode('classic')}
            aria-pressed={selectedMode === 'classic'}
            className={`rounded-2xl border p-6 text-left transition ${
              selectedMode === 'classic'
                ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_30px_rgba(255,47,122,0.4)]'
                : isDark
                  ? 'border-zinc-700 bg-zinc-900 hover:border-pink-400/50'
                  : 'border-zinc-300 bg-white hover:border-pink-400/50'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-pink-300">Modo 1</p>
            <h2 className="mt-2 text-2xl font-bold">Página Clássica</h2>
            <p className={`mt-2 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>Visual romântico premium e versão cinematográfica Lovelyflix.</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode('wrapped')}
            aria-pressed={selectedMode === 'wrapped'}
            className={`rounded-2xl border p-6 text-left transition ${
              selectedMode === 'wrapped'
                ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_30px_rgba(255,47,122,0.4)]'
                : isDark
                  ? 'border-zinc-700 bg-zinc-900 hover:border-pink-400/50'
                  : 'border-zinc-300 bg-white hover:border-pink-400/50'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-pink-300">Modo 2</p>
            <h2 className="mt-2 text-2xl font-bold">Wrapped</h2>
            <p className={`mt-2 ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>Stories interativo ou player Lovelyfy com retrospectiva.</p>
          </button>
        </div>

        {selectedMode && (
          <div className={`mt-10 rounded-2xl border p-5 ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-zinc-300 bg-white'}`}>
            <h3 className="text-lg font-semibold">Escolha a variação</h3>
            <p className={`mt-1 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>Toque em um modelo de celular para continuar.</p>
            {isDataSaver && (
              <p className={`mt-2 text-xs ${isDark ? 'text-zinc-500' : 'text-zinc-600'}`}>Economia de dados ativa: previews em vídeo foram desativados.</p>
            )}
            <div ref={variantsContainerRef} className="mt-5 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3">
              {variantsByMode[selectedMode].map((item) => (
                <button
                  key={item.value}
                  data-variant-id={item.id}
                  type="button"
                  onClick={(event) => handleVariantCardClick(event, item)}
                  onMouseEnter={() => setHoveredVariantId(item.id)}
                  onMouseLeave={() => setHoveredVariantId((prev) => (prev === item.id ? null : prev))}
                  className={`group rounded-2xl border p-3 text-left transition hover:border-pink-500 hover:shadow-[0_0_22px_rgba(255,47,122,0.45)] ${isDark ? 'border-zinc-700 bg-[#151515]' : 'border-zinc-300 bg-[#fff8fd]'}`}
                >
                  <div className={`mx-auto w-full max-w-[170px] rounded-[2rem] border p-[6px] shadow-xl sm:max-w-[190px] ${isDark ? 'border-zinc-700 bg-[#090909]' : 'border-zinc-300 bg-[#0f0f0f]'}`}>
                    <div className="relative aspect-[9/19] overflow-hidden rounded-[1.6rem] bg-black">
                      <video
                        ref={(el) => {
                          videoRefs.current[item.id] = el
                        }}
                        src={item.previewVideo}
                        className="absolute inset-0 h-full w-full object-cover"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/78" />
                      <div className="absolute left-1/2 top-2 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/70" />
                      <div className="absolute inset-x-3 bottom-3">
                        <p className="text-sm font-bold leading-tight text-white">{item.label}</p>
                        <p className="mt-1 text-[11px] leading-tight text-zinc-200">{item.caption}</p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
