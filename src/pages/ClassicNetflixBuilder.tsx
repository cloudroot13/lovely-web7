import { useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClassicNetflix } from '../components/ClassicNetflix'
import { useAppContext } from '../context/appStore'
import { readImageFileAsDataUrl } from '../utils/image'

type NetflixStep = 'title' | 'counter' | 'description' | 'photo'

const steps: { id: NetflixStep; label: string }[] = [
  { id: 'title', label: 'Titulo' },
  { id: 'counter', label: 'Contador' },
  { id: 'description', label: 'Descricao' },
  { id: 'photo', label: 'Fotos' },
]

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

  const currentStep = steps[stepIndex]
  const inferredTitle = useMemo(() => {
    if (loveData.classicTitle.trim()) return loveData.classicTitle.trim()
    if (loveData.nomePessoa.trim()) return loveData.nomePessoa.trim()
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
      alert('Formato HEIC/HEIF ainda nao e suportado aqui. Converta para JPG, PNG ou WEBP.')
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
        alert('Formato HEIC/HEIF ainda nao e suportado aqui. Converta para JPG, PNG ou WEBP.')
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
              <p className="text-zinc-300">Nome do casal (título principal).</p>
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
                placeholder="Ex: Cada dia com voce e o meu capitulo favorito. Seu sorriso muda meu mundo e eu te escolheria em todas as vidas."
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
              <ClassicNetflix loveData={loveData} />
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
