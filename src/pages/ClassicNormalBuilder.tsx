import { useMemo, useState, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/appStore'

const steps = [
  { id: 'title', label: 'Titulo da pagina' },
  { id: 'message', label: 'Mensagem' },
  { id: 'counter', label: 'Data e contador' },
  { id: 'photos', label: 'Fotos' },
  { id: 'music', label: 'Iframe de musica' },
  { id: 'background', label: 'Animacao de fundo' },
] as const

function getClock(startDate: string, yearsFallback: number, monthsFallback: number, daysFallback: number) {
  if (startDate) {
    const parsed = new Date(startDate.includes('T') ? startDate : `${startDate}T00:00:00`)
    if (!Number.isNaN(parsed.getTime())) {
      const totalSeconds = Math.max(1, Math.floor((Date.now() - parsed.getTime()) / 1000))
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

function extractTrackId(url: string) {
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/)
  return match?.[1] ?? ''
}

function BackgroundPreview({ mode }: { mode: 'none' | 'hearts' | 'stars_comets' | 'stars_meteors' | 'clouds' }) {
  if (mode === 'none') {
    return <div className="absolute inset-0 bg-gradient-to-b from-[#151515] to-[#0a0a0a]" />
  }

  if (mode === 'hearts') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#1a0d12] to-[#0a0a0a]">
        {Array.from({ length: 16 }).map((_, idx) => (
          <span
            key={idx}
            className="absolute text-pink-300/70"
            style={{
              left: `${6 + (idx % 8) * 11}%`,
              top: `${95 - (idx % 4) * 10}%`,
              fontSize: `${12 + (idx % 3) * 5}px`,
              animation: `classicHeartFloat ${4 + (idx % 4)}s ease-in-out ${idx * 0.16}s infinite`,
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
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#182233] to-[#080d16]">
        {Array.from({ length: 7 }).map((_, idx) => (
          <span
            key={idx}
            className="absolute h-6 rounded-full bg-white/15 blur-sm"
            style={{
              width: `${60 + (idx % 3) * 26}px`,
              left: `${-20 + idx * 18}%`,
              top: `${14 + (idx % 4) * 18}%`,
              animation: `classicCloudMove ${8 + (idx % 4)}s linear ${idx * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#131726] to-[#06070b]">
      {Array.from({ length: 36 }).map((_, idx) => (
        <span
          key={`star-${idx}`}
          className="absolute h-0.5 w-0.5 rounded-full bg-white/70"
          style={{
            left: `${4 + (idx % 9) * 10.5}%`,
            top: `${5 + Math.floor(idx / 9) * 22}%`,
            opacity: 0.3 + (idx % 4) * 0.16,
          }}
        />
      ))}
      {Array.from({ length: mode === 'stars_comets' ? 3 : 4 }).map((_, idx) => (
        <span
          key={`meteor-${idx}`}
          className="absolute h-px w-14 bg-gradient-to-r from-white/0 to-white/80"
          style={{
            left: `${8 + idx * 22}%`,
            top: `${18 + idx * 14}%`,
            transform: 'rotate(-28deg)',
            animation: `classicMeteor ${3.3 + idx * 0.7}s linear ${idx * 0.5}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function ClassicNormalBuilder() {
  const navigate = useNavigate()
  const { loveData, setLoveData } = useAppContext()
  const [stepIndex, setStepIndex] = useState(0)

  const clock = useMemo(
    () => getClock(loveData.startDate, loveData.anos, loveData.meses, loveData.dias),
    [loveData.startDate, loveData.anos, loveData.meses, loveData.dias],
  )

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

  const current = steps[stepIndex].id

  const onMainPhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setLoveData({ fotoCasalDataUrl: URL.createObjectURL(file) })
  }

  const onExtraPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    const urls = Array.from(files)
      .slice(0, 8)
      .map((file) => URL.createObjectURL(file))
    setLoveData({ storiesImagesDataUrls: urls, totalPhotos: urls.length })
  }

  return (
    <main className="min-h-dvh bg-[#050505] text-white">
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 px-4 py-6 lg:grid-cols-[1fr_420px] lg:items-start lg:px-8">
        <section className="rounded-3xl border border-zinc-800 bg-black/70 p-6">
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#2a0d0d]">
                <div
                  className="h-full rounded-full bg-[#ef4444] transition-all duration-300"
                  style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
              <span className="text-sm text-zinc-300">{stepIndex + 1}/{steps.length}</span>
            </div>
            <h1 className="mt-6 text-4xl font-black">{steps[stepIndex].label}</h1>
          </div>

          {current === 'title' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Escreva o titulo da pagina classica.</p>
              <input
                value={loveData.classicTitle}
                onChange={(event) => setLoveData({ classicTitle: event.target.value })}
                className="w-full rounded-xl border border-zinc-700 bg-[#151515] px-4 py-3 text-base"
                placeholder="Ex: Joao & Maria"
              />
            </div>
          )}

          {current === 'message' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Escreva uma mensagem especial para a pagina.</p>
              <textarea
                value={loveData.classicMessage}
                onChange={(event) => setLoveData({ classicMessage: event.target.value })}
                className="h-48 w-full rounded-xl border border-zinc-700 bg-[#151515] px-4 py-3 text-base"
                placeholder="Sua mensagem aqui..."
              />
            </div>
          )}

          {current === 'counter' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Defina a data de inicio e o estilo do contador.</p>
              <input
                type="date"
                value={loveData.startDate}
                onChange={(event) => setLoveData({ startDate: event.target.value })}
                className="w-full rounded-xl border border-zinc-700 bg-[#151515] px-4 py-3 text-base"
              />
              <div className="grid gap-2 sm:grid-cols-3">
                {['default', 'classic', 'simple'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLoveData({ classicCounterStyle: item as 'default' | 'classic' | 'simple' })}
                    className={`rounded-xl border px-4 py-3 text-left capitalize ${
                      loveData.classicCounterStyle === item ? 'border-red-400 bg-zinc-800' : 'border-zinc-700 bg-[#151515]'
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
              <label className="block rounded-xl border border-dashed border-zinc-600 bg-[#151515] p-4">
                <p className="text-sm text-zinc-300">Foto principal</p>
                <input type="file" accept="image/*" onChange={onMainPhoto} className="mt-3 block w-full text-xs" />
              </label>

              <label className="block rounded-xl border border-dashed border-zinc-600 bg-[#151515] p-4">
                <p className="text-sm text-zinc-300">Fotos extras (max. 8)</p>
                <input type="file" accept="image/*" multiple onChange={onExtraPhotos} className="mt-3 block w-full text-xs" />
              </label>

              <div className="grid gap-2 sm:grid-cols-4">
                {['coverflow', 'cube', 'cards', 'flip'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setLoveData({ classicPhotoDisplay: item as 'coverflow' | 'cube' | 'cards' | 'flip' })}
                    className={`rounded-xl border px-3 py-2 text-sm capitalize ${
                      loveData.classicPhotoDisplay === item ? 'border-red-400 bg-zinc-800' : 'border-zinc-700 bg-[#151515]'
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
              <p className="text-zinc-300">Cole um link de track do Spotify para exibir no iframe.</p>
              <input
                value={loveData.musicaSpotifyUrl}
                onChange={(event) => setLoveData({ musicaSpotifyUrl: event.target.value, musicaSource: 'spotify_link' })}
                className="w-full rounded-xl border border-zinc-700 bg-[#151515] px-4 py-3 text-base"
                placeholder="https://open.spotify.com/track/..."
              />
            </div>
          )}

          {current === 'background' && (
            <div className="space-y-4">
              <p className="text-zinc-300">Escolha uma animacao de fundo.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <button type="button" onClick={() => setLoveData({ classicBackgroundAnimation: 'none' })} className={`rounded-xl border px-3 py-3 text-left ${loveData.classicBackgroundAnimation === 'none' ? 'border-red-400 bg-zinc-800' : 'border-zinc-700 bg-[#151515]'}`}>Nenhuma</button>
                <button type="button" onClick={() => setLoveData({ classicBackgroundAnimation: 'hearts' })} className={`rounded-xl border px-3 py-3 text-left ${loveData.classicBackgroundAnimation === 'hearts' ? 'border-red-400 bg-zinc-800' : 'border-zinc-700 bg-[#151515]'}`}>Chuva de coracoes</button>
                <button type="button" onClick={() => setLoveData({ classicBackgroundAnimation: 'stars_comets' })} className={`rounded-xl border px-3 py-3 text-left ${loveData.classicBackgroundAnimation === 'stars_comets' ? 'border-red-400 bg-zinc-800' : 'border-zinc-700 bg-[#151515]'}`}>Ceu com cometas</button>
                <button type="button" onClick={() => setLoveData({ classicBackgroundAnimation: 'stars_meteors' })} className={`rounded-xl border px-3 py-3 text-left ${loveData.classicBackgroundAnimation === 'stars_meteors' ? 'border-red-400 bg-zinc-800' : 'border-zinc-700 bg-[#151515]'}`}>Ceu com meteoros</button>
                <button type="button" onClick={() => setLoveData({ classicBackgroundAnimation: 'clouds' })} className={`rounded-xl border px-3 py-3 text-left ${loveData.classicBackgroundAnimation === 'clouds' ? 'border-red-400 bg-zinc-800' : 'border-zinc-700 bg-[#151515]'}`}>Nuvens</button>
              </div>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button type="button" onClick={prev} className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 font-semibold">
              Voltar etapa
            </button>
            <button type="button" onClick={next} className="w-full rounded-xl bg-zinc-200 px-4 py-3 font-semibold text-black">
              {stepIndex === steps.length - 1 ? 'Gerar pagina' : 'Proxima etapa'}
            </button>
          </div>
        </section>

        <aside className="sticky top-4 hidden lg:block">
          <div className="mx-auto w-[390px] rounded-[44px] border border-zinc-700 bg-[#0c0c0d] p-3 shadow-[0_0_40px_rgba(0,0,0,0.55)]">
            <div className="relative h-[720px] overflow-hidden rounded-[34px] border border-zinc-800 bg-[#121212]">
              <BackgroundPreview mode={loveData.classicBackgroundAnimation} />

              <div className="relative z-10 flex h-full flex-col items-center px-5 py-8 text-center">
                <h2 className="text-3xl font-black text-red-400">{loveData.classicTitle || 'Titulo da pagina'}</h2>
                <p className="mt-2 max-w-[28ch] text-sm text-zinc-300">{loveData.classicMessage || 'Mensagem especial da pagina classica.'}</p>

                <div className="mt-8 w-full">
                  {loveData.classicCounterStyle === 'classic' && (
                    <p className="text-base font-semibold text-zinc-100">
                      Juntos ha {clock.years} anos, {clock.months} meses e {clock.days} dias
                    </p>
                  )}

                  {loveData.classicCounterStyle === 'simple' && (
                    <div>
                      <p className="text-5xl font-black text-zinc-100">{clock.days}</p>
                      <p className="text-sm text-zinc-300">dias compartilhados</p>
                    </div>
                  )}

                  {loveData.classicCounterStyle === 'default' && (
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold">{clock.years}</p><p className="text-zinc-400">anos</p></div>
                      <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold">{clock.months}</p><p className="text-zinc-400">meses</p></div>
                      <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold">{clock.days}</p><p className="text-zinc-400">dias</p></div>
                      <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold">{clock.hours}</p><p className="text-zinc-400">horas</p></div>
                      <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold">{clock.minutes}</p><p className="text-zinc-400">min</p></div>
                      <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold">{clock.seconds}</p><p className="text-zinc-400">seg</p></div>
                    </div>
                  )}
                </div>

                <div className="mt-6 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/50">
                  {loveData.fotoCasalDataUrl ? (
                    <img src={loveData.fotoCasalDataUrl} alt="Preview" className="h-44 w-full object-cover" />
                  ) : (
                    <div className="flex h-44 items-center justify-center text-zinc-400">Foto principal</div>
                  )}
                </div>

                {embedUrl && (
                  <iframe
                    src={embedUrl}
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
