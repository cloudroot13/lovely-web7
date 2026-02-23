import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { classicNormalThemes } from '../assets/themes/themeAssets'
import { useAppContext } from '../context/appStore'

const classicOptions = Object.keys(classicNormalThemes)

export default function ThemeSelector() {
  const navigate = useNavigate()
  const { config, setConfig } = useAppContext()

  const needsThemeSelection = config.mode === 'classic' && config.variant === 'normal'

  useEffect(() => {
    if (!needsThemeSelection) {
      navigate('/builder', { replace: true })
    }
  }, [navigate, needsThemeSelection])

  if (!needsThemeSelection) {
    return null
  }

  const themes = classicOptions

  return (
    <main className="min-h-[100dvh] bg-[#0f0f0f] px-4 py-8 text-[#f5f5f5] sm:px-5 sm:py-10 md:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-3xl font-bold md:text-5xl">Escolha um tema</h1>
        <p className="mt-3 text-center text-zinc-300">Temas da Clássica Normal</p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {themes.map((theme) => (
            <button
              key={theme}
              type="button"
              onClick={() => setConfig({ theme })}
              aria-pressed={config.theme === theme}
              className={`rounded-2xl border p-6 text-left transition ${
                config.theme === theme
                  ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_22px_rgba(255,47,122,0.4)]'
                  : 'border-zinc-700 bg-zinc-900 hover:border-pink-500/60'
              }`}
            >
              <p className="text-sm uppercase tracking-[0.2em] text-pink-300">Tema</p>
              <h2 className="mt-2 text-xl font-bold">{theme}</h2>
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => navigate('/builder')}
            className="rounded-full bg-pink-500 px-8 py-3 font-semibold text-black transition hover:shadow-[0_0_25px_rgba(255,47,122,0.8)]"
          >
            Continuar para o chat
          </button>
        </div>
      </div>
    </main>
  )
}
