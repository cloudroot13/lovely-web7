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
  { id: 'recipient', label: 'Para quem e o presente?' },
  { id: 'title', label: 'Título da página' },
  { id: 'message', label: 'Mensagem' },
  { id: 'counter', label: 'Contador' },
  { id: 'photos', label: 'Fotos' },
  { id: 'music', label: 'Iframe de musica' },
  { id: 'memories', label: 'Memórias' },
  { id: 'background', label: 'Animação de fundo' },
] as const

type BackgroundMode = 'none' | 'hearts' | 'stars_meteors' | 'clouds'
type PhotoMode = 'coverflow' | 'cube' | 'cards' | 'flip'
type GiftIconKey = 'heart' | 'users' | 'flower' | 'sparkle' | 'star' | 'crown'
interface GiftTypePreset {
  id: string
  label: string
  description: string
  iconKey: GiftIconKey
  featured?: boolean
}
const CLASSIC_MAX_TOTAL_PHOTOS = 6
const CLASSIC_MAX_EXTRA_PHOTOS = 5
const CLASSIC_MAX_MEMORIES = 8

type StepId = (typeof steps)[number]['id']

const giftTypePresets: GiftTypePreset[] = [
  { id: 'amor', label: 'Presente de Amor', description: 'Para namorado(a), noivo(a) ou conjuge.', iconKey: 'heart', featured: true },
  { id: 'melhor-amiga', label: 'Presente para Amiga', description: 'Surpreenda sua melhor amiga.', iconKey: 'users' },
  { id: 'dia-da-mulher', label: 'Dia da Mulher', description: 'Homenagem para uma mulher especial.', iconKey: 'flower' },
  { id: 'mae', label: 'Mae', description: 'Agradecimento cheio de carinho.', iconKey: 'sparkle' },
  { id: 'avo', label: 'Avo', description: 'Memorias e amor em cada detalhe.', iconKey: 'star' },
  { id: 'irma', label: 'Irma', description: 'Para quem sempre esteve ao seu lado.', iconKey: 'users' },
  { id: 'esposa', label: 'Esposa', description: 'Para celebrar o amor todos os dias.', iconKey: 'crown' },
  { id: 'filha', label: 'Filha', description: 'Uma homenagem afetiva e especial.', iconKey: 'heart' },
]

function getGiftReceiverLabel(presetId: string | undefined) {
  switch (presetId) {
    case 'melhor-amiga':
      return 'sua amiga'
    case 'mae':
      return 'sua mae'
    case 'avo':
      return 'sua avo'
    case 'irma':
      return 'sua irma'
    case 'esposa':
      return 'sua esposa'
    case 'filha':
      return 'sua filha'
    case 'dia-da-mulher':
      return 'essa mulher especial'
    default:
      return 'sua pessoa amada'
  }
}

