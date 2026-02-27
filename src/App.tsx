import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useInViewAnimations } from './hooks/useInViewAnimations'
import cupidoAtirandoVideo from './assets/mascote_cupido/atirando.mov'
import cupidoRosto from './assets/mascote_cupido/rosto.png'

const Home = lazy(() => import('./pages/Home'))
const ChooseMode = lazy(() => import('./pages/ChooseMode'))
const ThemeSelector = lazy(() => import('./pages/ThemeSelector'))
const Builder = lazy(() => import('./pages/Builder'))
const Preview = lazy(() => import('./pages/Preview'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Checkout = lazy(() => import('./pages/Checkout'))
const NotFound = lazy(() => import('./pages/NotFound'))
const WrappedLovelyflixDemo = lazy(() => import('./pages/WrappedLovelyflixDemo'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const CookiesPage = lazy(() => import('./pages/CookiesPage'))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'))
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const ExamplesPage = lazy(() => import('./pages/ExamplesPage'))
const LovelyflixExperience = lazy(() => import('./modules/lovelyflix/LovelyflixExperience'))
const LovelyflixProfileSelect = lazy(() => import('./modules/lovelyflix/LovelyflixProfileSelect'))

export default function App() {
  useInViewAnimations()
  const [showLoading, setShowLoading] = useState(true)
  const [loadingVideoBlocked, setLoadingVideoBlocked] = useState(false)
  const loadingVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => setShowLoading(false), 5000)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!showLoading) return

    const video = loadingVideoRef.current
    if (!video) return

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.autoplay = true
    video.loop = true
    video.setAttribute('muted', '')
    video.setAttribute('autoplay', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', 'true')
    video.controls = false
    video.load()

    const tryPlay = () => {
      video.play().catch(() => {
        // Continua tentando autoplay no mobile sem trocar para fallback.
      })
    }

    const onPlay = () => setLoadingVideoBlocked(false)
    const onError = () => setLoadingVideoBlocked(true)

    tryPlay()
    video.addEventListener('loadeddata', tryPlay)
    video.addEventListener('canplay', tryPlay)
    video.addEventListener('playing', onPlay)
    video.addEventListener('error', onError)
    const retry = window.setInterval(tryPlay, 700)

    return () => {
      window.clearInterval(retry)
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('canplay', tryPlay)
      video.removeEventListener('playing', onPlay)
      video.removeEventListener('error', onError)
    }
  }, [showLoading])

  const loadingVisual = (
    <>
      {loadingVideoBlocked ? (
        <div className="relative grid h-[210px] w-[210px] place-items-center overflow-hidden rounded-2xl border border-pink-300/30 bg-zinc-900">
          <img src={cupidoRosto} alt="Cupido" className="h-24 w-24 animate-pulse object-contain" />
          <span className="absolute bottom-3 text-[11px] uppercase tracking-[0.18em] text-pink-200">carregando...</span>
        </div>
      ) : (
        <video
          ref={loadingVideoRef}
          className="h-[210px] w-[210px] rounded-2xl object-cover"
          src={cupidoAtirandoVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          controls={false}
        />
      )}
    </>
  )
  const loadingFallbackVisual = (
    <div className="relative grid h-[210px] w-[210px] place-items-center overflow-hidden rounded-2xl border border-pink-300/30 bg-zinc-900">
      <img src={cupidoRosto} alt="Cupido" className="h-24 w-24 animate-pulse object-contain" />
      <span className="absolute bottom-3 text-[11px] uppercase tracking-[0.18em] text-pink-200">carregando...</span>
    </div>
  )

  if (showLoading) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-black text-white">
        {loadingVisual}
      </main>
    )
  }

  return (
    <Suspense
      fallback={
        <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-black text-white">
          {loadingFallbackVisual}
        </main>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose-mode" element={<ChooseMode />} />
        <Route path="/theme" element={<ThemeSelector />} />
        <Route path="/lovelyflix-profile" element={<LovelyflixProfileSelect />} />
        <Route path="/netflix-profile" element={<LovelyflixProfileSelect />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/login" element={<Login />} />
        <Route path="/criar-conta" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/demo/wrapped-lovelyflix" element={<WrappedLovelyflixDemo />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/contato" element={<ContactPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/termos-de-uso" element={<TermsPage />} />
        <Route path="/politica-de-privacidade" element={<PrivacyPage />} />
        <Route path="/politica-de-cookies" element={<CookiesPage />} />
        <Route path="/como-funciona" element={<HowItWorksPage />} />
        <Route path="/recursos" element={<ResourcesPage />} />
        <Route path="/precos" element={<PricingPage />} />
        <Route path="/exemplos" element={<ExamplesPage />} />
        <Route path="/lovelyflix" element={<LovelyflixExperience />} />
        <Route path="/netflix" element={<LovelyflixExperience />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
