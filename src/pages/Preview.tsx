import { useLocation, useNavigate } from 'react-router-dom'
import { ClassicNetflix } from '../components/ClassicNetflix'
import { ClassicNormal } from '../components/ClassicNormal'
import { JornadaWrapped } from '../modules/jornada/JornadaWrapped'
import WrappedGameExperience from '../modules/wrapped-game/WrappedGameExperience'
import { LovelyfyWrapped } from '../modules/lovelyfy/LovelyfyWrapped'
import LovelyflixExperience from '../modules/lovelyflix/LovelyflixExperience'
import { useAppContext } from '../context/appStore'

export default function Preview() {
  const { config, loveData } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const showBuilderPreview = params.get('builderPreview') === '1'
  const modeParam = params.get('mode')
  const variantParam = params.get('variant')
  const activeMode = modeParam === 'classic' || modeParam === 'wrapped' ? modeParam : config.mode
  const activeVariant =
    variantParam === 'normal' ||
    variantParam === 'netflix' ||
    variantParam === 'stories' ||
    variantParam === 'spotify' ||
    variantParam === 'jornada' ||
    variantParam === 'game'
      ? variantParam
      : config.variant

  const isWrappedPreview = activeMode === 'wrapped'
  const isLoggedIn = typeof window !== 'undefined' && window.localStorage.getItem('lovely-auth') === '1'
  const hasPaid = typeof window !== 'undefined' && window.localStorage.getItem('lovely-paid') === '1'
  const hasUnlockedPreview = isLoggedIn && hasPaid
  const shouldLockPreview = !showBuilderPreview && isWrappedPreview && !hasUnlockedPreview

  const finalDestination = `/preview?mode=${activeMode}&variant=${activeVariant}`

  return (
    <main className="relative min-h-[100dvh] bg-black text-white" aria-label="Pré-visualização da experiência">
      {activeMode === 'classic' && activeVariant === 'normal' && <ClassicNormal loveData={loveData} />}
      {activeMode === 'classic' && activeVariant === 'netflix' && <ClassicNetflix loveData={loveData} />}
      {activeMode === 'wrapped' && activeVariant === 'stories' && <LovelyflixExperience />}
      {activeMode === 'wrapped' && activeVariant === 'spotify' && <LovelyfyWrapped loveData={loveData} />}
      {activeMode === 'wrapped' && activeVariant === 'jornada' && <JornadaWrapped loveData={loveData} />}
      {activeMode === 'wrapped' && activeVariant === 'game' && <WrappedGameExperience />}

      {shouldLockPreview && (
        <div className="fixed inset-0 z-[999] flex items-end justify-center bg-black/78 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-zinc-700 bg-zinc-900 p-5 text-center shadow-2xl">
            <p className="text-sm uppercase tracking-[0.14em] text-zinc-400">Preview bloqueado</p>
            <h2 className="mt-2 text-xl font-bold">Conclua os passos para ter acesso</h2>
            <p className="mt-2 text-sm text-zinc-300">Faça login e confirme o pagamento para liberar os slides completos.</p>
            <button
              type="button"
              className="mt-4 w-full rounded-xl bg-pink-500 px-4 py-3 font-semibold text-white transition hover:bg-pink-400"
              onClick={() => navigate(`/login?returnTo=${encodeURIComponent(`/checkout?returnTo=${encodeURIComponent(finalDestination)}`)}`)}
            >
              Fazer login e pagar
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
