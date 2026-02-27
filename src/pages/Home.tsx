import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeHeader } from '../components/HomeHeader'
import ilustrativo1 from '../assets/lovelyfy/ilustrativo1.jpeg'
import ilustrativo2 from '../assets/lovelyfy/ilustrativo2.jpeg'
import ilustrativo3 from '../assets/lovelyfy/ilustrativo3.jpeg'
import cupidoPrancheta from '../assets/mascote_cupido/prancheta.png'
import cupidoPincel from '../assets/mascote_cupido/pincel.png'
import cupidoQrcode from '../assets/mascote_cupido/qrcode.png'
import cupidoSurpreso from '../assets/mascote_cupido/surpreso.png'
import wrappedLovelyflixVideo from '../assets/lovelyflix/lovelyflix.mp4'
import wrappedLovelyfyVideo from '../assets/lovelyfy/lovelyfy.mp4'
import wrappedJornadaVideo from '../assets/jornada/jornada.mp4'
import wrappedGameVideo from '../assets/game/game.mp4'
import classicNormalVideo from '../assets/classico-normal/classico-normal.mp4'
import classicLovelyflixVideo from '../assets/classico-lovelyflix/classico-lovelyflix.mp4'

export default function Home() {
  const navigate = useNavigate()
  const typingText = 'única em minutos'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = window.localStorage.getItem('lovely-home-theme')
    return stored === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    window.localStorage.setItem('lovely-home-theme', theme)
  }, [theme])

  const [typedHighlight, setTypedHighlight] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeExperienceIdx, setActiveExperienceIdx] = useState(0)
  const [isExperienceVideoPlaying, setIsExperienceVideoPlaying] = useState(false)
  const [isDataSaver, setIsDataSaver] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        if (!isDeleting) {
          const next = typingText.slice(0, typedHighlight.length + 1)
          setTypedHighlight(next)
          if (next === typingText) {
            setTimeout(() => setIsDeleting(true), 900)
          }
          return
        }

        const next = typingText.slice(0, Math.max(0, typedHighlight.length - 1))
        setTypedHighlight(next)
        if (next.length === 0) {
          setIsDeleting(false)
        }
      },
      isDeleting ? 85 : 130,
    )

    return () => window.clearTimeout(timeout)
  }, [isDeleting, typedHighlight, typingText])

  const isDark = theme === 'dark'
  const frameMedia = [ilustrativo2, ilustrativo1, ilustrativo3]
  const howItWorksImages = [cupidoPrancheta, cupidoPincel, cupidoQrcode, cupidoSurpreso]
  const howItWorksSteps = [
    {
      id: '01',
      title: 'Escolha o estilo',
      description: 'Conte sua história e escolha o formato ideal para criar um presente inesquecível.',
      image: howItWorksImages[0],
    },
    {
      id: '02',
      title: 'Personalize cada detalhe',
      description: 'Adicione fotos, textos e música para deixar tudo com a identidade do seu momento.',
      image: howItWorksImages[1],
    },
    {
      id: '03',
      title: 'Receba seu link e QR',
      description: 'Depois do pagamento, você libera o acesso e recebe o link para compartilhar.',
      image: howItWorksImages[2],
    },
    {
      id: '04',
      title: 'Emocione quem você ama',
      description: 'Envie o presente e transforme esse instante em uma lembrança eterna.',
      image: howItWorksImages[3],
    },
  ]
  // Edite somente os campos fallbackImage e videoSrc para trocar a midia de cada estilo.
  // 4 estilos wrapped + 2 estilos classicos
  const experienceOptions = [
    {
      id: 'wrapped-lovelyflix',
      type: 'wrapped',
      title: 'Wrapped Lovelyflix',
      description: 'Stories cinematograficos com visual premium e dinamico.',
      videoSrc: wrappedLovelyflixVideo,
      fallbackImage: ilustrativo1,
    },
    {
      id: 'wrapped-lovelyfy',
      type: 'wrapped',
      title: 'Wrapped Lovelyfy',
      description: 'Estilo musical para destacar momentos com clima de retrospectiva.',
      videoSrc: wrappedLovelyfyVideo,
      fallbackImage: ilustrativo2,
    },
    {
      id: 'wrapped-jornada',
      type: 'wrapped',
      title: 'Wrapped Jornada',
      description: 'Narrativa por etapas para contar a historia do casal com impacto.',
      videoSrc: wrappedJornadaVideo,
      fallbackImage: ilustrativo3,
    },
    {
      id: 'wrapped-game',
      type: 'wrapped',
      title: 'Wrapped Game',
      description: 'Experiencia interativa com desafio e participacao do casal.',
      videoSrc: wrappedGameVideo,
      fallbackImage: ilustrativo1,
    },
    {
      id: 'classic-normal',
      type: 'classic',
      title: 'Classica Normal',
      description: 'Pagina romantica tradicional com foco em elegancia e emocao.',
      videoSrc: classicNormalVideo,
      fallbackImage: ilustrativo1,
    },
    {
      id: 'classic-lovelyflix',
      type: 'classic',
      title: 'Classica Lovelyflix',
      description: 'Versao classica com estetica de streaming e destaque visual.',
      videoSrc: classicLovelyflixVideo,
      fallbackImage: ilustrativo3,
    },
  ]
  const activeExperience = experienceOptions[activeExperienceIdx]
  const prevExperience = experienceOptions[(activeExperienceIdx - 1 + experienceOptions.length) % experienceOptions.length]
  const nextExperience = experienceOptions[(activeExperienceIdx + 1) % experienceOptions.length]
  const hearts = [
    { left: '7%', top: '16%', size: '38px', rotate: '-18deg', delay: 0.1 },
    { left: '88%', top: '23%', size: '46px', rotate: '12deg', delay: 0.4 },
    { left: '9%', top: '76%', size: '44px', rotate: '-12deg', delay: 0.2 },
    { left: '84%', top: '79%', size: '34px', rotate: '18deg', delay: 0.7 },
  ]

  useEffect(() => {
    setIsExperienceVideoPlaying(false)
  }, [activeExperienceIdx])

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    type NavigatorConnection = {
      saveData?: boolean
      effectiveType?: string
      addEventListener?: (type: 'change', listener: () => void) => void
      removeEventListener?: (type: 'change', listener: () => void) => void
    }
    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection
    if (!connection) return

    const apply = () => {
      const slowNetwork = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
      setIsDataSaver(Boolean(connection.saveData || slowNetwork))
    }

    apply()
    connection.addEventListener?.('change', apply)
    return () => connection.removeEventListener?.('change', apply)
  }, [])

  return (
    <main
      className={`relative min-h-[100dvh] overflow-hidden px-3 py-6 transition-colors sm:px-6 sm:py-10 ${
        isDark ? 'bg-[#0f0f0f] text-[#f5f5f5]' : 'bg-[#fff6fb] text-[#2d1222]'
      }`}
    >
      <div
        className={`absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_15%_20%,rgba(255,79,163,0.3),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(255,47,122,0.22),transparent_35%)]'
            : 'bg-[radial-gradient(circle_at_18%_16%,rgba(255,79,163,0.25),transparent_36%),radial-gradient(circle_at_82%_86%,rgba(255,47,122,0.18),transparent_36%)]'
        }`}
        aria-hidden
      />
      <motion.div
        animate={{ opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 9, repeat: Infinity }}
        className={`absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl ${
          isDark ? 'bg-pink-500/30' : 'bg-pink-400/35'
        }`}
      />

      <HomeHeader
        isDark={isDark}
        onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
        onCreate={() => navigate('/choose-mode')}
      />

      <div className="relative mx-auto mt-8 grid w-full max-w-6xl gap-6 md:min-h-[78vh] md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <section className="text-left md:pr-6">
          <p className={`mb-4 text-xs uppercase tracking-[0.28em] ${isDark ? 'text-pink-300' : 'text-pink-700'}`}>
            Seja bem vindo ao Lovelyfy, onde não construimos apenas presentes, mas experiências e sonhos
          </p>
          <h1 className="max-w-3xl font-serif text-3xl leading-tight sm:text-4xl md:text-6xl">
            Crie sua experiência
            <span className={`ml-2 inline-block ${isDark ? 'text-pink-400' : 'text-pink-600'}`}>
              {typedHighlight}
              <span className="ml-0.5 inline-block animate-pulse">|</span>
            </span>
          </h1>
          <p className={`mt-5 max-w-2xl text-base md:text-lg ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Monte seu presente com fotos, momentos e mensagens. Escolha entre estilos clássicos ou wrapped e compartilhe um link inesquecível.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate('/choose-mode')}
              className="rounded-full bg-pink-500 px-8 py-4 text-sm font-semibold text-black transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(255,47,122,0.75)]"
            >
              Começar agora
            </button>
          </div>
        </section>

        <section className="relative h-[420px] sm:h-[520px] md:h-[620px]">
          <motion.div
            animate={{ rotate: [-13, -10, -13], y: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-10 left-2 z-10 h-[300px] w-[155px] rounded-[32px] border-[5px] border-zinc-800 bg-[#171717] p-2 sm:h-[390px] sm:w-[200px] sm:rounded-[36px] sm:border-[6px]"
          >
            <div className="h-full w-full overflow-hidden rounded-[26px]">
              <img src={frameMedia[0]} alt="Preview lovelyfy 1" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            animate={{ rotate: [12, 9, 12], y: [0, -6, 0] }}
            transition={{ duration: 7.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-10 right-2 z-10 h-[300px] w-[155px] rounded-[32px] border-[5px] border-zinc-800 bg-[#171717] p-2 sm:h-[390px] sm:w-[200px] sm:rounded-[36px] sm:border-[6px]"
          >
            <div className="h-full w-full overflow-hidden rounded-[26px]">
              <img src={frameMedia[2]} alt="Preview lovelyfy 3" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-1/2 z-30 h-[370px] w-[190px] -translate-x-1/2 rounded-[36px] border-[6px] border-zinc-800 bg-[#191625] p-2 shadow-2xl sm:h-[470px] sm:w-[245px] sm:rounded-[42px] sm:border-[7px]"
          >
            <div className="h-full w-full overflow-hidden rounded-[30px]">
              <img src={frameMedia[1]} alt="Preview lovelyfy 2" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </section>
      </div>

      <section className="relative mx-auto mt-10 w-full max-w-6xl pb-8">
        <div className={`rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-zinc-800 bg-[#131318]/85' : 'border-pink-200 bg-white/85'}`}>
          <div className="mx-auto max-w-4xl text-center">
            <p className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${isDark ? 'border-pink-500/35 bg-pink-500/10 text-pink-300' : 'border-pink-300 bg-pink-50 text-pink-700'}`}>
              Como funciona
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              Crie um presente inesquecível em{' '}
              <span className={isDark ? 'text-pink-400' : 'text-pink-600'}>4 passos simples</span>
            </h2>
            <p className={`mx-auto mt-3 max-w-3xl text-sm sm:text-lg ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Nossa plataforma facilita cada etapa para você criar uma experiência digital personalizada.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {howItWorksSteps.map((step, index) => (
              <motion.article
                key={step.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                className={`relative rounded-3xl border p-4 pt-8 text-center transition ${isDark ? 'border-zinc-700 bg-[#1a1a22] hover:border-pink-500/60' : 'border-pink-200 bg-[#fff9fd] hover:border-pink-400'}`}
              >
                <div className={`absolute left-1/2 top-0 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-base font-black ${isDark ? 'bg-pink-500 text-black' : 'bg-pink-500 text-white'}`}>
                  {step.id}
                </div>
                <div className={`relative mx-auto mt-2 h-34 w-34 overflow-hidden rounded-2xl border ${isDark ? 'border-zinc-600 bg-zinc-800/70' : 'border-pink-200 bg-pink-50'}`}>
                  <motion.img
                    src={step.image}
                    alt={step.title}
                    className="h-full w-full object-contain p-2"
                    animate={{ x: [0, -2, 0], rotate: [0, -1.5, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.8 + index * 0.35 }}
                  />
                  <motion.span
                    aria-hidden
                    className={`pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-lg ${isDark ? 'text-pink-300' : 'text-pink-500'}`}
                    animate={{ x: [0, 12, 42, 74], opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.9] }}
                    transition={{ duration: 1.05, repeat: Infinity, repeatDelay: 2.35 + index * 0.35, ease: 'easeOut' }}
                  >
                    ➤
                  </motion.span>
                </div>
                <h3 className="mt-4 text-2xl font-bold leading-tight">{step.title}</h3>
                <p className={`mt-3 text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>{step.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-8 w-full max-w-6xl overflow-x-hidden pb-8 sm:mt-10 sm:pb-10">
        <div className={`rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-zinc-800 bg-[#131318]/85' : 'border-pink-200 bg-white/90'}`}>
          <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative mx-auto flex h-[305px] w-full max-w-[220px] items-center justify-center sm:h-[540px] sm:max-w-[360px]">
              <motion.div
                key={`left-${prevExperience.id}`}
                initial={{ opacity: 0.25, x: -20 }}
                animate={{ opacity: 0.38, x: 0 }}
                transition={{ duration: 0.35 }}
                className={`absolute left-1 top-1/2 h-[230px] w-[112px] -translate-y-1/2 rotate-[-12deg] rounded-[1.5rem] border p-1.5 sm:left-0 sm:h-[420px] sm:w-[205px] sm:rounded-[2rem] sm:p-2 ${isDark ? 'border-zinc-700 bg-[#0f0f14]/75' : 'border-pink-200 bg-[#f7f1ff]/80'}`}
              >
                <div className="h-full w-full overflow-hidden rounded-[1.1rem] sm:rounded-[1.5rem]">
                  <img src={prevExperience.fallbackImage} alt={prevExperience.title} loading="lazy" className="h-full w-full object-cover opacity-90" />
                </div>
              </motion.div>

              <motion.div
                key={`right-${nextExperience.id}`}
                initial={{ opacity: 0.25, x: 20 }}
                animate={{ opacity: 0.38, x: 0 }}
                transition={{ duration: 0.35 }}
                className={`absolute right-1 top-1/2 h-[230px] w-[112px] -translate-y-1/2 rotate-[12deg] rounded-[1.5rem] border p-1.5 sm:right-0 sm:h-[420px] sm:w-[205px] sm:rounded-[2rem] sm:p-2 ${isDark ? 'border-zinc-700 bg-[#0f0f14]/75' : 'border-pink-200 bg-[#f7f1ff]/80'}`}
              >
                <div className="h-full w-full overflow-hidden rounded-[1.1rem] sm:rounded-[1.5rem]">
                  <img src={nextExperience.fallbackImage} alt={nextExperience.title} loading="lazy" className="h-full w-full object-cover opacity-90" />
                </div>
              </motion.div>

              <motion.article
                key={activeExperience.id}
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className={`relative z-20 h-[300px] w-[152px] rounded-[1.9rem] border-[4px] p-2 shadow-2xl sm:h-[500px] sm:w-[250px] sm:rounded-[2.5rem] sm:border-[7px] ${isDark ? 'border-zinc-800 bg-[#171725]' : 'border-zinc-800 bg-[#191622]'}`}
              >
                <div className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-black/70 sm:w-18" />
                <div className="h-full w-full overflow-hidden rounded-[1.5rem] bg-black sm:rounded-[2rem]">
                  {activeExperience.videoSrc && isExperienceVideoPlaying && !isDataSaver ? (
                    <video
                      src={activeExperience.videoSrc}
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (isDataSaver) return
                        setIsExperienceVideoPlaying(true)
                      }}
                      disabled={isDataSaver}
                      className="relative h-full w-full"
                    >
                      <video
                        src={activeExperience.videoSrc}
                        className="h-full w-full object-cover opacity-75"
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 grid place-items-center bg-black/35">
                        <span className="rounded-full border border-white/35 bg-black/60 px-3 py-1.5 text-xs font-semibold text-white sm:px-4 sm:py-2 sm:text-sm">
                          {isDataSaver ? 'Prévia do vídeo' : 'Tocar vídeo'}
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </motion.article>
            </div>

            <div className="min-w-0 px-1 sm:px-0">
              <p className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${isDark ? 'border-pink-500/35 bg-pink-500/10 text-pink-300' : 'border-pink-300 bg-pink-50 text-pink-700'}`}>
                Modelos em destaque
              </p>
              <p className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${activeExperience.type === 'wrapped' ? isDark ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200' : 'border-cyan-300 bg-cyan-50 text-cyan-700' : isDark ? 'border-amber-400/40 bg-amber-500/10 text-amber-200' : 'border-amber-300 bg-amber-50 text-amber-700'}`}>
                {activeExperience.type === 'wrapped' ? 'Wrapped' : 'Classica'}
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">{activeExperience.title}</h2>
              <p className={`mt-3 max-w-2xl break-words text-base leading-relaxed sm:mt-4 sm:text-xl ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{activeExperience.description}</p>

              <div className="mt-6 space-y-3 sm:hidden">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveExperienceIdx((prev) => (prev - 1 + experienceOptions.length) % experienceOptions.length)}
                    className={`min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-pink-400' : 'border-pink-200 bg-white text-zinc-700 hover:border-pink-400'}`}
                    aria-label="Opção anterior"
                  >
                    ← Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveExperienceIdx((prev) => (prev + 1) % experienceOptions.length)}
                    className={`min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm font-semibold transition ${isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-100 hover:border-pink-400' : 'border-pink-200 bg-white text-zinc-700 hover:border-pink-400'}`}
                    aria-label="Próxima opção"
                  >
                    Próximo →
                  </button>
                </div>
                <div className="flex items-center justify-center gap-1.5">
                  {experienceOptions.map((item, idx) => (
                    <button
                      key={`mobile-dot-${item.id}`}
                      type="button"
                      onClick={() => setActiveExperienceIdx(idx)}
                      className={`h-2.5 rounded-full transition ${activeExperienceIdx === idx ? 'w-7 bg-pink-500' : isDark ? 'w-2.5 bg-zinc-600' : 'w-2.5 bg-zinc-300'}`}
                      aria-label={`Selecionar ${item.title}`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {experienceOptions.map((item, idx) => (
                    <button
                      key={`mobile-chip-${item.id}`}
                      type="button"
                      onClick={() => setActiveExperienceIdx(idx)}
                      className={`min-w-0 rounded-full border px-2 py-1.5 text-xs font-semibold leading-tight transition ${activeExperienceIdx === idx ? 'border-pink-500 bg-pink-500/15 text-pink-300' : isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-300' : 'border-zinc-300 bg-white text-zinc-700'}`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 hidden items-center gap-3 sm:flex">
                <button
                  type="button"
                  onClick={() => setActiveExperienceIdx((prev) => (prev - 1 + experienceOptions.length) % experienceOptions.length)}
                  className={`grid h-11 w-11 place-items-center rounded-full border text-xl transition ${isDark ? 'border-zinc-600 bg-zinc-900 text-zinc-100 hover:border-pink-400' : 'border-pink-200 bg-white text-zinc-700 hover:border-pink-400'}`}
                  aria-label="Opção anterior"
                >
                  ‹
                </button>
                <div className="flex items-center gap-2">
                  {experienceOptions.map((item, idx) => (
                    <button
                      key={`desktop-dot-${item.id}`}
                      type="button"
                      onClick={() => setActiveExperienceIdx(idx)}
                      className={`h-2.5 rounded-full transition ${activeExperienceIdx === idx ? 'w-8 bg-pink-500' : isDark ? 'w-2.5 bg-zinc-600 hover:bg-zinc-500' : 'w-2.5 bg-zinc-300 hover:bg-zinc-400'}`}
                      aria-label={`Selecionar ${item.title}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setActiveExperienceIdx((prev) => (prev + 1) % experienceOptions.length)}
                  className={`grid h-11 w-11 place-items-center rounded-full border text-xl transition ${isDark ? 'border-zinc-600 bg-zinc-900 text-zinc-100 hover:border-pink-400' : 'border-pink-200 bg-white text-zinc-700 hover:border-pink-400'}`}
                  aria-label="Próxima opção"
                >
                  ›
                </button>
              </div>

              <div className="mt-6 hidden flex-wrap gap-2 sm:flex">
                {experienceOptions.map((item, idx) => (
                  <button
                    key={`chip-${item.id}`}
                    type="button"
                    onClick={() => setActiveExperienceIdx(idx)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${activeExperienceIdx === idx ? 'border-pink-500 bg-pink-500/15 text-pink-300' : isDark ? 'border-zinc-700 bg-zinc-900 text-zinc-300 hover:border-pink-400/60' : 'border-zinc-300 bg-white text-zinc-700 hover:border-pink-400/60'}`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => navigate('/choose-mode')}
                className="mt-8 w-full rounded-2xl bg-emerald-500 px-7 py-4 text-base font-semibold text-white transition hover:brightness-110 sm:w-auto"
              >
                Criar meu presente
              </button>
            </div>
          </div>
        </div>
      </section>

      {hearts.map((heart, idx) => (
        <motion.span
          key={`heart-${heart.left}-${heart.top}`}
          aria-hidden
          className={`pointer-events-none absolute hidden select-none sm:block ${isDark ? 'text-pink-300/40' : 'text-pink-400/55'}`}
          style={{ left: heart.left, top: heart.top, fontSize: heart.size, rotate: heart.rotate }}
          animate={{ y: [0, -10, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 6.8 + idx, repeat: Infinity, delay: heart.delay, ease: 'easeInOut' }}
        >
          ❤
        </motion.span>
      ))}
    </main>
  )
}
