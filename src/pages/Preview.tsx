import { Link } from 'react-router-dom'
import { ClassicNetflix } from '../components/ClassicNetflix'
import { ClassicNormal } from '../components/ClassicNormal'
import { JornadaWrapped } from '../modules/jornada/JornadaWrapped'
import WrappedGameExperience from '../modules/wrapped-game/WrappedGameExperience'
import { LovelyfyWrapped } from '../modules/lovelyfy/LovelyfyWrapped'
import { WrappedStories } from '../components/WrappedStories'
import { useAppContext } from '../context/appStore'

export default function Preview() {
  const { config, loveData } = useAppContext()

  return (
    <main className="relative min-h-[100dvh] bg-black text-white" aria-label="Pré-visualização da experiência">
      <div className="fixed left-3 top-3 z-50 flex gap-2 sm:left-4 sm:top-4">
        <Link
          to="/"
          className="rounded-full border border-zinc-600 bg-zinc-900/70 px-4 py-2 text-xs uppercase tracking-[0.16em] focus-visible:ring-2 focus-visible:ring-white/80"
        >
          Home
        </Link>
      </div>

      {config.mode === 'classic' && config.variant === 'normal' && <ClassicNormal loveData={loveData} />}
      {config.mode === 'classic' && config.variant === 'netflix' && <ClassicNetflix loveData={loveData} />}
      {config.mode === 'wrapped' && config.variant === 'stories' && <WrappedStories loveData={loveData} theme={config.theme} />}
      {config.mode === 'wrapped' && config.variant === 'spotify' && <LovelyfyWrapped loveData={loveData} />}
      {config.mode === 'wrapped' && config.variant === 'jornada' && <JornadaWrapped loveData={loveData} />}
      {config.mode === 'wrapped' && config.variant === 'game' && <WrappedGameExperience />}
    </main>
  )
}
