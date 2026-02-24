import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/appStore'
import { buildSpotifyTrackEmbedUrl } from '../utils/spotify'
import { readFileAsDataUrl } from '../utils/file'
import { readImageFileAsDataUrl } from '../utils/image'
import '../styles/classic-hearts-animation.css'
import '../styles/classic-cloud-animation.css'
import '../styles/classic-stars-meteors-animation.css'
import '../styles/classic-gallery-animation.css'

const steps = [
  { id: 'title', label: 'Titulo da pagina' },
  { id: 'message', label: 'Mensagem' },
  { id: 'counter', label: 'Contador' },
  { id: 'photos', label: 'Fotos' },
  { id: 'music', label: 'Iframe de musica' },
  { id: 'memories', label: 'Memórias' },
  { id: 'background', label: 'Animacao de fundo' },
] as const

type BackgroundMode = 'none' | 'hearts' | 'stars_meteors' | 'clouds'
type PhotoMode = 'coverflow' | 'cube' | 'cards' | 'flip'
const CLASSIC_MAX_TOTAL_PHOTOS = 6
const CLASSIC_MAX_EXTRA_PHOTOS = 5
const CLASSIC_MAX_MEMORIES = 8

type StepId = (typeof steps)[number]['id']

function seeded(index: number, multiplier: number, offset = 0) {
  const raw = Math.sin((index + 1) * multiplier + offset) * 10000
  return raw - Math.floor(raw)
}

function buildClock(startDate: string, yearsFallback: number, monthsFallback: number, daysFallback: number) {
  if (startDate) {
    const parsed = new Date(startDate.includes('T') ? startDate : `${startDate}T00:00:00`)
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
    years: Math.max(0, yearsFallback),
    months: Math.max(0, monthsFallback),
    days: Math.max(0, daysFallback),
    hours: 0,
    minutes: 0,
    seconds: 0,
  }
}

