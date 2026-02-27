import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/appStore'
import NetflixBootIntro from '../../components/NetflixBootIntro'

function getProfileName(nomePessoa: string) {
  return nomePessoa.trim() || 'Perfil Principal'
}

function getCoupleInitials(nomeCriador: string, nomePessoa: string) {
  const first = nomeCriador.trim()[0]?.toUpperCase() || ''
  const second = nomePessoa.trim()[0]?.toUpperCase() || ''
  const value = `${first}${second}`.trim()
  return value || 'LP'
}

function hasLovelyData(data: ReturnType<typeof useAppContext>['loveData']) {
  return Boolean(data.nomePessoa.trim() && data.nomeCriador.trim() && data.startDate && data.fotoCasalDataUrl)
}

export default function LovelyflixProfileSelect() {
  const location = useLocation()
  const navigate = useNavigate()
  const { config, loveData } = useAppContext()
  const [leaving, setLeaving] = useState(false)
  const params = new URLSearchParams(location.search)
  const isBuilderPreview = params.get('builderPreview') === '1'
  const [showIntro, setShowIntro] = useState(!isBuilderPreview)

  useEffect(() => {
    if (isBuilderPreview) {
      return
    }

    const isLoggedIn = typeof window !== 'undefined' && window.localStorage.getItem('lovely-auth') === '1'
    const hasPaid = typeof window !== 'undefined' && window.localStorage.getItem('lovely-paid') === '1'
    if (!isLoggedIn || !hasPaid) {
      navigate(`/login?returnTo=${encodeURIComponent(`/checkout?returnTo=${encodeURIComponent('/lovelyflix-profile')}`)}`, { replace: true })
      return
    }

    if (!(config.mode === 'wrapped' && config.variant === 'stories')) {
      navigate('/choose-mode', { replace: true })
      return
    }

    if (!hasLovelyData(loveData)) {
      navigate('/builder', { replace: true })
    }
  }, [config.mode, config.variant, loveData, navigate])

  const profileName = useMemo(() => getProfileName(loveData.nomePessoa), [loveData.nomePessoa])
  const profileInitials = useMemo(() => getCoupleInitials(loveData.nomeCriador, loveData.nomePessoa), [loveData.nomeCriador, loveData.nomePessoa])
  const handleEnter = () => {
    if (isBuilderPreview) {
      return
    }
    setLeaving(true)
    window.setTimeout(() => {
      navigate('/lovelyflix')
    }, 320)
  }

  if (showIntro) {
    return <NetflixBootIntro onDone={() => setShowIntro(false)} label="LOVELYFLIX" />
  }

  return (
    <main className="min-h-[100dvh] bg-[#000000] text-white">
      <motion.div
        initial={{ opacity: 0, filter: 'blur(8px)' }}
        animate={{ opacity: leaving ? 0 : 1, filter: leaving ? 'blur(6px)' : 'blur(0px)', x: leaving ? -30 : 0 }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
        className="relative mx-auto min-h-[100dvh] w-full max-w-[390px] overflow-hidden"
      >
        <img src={loveData.fotoCasalDataUrl} alt="Capa do casal" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/35 to-black/90" />

        <div className="absolute left-0 right-0 top-0 z-10 px-5 pt-8">
          <h1 className="text-[2.2rem] font-black leading-none text-white">LOVELY</h1>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 rounded-t-[44px] bg-gradient-to-b from-black/20 via-black/70 to-black/95 px-6 pb-10 pt-9 text-center">
          <p className="mb-6 text-3xl font-medium text-zinc-200">Acesse o presente</p>

          <button
            type="button"
            onClick={handleEnter}
            className="group mx-auto flex cursor-pointer flex-col items-center transition duration-300 focus:outline-none"
            aria-label={`Entrar com o perfil ${profileName}`}
          >
            <div className="flex h-28 w-28 items-center justify-center rounded-2xl border border-white/20 bg-[#141414] text-4xl font-black text-white transition duration-300 group-hover:scale-[1.05] group-hover:border-white/45">
              {profileInitials}
            </div>
            <p className="mt-3 max-w-[11rem] truncate text-3xl font-semibold text-white">{profileName}</p>
          </button>
        </div>
      </motion.div>
    </main>
  )
}
