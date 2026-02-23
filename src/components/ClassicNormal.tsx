import { motion } from 'framer-motion'
import { classicNormalThemes } from '../assets/themes/themeAssets'
import type { LoveData } from '../types/types'

interface ClassicNormalProps {
  loveData: LoveData
  theme: string
}

export function ClassicNormal({ loveData, theme }: ClassicNormalProps) {
  const nomeExibicao = loveData.apelido || loveData.nomePessoa || 'voce'
  const selectedTheme = classicNormalThemes[theme as keyof typeof classicNormalThemes] ?? classicNormalThemes['Romantic Pink']
  const title = loveData.classicTitle?.trim() || `${loveData.nomePessoa || 'Seu amor'} & Voce`
  const message =
    loveData.classicMessage?.trim() ||
    `${nomeExibicao}, desde o dia em que ${loveData.comoConheceram || 'nossos caminhos se cruzaram'}, cada detalhe virou historia.`

  const getCounter = () => {
    if (loveData.startDate) {
      const start = new Date(loveData.startDate.includes('T') ? loveData.startDate : `${loveData.startDate}T00:00:00`)
      if (!Number.isNaN(start.getTime())) {
        const total = Math.max(1, Math.floor((Date.now() - start.getTime()) / 1000))
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
      years: Math.max(0, loveData.anos),
      months: Math.max(0, loveData.meses),
      days: Math.max(0, loveData.dias),
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  const clock = getCounter()
  const trackId = loveData.musicaSpotifyUrl.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/)?.[1]
  const embedUrl = trackId ? `https://open.spotify.com/embed/track/${trackId}` : null

  return (
    <section className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center overflow-hidden px-4 py-12">
      <img src={selectedTheme.bg} alt="" aria-hidden className="absolute inset-0 -z-30 h-full w-full object-cover" />
      <img src={selectedTheme.overlay} alt="" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 -z-10 bg-black/70" />
      {loveData.classicBackgroundAnimation === 'hearts' && (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {Array.from({ length: 24 }).map((_, idx) => (
            <span
              key={idx}
              className="absolute text-pink-300/65"
              style={{
                left: `${(idx * 9) % 100}%`,
                bottom: '-10%',
                fontSize: `${10 + (idx % 4) * 5}px`,
                animation: `classicHeartFloat ${4 + (idx % 4)}s ease-in-out ${idx * 0.15}s infinite`,
              }}
            >
              ❤
            </span>
          ))}
        </div>
      )}
      {(loveData.classicBackgroundAnimation === 'stars_comets' || loveData.classicBackgroundAnimation === 'stars_meteors') && (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {Array.from({ length: 36 }).map((_, idx) => (
            <span key={`s-${idx}`} className="absolute h-0.5 w-0.5 rounded-full bg-white/70" style={{ left: `${4 + (idx % 9) * 10.4}%`, top: `${4 + Math.floor(idx / 9) * 22}%` }} />
          ))}
          {Array.from({ length: loveData.classicBackgroundAnimation === 'stars_comets' ? 3 : 4 }).map((_, idx) => (
            <span
              key={`m-${idx}`}
              className="absolute h-px w-14 bg-gradient-to-r from-white/0 to-white/80"
              style={{
                left: `${10 + idx * 20}%`,
                top: `${20 + idx * 12}%`,
                transform: 'rotate(-28deg)',
                animation: `classicMeteor ${3 + idx * 0.6}s linear ${idx * 0.5}s infinite`,
              }}
            />
          ))}
        </div>
      )}
      {loveData.classicBackgroundAnimation === 'clouds' && (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          {Array.from({ length: 8 }).map((_, idx) => (
            <span
              key={`c-${idx}`}
              className="absolute h-7 rounded-full bg-white/12 blur-sm"
              style={{
                width: `${64 + (idx % 3) * 24}px`,
                left: `${-20 + idx * 16}%`,
                top: `${10 + (idx % 4) * 18}%`,
                animation: `classicCloudMove ${8 + (idx % 4)}s linear ${idx * 0.2}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-3xl rounded-3xl border border-pink-500/30 bg-zinc-950/80 p-6 shadow-[0_0_50px_rgba(255,47,122,0.25)] backdrop-blur md:p-10">
        <div className="relative mx-auto w-fit -rotate-2">
          <img src={selectedTheme.frame} alt="Moldura polaroid" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="relative rounded-lg border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
            {loveData.fotoCasalDataUrl ? (
              <img src={loveData.fotoCasalDataUrl} alt="Foto do casal" className="h-52 w-52 rounded object-cover md:h-64 md:w-64" />
            ) : (
              <div className="flex h-52 w-52 items-center justify-center rounded bg-gradient-to-br from-pink-500/25 to-zinc-900 text-center text-sm text-zinc-300 md:h-64 md:w-64">
                Foto do casal
              </div>
            )}
          </div>
        </div>

        <h1 className="mt-8 text-center font-serif text-3xl font-semibold text-zinc-100 md:text-4xl">{title}</h1>

        <p className="mt-2 text-center text-sm uppercase tracking-[0.24em] text-pink-300">{theme}</p>

        <p className="mt-6 text-left leading-relaxed text-zinc-200 md:text-lg">{message}</p>

        <div className="mt-8 rounded-2xl border border-pink-500/25 bg-zinc-900/80 p-4 text-center">
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
        aria-label="Coração"
      >
        ❤
      </motion.button>
    </section>
  )
}