function BackgroundLayer({ mode }: { mode: BackgroundMode }) {
  if (mode === 'none') {
    return <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#09090b] via-[#0a0a0d] to-[#060609]" />
  }

  if (mode === 'hearts') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-gradient-to-b from-[#170d14] via-[#0f0d12] to-[#07070a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,70,152,0.22),transparent_40%),radial-gradient(circle_at_75%_72%,rgba(255,70,152,0.16),transparent_44%)]" />
        {Array.from({ length: 30 }).map((_, idx) => (
          <span
            key={idx}
            className="absolute text-pink-300/70"
            style={{
              left: `${(idx * 7.4) % 100}%`,
              bottom: '-12%',
              fontSize: `${10 + (idx % 4) * 6}px`,
              animation: `classicHeartRise ${4 + (idx % 5) * 0.6}s ease-in-out ${idx * 0.08}s infinite`,
            }}
          >
            ❤
          </span>
        ))}
      </div>
    )
  }

  if (mode === 'clouds') {
    const cloudLayers = [
      { key: 'back', className: 'classic-cloud-layer-back', count: 6, minTop: 12, maxTop: 42, minWidth: 190, maxWidth: 320, minOpacity: 0.24, maxOpacity: 0.4, minDuration: 82, maxDuration: 96 },
      { key: 'mid', className: 'classic-cloud-layer-mid', count: 7, minTop: 26, maxTop: 68, minWidth: 150, maxWidth: 265, minOpacity: 0.32, maxOpacity: 0.5, minDuration: 56, maxDuration: 74 },
      { key: 'front', className: 'classic-cloud-layer-front', count: 8, minTop: 44, maxTop: 88, minWidth: 120, maxWidth: 220, minOpacity: 0.4, maxOpacity: 0.58, minDuration: 34, maxDuration: 52 },
    ] as const

    return (
      <div className="classic-cloud-scene pointer-events-none absolute inset-0">
        {cloudLayers.map((layer, layerIdx) => (
          <div key={layer.key} className={`classic-cloud-layer ${layer.className}`}>
            {Array.from({ length: layer.count }).map((_, idx) => {
              const seedIndex = layerIdx * 40 + idx
              const top = layer.minTop + seeded(seedIndex, 7.1, 0.6) * (layer.maxTop - layer.minTop)
              const width = layer.minWidth + seeded(seedIndex, 5.3, 1.3) * (layer.maxWidth - layer.minWidth)
              const opacity = layer.minOpacity + seeded(seedIndex, 8.6, 0.3) * (layer.maxOpacity - layer.minOpacity)
              const driftDuration = layer.minDuration + seeded(seedIndex, 6.7, 0.2) * (layer.maxDuration - layer.minDuration)
              const bobDuration = 8 + seeded(seedIndex, 2.8, 1.2) * 7
              const delay = -seeded(seedIndex, 4.4, 0.1) * driftDuration

              return (
                <div
                  key={`${layer.key}-${idx}`}
                  className="classic-cloud-item"
                  style={{
                    top: `${top}%`,
                    width: `${width}px`,
                    opacity,
                    animationDuration: `${driftDuration}s`,
                    animationDelay: `${delay}s`,
                  }}
                >
                  <div className="classic-cloud-body" style={{ animation: `classic-cloud-float ${bobDuration}s ease-in-out ${delay * 0.4}s infinite` }}>
                    <span className="classic-cloud-puff classic-cloud-puff-a" />
                    <span className="classic-cloud-puff classic-cloud-puff-b" />
                    <span className="classic-cloud-puff classic-cloud-puff-c" />
                    <span className="classic-cloud-puff classic-cloud-puff-d" />
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="classic-star-scene pointer-events-none absolute inset-0">
      <div className="classic-star-haze" />
      {Array.from({ length: 240 }).map((_, idx) => {
        const x = seeded(idx, 37.91, 0.33) * 100
        const y = seeded(idx, 19.73, 0.92) * 100
        const size = 1 + Math.floor(seeded(idx, 12.77, 0.41) * 3)
        const opacity = 0.18 + seeded(idx, 8.27, 0.14) * 0.72
        const twinkleDuration = 2.2 + seeded(idx, 6.13, 0.25) * 3.8
        const twinkleDelay = seeded(idx, 9.27, 0.73) * 3.2
        const shouldTwinkle = idx % 3 !== 0

        return (
          <span
            key={`star-${idx}`}
            className={`classic-star-dot ${shouldTwinkle ? 'classic-star-dot-twinkle' : ''}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              animationDuration: shouldTwinkle ? `${twinkleDuration}s` : undefined,
              animationDelay: shouldTwinkle ? `${twinkleDelay}s` : undefined,
            }}
          />
        )
      })}
      {Array.from({ length: 10 }).map((_, idx) => {
        const startX = -8 + seeded(idx, 3.83, 0.2) * 128
        const endX = startX - (10 + seeded(idx, 4.61, 0.4) * 26)

        return (
        <span
          key={`meteor-${idx}`}
          className="classic-star-meteor"
          style={{
            ['--start-x' as string]: `${startX}%`,
            ['--start-y' as string]: `${-28 + seeded(idx, 5.27, 0.8) * 20}%`,
            ['--end-x' as string]: `${endX}%`,
            ['--end-y' as string]: `${102 + seeded(idx, 7.11, 0.3) * 24}%`,
            ['--trail' as string]: `${84 + seeded(idx, 2.37, 0.7) * 48}px`,
            ['--angle' as string]: `${108 + seeded(idx, 8.3, 0.2) * 12}deg`,
            ['--duration' as string]: `${5.4 + seeded(idx, 2.17, 0.9) * 3.6}s`,
            ['--delay' as string]: `${idx * 0.44 + seeded(idx, 1.71, 0.6) * 1.8}s`,
          }}
        />
        )
      })}
    </div>
  )
}

function PhotoPreview({ images, mode }: { images: string[]; mode: PhotoMode }) {
  if (!images.length) {
    return <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-white/20 text-zinc-400">Suas fotos aparecem aqui</div>
  }

  if (mode === 'cube') {
    return (
      <div className="grid h-44 grid-cols-2 gap-2">
        {images.slice(0, 4).map((image, idx) => (
          <img key={image} src={image} alt={`Foto ${idx + 1}`} className="h-full w-full rounded-xl border border-white/10 object-cover" />
        ))}
      </div>
    )
  }

  if (mode === 'cards') {
    return (
      <div className="relative h-44">
        {images.slice(0, 4).map((image, idx) => (
          <img
            key={image}
            src={image}
            alt={`Foto ${idx + 1}`}
            className="absolute left-1/2 top-1/2 h-36 w-28 rounded-xl border border-white/20 object-cover shadow-xl"
            style={{
              transform: `translate(-50%, -50%) rotate(${(idx - 1.5) * 7}deg) translateX(${(idx - 1.5) * 26}px)`,
              zIndex: 10 + idx,
            }}
          />
        ))}
      </div>
    )
  }

  if (mode === 'flip') {
    return (
      <div className="grid h-44 grid-cols-3 gap-2">
        {images.slice(0, 6).map((image, idx) => (
          <img
            key={image}
            src={image}
            alt={`Foto ${idx + 1}`}
            className="h-full w-full rounded-lg border border-white/15 object-cover"
            style={{ animation: `classicFlipFloat ${3 + (idx % 3)}s ease-in-out ${idx * 0.1}s infinite` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="relative h-44 overflow-hidden rounded-2xl">
      {images.slice(0, 5).map((image, idx) => (
        <img
          key={image}
          src={image}
          alt={`Foto ${idx + 1}`}
          className="absolute top-2 h-40 w-28 rounded-xl border border-white/20 object-cover shadow-lg"
          style={{ left: `${8 + idx * 17}%`, zIndex: 10 + idx, transform: `rotate(${(idx - 2) * 3}deg)` }}
        />
      ))}
    </div>
  )
}

export default function ClassicNormalBuilder() {
  const navigate = useNavigate()
  const { loveData, setLoveData } = useAppContext()
  const [stepIndex, setStepIndex] = useState(0)
  const [photoKeys, setPhotoKeys] = useState<string[]>([])
  const addOnePhotoInputRef = useRef<HTMLInputElement | null>(null)
  const [memoryDate, setMemoryDate] = useState('')
  const [memoryTitle, setMemoryTitle] = useState('')
  const [memoryMessage, setMemoryMessage] = useState('')
  const [memoryImageDataUrl, setMemoryImageDataUrl] = useState('')
  const [memoryImageName, setMemoryImageName] = useState('')
  const [memoryError, setMemoryError] = useState('')

  const clock = useMemo(() => buildClock(loveData.startDate, loveData.anos, loveData.meses, loveData.dias), [loveData.startDate, loveData.anos, loveData.meses, loveData.dias])

  const embedUrl = buildSpotifyTrackEmbedUrl(loveData.musicaSpotifyUrl)

  const next = () => {
    if (stepIndex >= steps.length - 1) {
      navigate('/preview')
      return
    }
    setStepIndex((prev) => prev + 1)
  }

  const prev = () => setStepIndex((prev) => Math.max(0, prev - 1))
  const current = steps[stepIndex].id as StepId

  const onMainPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const unsupportedMobileFormat =
      /(\.heic|\.heif)$/i.test(file.name) || file.type === 'image/heic' || file.type === 'image/heif'
    if (unsupportedMobileFormat) {
      setMemoryError('Formato HEIC/HEIF ainda nao e suportado aqui. Converta para JPG, PNG ou WEBP.')
      return
    }
    const cappedExtras = loveData.storiesImagesDataUrls.slice(0, CLASSIC_MAX_EXTRA_PHOTOS)
    setPhotoKeys((prev) => prev.slice(0, CLASSIC_MAX_EXTRA_PHOTOS))
    const dataUrl = await readImageFileAsDataUrl(file)
    setLoveData({ fotoCasalDataUrl: dataUrl, storiesImagesDataUrls: cappedExtras, totalPhotos: cappedExtras.length + 1 })
  }

  const onExtraPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    const existingUrls = [...loveData.storiesImagesDataUrls]
    const existingKeys = new Set(photoKeys)
    const nextUrls = [...existingUrls]
    const nextKeys = [...photoKeys]

    for (const file of Array.from(files)) {
      const unsupportedMobileFormat =
        /(\.heic|\.heif)$/i.test(file.name) || file.type === 'image/heic' || file.type === 'image/heif'
      if (unsupportedMobileFormat) {
        setMemoryError('Formato HEIC/HEIF ainda nao e suportado aqui. Converta para JPG, PNG ou WEBP.')
        continue
      }
      const key = `${file.name}-${file.size}-${file.lastModified}`
      if (existingKeys.has(key)) continue
      if (nextUrls.length >= CLASSIC_MAX_EXTRA_PHOTOS) break
      existingKeys.add(key)
      nextKeys.push(key)
      nextUrls.push(await readImageFileAsDataUrl(file))
    }

    setPhotoKeys(nextKeys)
    setLoveData({ storiesImagesDataUrls: nextUrls, totalPhotos: nextUrls.length + (loveData.fotoCasalDataUrl ? 1 : 0) })
    event.target.value = ''
  }

  const removePhoto = (index: number) => {
    const nextUrls = loveData.storiesImagesDataUrls.filter((_, idx) => idx !== index)
    const nextKeys = photoKeys.filter((_, idx) => idx !== index)
    setPhotoKeys(nextKeys)
    setLoveData({ storiesImagesDataUrls: nextUrls, totalPhotos: nextUrls.length + (loveData.fotoCasalDataUrl ? 1 : 0) })
  }

  const onMemoriesBanner = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    input.value = ''
    if (!file) return
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setLoveData({ classicMemoriesBannerDataUrl: dataUrl })
    } catch {
      setMemoryError('Nao foi possivel ler a imagem do banner. Tente JPG, PNG ou WEBP.')
    }
  }

  const onMemoryImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget
    const file = input.files?.[0]
    input.value = ''
    if (!file) return

    const unsupportedMobileFormat =
      /(\.heic|\.heif)$/i.test(file.name) || file.type === 'image/heic' || file.type === 'image/heif'
    if (unsupportedMobileFormat) {
      setMemoryImageDataUrl('')
      setMemoryImageName('')
      setMemoryError('Formato HEIC/HEIF ainda nao e suportado aqui. Converta para JPG, PNG ou WEBP.')
      return
    }

    setMemoryImageName(file.name)
    setMemoryError('')
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setMemoryImageDataUrl(dataUrl)
    } catch {
      setMemoryImageDataUrl('')
      setMemoryImageName('')
      setMemoryError('Nao foi possivel ler essa imagem. Tente JPG, PNG ou WEBP.')
    }
  }

  const addMemory = () => {
    const resolvedMemoryImage =
      memoryImageDataUrl ||
      loveData.classicMemoriesBannerDataUrl ||
      loveData.fotoCasalDataUrl ||
      loveData.storiesImagesDataUrls[0] ||
      ''
    const missing: string[] = []
    if (!memoryDate) missing.push('data')
    if (!memoryTitle.trim()) missing.push('titulo')
    if (!resolvedMemoryImage) missing.push('foto da memoria (campo abaixo, banner, ou foto principal)')
    if (missing.length > 0) {
      setMemoryError(`Falta preencher: ${missing.join(', ')}.`)
      return
    }
    if (loveData.momentHighlights.length >= CLASSIC_MAX_MEMORIES) return

    const next = [
      ...loveData.momentHighlights,
      {
        text: memoryMessage.trim() || memoryTitle.trim(),
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        date: memoryDate,
        title: memoryTitle.trim(),
        message: memoryMessage.trim(),
        imageDataUrl: resolvedMemoryImage,
      },
    ].sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))

    setLoveData({ momentHighlights: next })
    setMemoryDate('')
    setMemoryTitle('')
    setMemoryMessage('')
    setMemoryImageDataUrl('')
    setMemoryImageName('')
    setMemoryError('')
  }

  const removeMemoryAt = (indexToRemove: number) => {
    setLoveData({ momentHighlights: loveData.momentHighlights.filter((_, index) => index !== indexToRemove) })
  }

  const clearAllMemories = () => {
    setLoveData({ momentHighlights: [] })
  }

  const triggerAddOnePhoto = () => {
    if (loveData.storiesImagesDataUrls.length >= CLASSIC_MAX_EXTRA_PHOTOS) {
      return
    }
    addOnePhotoInputRef.current?.click()
  }

  const previewImages = [loveData.fotoCasalDataUrl, ...loveData.storiesImagesDataUrls].filter(Boolean).slice(0, CLASSIC_MAX_TOTAL_PHOTOS)
  const remainingExtraPhotos = Math.max(0, CLASSIC_MAX_EXTRA_PHOTOS - loveData.storiesImagesDataUrls.length)

  const showTitle = stepIndex >= 0 && Boolean(loveData.classicTitle.trim())
  const showMessage = stepIndex >= 1 && Boolean(loveData.classicMessage.trim())
  const showCounter = stepIndex >= 2 && Boolean(loveData.startDate || loveData.anos || loveData.meses || loveData.dias)
  const showPhotos = stepIndex >= 3 && previewImages.length > 0
  const showMusic = stepIndex >= 4 && Boolean(embedUrl)
  const showMemoriesButton = stepIndex >= 5 && loveData.momentHighlights.length > 0

  return (
    <main className="min-h-dvh bg-[#050506] text-white">
      <div className="mx-auto grid w-full max-w-[1320px] gap-8 px-4 py-6 lg:grid-cols-[1fr_430px] lg:px-8">
        <section className="rounded-3xl border border-pink-500/20 bg-[linear-gradient(180deg,rgba(13,13,15,0.96),rgba(7,7,9,0.96))] p-6 shadow-[0_0_30px_rgba(255,77,166,0.08)]">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#2b101d]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#ff4f9a] to-[#ff7bb4] transition-all duration-300" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
              </div>
              <span className="text-sm text-zinc-300">{stepIndex + 1}/{steps.length}</span>
            </div>
            <h1 className="mt-6 text-4xl font-black text-zinc-100">{steps[stepIndex].label}</h1>
          </div>

          {current === 'title' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Escreva o titulo dedicatorio da sua pagina classica.</p>
              <input
                value={loveData.classicTitle}
                onChange={(event) => setLoveData({ classicTitle: event.target.value })}
                className="w-full rounded-xl border border-zinc-700 bg-[#16161a] px-4 py-3 text-base outline-none focus:border-pink-400"
                placeholder="Ex: Joao & Maria"
              />
            </div>
          )}

          {current === 'message' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Mensagem principal da pagina.</p>
              <textarea
                value={loveData.classicMessage}
                onChange={(event) => setLoveData({ classicMessage: event.target.value })}
                className="h-48 w-full rounded-xl border border-zinc-700 bg-[#16161a] px-4 py-3 text-base outline-none focus:border-pink-400"
                placeholder="Escreva sua mensagem..."
              />
            </div>
          )}

          {current === 'counter' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Informe a data de inicio e o estilo do contador.</p>
              <input
                type="date"
                value={loveData.startDate}
                onChange={(event) => setLoveData({ startDate: event.target.value })}
                className="w-full rounded-xl border border-zinc-700 bg-[#16161a] px-4 py-3 text-base outline-none focus:border-pink-400"
              />
              <div className="grid gap-2 sm:grid-cols-3">
                {['default', 'classic', 'simple'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLoveData({ classicCounterStyle: item as 'default' | 'classic' | 'simple' })}
                    className={`rounded-xl border px-4 py-3 text-left capitalize transition ${
                      loveData.classicCounterStyle === item ? 'border-pink-400 bg-pink-500/15 text-pink-100' : 'border-zinc-700 bg-[#16161a] text-zinc-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {current === 'photos' && (
            <div className="space-y-5">
              <label className="block rounded-xl border border-dashed border-zinc-600 bg-[#16161a] p-4">
                <p className="text-sm text-zinc-300">Foto principal</p>
                <input type="file" accept="image/*" onChange={onMainPhoto} className="mt-3 block w-full text-xs" />
              </label>

              <label className="block rounded-xl border border-dashed border-zinc-600 bg-[#16161a] p-4">
                <p className="text-sm text-zinc-300">Fotos extras (ate {CLASSIC_MAX_EXTRA_PHOTOS}, total da pagina: {CLASSIC_MAX_TOTAL_PHOTOS})</p>
                <input type="file" accept="image/*" multiple onChange={onExtraPhotos} className="mt-3 block w-full text-xs" />
                <p className="mt-2 text-xs text-zinc-400">
                  {loveData.storiesImagesDataUrls.length}/{CLASSIC_MAX_EXTRA_PHOTOS} adicionadas
                  {remainingExtraPhotos > 0 ? ` (${remainingExtraPhotos} restantes)` : ' (limite atingido)'}
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={triggerAddOnePhoto}
                    disabled={remainingExtraPhotos === 0}
                    className="rounded-lg border border-pink-400/60 bg-pink-500/15 px-3 py-2 text-sm font-semibold text-pink-100 transition hover:bg-pink-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Adicionar mais uma
                  </button>
                  <input ref={addOnePhotoInputRef} type="file" accept="image/*" onChange={onExtraPhotos} className="hidden" />
                </div>
              </label>

              {loveData.storiesImagesDataUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {loveData.storiesImagesDataUrls.map((url, idx) => (
                    <div key={`${url}-${idx}`} className="relative overflow-hidden rounded-lg border border-zinc-700">
                      <img src={url} alt={`Extra ${idx + 1}`} className="h-18 w-full object-cover" />
                      <button type="button" onClick={() => removePhoto(idx)} className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px]">x</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid gap-2 sm:grid-cols-4">
                {['coverflow', 'cube', 'cards', 'flip'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLoveData({ classicPhotoDisplay: item as PhotoMode })}
                    className={`rounded-xl border px-3 py-2 text-sm capitalize transition ${
                      loveData.classicPhotoDisplay === item ? 'border-pink-400 bg-pink-500/15 text-pink-100' : 'border-zinc-700 bg-[#16161a] text-zinc-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {current === 'music' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Cole o link da musica para o iframe do Spotify.</p>
              <input
                value={loveData.musicaSpotifyUrl}
                onChange={(event) => setLoveData({ musicaSpotifyUrl: event.target.value, musicaSource: 'spotify_link' })}
                className="w-full rounded-xl border border-zinc-700 bg-[#16161a] px-4 py-3 text-base outline-none focus:border-pink-400"
                placeholder="https://open.spotify.com/track/... ou spotify:track:..."
              />
              {!embedUrl && loveData.musicaSpotifyUrl.trim() && (
                <p className="text-xs text-amber-300">Link invalido. Use um link de track do Spotify.</p>
              )}
            </div>
          )}

          {current === 'memories' && (
            <div className="space-y-4">
              <div>
                <p className="text-zinc-300">Titulo das memorias</p>
                <input
                  value={loveData.classicMemoriesTitle}
                  onChange={(event) => setLoveData({ classicMemoriesTitle: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-[#16161a] px-4 py-3 text-base outline-none focus:border-pink-400"
                  placeholder="Ex: Nossa historia"
                />
              </div>

              <label className="block rounded-xl border border-dashed border-zinc-600 bg-[#16161a] p-4">
                <p className="text-sm text-zinc-300">Banner de fundo (opcional)</p>
                <input type="file" accept="image/*" onChange={onMemoriesBanner} className="mt-3 block w-full text-xs" />
              </label>

              <div className="rounded-xl border border-dashed border-zinc-600 bg-[#111216] p-4">
                <p className="text-sm text-zinc-300">Adicionar memoria</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <input
                    type="date"
                    value={memoryDate}
                    onChange={(event) => {
                      setMemoryDate(event.target.value)
                      setMemoryError('')
                    }}
                    className="rounded-lg border border-zinc-700 bg-[#16161a] px-3 py-2 text-sm outline-none focus:border-pink-400"
                  />
                  <input
                    value={memoryTitle}
                    onChange={(event) => {
                      setMemoryTitle(event.target.value)
                      setMemoryError('')
                    }}
                    placeholder="Titulo"
                    className="rounded-lg border border-zinc-700 bg-[#16161a] px-3 py-2 text-sm outline-none focus:border-pink-400"
                  />
                </div>
                <textarea
                  value={memoryMessage}
                  onChange={(event) => {
                    setMemoryMessage(event.target.value)
                    setMemoryError('')
                  }}
                  placeholder="Mensagem (opcional)"
                  className="mt-2 h-20 w-full rounded-lg border border-zinc-700 bg-[#16161a] px-3 py-2 text-sm outline-none focus:border-pink-400"
                />
                <input
                  type="file"
                  accept="image/*,.avif,.AVIF,.webp,.WEBP,.jfif,.JFIF,.png,.jpg,.jpeg,.gif,.bmp,.svg"
                  onChange={onMemoryImage}
                  className="mt-2 block w-full text-xs"
                />
                <p className="mt-1 text-[11px] text-zinc-400">Se nao escolher aqui, o banner sera usado automaticamente.</p>
                {memoryImageDataUrl && (
                  <div className="mt-2 flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/60 p-2">
                    <img src={memoryImageDataUrl} alt="Preview memoria" className="h-10 w-10 rounded object-cover" />
                    <p className="truncate text-xs text-zinc-300">{memoryImageName || 'Foto selecionada'}</p>
                  </div>
                )}
                {!memoryImageDataUrl && loveData.classicMemoriesBannerDataUrl && (
                  <p className="mt-2 text-xs text-zinc-300">Usando foto do banner para esta memoria.</p>
                )}
                {!memoryImageDataUrl && !loveData.classicMemoriesBannerDataUrl && loveData.fotoCasalDataUrl && (
                  <p className="mt-2 text-xs text-zinc-300">Usando foto principal para esta memoria.</p>
                )}
                {memoryError && <p className="mt-2 text-xs text-amber-300">{memoryError}</p>}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-zinc-400">{loveData.momentHighlights.length}/{CLASSIC_MAX_MEMORIES} memorias</p>
                  <button
                    type="button"
                    onClick={addMemory}
                    disabled={loveData.momentHighlights.length >= CLASSIC_MAX_MEMORIES}
                    className="rounded-lg border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    + Adicionar memoria
                  </button>
                </div>
              </div>

              {loveData.momentHighlights.length > 0 && (
                <>
                  <div className="mb-2 flex justify-end">
                    <button
                      type="button"
                      onClick={clearAllMemories}
                      className="rounded border border-zinc-600 bg-zinc-900 px-3 py-1 text-xs text-zinc-200 transition hover:border-pink-400"
                    >
                      Limpar memorias
                    </button>
                  </div>
                  <div className="grid max-h-60 gap-2 overflow-y-auto rounded-xl border border-zinc-700 bg-[#111216] p-3">
                    {loveData.momentHighlights.map((item, index) => (
                      <div key={item.id ?? `legacy-${index}`} className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-[#17181d] p-2">
                        <img src={item.imageDataUrl} alt={item.title ?? item.text ?? 'Memoria'} className="h-12 w-12 rounded-md object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-zinc-100">{item.title ?? item.text ?? 'Memoria'}</p>
                          <p className="text-xs text-zinc-400">{item.date ?? ''}</p>
                        </div>
                        <button type="button" onClick={() => removeMemoryAt(index)} className="rounded bg-black/60 px-2 py-1 text-xs">x</button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {current === 'background' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Escolha a animacao de fundo da pagina.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { key: 'none', label: 'Nenhuma' },
                  { key: 'hearts', label: 'Chuva de coracoes' },
                  { key: 'stars_meteors', label: 'Ceu estrelado com meteoros' },
                  { key: 'clouds', label: 'Nuvens' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setLoveData({ classicBackgroundAnimation: item.key as BackgroundMode })}
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      loveData.classicBackgroundAnimation === item.key ? 'border-pink-400 bg-pink-500/15 text-pink-100' : 'border-zinc-700 bg-[#16161a] text-zinc-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button type="button" onClick={prev} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold text-zinc-200">
              Voltar etapa
            </button>
            <button type="button" onClick={next} className="w-full rounded-xl bg-[#ffd7e9] px-4 py-3 font-semibold text-[#111]">
              {stepIndex === steps.length - 1 ? 'Gerar pagina' : 'Proxima etapa'}
            </button>
          </div>
        </section>

        <aside className="sticky top-4 hidden lg:block">
          <div className="mx-auto w-[392px] rounded-[44px] border border-zinc-700 bg-[#08080b] p-3 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
            <div className="relative h-[720px] overflow-hidden rounded-[34px] border border-zinc-800 bg-[#101014]">
              <BackgroundLayer mode={stepIndex >= 6 ? loveData.classicBackgroundAnimation : 'none'} />
              <div className="absolute inset-0 z-[3] bg-gradient-to-b from-black/55 via-black/45 to-black/70" />

              <div className="relative z-10 flex h-full flex-col px-5 py-8 text-center">
                {showTitle && <h2 className="text-3xl font-black text-pink-400">{loveData.classicTitle}</h2>}
                {showMessage && <p className="mt-2 text-sm text-zinc-300">{loveData.classicMessage}</p>}

                {showCounter && (
                  <div className="mt-8 w-full">
                    {loveData.classicCounterStyle === 'classic' && (
                      <p className="text-base font-semibold text-zinc-100">Juntos ha {clock.years} anos, {clock.months} meses e {clock.days} dias</p>
                    )}
                    {loveData.classicCounterStyle === 'simple' && (
                      <div>
                        <p className="text-5xl font-black text-pink-300">{clock.days}</p>
                        <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">dias</p>
                      </div>
                    )}
                    {loveData.classicCounterStyle === 'default' && (
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.years}</p><p className="text-zinc-400">anos</p></div>
                        <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.months}</p><p className="text-zinc-400">meses</p></div>
                        <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.days}</p><p className="text-zinc-400">dias</p></div>
                        <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.hours}</p><p className="text-zinc-400">h</p></div>
                        <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.minutes}</p><p className="text-zinc-400">min</p></div>
                        <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.seconds}</p><p className="text-zinc-400">seg</p></div>
                      </div>
                    )}
                  </div>
                )}

                {showPhotos && (
                  <div className="mt-6">
                    <PhotoPreview images={previewImages} mode={loveData.classicPhotoDisplay} />
                  </div>
                )}

                {showMusic && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/15 bg-[#121212]">
                    <iframe
                      src={embedUrl ? `${embedUrl}?theme=0` : undefined}
                      className="block w-full border-0 align-top"
                      height="152"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  </div>
                )}

                {showMemoriesButton && (
                  <button
                    type="button"
                    className="mx-auto mt-5 rounded-full bg-gradient-to-r from-[#ff4e8d] to-[#ff6a5a] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,90,150,0.5)]"
                  >
                    ✨ Ver memorias
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