function GiftTypeIcon({ iconKey }: { iconKey: GiftIconKey }) {
  const base = 'h-5 w-5 text-pink-500'
  if (iconKey === 'users') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
        <path d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" />
        <circle cx="9.5" cy="7" r="3" />
        <path d="M22 19v-1a4 4 0 0 0-3-3.87" />
        <path d="M16 4.13a3 3 0 0 1 0 5.75" />
      </svg>
    )
  }
  if (iconKey === 'flower') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
        <path d="M12 14.2c-2.3 0-4.2-1.6-4.2-3.7 0-1.7 1.3-3 3-3 0 .7.5 1.2 1.2 1.2.7 0 1.2-.5 1.2-1.2 1.7 0 3 1.3 3 3 0 2.1-1.9 3.7-4.2 3.7Z" />
        <path d="M12 14.2V21" />
        <path d="M12 18.2c-1.7 0-2.8-1-3.4-2" />
        <path d="M12 19.2c1.6 0 2.7-.8 3.3-1.8" />
        <path d="M10.1 7.9c-.9-1.6-.6-3.2.8-4.4 1.4 1.2 1.7 2.8.8 4.4" />
      </svg>
    )
  }
  if (iconKey === 'sparkle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
        <path d="m12 3 1.6 3.9L18 8.5l-4.4 1.6L12 14l-1.6-3.9L6 8.5l4.4-1.6L12 3Z" />
        <path d="m5 16 .8 1.9L8 18.7l-2.2.8L5 22l-.8-2.5L2 18.7l2.2-.8L5 16Z" />
      </svg>
    )
  }
  if (iconKey === 'star') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
        <path d="m12 3 2.8 5.6L21 9.4l-4.5 4.4 1.1 6.3L12 17.1l-5.6 3 1.1-6.3L3 9.4l6.2-.8L12 3Z" />
      </svg>
    )
  }
  if (iconKey === 'crown') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
        <path d="m3 8 4.5 4L12 6l4.5 6L21 8l-2 10H5L3 8Z" />
        <path d="M5 18h14" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
      <path d="M12 20.5s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10.5c0 5.7-7 10-7 10Z" />
    </svg>
  )
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function getMeteorRotation(startX: number, startY: number, endX: number, endY: number) {
  return (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI - 90
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
  const [selectedGiftType, setSelectedGiftType] = useState<GiftTypePreset | null>(giftTypePresets.find((item) => item.featured) ?? giftTypePresets[0])
  const [photoKeys, setPhotoKeys] = useState<string[]>([])
  const addOnePhotoInputRef = useRef<HTMLInputElement | null>(null)
  const [memoryDate, setMemoryDate] = useState('')
  const [memoryTitle, setMemoryTitle] = useState('')
  const [memoryMessage, setMemoryMessage] = useState('')
  const [memoryImageDataUrl, setMemoryImageDataUrl] = useState('')
  const [memoryImageName, setMemoryImageName] = useState('')
  const [memoryError, setMemoryError] = useState('')

  const clock = useMemo(() => buildClock(loveData.startDate, loveData.anos, loveData.meses, loveData.dias), [loveData.startDate, loveData.anos, loveData.meses, loveData.dias])
  const giftReceiverLabel = useMemo(() => getGiftReceiverLabel(selectedGiftType?.id), [selectedGiftType?.id])

  const embedUrl = buildSpotifyTrackEmbedUrl(loveData.musicaSpotifyUrl)

  const validateStep = (stepId: StepId) => {
    if (stepId === 'recipient') {
      if (!selectedGiftType) {
        alert('Selecione para quem e o presente para continuar.')
        return false
      }
      return true
    }

    if (stepId === 'title') {
      if (!loveData.classicTitle.trim()) {
        alert('Preencha o titulo da pagina para continuar.')
        return false
      }
      return true
    }

    if (stepId === 'message') {
      if (!loveData.classicMessage.trim()) {
        alert('Preencha a mensagem principal para continuar.')
        return false
      }
      return true
    }

    if (stepId === 'counter') {
      if (!loveData.startDate) {
        alert('Informe a data de inicio para continuar.')
        return false
      }
      return true
    }

    if (stepId === 'photos') {
      if (!loveData.fotoCasalDataUrl) {
        alert('A foto principal e obrigatoria para continuar.')
        return false
      }
      if (loveData.storiesImagesDataUrls.length === 0) {
        alert('Envie pelo menos 1 foto extra para continuar.')
        return false
      }
      return true
    }

    if (stepId === 'music') {
      if (!loveData.musicaSpotifyUrl.trim()) {
        alert('Cole um link de musica do Spotify para continuar.')
        return false
      }
      if (!embedUrl) {
        alert('O link da musica esta invalido. Use um link de track do Spotify.')
        return false
      }
      return true
    }

    if (stepId === 'memories') {
      if (!loveData.classicMemoriesTitle.trim()) {
        alert('Preencha o titulo das memorias para continuar.')
        return false
      }
      if (loveData.momentHighlights.length === 0) {
        alert('Adicione pelo menos 1 memoria para continuar.')
        return false
      }
      return true
    }

    if (stepId === 'background') {
      if (loveData.classicBackgroundAnimation === 'none') {
        alert('Escolha uma animacao de fundo para continuar.')
        return false
      }
      return true
    }

    return true
  }

  const next = () => {
    const stepId = steps[stepIndex].id as StepId
    if (!validateStep(stepId)) return
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
      setMemoryError('Formato HEIC/HEIF ainda não é suportado aqui. Converta para JPG, PNG ou WEBP.')
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
        setMemoryError('Formato HEIC/HEIF ainda não é suportado aqui. Converta para JPG, PNG ou WEBP.')
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
      setMemoryError('Não foi possível ler a imagem do banner. Tente JPG, PNG ou WEBP.')
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
      setMemoryError('Formato HEIC/HEIF ainda não é suportado aqui. Converta para JPG, PNG ou WEBP.')
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
      setMemoryError('Não foi possível ler essa imagem. Tente JPG, PNG ou WEBP.')
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
    if (!memoryTitle.trim()) missing.push('título')
    if (!resolvedMemoryImage) missing.push('foto da memória (campo abaixo, banner, ou foto principal)')
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
      <div className="mx-auto grid w-full max-w-330 gap-8 px-4 py-6 lg:grid-cols-[1fr_430px] lg:px-8">
        <section className="rounded-3xl border border-pink-500/20 bg-[linear-gradient(180deg,rgba(13,13,15,0.96),rgba(7,7,9,0.96))] p-6 shadow-[0_0_30px_rgba(255,77,166,0.08)]">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#2b101d]">
                <div className="h-full rounded-full bg-linear-to-r from-[#ff4f9a] to-[#ff7bb4] transition-all duration-300" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
              </div>
              <span className="text-sm text-zinc-300">{stepIndex + 1}/{steps.length}</span>
            </div>
            <h1 className="mt-6 text-4xl font-black text-zinc-100">{steps[stepIndex].label}</h1>
          </div>

          {current === 'recipient' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Selecione para quem sera o presente.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {giftTypePresets.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedGiftType(item)}
                    className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      selectedGiftType?.id === item.id
                        ? 'border-pink-400 bg-pink-500/15 text-pink-100'
                        : 'border-zinc-700 bg-[#16161a] text-zinc-200'
                    }`}
                  >
                    <GiftTypeIcon iconKey={item.iconKey} />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold leading-tight">{item.label}</span>
                      <span className="mt-1 block text-xs text-zinc-400">{item.description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {current === 'title' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Escreva o titulo dedicatorio da sua pagina classica para {giftReceiverLabel}.</p>
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
              <p className="text-zinc-300">Mensagem principal para {giftReceiverLabel}.</p>
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
              <p className="text-zinc-300">Informe a data de início e o estilo do contador.</p>
              <input
                type="date"
                value={loveData.startDate}
                onChange={(event) => setLoveData({ startDate: event.target.value })}
                className="w-full rounded-xl border border-zinc-700 bg-[#16161a] px-4 py-3 text-base outline-none focus:border-pink-400"
              />
              <div className="grid gap-2 sm:grid-cols-3">
                {['default', 'classic'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLoveData({ classicCounterStyle: item as 'default' | 'classic' })}
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
                <p className="text-sm text-zinc-300">Fotos extras (até {CLASSIC_MAX_EXTRA_PHOTOS}, total da página: {CLASSIC_MAX_TOTAL_PHOTOS})</p>
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
                <p className="text-zinc-300">Título das memórias</p>
                <input
                  value={loveData.classicMemoriesTitle}
                  onChange={(event) => setLoveData({ classicMemoriesTitle: event.target.value })}
                  className="mt-2 w-full rounded-xl border border-zinc-700 bg-[#16161a] px-4 py-3 text-base outline-none focus:border-pink-400"
                  placeholder="Ex: Nossa história"
                />
              </div>

              <label className="block rounded-xl border border-dashed border-zinc-600 bg-[#16161a] p-4">
                <p className="text-sm text-zinc-300">Banner de fundo (opcional)</p>
                <input type="file" accept="image/*" onChange={onMemoriesBanner} className="mt-3 block w-full text-xs" />
              </label>

              <div className="rounded-xl border border-dashed border-zinc-600 bg-[#111216] p-4">
                <p className="text-sm text-zinc-300">Adicionar memória</p>
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
                    placeholder="Título"
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
                <p className="mt-1 text-[11px] text-zinc-400">Se não escolher aqui, o banner será usado automaticamente.</p>
                {memoryImageDataUrl && (
                  <div className="mt-2 flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/60 p-2">
                    <img src={memoryImageDataUrl} alt="Preview memória" className="h-10 w-10 rounded object-cover" />
                    <p className="truncate text-xs text-zinc-300">{memoryImageName || 'Foto selecionada'}</p>
                  </div>
                )}
                {!memoryImageDataUrl && loveData.classicMemoriesBannerDataUrl && (
                  <p className="mt-2 text-xs text-zinc-300">Usando foto do banner para esta memória.</p>
                )}
                {!memoryImageDataUrl && !loveData.classicMemoriesBannerDataUrl && loveData.fotoCasalDataUrl && (
                  <p className="mt-2 text-xs text-zinc-300">Usando foto principal para esta memória.</p>
                )}
                {memoryError && <p className="mt-2 text-xs text-amber-300">{memoryError}</p>}
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-zinc-400">{loveData.momentHighlights.length}/{CLASSIC_MAX_MEMORIES} memórias</p>
                  <button
                    type="button"
                    onClick={addMemory}
                    disabled={loveData.momentHighlights.length >= CLASSIC_MAX_MEMORIES}
                    className="rounded-lg border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-100 transition hover:border-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    + Adicionar memória
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
                      Limpar memórias
                    </button>
                  </div>
                  <div className="grid max-h-60 gap-2 overflow-y-auto rounded-xl border border-zinc-700 bg-[#111216] p-3">
                    {loveData.momentHighlights.map((item, index) => (
                      <div key={item.id ?? `legacy-${index}`} className="flex items-center gap-3 rounded-lg border border-zinc-700 bg-[#17181d] p-2">
                        <img src={item.imageDataUrl} alt={item.title ?? item.text ?? 'Memoria'} className="h-12 w-12 rounded-md object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-zinc-100">{item.title ?? item.text ?? 'Memória'}</p>
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
              <p className="text-zinc-300">Escolha a animação de fundo da página.</p>
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
              {stepIndex === steps.length - 1 ? 'Gerar página' : 'Próxima etapa'}
            </button>
          </div>
        </section>

        <aside className="sticky top-4 hidden lg:block">
          <div className="mx-auto w-98 rounded-[44px] border border-zinc-700 bg-[#08080b] p-3 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
            <div className="relative h-180 overflow-hidden rounded-[34px] border border-zinc-800 bg-[#101014]">
              <BackgroundLayer mode={stepIndex >= 6 ? loveData.classicBackgroundAnimation : 'none'} />
              <div className="absolute inset-0 z-3 bg-linear-to-b from-black/55 via-black/45 to-black/70" />

              <div className="relative z-10 flex h-full flex-col px-5 py-8 text-center">
                {showTitle && <h2 className="text-3xl font-black text-pink-400">{loveData.classicTitle}</h2>}
                {showMessage && <p className="mt-2 text-sm text-zinc-300">{loveData.classicMessage}</p>}

                {showCounter && (
                  <div className="mt-8 w-full">
                    {loveData.classicCounterStyle === 'classic' && (
                      <p className="text-base font-semibold text-zinc-100">Juntos ha {clock.years} anos, {clock.months} meses e {clock.days} dias</p>
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
                    className="mx-auto mt-5 rounded-full bg-linear-to-r from-[#ff4e8d] to-[#ff6a5a] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,90,150,0.5)]"
                  >
                    ✨ Ver memórias
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
