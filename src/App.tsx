import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useInViewAnimations } from './hooks/useInViewAnimations'

const Home = lazy(() => import('./pages/Home'))
const ChooseMode = lazy(() => import('./pages/ChooseMode'))
const ThemeSelector = lazy(() => import('./pages/ThemeSelector'))
const Builder = lazy(() => import('./pages/Builder'))
const Preview = lazy(() => import('./pages/Preview'))
const NotFound = lazy(() => import('./pages/NotFound'))
const LovelyflixExperience = lazy(() => import('./modules/lovelyflix/LovelyflixExperience'))
const LovelyflixProfileSelect = lazy(() => import('./modules/lovelyflix/LovelyflixProfileSelect'))

export default function App() {
  useInViewAnimations()
  return (
    <Suspense fallback={<main className="flex min-h-dvh items-center justify-center bg-black text-white">Carregando...</main>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choose-mode" element={<ChooseMode />} />
        <Route path="/theme" element={<ThemeSelector />} />
        <Route path="/lovelyflix-profile" element={<LovelyflixProfileSelect />} />
        <Route path="/netflix-profile" element={<LovelyflixProfileSelect />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/lovelyflix" element={<LovelyflixExperience />} />
        <Route path="/netflix" element={<LovelyflixExperience />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
