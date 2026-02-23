import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#0f0f0f] px-4 py-10 text-[#f5f5f5] sm:px-6 sm:py-12">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,79,163,0.3),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(255,47,122,0.22),transparent_35%)]"
        aria-hidden
      />
      <motion.div
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-pink-500/30 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[80vh] max-w-5xl flex-col items-center justify-center text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.28em] text-pink-300">Lovely Romance Studio</p>
        <h1 className="max-w-3xl font-serif text-4xl leading-tight md:text-6xl">
          Transforme sentimentos em algo inesquecível.
        </h1>
        <p className="mt-5 max-w-xl text-zinc-300">
          Crie declarações interativas em formato clássico ou wrapped e compartilhe uma experiência única.
        </p>

        <button
          type="button"
          onClick={() => navigate('/choose-mode')}
          className="mt-10 rounded-full bg-pink-500 px-8 py-4 text-lg font-semibold text-black transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(255,47,122,0.75)] focus-visible:ring-2 focus-visible:ring-pink-200"
        >
          Criar minha história
        </button>
      </div>

      <motion.div
        animate={{ y: [0, -14, 0], x: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute left-8 top-16 h-20 w-20 rounded-full border border-pink-400/40"
        aria-hidden
      />
      <motion.div
        animate={{ y: [0, 12, 0], x: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute bottom-20 right-10 h-16 w-16 rounded-full bg-pink-500/20"
        aria-hidden
      />
    </main>
  )
}
