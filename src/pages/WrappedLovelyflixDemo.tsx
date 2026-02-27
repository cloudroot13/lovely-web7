import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LovelyflixExperience from '../modules/lovelyflix/LovelyflixExperience'
import type { LoveData } from '../types/types'
import demo1 from '../assets/lovelyflix/demo1.jpeg'
import demo2 from '../assets/lovelyflix/demo2.jpeg'
import demo3 from '../assets/lovelyflix/demo3.jpeg'
import demo4 from '../assets/lovelyflix/demo4.jpeg'
import demo5 from '../assets/lovelyflix/demo5.jpeg'
import demo6 from '../assets/lovelyflix/demo6.jpeg'
import demo7 from '../assets/lovelyflix/demo7.jpeg'
import demo8 from '../assets/lovelyflix/demo8.jpeg'
import demo9 from '../assets/lovelyflix/demo9.jpeg'
import NetflixBootIntro from '../components/NetflixBootIntro'

// Troque esse array quando adicionar as imagens finais da demo.
const demoStoryImages = [demo2, demo3, demo4, demo5, demo6, demo7, demo8, demo9]

const demoLoveData: LoveData = {
  nomeCriador: 'Gabriel',
  nomePessoa: 'Yasmin',
  apelido: 'Meu amor',
  classicTitle: 'Nossa história',
  classicMessage: 'Cada momento ao seu lado vira memória inesquecível.',
  classicCounterStyle: 'default',
  classicPhotoDisplay: 'cards',
  classicBackgroundAnimation: 'hearts',
  classicMemoriesTitle: 'Nossos melhores momentos',
  classicMemoriesBannerDataUrl: demo1,
  localConheceram: 'São Paulo',
  comoConheceram: 'Nos conhecemos por acaso e viramos destino.',
  momentoEspecial: 'Nosso primeiro beijo ao pôr do sol.',
  atividadeJuntos: 'Ver filmes e planejar viagens.',
  dataImportante: '2023-09-11',
  weeklyMeetups: 4,
  monthlyMeetups: 14,
  minutesTogether: 18340,
  memoriesCreated: 86,
  laughsShared: 432,
  startDate: '2023-09-11',
  oQueMaisAmo: 'Seu jeito de cuidar de mim em todos os detalhes.',
  musicaSource: 'none',
  musicaSpotifyUrl: '',
  musicaNome: 'Nossa trilha favorita',
  fotoCasalDataUrl: demo1,
  totalPhotos: 9,
  storiesImagesDataUrls: demoStoryImages,
  momentHighlights: [],
  anos: 2,
  meses: 5,
  dias: 14,
}

export default function WrappedLovelyflixDemo() {
  const navigate = useNavigate()
  const [showIntro, setShowIntro] = useState(true)
  const handleIntroDone = useCallback(() => setShowIntro(false), [])

  if (showIntro) {
    return <NetflixBootIntro onDone={handleIntroDone} label="LOVELYFLIX" />
  }

  return (
    <div className="relative min-h-dvh bg-black">
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-50 bg-gradient-to-b from-black/80 to-transparent px-4 pt-4 pb-10">
        <div className="pointer-events-auto mx-auto flex w-full max-w-[430px] items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-full border border-zinc-500 bg-black/55 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white"
          >
            Voltar
          </button>
          <p className="rounded-full border border-pink-500/50 bg-pink-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-pink-300">
            Demo fixa
          </p>
        </div>
      </div>
      <LovelyflixExperience demoData={demoLoveData} demoMode />
    </div>
  )
}
