import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useInViewAnimations } from './hooks/useInViewAnimations'
import cupidoAtirandoVideo from './assets/mascote_cupido/atirando.mov'

const Home = lazy(() => import('./pages/Home'))
const ChooseMode = lazy(() => import('./pages/ChooseMode'))
const ThemeSelector = lazy(() => import('./pages/ThemeSelector'))
const Builder = lazy(() => import('./pages/Builder'))
const Preview = lazy(() => import('./pages/Preview'))
const Login = lazy(() => import('./pages/Login'))
const Checkout = lazy(() => import('./pages/Checkout'))
const NotFound = lazy(() => import('./pages/NotFound'))
const LovelyflixExperience = lazy(() => import('./modules/lovelyflix/LovelyflixExperience'))
const LovelyflixProfileSelect = lazy(() => import('./modules/lovelyflix/LovelyflixProfileSelect'))

export default function App() {
  useInViewAnimations()
  const [showLoading, setShowLoading] = useState(true)
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

    const tryPlay = () => {
      video.play().catch(() => {
        // Alguns navegadores mobile bloqueiam a primeira tentativa; o retry trata isso.
      })
    }

    tryPlay()
    video.addEventListener('loadeddata', tryPlay)
    video.addEventListener('canplay', tryPlay)
    const retry = window.setInterval(tryPlay, 700)

    return () => {
      window.clearInterval(retry)
      video.removeEventListener('loadeddata', tryPlay)
      video.removeEventListener('canplay', tryPlay)
    }
  }, [showLoading])

  if (showLoading) {
    return (
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-black text-white">
        <video
          ref={loadingVideoRef}
          className="h-[210px] w-[210px] rounded-2xl object-cover"
          src={cupidoAtirandoVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />
      </main>
    )
  }

  return (
    <Suspense
      fallback={
        <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-black text-white">
          <video
            className="h-[210px] w-[210px] rounded-2xl object-cover"
            src={cupidoAtirandoVideo}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
          />
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
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/lovelyflix" element={<LovelyflixExperience />} />
        <Route path="/netflix" element={<LovelyflixExperience />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
