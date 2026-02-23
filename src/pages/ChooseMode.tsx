import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/appStore'
import type { ClassicVariant, Mode, WrappedVariant } from '../types/types'

const variantsByMode: Record<Mode, { label: string; value: ClassicVariant | WrappedVariant; themeLocked: boolean }[]> = {
  classic: [
    { label: 'Clássica Normal', value: 'normal', themeLocked: false },
    { label: 'Clássica Lovelyflix', value: 'netflix', themeLocked: true },
  ],
  wrapped: [
    { label: 'Lovelyflix', value: 'stories', themeLocked: true },
    { label: 'Wrapped Lovelyfy', value: 'spotify', themeLocked: true },
    { label: 'Jornada', value: 'jornada', themeLocked: true },
    { label: 'Game', value: 'game', themeLocked: true },
  ],
}

export default function ChooseMode() {
  const navigate = useNavigate()
  const { setConfig } = useAppContext()
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null)

  const chooseVariant = (variant: ClassicVariant | WrappedVariant, themeLocked: boolean) => {
    if (!selectedMode) {
      return
    }

    if (selectedMode === 'wrapped' && variant === 'stories') {
      setConfig({ mode: selectedMode, variant, theme: 'Lovelyflix Signature' })
      navigate('/builder')
      return
    }

    const fixedTheme =
      variant === 'netflix'
        ? 'Lovelyflix Signature'
        : variant === 'spotify'
          ? 'Lovelyfy Signature'
          : variant === 'jornada'
            ? 'Jornada Signature'
            : variant === 'game'
              ? 'Game Signature'
              : undefined

    setConfig({ mode: selectedMode, variant, ...(fixedTheme ? { theme: fixedTheme } : {}) })
    navigate(themeLocked ? '/builder' : '/theme')
  }

  return (
    <main className="min-h-[100dvh] bg-[#0f0f0f] px-4 py-8 text-[#f5f5f5] sm:px-5 sm:py-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 id="choose-mode-title" className="text-center text-3xl font-bold md:text-5xl">
          Escolha o seu formato
        </h1>
        <p className="mt-3 text-center text-zinc-300">Página Clássica ou Wrapped e depois a variação visual.</p>

        <div className="mt-10 grid gap-4 md:grid-cols-2" role="group" aria-labelledby="choose-mode-title">
          <button
            type="button"
            onClick={() => setSelectedMode('classic')}
            aria-pressed={selectedMode === 'classic'}
            className={`rounded-2xl border p-6 text-left transition ${
              selectedMode === 'classic'
                ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_30px_rgba(255,47,122,0.4)]'
                : 'border-zinc-700 bg-zinc-900 hover:border-pink-400/50'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-pink-300">Modo 1</p>
            <h2 className="mt-2 text-2xl font-bold">Página Clássica</h2>
            <p className="mt-2 text-zinc-300">Visual romântico premium e versão cinematográfica Lovelyflix.</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedMode('wrapped')}
            aria-pressed={selectedMode === 'wrapped'}
            className={`rounded-2xl border p-6 text-left transition ${
              selectedMode === 'wrapped'
                ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_30px_rgba(255,47,122,0.4)]'
                : 'border-zinc-700 bg-zinc-900 hover:border-pink-400/50'
            }`}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-pink-300">Modo 2</p>
            <h2 className="mt-2 text-2xl font-bold">Wrapped</h2>
            <p className="mt-2 text-zinc-300">Stories interativo ou player Lovelyfy com retrospectiva.</p>
          </button>
        </div>

        {selectedMode && (
          <div className="mt-10 rounded-2xl border border-zinc-700 bg-zinc-900 p-5">
            <h3 className="text-lg font-semibold">Escolha a variação</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {variantsByMode[selectedMode].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => chooseVariant(item.value, item.themeLocked)}
                  className="rounded-xl border border-zinc-700 bg-[#1a1a1a] p-4 text-left transition hover:border-pink-500 hover:shadow-[0_0_22px_rgba(255,47,122,0.45)]"
                >
                  <p className="text-lg font-semibold">{item.label}</p>
                  {item.value !== 'stories' && (
                    <p className="mt-1 text-sm text-zinc-400">{item.themeLocked ? 'Tema fixo' : 'Escolha de tema disponível'}</p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
