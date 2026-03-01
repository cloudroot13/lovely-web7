import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeHeader } from '../components/HomeHeader'
import { HomeFooter } from '../components/HomeFooter'
import ilustrativo1 from '../assets/lovelyfy/ilustrativo1.jpeg'
import ilustrativo2 from '../assets/lovelyfy/ilustrativo2.jpeg'
import ilustrativo3 from '../assets/lovelyfy/ilustrativo3.jpeg'
import cupidoPrancheta from '../assets/mascote_cupido/prancheta.png'
import cupidoPincel from '../assets/mascote_cupido/pincel.png'
import cupidoQrcode from '../assets/mascote_cupido/qrcode.png'
import cupidoSurpreso from '../assets/mascote_cupido/surpreso.png'
import cupidoCoracao from '../assets/mascote_cupido/coracao.png'
import wrappedLovelyflixVideo from '../assets/lovelyflix/lovelyflix.mp4'
import wrappedLovelyfyVideo from '../assets/lovelyfy/lovelyfy.mp4'
import wrappedJornadaVideo from '../assets/jornada/jornada.mp4'
import wrappedGameVideo from '../assets/game/game.mp4'
import classicNormalVideo from '../assets/classico-normal/classico-normal.mp4'
import classicLovelyflixVideo from '../assets/classico-lovelyflix/classico-lovelyflix.mp4'
import lovelyflixDemoImage1 from '../assets/lovelyflix/demo1.jpeg'
import lovelyflixDemoImage2 from '../assets/lovelyflix/demo2.jpeg'
import { isAuthenticated } from '../utils/auth'

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

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('lovely-home-theme', next)
      }
      return next
    })
  }

  const [typedHighlight, setTypedHighlight] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeExperienceIdx, setActiveExperienceIdx] = useState(0)
  const [isExperienceVideoPlaying, setIsExperienceVideoPlaying] = useState(false)
  const [isDataSaver, setIsDataSaver] = useState(false)
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq1')
  const [isMobileViewport, setIsMobileViewport] = useState(false)
  const [isLiteMode, setIsLiteMode] = useState(false)
  const [allowCommentMarquee, setAllowCommentMarquee] = useState(true)
  const [isFeaturesInView, setIsFeaturesInView] = useState(false)
  const [isDemoBannerInView, setIsDemoBannerInView] = useState(false)
  const featuresSectionRef = useRef<HTMLElement | null>(null)
  const demoBannerSectionRef = useRef<HTMLElement | null>(null)

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
  const featureCards = [
    {
      id: 'always-online',
      title: 'Para sempre no ar',
      description: 'Seu presente fica online para acessar quando quiser, em qualquer dispositivo.',
      icon: '☁',
      image: cupidoCoracao,
    },
    {
      id: 'fully-custom',
      title: '100% personalizável',
      description: 'Combine fotos, vídeos, músicas e textos para criar algo único de verdade.',
      icon: '✦',
      image: cupidoPincel,
    },
  ]
  const testimonials = [
    {
      id: 'ts1',
      name: 'Ana Clara',
      when: '3 semanas atrás',
      text: 'Fiz para o meu noivo e ele chorou no capítulo final. Ficou com cara de streaming de verdade.',
      avatar: 'https://i.pravatar.cc/120?img=12',
    },
    {
      id: 'ts2',
      name: 'João e Mari',
      when: '1 mês atrás',
      text: 'A demo já convenceu a gente. A experiência interativa deixou todo mundo em choque.',
      avatar: 'https://i.pravatar.cc/120?img=18',
    },
    {
      id: 'ts3',
      name: 'Carla',
      when: '2 semanas atrás',
      text: 'Usei no aniversário da minha mãe. Ela reviu as fotos antigas e ficou emocionada.',
      avatar: 'https://i.pravatar.cc/120?img=32',
    },
    {
      id: 'ts4',
      name: 'Lucas',
      when: '1 mês atrás',
      text: 'A estética preta e rosa ficou perfeita no celular. Parece app premium mesmo.',
      avatar: 'https://i.pravatar.cc/120?img=52',
    },
    {
      id: 'ts5',
      name: 'Rafaela',
      when: '5 dias atrás',
      text: 'Montei em poucos minutos e o resultado ficou muito acima do que eu esperava.',
      avatar: 'https://i.pravatar.cc/120?img=44',
    },
    {
      id: 'ts6',
      name: 'Bruno',
      when: '2 meses atrás',
      text: 'O formato de episódios com história do casal foi o que mais chamou atenção aqui em casa.',
      avatar: 'https://i.pravatar.cc/120?img=61',
    },
  ]
  const testimonialsRowA = testimonials.slice(0, 3)
  const testimonialsRowB = testimonials.slice(3)
  const faqItems = [
    {
      id: 'faq1',
      question: 'O que é a Lovelyfy?',
      answer: 'A Lovelyfy é uma plataforma para criar presentes digitais personalizados com fotos, vídeos, textos e experiências interativas.',
    },
    {
      id: 'faq2',
      question: 'Para quem posso criar um presente?',
      answer: 'Você pode criar para namorada(o), mãe, pai, avó, amiga(o) e para qualquer pessoa especial.',
    },
    {
      id: 'faq3',
      question: 'Como funciona? Preciso saber editar?',
      answer: 'Não. Você só preenche os dados, envia as mídias e a plataforma monta tudo para você automaticamente.',
    },
    {
      id: 'faq4',
      question: 'O site fica no ar para sempre?',
      answer: 'Depende do plano escolhido. Temos opções de 24h, anual e vitalício.',
    },
    {
      id: 'faq5',
      question: 'Como entrego a surpresa?',
      answer: 'Você recebe um link para compartilhar e pode transformar em QR Code para entregar de forma criativa.',
    },
    {
      id: 'faq6',
      question: 'O acesso é imediato após o pagamento?',
      answer: 'Sim. Assim que o pagamento é confirmado, o acesso ao presente é liberado.',
    },
    {
      id: 'faq7',
      question: 'Se eu errar algo, posso editar depois?',
      answer: 'Sim. Você pode editar conteúdo e atualizar informações conforme o plano contratado.',
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

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(max-width: 768px)')
    const apply = () => setIsMobileViewport(media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lowCpu = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4
    const lowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
      ? ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4
      : false
    setIsLiteMode(Boolean(reducedMotion || isDataSaver || lowCpu || lowMemory || isMobileViewport))
  }, [isDataSaver, isMobileViewport])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setAllowCommentMarquee(!media.matches)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  const shouldAnimate = !isLiteMode

  useEffect(() => {
    const targets = [
      { element: featuresSectionRef.current, key: 'features' as const },
      { element: demoBannerSectionRef.current, key: 'demo' as const },
    ].filter((item): item is { element: HTMLElement; key: 'features' | 'demo' } => Boolean(item.element))

    if (targets.length === 0) return

    const markVisible = (key: 'features' | 'demo') => {
      if (key === 'features') setIsFeaturesInView(true)
      if (key === 'demo') setIsDemoBannerInView(true)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = (entry.target as HTMLElement).dataset.observeKey as 'features' | 'demo'
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            markVisible(key)
          }
        })
      },
      { threshold: [0, 0.01, 0.08], rootMargin: '180px 0px 180px 0px' },
    )

    targets.forEach(({ element, key }) => {
      element.dataset.observeKey = key
      observer.observe(element)

      const rect = element.getBoundingClientRect()
      const vh = window.innerHeight || document.documentElement.clientHeight
      if (rect.top < vh * 0.95 && rect.bottom > vh * 0.05) {
        markVisible(key)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <main
      className={`relative min-h-[100dvh] overflow-x-hidden px-3 pt-24 pb-0 transition-colors sm:px-6 sm:pt-28 sm:pb-0 ${
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
        animate={shouldAnimate ? { opacity: [0.25, 0.45, 0.25] } : undefined}
        transition={shouldAnimate ? { duration: 9, repeat: Infinity } : undefined}
        className={`absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl ${
          isDark ? 'bg-pink-500/30' : 'bg-pink-400/35'
        }`}
      />

      <div className="fixed inset-x-0 top-3 z-[80] px-3 sm:px-6">
        <HomeHeader
          isDark={isDark}
          onBrandClick={() => navigate('/login')}
          onToggleTheme={toggleTheme}
          onLogin={() => navigate('/login')}
          onAccount={() => navigate('/minha-conta')}
          showAccount={isAuthenticated()}
          onCreate={() => navigate('/choose-mode')}
          onFaq={() => navigate('/faq')}
          onAbout={() => navigate('/sobre')}
        />
      </div>

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
            animate={shouldAnimate ? { rotate: [-13, -10, -13], y: [0, -5, 0] } : undefined}
            transition={shouldAnimate ? { duration: 7, repeat: Infinity, ease: 'easeInOut' } : undefined}
            className="absolute bottom-10 left-2 z-10 h-[300px] w-[155px] rounded-[32px] border-[5px] border-zinc-800 bg-[#171717] p-2 sm:h-[390px] sm:w-[200px] sm:rounded-[36px] sm:border-[6px]"
          >
            <div className="h-full w-full overflow-hidden rounded-[26px]">
              <img src={frameMedia[0]} alt="Preview lovelyfy 1" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            animate={shouldAnimate ? { rotate: [12, 9, 12], y: [0, -6, 0] } : undefined}
            transition={shouldAnimate ? { duration: 7.4, repeat: Infinity, ease: 'easeInOut' } : undefined}
            className="absolute bottom-10 right-2 z-10 h-[300px] w-[155px] rounded-[32px] border-[5px] border-zinc-800 bg-[#171717] p-2 sm:h-[390px] sm:w-[200px] sm:rounded-[36px] sm:border-[6px]"
          >
            <div className="h-full w-full overflow-hidden rounded-[26px]">
              <img src={frameMedia[2]} alt="Preview lovelyfy 3" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            animate={shouldAnimate ? { y: [0, -10, 0] } : undefined}
            transition={shouldAnimate ? { duration: 6.2, repeat: Infinity, ease: 'easeInOut' } : undefined}
            className="absolute bottom-0 left-1/2 z-30 h-[370px] w-[190px] -translate-x-1/2 rounded-[36px] border-[6px] border-zinc-800 bg-[#191625] p-2 shadow-2xl sm:h-[470px] sm:w-[245px] sm:rounded-[42px] sm:border-[7px]"
          >
            <div className="h-full w-full overflow-hidden rounded-[30px]">
              <img src={frameMedia[1]} alt="Preview lovelyfy 2" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </section>
      </div>

      <section id="como-funciona" className="relative mx-auto mt-10 w-full max-w-6xl pb-8">
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

      <section id="recursos" ref={featuresSectionRef} className="relative mx-auto mt-8 w-full max-w-6xl pb-10 sm:mt-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${isDark ? 'border-pink-500/35 bg-pink-500/10 text-pink-300' : 'border-pink-300 bg-pink-50 text-pink-700'}`}>
            Recursos
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
            Crie um presente <span className={isDark ? 'text-pink-400' : 'text-pink-600'}>memorável e único</span>
          </h2>
          <p className={`mx-auto mt-3 max-w-3xl text-sm sm:text-lg ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Cada card destaca um diferencial para emocionar com visual premium e desempenho leve.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {featureCards.map((card) => (
            <motion.article
              key={card.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className={`rounded-3xl border p-5 transition ${isDark ? 'border-zinc-700 bg-[#14141c] hover:border-pink-500/70 hover:shadow-[0_0_28px_rgba(255,47,122,0.22)]' : 'border-pink-200 bg-white/90 hover:border-pink-400 hover:shadow-[0_0_24px_rgba(255,79,163,0.2)]'}`}
            >
              <span className={`inline-grid h-10 w-10 place-items-center rounded-xl text-lg ${isDark ? 'bg-pink-500/15 text-pink-300' : 'bg-pink-50 text-pink-600'}`}>{card.icon}</span>
              <h3 className="mt-4 text-3xl font-bold leading-tight">{card.title}</h3>
              <p className={`mt-3 text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>{card.description}</p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                <img src={card.image} alt={card.title} loading="lazy" className="h-44 w-full object-contain p-3 transition duration-300 hover:scale-105" />
              </div>
            </motion.article>
          ))}

          <motion.article
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`rounded-3xl border p-5 transition md:row-span-2 ${isDark ? 'border-zinc-700 bg-[#14141c] hover:border-pink-500/70 hover:shadow-[0_0_28px_rgba(255,47,122,0.22)]' : 'border-pink-200 bg-white/90 hover:border-pink-400 hover:shadow-[0_0_24px_rgba(255,79,163,0.2)]'}`}
          >
            <span className={`inline-grid h-10 w-10 place-items-center rounded-xl text-lg ${isDark ? 'bg-pink-500/15 text-pink-300' : 'bg-pink-50 text-pink-600'}`}>♫</span>
            <h3 className="mt-4 text-3xl font-bold leading-tight">Com retrospectiva única</h3>
            <p className={`mt-3 text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              Uma retrospectiva animada para reviver sua história com ritmo, emoção e impacto visual.
            </p>
            <div className="mx-auto mt-6 w-full max-w-[230px] rounded-[2rem] border-[5px] border-zinc-800 bg-[#191622] p-2 shadow-2xl">
              <div className="h-[380px] overflow-hidden rounded-[1.6rem] bg-black">
                {isFeaturesInView && !isLiteMode ? (
                  <video
                    key="features-video-active"
                    src={wrappedLovelyfyVideo}
                    className="h-full w-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img src={lovelyflixDemoImage1} alt="Prévia retrospectiva" className="h-full w-full object-cover opacity-80" loading="lazy" />
                )}
              </div>
            </div>
          </motion.article>

          <motion.article
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={`rounded-3xl border p-5 transition md:col-span-2 ${isDark ? 'border-zinc-700 bg-[#14141c] hover:border-pink-500/70 hover:shadow-[0_0_28px_rgba(255,47,122,0.22)]' : 'border-pink-200 bg-white/90 hover:border-pink-400 hover:shadow-[0_0_24px_rgba(255,79,163,0.2)]'}`}
          >
            <span className={`inline-grid h-10 w-10 place-items-center rounded-xl text-lg ${isDark ? 'bg-pink-500/15 text-pink-300' : 'bg-pink-50 text-pink-600'}`}>📷</span>
            <h3 className="mt-4 text-3xl font-bold leading-tight">Relembre seus melhores momentos</h3>
            <p className={`mt-3 text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              Monte uma narrativa afetiva com suas melhores fotos, criando uma lembrança digital que fica para sempre.
            </p>
            <div className="relative mx-auto mt-6 h-[260px] w-full max-w-[420px]">
              <motion.div
                animate={isFeaturesInView && shouldAnimate ? { rotate: [-12, -9, -12], y: [0, -4, 0] } : { rotate: -12, y: 0 }}
                transition={isFeaturesInView && shouldAnimate ? { duration: 6.8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                className={`absolute left-2 top-8 z-10 h-[180px] w-[96px] rounded-[1.4rem] border-[4px] p-1.5 sm:left-6 sm:h-[210px] sm:w-[112px] ${isDark ? 'border-zinc-700 bg-[#14141b]' : 'border-zinc-400 bg-[#18181f]'}`}
              >
                <div className="h-full w-full overflow-hidden rounded-[1rem]">
                  <img src={ilustrativo1} alt="Momento especial 1" loading="lazy" className="h-full w-full object-cover" />
                </div>
              </motion.div>

              <motion.div
                animate={isFeaturesInView && shouldAnimate ? { y: [0, -9, 0] } : { y: 0 }}
                transition={isFeaturesInView && shouldAnimate ? { duration: 6.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                className={`absolute left-1/2 top-1 z-20 h-[220px] w-[116px] -translate-x-1/2 rounded-[1.7rem] border-[4px] p-1.5 shadow-2xl sm:h-[250px] sm:w-[132px] ${isDark ? 'border-zinc-800 bg-[#171725]' : 'border-zinc-700 bg-[#191622]'}`}
              >
                <div className="h-full w-full overflow-hidden rounded-[1.25rem]">
                  <img src={ilustrativo2} alt="Momento especial 2" loading="lazy" className="h-full w-full object-cover" />
                </div>
              </motion.div>

              <motion.div
                animate={isFeaturesInView && shouldAnimate ? { rotate: [12, 9, 12], y: [0, -4, 0] } : { rotate: 12, y: 0 }}
                transition={isFeaturesInView && shouldAnimate ? { duration: 7.1, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
                className={`absolute right-2 top-8 z-10 h-[180px] w-[96px] rounded-[1.4rem] border-[4px] p-1.5 sm:right-6 sm:h-[210px] sm:w-[112px] ${isDark ? 'border-zinc-700 bg-[#14141b]' : 'border-zinc-400 bg-[#18181f]'}`}
              >
                <div className="h-full w-full overflow-hidden rounded-[1rem]">
                  <img src={ilustrativo3} alt="Momento especial 3" loading="lazy" className="h-full w-full object-cover" />
                </div>
              </motion.div>
            </div>
          </motion.article>
        </div>
      </section>

      <section ref={demoBannerSectionRef} className="relative mx-auto mt-6 w-full max-w-6xl pb-10 sm:mt-10">
        <div className="relative overflow-hidden rounded-[2rem] border border-pink-500/45 bg-[radial-gradient(circle_at_20%_20%,rgba(255,47,122,0.34),transparent_38%),radial-gradient(circle_at_82%_75%,rgba(255,90,160,0.2),transparent_36%),linear-gradient(135deg,#130b14,#09070d_55%,#180914)] px-5 py-10 sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.06)_48%,transparent_100%)]" />

          <motion.div
            animate={isDemoBannerInView && shouldAnimate ? { rotate: [-11, -9, -11], y: [0, -4, 0] } : { rotate: -11, y: 0 }}
            transition={isDemoBannerInView && shouldAnimate ? { duration: 7, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
            className="absolute -left-4 bottom-[-36px] hidden h-[260px] w-[140px] rounded-[1.8rem] border-[4px] border-zinc-800 bg-[#171717] p-1.5 sm:block"
          >
            <div className="h-full w-full overflow-hidden rounded-[1.4rem]">
              <img src={lovelyflixDemoImage2} alt="Prévia demo 1" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.div
            animate={isDemoBannerInView && shouldAnimate ? { rotate: [11, 9, 11], y: [0, -4, 0] } : { rotate: 11, y: 0 }}
            transition={isDemoBannerInView && shouldAnimate ? { duration: 7.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
            className="absolute -right-4 bottom-[-40px] hidden h-[280px] w-[150px] rounded-[1.9rem] border-[4px] border-zinc-800 bg-[#171717] p-1.5 sm:block"
          >
            <div className="h-full w-full overflow-hidden rounded-[1.45rem]">
              <img src={lovelyflixDemoImage1} alt="Prévia demo 2" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-black leading-tight text-white sm:text-6xl">
              Teste Nossa
              <br />
              Demo Interativa
            </h2>
            <button
              type="button"
              onClick={() => navigate('/demo/wrapped-lovelyflix')}
              className="mt-6 rounded-2xl border border-pink-400/50 bg-pink-500 px-6 py-3 text-base font-semibold text-black shadow-[0_8px_30px_rgba(255,47,122,0.35)] transition hover:scale-[1.02] hover:brightness-110"
            >
              Explorar a Demo
            </button>
            <p className="mt-3 text-sm font-medium text-pink-100/90">Demo pronta com dados mockados, sem edição.</p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-4 w-full max-w-6xl pb-14 sm:mt-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${isDark ? 'border-pink-500/35 bg-pink-500/10 text-pink-300' : 'border-pink-300 bg-pink-50 text-pink-700'}`}>
            Depoimentos
          </p>
          <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
            O que nossos <span className={isDark ? 'text-pink-400' : 'text-pink-600'}>clientes dizem</span>
          </h2>
          <p className={`mx-auto mt-3 max-w-3xl text-sm sm:text-lg ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Histórias reais com visual emocional e experiência premium no celular.
          </p>
        </div>

        <div className="relative left-1/2 mt-8 w-screen -translate-x-1/2 space-y-4 overflow-hidden">
          <div
            className={`pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-r to-transparent sm:w-24 ${
              isDark ? 'from-[#0f0f0f]' : 'from-[#fff6fb]'
            }`}
          />
          <div
            className={`pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-l to-transparent sm:w-24 ${
              isDark ? 'from-[#0f0f0f]' : 'from-[#fff6fb]'
            }`}
          />

          <motion.div
            className="flex w-max gap-4"
            animate={allowCommentMarquee ? { x: ['0%', '-50%'] } : { x: '0%' }}
            transition={allowCommentMarquee ? { duration: 30, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
          >
            {[...testimonialsRowA, ...testimonialsRowA].map((item, index) => (
              <article
                key={`${item.id}-a-${index}`}
                className={`w-[280px] shrink-0 rounded-2xl border p-4 sm:w-[360px] ${isDark ? 'border-zinc-700 bg-[#14141b]' : 'border-pink-200 bg-white/90'}`}
              >
                <p className="text-sm tracking-[0.16em] text-pink-400">★★★★★</p>
                <p className={`mt-3 text-base leading-relaxed ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>"{item.text}"</p>
                <div className={`mt-4 flex items-center gap-3 border-t pt-3 ${isDark ? 'border-zinc-700' : 'border-pink-100'}`}>
                  <img src={item.avatar} alt={item.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.when}</p>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>

          <motion.div
            className="flex w-max gap-4"
            animate={allowCommentMarquee ? { x: ['-50%', '0%'] } : { x: '-10%' }}
            transition={allowCommentMarquee ? { duration: 32, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
          >
            {[...testimonialsRowB, ...testimonialsRowB].map((item, index) => (
              <article
                key={`${item.id}-b-${index}`}
                className={`w-[280px] shrink-0 rounded-2xl border p-4 sm:w-[360px] ${isDark ? 'border-zinc-700 bg-[#14141b]' : 'border-pink-200 bg-white/90'}`}
              >
                <p className="text-sm tracking-[0.16em] text-pink-400">★★★★★</p>
                <p className={`mt-3 text-base leading-relaxed ${isDark ? 'text-zinc-200' : 'text-zinc-700'}`}>"{item.text}"</p>
                <div className={`mt-4 flex items-center gap-3 border-t pt-3 ${isDark ? 'border-zinc-700' : 'border-pink-100'}`}>
                  <img src={item.avatar} alt={item.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.when}</p>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="planos" className="relative mx-auto mt-2 w-full max-w-6xl pb-16 sm:mt-6">
        <div className={`rounded-[2rem] border p-6 sm:p-8 ${isDark ? 'border-zinc-700 bg-[#121219]' : 'border-pink-200 bg-white/90'}`}>
          <div className="mx-auto max-w-4xl text-center">
            <p className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${isDark ? 'border-pink-500/35 bg-pink-500/10 text-pink-300' : 'border-pink-300 bg-pink-50 text-pink-700'}`}>
              Planos e Preços
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              Escolha o plano <span className={isDark ? 'text-pink-400' : 'text-pink-600'}>ideal</span> para você
            </h2>
            <p className={`mx-auto mt-3 max-w-3xl text-sm sm:text-lg ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Pagamento único, sem mensalidade. Crie seu presente digital agora.
            </p>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
            {[
              { id: '24h', title: 'Só Hoje (24h)', oldPrice: 'R$ 25,00', price: 'R$ 15,00', badge: 'Econômico', highlight: false },
              { id: 'anual', title: 'Plano Anual', oldPrice: 'R$ 45,00', price: 'R$ 20,00', badge: 'Mais Popular', highlight: true },
              { id: 'vitalicio', title: 'Para Sempre (Vitalício)', oldPrice: 'R$ 67,00', price: 'R$ 27,00', badge: 'Melhor Custo-benefício', highlight: false },
            ].map((plan) => (
              <article
                key={plan.id}
                className={`relative rounded-3xl border p-5 ${plan.highlight ? isDark ? 'border-pink-500 bg-pink-500/10 shadow-[0_0_30px_rgba(255,47,122,0.22)]' : 'border-pink-400 bg-pink-50/80 shadow-[0_0_24px_rgba(255,79,163,0.2)]' : isDark ? 'border-zinc-700 bg-[#17171f]' : 'border-pink-200 bg-white'}`}
              >
                <span className={`absolute -top-3 left-4 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${plan.highlight ? isDark ? 'border-pink-400 bg-pink-500 text-black' : 'border-pink-300 bg-pink-500 text-white' : isDark ? 'border-zinc-600 bg-zinc-900 text-zinc-200' : 'border-pink-200 bg-pink-50 text-pink-700'}`}>
                  {plan.badge}
                </span>
                <h3 className="mt-4 text-2xl font-bold">{plan.title}</h3>
                <p className={`mt-4 text-sm line-through ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{plan.oldPrice}</p>
                <p className="text-4xl font-black">{plan.price}</p>
                <ul className={`mt-4 space-y-2 text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  <li>• Acesso imediato</li>
                  <li>• Edições ilimitadas</li>
                  <li>• Fotos e seções ilimitadas</li>
                </ul>
                <button
                  type="button"
                  onClick={() => navigate('/choose-mode')}
                  className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${plan.highlight ? 'bg-pink-500 text-black hover:brightness-110' : isDark ? 'border border-zinc-600 bg-zinc-900 text-zinc-100 hover:border-pink-400' : 'border border-pink-200 bg-white text-zinc-700 hover:border-pink-400'}`}
                >
                  Escolher plano
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-2 w-full max-w-6xl pb-12 sm:mt-6">
        <div className="grid gap-6 p-1 sm:p-2 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className={`inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${isDark ? 'border-pink-500/35 bg-pink-500/10 text-pink-300' : 'border-pink-300 bg-pink-50 text-pink-700'}`}>
              Perguntas Frequentes
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight sm:text-5xl">
              Tire suas <span className={isDark ? 'text-pink-400' : 'text-pink-600'}>Dúvidas</span>
            </h2>
            <p className={`mt-3 max-w-lg text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Separamos as perguntas mais comuns. Se a sua não estiver aqui, entre em contato.
            </p>

            <p className="mt-8 text-lg font-bold sm:text-xl">Não encontrou sua pergunta?</p>
            <div className="mt-4 space-y-3">
              <a
                href="#"
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${isDark ? 'border-zinc-700 bg-[#17171f] hover:border-pink-400/70' : 'border-pink-200 bg-white hover:border-pink-400/70'}`}
              >
                <div>
                  <p className="text-base font-semibold sm:text-lg">Instagram</p>
                  <p className={`text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>@lovelyfy.oficial</p>
                </div>
                <span className="text-2xl">›</span>
              </a>
              <a
                href="#"
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${isDark ? 'border-zinc-700 bg-[#17171f] hover:border-pink-400/70' : 'border-pink-200 bg-white hover:border-pink-400/70'}`}
              >
                <div>
                  <p className="text-base font-semibold sm:text-lg">E-mail</p>
                  <p className={`text-sm sm:text-base ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>suporte@lovelyfy.com.br</p>
                </div>
                <span className="text-2xl">›</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => navigate('/choose-mode')}
              className="mt-5 w-full rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-semibold text-white transition hover:brightness-110"
            >
              Criar meu presente ↗
            </button>
          </div>

          <div className="space-y-3">
            {faqItems.map((item) => {
              const isOpen = openFaqId === item.id
              return (
                <article key={item.id} className={`rounded-2xl border ${isDark ? 'border-zinc-700 bg-[#17171f]' : 'border-pink-200 bg-white'}`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaqId((prev) => (prev === item.id ? null : item.id))}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-lg font-semibold leading-snug sm:text-xl">{item.question}</span>
                    <span className={`text-2xl transition ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
                  </button>
                  {isOpen && <p className={`px-5 pb-4 text-sm leading-relaxed sm:text-base ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{item.answer}</p>}
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <HomeFooter isDark={isDark} />

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
