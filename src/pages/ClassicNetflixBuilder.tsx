import { useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClassicNetflix } from '../components/ClassicNetflix'
import { useAppContext } from '../context/appStore'
import { readImageFileAsDataUrl } from '../utils/image'

type NetflixStep = 'recipient' | 'title' | 'counter' | 'description' | 'photo'
type GiftIconKey = 'heart' | 'users' | 'flower' | 'sparkle' | 'star' | 'crown'
interface GiftTypePreset {
  id: string
  label: string
  description: string
  iconKey: GiftIconKey
  featured?: boolean
}

const steps: { id: NetflixStep; label: string }[] = [
  { id: 'recipient', label: 'Para quem e o presente?' },
  { id: 'title', label: 'Título' },
  { id: 'counter', label: 'Contador' },
  { id: 'description', label: 'Descricao' },
  { id: 'photo', label: 'Fotos' },
]

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
  const base = 'h-5 w-5 text-[#ff5f67]'
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

function buildCounterParts(startDate: string) {
  const parsed = new Date(startDate.includes('T') ? startDate : `${startDate}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) {
    return { anos: 0, meses: 0, dias: 0 }
  }

  const now = new Date()
  const totalSeconds = Math.max(0, Math.floor((now.getTime() - parsed.getTime()) / 1000))
  const anos = Math.floor(totalSeconds / (365 * 24 * 60 * 60))
  const afterYears = totalSeconds % (365 * 24 * 60 * 60)
  const meses = Math.floor(afterYears / (30 * 24 * 60 * 60))
  const afterMonths = afterYears % (30 * 24 * 60 * 60)
  const dias = Math.floor(afterMonths / (24 * 60 * 60))
  return { anos, meses, dias }
}

export default function ClassicNetflixBuilder() {
  const navigate = useNavigate()
  const { loveData, setLoveData } = useAppContext()
  const [stepIndex, setStepIndex] = useState(0)
  const [episodePhotoKeys, setEpisodePhotoKeys] = useState<string[]>([])
  const [selectedGiftType, setSelectedGiftType] = useState<GiftTypePreset | null>(giftTypePresets.find((item) => item.featured) ?? giftTypePresets[0])

  const currentStep = steps[stepIndex]
  const giftReceiverLabel = useMemo(() => getGiftReceiverLabel(selectedGiftType?.id), [selectedGiftType?.id])
  const inferredTitle = useMemo(() => {
    if (loveData.classicTitle) return loveData.classicTitle
    if (loveData.nomePessoa) return loveData.nomePessoa
    return ''
  }, [loveData.classicTitle, loveData.nomePessoa])

  const next = () => {
    if (currentStep.id === 'photo') {
      const hasCover = Boolean(loveData.fotoCasalDataUrl)
      const hasEpisodePhotos = loveData.storiesImagesDataUrls.length === 10
      if (!hasCover || !hasEpisodePhotos) {
        alert('Envie 1 foto de destaque e 10 fotos dos episódios para continuar.')
        return
      }
    }

    if (stepIndex >= steps.length - 1) {
      navigate('/preview')
      return
    }
    setStepIndex((prev) => prev + 1)
  }

  const prev = () => setStepIndex((prev) => Math.max(0, prev - 1))

  const onMainPhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const unsupportedMobileFormat =
      /(\.heic|\.heif)$/i.test(file.name) || file.type === 'image/heic' || file.type === 'image/heif'
    if (unsupportedMobileFormat) {
      alert('Formato HEIC/HEIF ainda não é suportado aqui. Converta para JPG, PNG ou WEBP.')
      return
    }
    const dataUrl = await readImageFileAsDataUrl(file)
    setLoveData({ fotoCasalDataUrl: dataUrl })
  }

  const onEpisodePhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    const existing = loveData.storiesImagesDataUrls.slice(0, 10)
    const existingKeys = new Set(episodePhotoKeys)
    const nextUrls = [...existing]
    const nextKeys = [...episodePhotoKeys]

    for (const file of Array.from(files)) {
      if (nextUrls.length >= 10) break
      const unsupportedMobileFormat =
        /(\.heic|\.heif)$/i.test(file.name) || file.type === 'image/heic' || file.type === 'image/heif'
      if (unsupportedMobileFormat) {
        alert('Formato HEIC/HEIF ainda não é suportado aqui. Converta para JPG, PNG ou WEBP.')
        continue
      }
      const key = `${file.name}-${file.size}-${file.lastModified}`
      if (existingKeys.has(key)) continue
      existingKeys.add(key)
      nextKeys.push(key)
      nextUrls.push(await readImageFileAsDataUrl(file))
    }

    setEpisodePhotoKeys(nextKeys.slice(0, 10))
    setLoveData({ storiesImagesDataUrls: nextUrls.slice(0, 10) })
    event.target.value = ''
  }

  const removeEpisodePhoto = (index: number) => {
    const nextUrls = loveData.storiesImagesDataUrls.filter((_, idx) => idx !== index).slice(0, 10)
    const nextKeys = episodePhotoKeys.filter((_, idx) => idx !== index).slice(0, 10)
    setEpisodePhotoKeys(nextKeys)
    setLoveData({ storiesImagesDataUrls: nextUrls })
  }

  const onStartDate = (value: string) => {
    const counter = buildCounterParts(value)
    setLoveData({
      startDate: value,
      anos: counter.anos,
      meses: counter.meses,
      dias: counter.dias,
    })
  }

  return (
    <main className="min-h-dvh bg-[#0f0f0f] text-[#f5f5f5]">
      <div className="mx-auto grid w-full max-w-[1320px] gap-8 px-4 py-6 lg:grid-cols-[1fr_430px] lg:px-8">
        <section className="rounded-3xl border border-[#E50914]/25 bg-[linear-gradient(180deg,rgba(13,13,15,0.96),rgba(7,7,9,0.96))] p-6 shadow-[0_0_24px_rgba(229,9,20,0.16)]">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#2a0f11]">
                <div className="h-full rounded-full bg-gradient-to-r from-[#E50914] to-[#ff4757] transition-all duration-300" style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
              </div>
              <span className="text-sm text-zinc-300">{stepIndex + 1}/{steps.length}</span>
            </div>
            <h1 className="mt-6 text-4xl font-black text-zinc-100">Clássica Lovelyflix</h1>
            <p className="mt-2 text-zinc-400">Etapas de criação (sem chat): título, contador, descrição e foto.</p>
          </div>

          {currentStep.id === 'title' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Nome do casal para o presente de {giftReceiverLabel} (titulo principal).</p>
              <input
                value={inferredTitle}
                onChange={(event) =>
                  setLoveData({
                    classicTitle: event.target.value,
                    nomePessoa: event.target.value,
                  })
                }
                className="w-full rounded-xl border border-zinc-700 bg-[#16161a] px-4 py-3 text-base outline-none focus:border-[#E50914]"
                placeholder="Ex: Joao & Maria"
              />
            </div>
          )}

          {currentStep.id === 'recipient' && (
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
                        ? 'border-[#E50914] bg-[#E50914]/15 text-zinc-100'
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

          {currentStep.id === 'counter' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Data inicial do contador Netflix.</p>
              <input
                type="date"
                value={loveData.startDate}
                onChange={(event) => onStartDate(event.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-[#16161a] px-4 py-3 text-base outline-none focus:border-[#E50914]"
              />
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-xl bg-black/55 p-3 text-center"><p className="text-xl font-bold text-red-300">{loveData.anos}</p><p className="text-zinc-400">anos</p></div>
                <div className="rounded-xl bg-black/55 p-3 text-center"><p className="text-xl font-bold text-red-300">{loveData.meses}</p><p className="text-zinc-400">meses</p></div>
                <div className="rounded-xl bg-black/55 p-3 text-center"><p className="text-xl font-bold text-red-300">{loveData.dias}</p><p className="text-zinc-400">dias</p></div>
              </div>
            </div>
          )}

          {currentStep.id === 'description' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Escreva um texto romantico para aparecer como descricao da experiencia.</p>
              <textarea
                value={loveData.comoConheceram}
                onChange={(event) => setLoveData({ comoConheceram: event.target.value })}
                className="h-44 w-full rounded-xl border border-zinc-700 bg-[#16161a] px-4 py-3 text-base outline-none focus:border-[#E50914]"
                placeholder="Ex: Cada dia com você é o meu capítulo favorito. Seu sorriso muda meu mundo e eu te escolheria em todas as vidas."
              />
            </div>
          )}

          {currentStep.id === 'photo' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Envie 1 foto de destaque (capa) e 10 fotos para os episódios.</p>
              <label className="block rounded-xl border border-dashed border-zinc-600 bg-[#16161a] p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-400">Foto de destaque</p>
                <input type="file" accept="image/*" onChange={onMainPhoto} className="block w-full text-xs" />
              </label>
              <label className="block rounded-xl border border-dashed border-zinc-600 bg-[#16161a] p-4">
                <p className="mb-2 text-xs uppercase tracking-[0.15em] text-zinc-400">
                  Fotos dos episódios ({loveData.storiesImagesDataUrls.length}/10)
                </p>
                <input type="file" accept="image/*" multiple onChange={onEpisodePhotos} className="block w-full text-xs" />
              </label>
              {loveData.fotoCasalDataUrl && (
                <div className="overflow-hidden rounded-xl border border-zinc-700 bg-black/40">
                  <p className="border-b border-zinc-700 px-3 py-2 text-xs text-zinc-300">Prévia da capa</p>
                  <img src={loveData.fotoCasalDataUrl} alt="Foto de destaque" className="h-36 w-full object-cover" />
                </div>
              )}
              {loveData.storiesImagesDataUrls.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {loveData.storiesImagesDataUrls.map((image, idx) => (
                    <div key={`${idx}-${image.slice(0, 20)}`} className="relative overflow-hidden rounded-lg border border-zinc-700">
                      <img src={image} alt={`Episódio ${idx + 1}`} className="h-20 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeEpisodePhoto(idx)}
                        className="absolute right-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button type="button" onClick={prev} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold text-zinc-200">
              Voltar etapa
            </button>
            <button type="button" onClick={next} className="w-full rounded-xl bg-[#E50914] px-4 py-3 font-semibold text-white">
              {stepIndex === steps.length - 1 ? 'Gerar página' : 'Próxima etapa'}
            </button>
          </div>
        </section>

        <aside className="sticky top-4 hidden lg:block">
          <div className="mx-auto w-[392px] overflow-hidden rounded-[44px] border border-zinc-700 bg-[#08080b] p-2 shadow-[0_0_50px_rgba(0,0,0,0.6)]">
            <div className="relative h-[720px] overflow-hidden rounded-[34px] border border-zinc-800">
              <ClassicNetflix loveData={loveData} showBootIntro={false} />
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
