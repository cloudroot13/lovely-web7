import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ClassicNetflix } from '../components/ClassicNetflix'
import { ClassicNormal } from '../components/ClassicNormal'
import { JornadaWrapped } from '../modules/jornada/JornadaWrapped'
import WrappedGameExperience from '../modules/wrapped-game/WrappedGameExperience'
import { LovelyfyWrapped } from '../modules/lovelyfy/LovelyfyWrapped'
import LovelyflixExperience from '../modules/lovelyflix/LovelyflixExperience'
import { useAppContext } from '../context/appStore'
import { getCurrentUser, isAuthenticated } from '../utils/auth'
import { hasActiveAccess } from '../utils/access'

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

  const user = getCurrentUser()
  const isLoggedIn = isAuthenticated()
  const hasPaid = Boolean(user && hasActiveAccess(user.id))
  const hasUnlockedPreview = isLoggedIn && hasPaid
  const shouldLockPreview = !showBuilderPreview && !hasUnlockedPreview

  const finalDestination = `/preview?mode=${activeMode}&variant=${activeVariant}`
  const loginDestination = `/login?returnTo=${encodeURIComponent(`/checkout?returnTo=${encodeURIComponent(finalDestination)}`)}`

  useEffect(() => {
    if (!shouldLockPreview) return
    navigate(loginDestination, { replace: true })
  }, [shouldLockPreview, navigate, loginDestination])

  if (shouldLockPreview) {
    return null
  }

  return (
    <main className="relative min-h-[100dvh] bg-black text-white" aria-label="Pré-visualização da experiência">
      {activeMode === 'classic' && activeVariant === 'normal' && <ClassicNormal loveData={loveData} />}
      {activeMode === 'classic' && activeVariant === 'netflix' && <ClassicNetflix loveData={loveData} />}
      {activeMode === 'wrapped' && activeVariant === 'stories' && <LovelyflixExperience />}
      {activeMode === 'wrapped' && activeVariant === 'spotify' && <LovelyfyWrapped loveData={loveData} />}
      {activeMode === 'wrapped' && activeVariant === 'jornada' && <JornadaWrapped loveData={loveData} />}
      {activeMode === 'wrapped' && activeVariant === 'game' && <WrappedGameExperience />}
    </main>
  )
}
