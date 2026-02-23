import { useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/appStore'

const steps = [
  { id: 'title', label: 'Titulo da pagina' },
  { id: 'message', label: 'Mensagem' },
  { id: 'counter', label: 'Contador' },
  { id: 'photos', label: 'Fotos' },
  { id: 'music', label: 'Iframe de musica' },
  { id: 'background', label: 'Animacao de fundo' },
] as const

type BackgroundMode = 'none' | 'hearts' | 'stars_comets' | 'stars_meteors' | 'clouds'
type PhotoMode = 'coverflow' | 'cube' | 'cards' | 'flip'

type StepId = (typeof steps)[number]['id']

function extractTrackId(url: string) {
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/)
  return match?.[1] ?? ''
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
    return <div className="absolute inset-0 bg-gradient-to-b from-[#131313] via-[#101010] to-[#080808]" />
  }

  if (mode === 'hearts') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#1a0f16] via-[#101014] to-[#080808]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,90,165,0.2),transparent_38%),radial-gradient(circle_at_78%_78%,rgba(255,90,165,0.14),transparent_42%)]" />
        {Array.from({ length: 22 }).map((_, idx) => (
          <span
            key={idx}
            className="absolute text-pink-300/70"
            style={{
              left: `${(idx * 9) % 100}%`,
              bottom: '-10%',
              fontSize: `${10 + (idx % 4) * 5}px`,
              animation: `classicHeartRise ${4.2 + (idx % 4) * 0.7}s ease-in-out ${idx * 0.12}s infinite`,
            }}
          >
            ❤
          </span>
        ))}
      </div>
    )
  }

  if (mode === 'clouds') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#151825] via-[#0e1220] to-[#070a13]">
        {Array.from({ length: 9 }).map((_, idx) => (
          <span
            key={idx}
            className="absolute h-7 rounded-full bg-white/14 blur-sm"
            style={{
              width: `${58 + (idx % 4) * 22}px`,
              left: `${-16 + idx * 13}%`,
              top: `${10 + (idx % 5) * 14}%`,
              animation: `classicCloudDrift ${8 + (idx % 4) * 1.6}s linear ${idx * 0.14}s infinite`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#121726] via-[#0b0e17] to-[#06070b]">
      {Array.from({ length: 48 }).map((_, idx) => (
        <span
          key={`star-${idx}`}
          className="absolute h-[2px] w-[2px] rounded-full bg-white"
          style={{
            left: `${4 + (idx % 12) * 8}%`,
            top: `${5 + Math.floor(idx / 12) * 20}%`,
            opacity: 0.25 + (idx % 5) * 0.14,
            animation: `classicStarTwinkle ${2.2 + (idx % 4) * 0.9}s ease-in-out ${idx * 0.07}s infinite`,
          }}
        />
      ))}
      {Array.from({ length: mode === 'stars_comets' ? 3 : 5 }).map((_, idx) => (
        <span
          key={`meteor-${idx}`}
          className="absolute h-px w-16 bg-gradient-to-r from-white/0 to-white/90"
          style={{
            left: `${8 + idx * 16}%`,
            top: `${18 + idx * 11}%`,
            transform: 'rotate(-30deg)',
            animation: `classicMeteorTrail ${3.8 + idx * 0.55}s linear ${idx * 0.4}s infinite`,
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
  const [photoKeys, setPhotoKeys] = useState<string[]>([])

  const clock = useMemo(() => buildClock(loveData.startDate, loveData.anos, loveData.meses, loveData.dias), [loveData.startDate, loveData.anos, loveData.meses, loveData.dias])

  const trackId = extractTrackId(loveData.musicaSpotifyUrl)
  const embedUrl = trackId ? `https://open.spotify.com/embed/track/${trackId}` : null

  const next = () => {
    if (stepIndex >= steps.length - 1) {
      navigate('/preview')
      return
    }
    setStepIndex((prev) => prev + 1)
  }

  const prev = () => setStepIndex((prev) => Math.max(0, prev - 1))
  const current = steps[stepIndex].id as StepId

  const onMainPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setLoveData({ fotoCasalDataUrl: URL.createObjectURL(file) })
  }

  const onExtraPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files?.length) return

    const existingUrls = [...loveData.storiesImagesDataUrls]
    const existingKeys = new Set(photoKeys)
    const nextUrls = [...existingUrls]
    const nextKeys = [...photoKeys]

    for (const file of Array.from(files)) {
      const key = `${file.name}-${file.size}-${file.lastModified}`
      if (existingKeys.has(key)) continue
      if (nextUrls.length >= 8) break
      existingKeys.add(key)
      nextKeys.push(key)
      nextUrls.push(URL.createObjectURL(file))
    }

    setPhotoKeys(nextKeys)
    setLoveData({ storiesImagesDataUrls: nextUrls, totalPhotos: nextUrls.length })
    event.target.value = ''
  }

  const removePhoto = (index: number) => {
    const nextUrls = loveData.storiesImagesDataUrls.filter((_, idx) => idx !== index)
    const nextKeys = photoKeys.filter((_, idx) => idx !== index)
    setPhotoKeys(nextKeys)
    setLoveData({ storiesImagesDataUrls: nextUrls, totalPhotos: nextUrls.length })
  }

  const previewImages = [loveData.fotoCasalDataUrl, ...loveData.storiesImagesDataUrls].filter(Boolean)

  const showTitle = stepIndex >= 0 && Boolean(loveData.classicTitle.trim())
  const showMessage = stepIndex >= 1 && Boolean(loveData.classicMessage.trim())
  const showCounter = stepIndex >= 2 && Boolean(loveData.startDate || loveData.anos || loveData.meses || loveData.dias)
  const showPhotos = stepIndex >= 3 && previewImages.length > 0
  const showMusic = stepIndex >= 4 && Boolean(embedUrl)

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
                <p className="text-sm text-zinc-300">Fotos extras (ate 8)</p>
                <input type="file" accept="image/*" multiple onChange={onExtraPhotos} className="mt-3 block w-full text-xs" />
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
                placeholder="https://open.spotify.com/track/..."
              />
            </div>
          )}

          {current === 'background' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Escolha a animacao de fundo da pagina.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { key: 'none', label: 'Nenhuma' },
                  { key: 'hearts', label: 'Chuva de coracoes' },
                  { key: 'stars_comets', label: 'Ceu estrelado com cometas' },
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
              <BackgroundLayer mode={stepIndex >= 5 ? loveData.classicBackgroundAnimation : 'none'} />

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
                  <iframe
                    src={embedUrl ?? undefined}
                    className="mt-5 w-full rounded-2xl"
                    height="152"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
