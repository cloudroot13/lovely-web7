import { motion } from 'framer-motion'
import { classicNormalThemes } from '../assets/themes/themeAssets'
import type { LoveData } from '../types/types'

interface ClassicNormalProps {
  loveData: LoveData
  theme: string
}

type BackgroundMode = 'none' | 'hearts' | 'stars_comets' | 'stars_meteors' | 'clouds'
type PhotoMode = 'coverflow' | 'cube' | 'cards' | 'flip'

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

function BackgroundLayer({ mode }: { mode: BackgroundMode }) {
  if (mode === 'none') {
    return <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0b0b0d] to-[#08080a]" />
  }

  if (mode === 'hearts') {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#1b1018] via-[#101014] to-[#08080a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,95,170,0.2),transparent_40%),radial-gradient(circle_at_75%_75%,rgba(255,95,170,0.14),transparent_42%)]" />
        {Array.from({ length: 28 }).map((_, idx) => (
          <span
            key={idx}
            className="absolute text-pink-300/70"
            style={{
              left: `${(idx * 8) % 100}%`,
              bottom: '-10%',
              fontSize: `${10 + (idx % 4) * 5}px`,
              animation: `classicHeartRise ${4 + (idx % 4) * 0.75}s ease-in-out ${idx * 0.12}s infinite`,
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
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#141829] via-[#0b0f1d] to-[#070a14]">
        {Array.from({ length: 10 }).map((_, idx) => (
          <span
            key={idx}
            className="absolute h-7 rounded-full bg-white/14 blur-sm"
            style={{
              width: `${60 + (idx % 4) * 24}px`,
              left: `${-18 + idx * 13}%`,
              top: `${9 + (idx % 5) * 14}%`,
              animation: `classicCloudDrift ${8 + (idx % 4) * 1.6}s linear ${idx * 0.16}s infinite`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#121726] via-[#0c0f19] to-[#07090e]">
      {Array.from({ length: 60 }).map((_, idx) => (
        <span
          key={`s-${idx}`}
          className="absolute h-[2px] w-[2px] rounded-full bg-white"
          style={{
            left: `${3 + (idx % 12) * 8}%`,
            top: `${4 + Math.floor(idx / 12) * 18}%`,
            opacity: 0.2 + (idx % 5) * 0.15,
            animation: `classicStarTwinkle ${2 + (idx % 5) * 0.85}s ease-in-out ${idx * 0.06}s infinite`,
          }}
        />
      ))}
      {Array.from({ length: mode === 'stars_comets' ? 4 : 6 }).map((_, idx) => (
        <span
          key={`m-${idx}`}
          className="absolute h-px w-16 bg-gradient-to-r from-white/0 to-white/95"
          style={{
            left: `${7 + idx * 14}%`,
            top: `${16 + idx * 10}%`,
            transform: 'rotate(-30deg)',
            animation: `classicMeteorTrail ${3.6 + idx * 0.55}s linear ${idx * 0.45}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function PhotoGallery({ images, mode }: { images: string[]; mode: PhotoMode }) {
  if (!images.length) {
    return <div className="flex h-44 items-center justify-center rounded-2xl border border-dashed border-white/20 text-zinc-400">Sem fotos</div>
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
              transform: `translate(-50%, -50%) rotate(${(idx - 1.5) * 7}deg) translateX(${(idx - 1.5) * 28}px)`,
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
          <img key={image} src={image} alt={`Foto ${idx + 1}`} className="h-full w-full rounded-lg border border-white/15 object-cover" style={{ animation: `classicFlipFloat ${3 + (idx % 3)}s ease-in-out ${idx * 0.1}s infinite` }} />
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

export function ClassicNormal({ loveData, theme }: ClassicNormalProps) {
  const selectedTheme = classicNormalThemes[theme as keyof typeof classicNormalThemes] ?? classicNormalThemes['Romantic Pink']
  const title = loveData.classicTitle?.trim() || `${loveData.nomePessoa || 'Seu amor'} & Voce`
  const message =
    loveData.classicMessage?.trim() ||
    `${loveData.apelido || loveData.nomePessoa || 'Voce'}, desde o dia em que ${loveData.comoConheceram || 'nossos caminhos se cruzaram'}, cada detalhe virou historia.`

  const clock = buildClock(loveData)
  const backgroundMode = (loveData.classicBackgroundAnimation || 'none') as BackgroundMode
  const photoMode = (loveData.classicPhotoDisplay || 'coverflow') as PhotoMode
  const trackId = loveData.musicaSpotifyUrl.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/)?.[1]
  const embedUrl = trackId ? `https://open.spotify.com/embed/track/${trackId}` : null

  const galleryImages = [loveData.fotoCasalDataUrl, ...loveData.storiesImagesDataUrls].filter(Boolean)

  return (
    <section className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center overflow-hidden px-4 py-12">
      <img src={selectedTheme.bg} alt="" aria-hidden className="absolute inset-0 -z-40 h-full w-full object-cover" />
      <img src={selectedTheme.overlay} alt="" aria-hidden className="absolute inset-0 -z-30 h-full w-full object-cover opacity-70" />
      <BackgroundLayer mode={backgroundMode} />
      <div className="absolute inset-0 -z-10 bg-black/55" />

      <div className="w-full max-w-3xl rounded-3xl border border-pink-500/30 bg-zinc-950/78 p-6 shadow-[0_0_50px_rgba(255,47,122,0.25)] backdrop-blur md:p-10">
        <h1 className="text-center font-serif text-3xl font-semibold text-zinc-100 md:text-4xl">{title}</h1>
        <p className="mt-2 text-center text-sm uppercase tracking-[0.24em] text-pink-300">{theme}</p>

        <p className="mt-6 text-left leading-relaxed text-zinc-200 md:text-lg">{message}</p>

        <div className="mt-7">
          <PhotoGallery images={galleryImages} mode={photoMode} />
        </div>

        <div className="mt-7 rounded-2xl border border-pink-500/25 bg-zinc-900/80 p-4 text-center">
          {loveData.classicCounterStyle === 'classic' ? (
            <>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Tempo juntos</p>
              <p className="mt-2 text-2xl font-semibold text-pink-300">{clock.years} anos, {clock.months} meses e {clock.days} dias</p>
            </>
          ) : loveData.classicCounterStyle === 'simple' ? (
            <>
              <p className="text-5xl font-black text-pink-300">{clock.days}</p>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">dias compartilhados</p>
            </>
          ) : (
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.years}</p><p className="text-zinc-400">anos</p></div>
              <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.months}</p><p className="text-zinc-400">meses</p></div>
              <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.days}</p><p className="text-zinc-400">dias</p></div>
              <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.hours}</p><p className="text-zinc-400">horas</p></div>
              <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.minutes}</p><p className="text-zinc-400">min</p></div>
              <div className="rounded-xl bg-black/55 p-2"><p className="text-xl font-bold text-pink-200">{clock.seconds}</p><p className="text-zinc-400">seg</p></div>
            </div>
          )}
        </div>

        {embedUrl && (
          <iframe
            src={embedUrl}
            className="mt-6 w-full rounded-2xl"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        )}
      </div>

      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 right-8 rounded-full bg-pink-500 px-5 py-3 text-2xl shadow-[0_0_30px_rgba(255,47,122,0.6)]"
        aria-label="Coracao"
      >
        ❤
      </motion.button>
    </section>
  )
}
