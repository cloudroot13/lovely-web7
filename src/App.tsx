import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ChooseMode from './pages/ChooseMode'
import ThemeSelector from './pages/ThemeSelector'
import Builder from './pages/Builder'
import Preview from './pages/Preview'
import NotFound from './pages/NotFound'
import LovelyflixExperience from './modules/lovelyflix/LovelyflixExperience'
import LovelyflixProfileSelect from './modules/lovelyflix/LovelyflixProfileSelect'

export default function App() {
  return (
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
  )
}
