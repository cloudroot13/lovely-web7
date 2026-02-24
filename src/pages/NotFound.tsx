import { Link } from 'react-router-dom'
import pensadorMascot from '../assets/mascote_cupido/pensador.png'

export default function NotFound() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#0b0b0b] px-4 py-8 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(236,72,153,0.24),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(29,185,84,0.2),transparent_38%)]" />

      <section className="relative mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-md flex-col items-center justify-center rounded-3xl border border-white/10 bg-black/55 p-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-300">Erro 404</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Página não encontrada</h1>

        <div className="relative mt-7 w-full">
          <div className="mx-auto max-w-72.5 rounded-2xl border border-white/15 bg-[#171717] px-4 py-3 text-sm font-semibold text-zinc-100 shadow-[0_10px_26px_rgba(0,0,0,0.45)] sm:text-base">
            O que você está fazendo aqui? Está perdido? Clique para voltar.
          </div>
          <div className="mx-auto -mt-1 h-4 w-4 rotate-45 border-b border-r border-white/15 bg-[#171717]" />
        </div>

        <img src={pensadorMascot} alt="Mascote cupido pensador" className="mt-5 w-55 max-w-full object-contain sm:w-62.5" />

        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-[#1DB954] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-black transition duration-300 hover:scale-105"
        >
          Voltar para início
        </Link>
      </section>
    </main>
  )
}
