import { motion } from 'framer-motion'
import { netflixAssets } from '../assets/themes/themeAssets'
import type { LoveData } from '../types/types'

interface ClassicNetflixProps {
  loveData: LoveData
}

const netflixMoments = [
  'O primeiro olhar',
  'A conversa que mudou tudo',
  'Nosso primeiro encontro',
  'O abraço inesquecível',
  'A promessa para o futuro',
  'A viagem favorita',
  'O dia do pedido',
  'Nosso ritual diário',
  'A grande superação',
  'O próximo sonho juntos',
]

export function ClassicNetflix({ loveData }: ClassicNetflixProps) {
  const relationshipDays = loveData.anos * 365 + loveData.meses * 30 + loveData.dias
  const progressPercent = Math.min(95, Math.max(8, Math.round((relationshipDays % 1000) / 10)))

  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <section className="relative min-h-dvh w-full overflow-hidden">
        {loveData.fotoCasalDataUrl ? (
          <img src={loveData.fotoCasalDataUrl} alt="Casal" className="h-full w-full object-cover" />
        ) : (
          <img src={netflixAssets.top10Bg} alt="Fundo Lovelyflix" className="h-full w-full object-cover" />
        )}
        <img src={netflixAssets.heroOverlay} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-90" />
        <img src={netflixAssets.redGradient} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/70" />
        <div className="absolute inset-0 bg-linear-to-t from-[#111111] via-transparent to-transparent" />

        <div className="absolute bottom-12 left-6 right-6 mx-auto max-w-6xl md:left-10 md:right-10">
          <p className="text-xs font-semibold tracking-[0.3em] text-[#E50914]">LOVELYFLIX ORIGINAL</p>
          <h1 className="mt-3 text-4xl font-black uppercase leading-tight md:text-7xl">Uma História de Amor</h1>
          <p className="mt-3 max-w-xl text-zinc-200">
            Estrelando {loveData.nomePessoa || 'quem você ama'} | Tudo começou quando {loveData.comoConheceram || 'o destino juntou vocês'}.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button type="button" className="rounded bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-white/80">
              ▶ Assistir
            </button>
            <button
              type="button"
              className="rounded bg-zinc-600/70 px-6 py-3 font-semibold text-white transition hover:bg-[#E50914] hover:shadow-[0_0_24px_rgba(229,9,20,0.7)] focus-visible:ring-2 focus-visible:ring-white/80"
            >
              + Minha Lista
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <h2 className="mb-4 text-xl font-bold">Top 10 Momentos</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {netflixMoments.map((moment, index) => (
            <motion.article
              whileHover={{ y: -5 }}
              key={moment}
              className="relative min-w-60 rounded-lg border border-zinc-700 bg-[#1a1a1a] p-4 transition hover:border-[#E50914] hover:shadow-[0_0_22px_rgba(229,9,20,0.45)]"
            >
              <span className="pointer-events-none absolute -left-2 -top-7 text-8xl font-black text-white/12">{index + 1}</span>
              <p className="relative z-10 mt-10 text-sm font-medium text-zinc-100">{moment}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-2 md:px-10">
        <h2 className="mb-4 text-xl font-bold">Temporadas</h2>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            'Temporada 1: O Começo',
            'Temporada 2: Crescendo Juntos',
            'Temporada 3: Nosso Futuro',
          ].map((season) => (
            <div key={season} className="rounded-lg border border-zinc-700 bg-[#191919] p-4 transition hover:border-[#E50914]">
              {season}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <h2 className="mb-3 text-xl font-bold">Continuar Assistindo</h2>
        <div className="rounded-xl border border-zinc-700 bg-[#1a1a1a] p-4">
          <div className="mb-2 flex items-center justify-between text-sm text-zinc-300">
            <span>{loveData.nomePessoa || 'Nossa história'} - Episódio atual</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
            <div className="h-full rounded-full bg-[#E50914] transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </section>
    </div>
  )
}
