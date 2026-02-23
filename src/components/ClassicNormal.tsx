import { motion } from 'framer-motion'
import { classicNormalThemes } from '../assets/themes/themeAssets'
import type { LoveData } from '../types/types'

interface ClassicNormalProps {
  loveData: LoveData
  theme: string
}

export function ClassicNormal({ loveData, theme }: ClassicNormalProps) {
  const nomeExibicao = loveData.apelido || loveData.nomePessoa || 'você'
  const selectedTheme = classicNormalThemes[theme as keyof typeof classicNormalThemes] ?? classicNormalThemes['Romantic Pink']

  return (
    <section className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center overflow-hidden px-4 py-12">
      <img src={selectedTheme.bg} alt="" aria-hidden className="absolute inset-0 -z-30 h-full w-full object-cover" />
      <img src={selectedTheme.overlay} alt="" aria-hidden className="absolute inset-0 -z-20 h-full w-full object-cover opacity-80" />
      <div className="absolute inset-0 -z-10 bg-black/70" />

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

        <h1 className="mt-8 text-center font-serif text-3xl font-semibold text-zinc-100 md:text-4xl">
          {loveData.nomePessoa || 'Seu Amor'} <span className="text-pink-400">&</span> Você
        </h1>

        <p className="mt-2 text-center text-sm uppercase tracking-[0.24em] text-pink-300">{theme}</p>

        <p className="mt-6 text-left leading-relaxed text-zinc-200 md:text-lg">
          {nomeExibicao}, desde o dia em que {loveData.comoConheceram || 'nossos caminhos se cruzaram'}, eu entendi que o amor
          podia ser simples e, ao mesmo tempo, gigantesco. Nosso momento mais especial, {loveData.momentoEspecial || 'cada detalhe que construímos'}, virou lembrança viva em mim. Em {loveData.dataImportante || 'uma data inesquecível'}, escolhemos
          escrever essa história com cuidado, parceria e verdade. Hoje celebramos {loveData.anos} anos, {loveData.meses} meses e {loveData.dias} dias de uma conexão que continua escolhendo o futuro todos os dias.
        </p>

        <div className="mt-8 rounded-2xl border border-pink-500/25 bg-zinc-900/80 p-4 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Tempo juntos</p>
          <p className="mt-2 text-2xl font-semibold text-pink-300">
            {loveData.anos} anos, {loveData.meses} meses e {loveData.dias} dias
          </p>
        </div>
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
