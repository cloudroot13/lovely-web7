import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/appStore'
import { getCurrentUser, isAuthenticated } from '../utils/auth'
import { hasActiveAccess } from '../utils/access'
import ClassicNormalBuilder from './ClassicNormalBuilder'
import ClassicNetflixBuilder from './ClassicNetflixBuilder'
import type { LoveData, MomentHighlight } from '../types/types'
import { readFileAsDataUrl } from '../utils/file'
import beijoMascoteVideo from '../assets/mascote_cupido/beijo.mov'

type QuestionKind = 'text' | 'music' | 'gallery' | 'number' | 'date' | 'datetime' | 'photo' | 'polaroids'
type GiftIconKey = 'heart' | 'users' | 'flower' | 'sparkle' | 'star' | 'crown'

interface Question {
  id: string
  text: string
  placeholder: string
  kind: QuestionKind
}

interface GiftTypePreset {
  id: string
  label: string
  description: string
  iconKey: GiftIconKey
  featured?: boolean
}

const WRAPPED_FIXED_EXTRA_PHOTOS = 4

const questions: Question[] = [
  { id: 'nomeCriador', text: 'Agora me diz: qual é o seu nome?', placeholder: 'Ex: Leonardo', kind: 'text' },
  { id: 'nomePessoa', text: 'Qual o nome da sua pessoa amada?', placeholder: 'Ex: Amanda', kind: 'text' },
  { id: 'startDate', text: 'Qual a data que vocês se conheceram?', placeholder: '', kind: 'date' },
  {
    id: 'music',
    text: 'Agora adicione a música (link), a foto de capa e as fotos dos slides.',
    placeholder: '',
    kind: 'music',
  },
  { id: 'apelido', text: 'Como você chama ela no dia a dia?', placeholder: 'Ex: Meu amor, vida, meu bem...', kind: 'text' },
  {
    id: 'weeklyMeetups',
    text: 'Em média, quantas vezes vocês se veem por semana?',
    placeholder: 'Ex: 3',
    kind: 'number',
  },
  {
    id: 'oQueMaisAmo',
    text: 'Agora fale mais sobre sua pessoa amada: o que você mais gosta nela e quais traços te marcam?',
    placeholder: 'Ex: o jeito que ela cuida de mim, o sorriso, a força, a calma...',
    kind: 'text',
  },
]

const lovelyflixQuestions: Question[] = [
  { id: 'nomeCriador', text: 'Vamos montar seu painel Lovelyflix. Qual é o seu nome?', placeholder: 'Ex: Leonardo', kind: 'text' },
  { id: 'nomePessoa', text: 'Quem estrela essa história com você?', placeholder: 'Ex: Amanda', kind: 'text' },
  { id: 'startDate', text: 'Qual a data que vocês se conheceram?', placeholder: '', kind: 'date' },
  {
    id: 'music',
    text: 'Primeiro, envie todas as fotos: capa, fotos de destaque e fotos extras dos capítulos.',
    placeholder: '',
    kind: 'music',
  },
  {
    id: 'monthlyMeetups',
    text: 'Em média, quantas vezes vocês saem por mês?',
    placeholder: 'Ex: 4',
    kind: 'number',
  },
  {
    id: 'oQueMaisAmo',
    text: 'Descreva o que mais te encanta nela (vamos usar como texto grande da experiência).',
    placeholder: 'Ex: o sorriso, o cuidado, o jeito de me acalmar...',
    kind: 'text',
  },
  {
    id: 'momentoEspecial',
    text: 'Qual foi o momento mais especial de vocês? (vamos usar como destaque principal)',
    placeholder: 'Ex: o pedido de namoro, a primeira viagem...',
    kind: 'text',
  },
  {
    id: 'atividadeJuntos',
    text: 'Qual atividade vocês mais gostam de fazer juntos?',
    placeholder: 'Ex: ver filme, cozinhar, sair para jantar...',
    kind: 'text',
  },
  { id: 'dataImportante', text: 'Selecione a data importante que deve aparecer na experiência.', placeholder: '', kind: 'date' },
]

const jornadaQuestions: Question[] = [
  { id: 'nomeCriador', text: 'Antes de tudo, qual é o seu nome?', placeholder: 'Ex: Leonardo', kind: 'text' },
  { id: 'nomePessoa', text: 'Qual o nome da sua pessoa amada?', placeholder: 'Ex: Amanda', kind: 'text' },
  { id: 'startDate', text: 'Qual a data que vocês se conheceram?', placeholder: '', kind: 'date' },
  { id: 'apelido', text: 'Como você chama ela no dia a dia?', placeholder: 'Ex: Meu amor, vida, meu bem...', kind: 'text' },
  {
    id: 'localConheceram',
    text: 'Onde vocês se conheceram?',
    placeholder: 'Ex: na escola, no trabalho, na praça...',
    kind: 'text',
  },
  {
    id: 'jornadaPolaroids',
    text: 'Agora vamos montar as 5 polaroids. Escolha momentos que tenham significado para vocês.',
    placeholder: '',
    kind: 'polaroids',
  },
]

const gameQuestions: Question[] = [
  { id: 'nomeCriador', text: 'Qual o seu nome de jogador(a)?', placeholder: 'Ex: Leo', kind: 'text' },
  { id: 'nomePessoa', text: 'Quem joga essa aventura com você?', placeholder: 'Ex: Amanda', kind: 'text' },
  { id: 'startDate', text: 'Qual a data que vocês se conheceram?', placeholder: '', kind: 'date' },
  {
    id: 'gameGallery',
    text: 'Envie a foto principal do casal e as fotos extras para os novos slides.',
    placeholder: '',
    kind: 'gallery',
  },
]

const giftTypePresets: GiftTypePreset[] = [
  { id: 'amor', label: 'Presente de Amor', description: 'Para namorado(a), noivo(a) ou cônjuge.', iconKey: 'heart', featured: true },
  { id: 'melhor-amiga', label: 'Presente para Amiga', description: 'Surpreenda sua melhor amiga.', iconKey: 'users' },
  { id: 'dia-da-mulher', label: 'Dia da Mulher', description: 'Homenagem para uma mulher especial.', iconKey: 'flower' },
  { id: 'mae', label: 'Mãe', description: 'Agradecimento cheio de carinho.', iconKey: 'sparkle' },
  { id: 'avo', label: 'Avó', description: 'Memórias e amor em cada detalhe.', iconKey: 'star' },
  { id: 'irma', label: 'Irmã', description: 'Para quem sempre esteve ao seu lado.', iconKey: 'users' },
  { id: 'esposa', label: 'Esposa', description: 'Para celebrar o amor todos os dias.', iconKey: 'crown' },
  { id: 'filha', label: 'Filha', description: 'Uma homenagem afetiva e especial.', iconKey: 'heart' },
]

function extractLovelyfyTrackId(url: string) {
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/)
  return match?.[1] ?? ''
}

function getGiftReceiverLabel(presetId: string | undefined) {
  switch (presetId) {
    case 'melhor-amiga':
      return 'sua amiga'
    case 'mae':
      return 'sua mãe'
    case 'avo':
      return 'sua avó'
    case 'irma':
      return 'sua irmã'
    case 'esposa':
      return 'sua esposa'
    case 'filha':
      return 'sua filha'
    case 'dia-da-mulher':
      return 'essa mulher especial'
    default:
      return 'sua pessoa amada'
  }
}

function GiftTypeIcon({ iconKey }: { iconKey: GiftIconKey }) {
  const base = 'h-5 w-5 text-pink-500'
  if (iconKey === 'users') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
        <path d="M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1" />
        <circle cx="9.5" cy="7" r="3" />
        <path d="M22 19v-1a4 4 0 0 0-3-3.87" />
        <path d="M16 4.13a3 3 0 0 1 0 5.75" />
      </svg>
    )
  }
  if (iconKey === 'flower') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
        <path d="M12 14.2c-2.3 0-4.2-1.6-4.2-3.7 0-1.7 1.3-3 3-3 0 .7.5 1.2 1.2 1.2.7 0 1.2-.5 1.2-1.2 1.7 0 3 1.3 3 3 0 2.1-1.9 3.7-4.2 3.7Z" />
        <path d="M12 14.2V21" />
        <path d="M12 18.2c-1.7 0-2.8-1-3.4-2" />
        <path d="M12 19.2c1.6 0 2.7-.8 3.3-1.8" />
        <path d="M10.1 7.9c-.9-1.6-.6-3.2.8-4.4 1.4 1.2 1.7 2.8.8 4.4" />
      </svg>
    )
  }
  if (iconKey === 'sparkle') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
        <path d="m12 3 1.6 3.9L18 8.5l-4.4 1.6L12 14l-1.6-3.9L6 8.5l4.4-1.6L12 3Z" />
        <path d="m5 16 .8 1.9L8 18.7l-2.2.8L5 22l-.8-2.5L2 18.7l2.2-.8L5 16Z" />
      </svg>
    )
  }
  if (iconKey === 'star') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
        <path d="m12 3 2.8 5.6L21 9.4l-4.5 4.4 1.1 6.3L12 17.1l-5.6 3 1.1-6.3L3 9.4l6.2-.8L12 3Z" />
      </svg>
    )
  }
  if (iconKey === 'crown') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
        <path d="m3 8 4.5 4L12 6l4.5 6L21 8l-2 10H5L3 8Z" />
        <path d="M5 18h14" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={base} aria-hidden>
      <path d="M12 20.5s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10.5c0 5.7-7 10-7 10Z" />
    </svg>
  )
}

export default function Builder() {
  const navigate = useNavigate()
  const { config, setLoveData, loveData } = useAppContext()
  const isClassicNormalFlow = config.mode === 'classic' && config.variant === 'normal'
  const isClassicNetflixFlow = config.mode === 'classic' && config.variant === 'netflix'
  const isLovelyflixFlow = config.mode === 'wrapped' && config.variant === 'stories'
  const isJornadaFlow = config.mode === 'wrapped' && config.variant === 'jornada'
  const isGameFlow = config.mode === 'wrapped' && config.variant === 'game'
  const activeQuestions = isLovelyflixFlow
    ? lovelyflixQuestions
    : isJornadaFlow
      ? jornadaQuestions
      : isGameFlow
        ? gameQuestions
        : questions

  const [step, setStep] = useState(0)
  const [answer, setAnswer] = useState('')
  const [, setMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    { sender: 'bot', text: activeQuestions[0].text },
  ])

  const [musicTitle, setMusicTitle] = useState(() => loveData.musicaNome || '')
  const [lovelyfyUrl, setLovelyfyUrl] = useState(() => loveData.musicaSpotifyUrl || '')
  const [photoDataUrl, setPhotoDataUrl] = useState(() => loveData.fotoCasalDataUrl || '')
  const [mainPhotoName, setMainPhotoName] = useState('')
  const [totalPhotos, setTotalPhotos] = useState(5)
  const [totalPhotosInput, setTotalPhotosInput] = useState('5')
  const [storiesDataUrls, setStoriesDataUrls] = useState<string[]>([])
  const [storiesImageKeys, setStoriesImageKeys] = useState<string[]>([])
  const [musicValidationMessage, setMusicValidationMessage] = useState('')
  const [momentoEspecialFotoDataUrl, setMomentoEspecialFotoDataUrl] = useState('')
  const [atividadeFotoDataUrl, setAtividadeFotoDataUrl] = useState('')
  const jornadaPolaroids = useMemo(
    () => [
      { label: 'Momento 1', hint: 'Ex: nosso primeiro encontro no shopping' },
      { label: 'Momento 2', hint: 'Ex: o dia do nosso primeiro beijo' },
      { label: 'Momento 3', hint: 'Ex: a nossa primeira viagem juntos' },
      { label: 'Momento 4', hint: 'Ex: o pedido de namoro' },
      { label: 'Momento 5', hint: 'Ex: nosso momento mais especial' },
    ],
    [],
  )
  const [jornadaInputs, setJornadaInputs] = useState(() =>
    Array.from({ length: 5 }).map(() => ({
      title: '',
      description: '',
      date: '',
      imageDataUrl: '',
      imageName: '',
    })),
  )
  const mainPhotoInputRef = useRef<HTMLInputElement | null>(null)
  const extraPhotosInputRef = useRef<HTMLInputElement | null>(null)
  const textInputRef = useRef<HTMLInputElement | null>(null)
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; message: string } | null>(null)
  const [giftTypeSearch, setGiftTypeSearch] = useState('')
  const [selectedGiftType, setSelectedGiftType] = useState<GiftTypePreset | null>(giftTypePresets.find((item) => item.featured) ?? giftTypePresets[0])
  const [giftTypeStepDone, setGiftTypeStepDone] = useState(false)
  const [previewTick, setPreviewTick] = useState(0)
  const [builderTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    return window.localStorage.getItem('lovely-home-theme') === 'light' ? 'light' : 'dark'
  })

  const currentQuestion = activeQuestions[step]
  const spotifyTrackId = extractLovelyfyTrackId(lovelyfyUrl.trim())
  const isDefaultWrappedFlow = !isLovelyflixFlow && !isJornadaFlow && !isGameFlow
  const uploadedPhotosCount = isGameFlow ? storiesDataUrls.length + (photoDataUrl ? 1 : 0) : storiesDataUrls.length
  const remainingPhotos = Math.max(0, totalPhotos - uploadedPhotosCount)
  const isBuilderDark = builderTheme === 'dark'
  const isGuidedFlow = !isClassicNormalFlow && !isClassicNetflixFlow
  const filteredGiftTypes = useMemo(
    () => giftTypePresets.filter((item) => item.label.toLowerCase().includes(giftTypeSearch.trim().toLowerCase())),
    [giftTypeSearch],
  )
  const buildLovelyflixHighlights = (overrides?: Partial<Pick<LoveData, 'momentoEspecial' | 'atividadeJuntos'>>) => {
    const highlights: MomentHighlight[] = []
    const momentoTexto = ((overrides?.momentoEspecial ?? loveData.momentoEspecial) || '').trim()
    const atividadeTexto = ((overrides?.atividadeJuntos ?? loveData.atividadeJuntos) || '').trim()
    if (momentoEspecialFotoDataUrl) {
      highlights.push({ text: momentoTexto || 'Destaque principal', imageDataUrl: momentoEspecialFotoDataUrl })
    }
    if (atividadeFotoDataUrl) {
      highlights.push({ text: atividadeTexto || 'Momento do Top 5', imageDataUrl: atividadeFotoDataUrl })
    }
    return highlights
  }
  const giftReceiverLabel = useMemo(() => getGiftReceiverLabel(selectedGiftType?.id), [selectedGiftType?.id])
  const contextualQuestionText = useMemo(() => {
    switch (currentQuestion.id) {
      case 'nomePessoa':
        return `Qual o nome de ${giftReceiverLabel}?`
      case 'apelido':
        return `Como você chama ${giftReceiverLabel} no dia a dia?`
      case 'music':
        if (isLovelyflixFlow) {
          return `Agora envie a foto de capa e as fotos dos capítulos de ${giftReceiverLabel}.`
        }
        return `Agora adicione a música (link), a foto de capa e as fotos dos slides de ${giftReceiverLabel}.`
      case 'oQueMaisAmo':
        return `Agora conte o que você mais admira em ${giftReceiverLabel}.`
      default:
        return currentQuestion.text
    }
  }, [currentQuestion.id, currentQuestion.text, giftReceiverLabel, isLovelyflixFlow])

  const moveNext = () => {
    const nextStep = step + 1
    if (nextStep >= activeQuestions.length) {
      const finalDestination = isLovelyflixFlow ? '/lovelyflix-profile' : '/preview'
      const user = getCurrentUser()
      const isLoggedIn = isAuthenticated()
      const hasPaid = Boolean(user && hasActiveAccess(user.id))

      if (!isLoggedIn) {
        navigate(`/login?returnTo=${encodeURIComponent(`/checkout?returnTo=${encodeURIComponent(finalDestination)}`)}`)
        return
      }

      if (!hasPaid) {
        navigate(`/checkout?returnTo=${encodeURIComponent(finalDestination)}`)
        return
      }

      navigate(finalDestination)
      return
    }
    setStep(nextStep)
    setMessages((prev) => [...prev, { sender: 'bot', text: activeQuestions[nextStep].text }])
    setNotice(null)
  }

  const handleConfirmMusic = () => {
    if (!photoDataUrl) {
      setNotice({ type: 'error', message: 'A foto principal do casal e obrigatoria para continuar.' })
      return
    }

    if (isLovelyflixFlow) {
      if (!momentoEspecialFotoDataUrl || !atividadeFotoDataUrl) {
        setNotice({ type: 'error', message: 'Antes de continuar, envie as 2 fotos dos momentos marcantes.' })
        return
      }

      if (storiesDataUrls.length !== totalPhotos) {
        setNotice({ type: 'error', message: `Envie exatamente ${totalPhotos} fotos extras para continuar.` })
        return
      }

      const momentHighlights = buildLovelyflixHighlights()

      setLoveData({
        fotoCasalDataUrl: photoDataUrl,
        totalPhotos,
        storiesImagesDataUrls: storiesDataUrls,
        momentHighlights,
        memoriesCreated: momentHighlights.length + storiesDataUrls.length,
      })

      setMessages((prev) => [...prev, { sender: 'user', text: `${storiesDataUrls.length} fotos enviadas para a experiência Lovelyflix.` }])
      moveNext()
      return
    }

    if (isJornadaFlow) {
      if (!momentoEspecialFotoDataUrl || !atividadeFotoDataUrl) {
        setNotice({ type: 'error', message: 'Antes de continuar, envie as 2 fotos dos momentos marcantes.' })
        return
      }

      if (storiesDataUrls.length !== totalPhotos) {
        setNotice({ type: 'error', message: `Envie exatamente ${totalPhotos} fotos extras para continuar.` })
        return
      }

      const momentHighlights: MomentHighlight[] = [
        { text: loveData.momentoEspecial || 'Momento mais marcante', imageDataUrl: momentoEspecialFotoDataUrl },
        { text: loveData.atividadeJuntos || 'Nosso momento favorito', imageDataUrl: atividadeFotoDataUrl },
      ]

      setLoveData({
        musicaSource: 'none',
        musicaSpotifyUrl: '',
        musicaNome: '',
        fotoCasalDataUrl: photoDataUrl,
        totalPhotos,
        storiesImagesDataUrls: storiesDataUrls,
        momentHighlights,
        memoriesCreated: momentHighlights.length + storiesDataUrls.length,
      })

      setMessages((prev) => [...prev, { sender: 'user', text: `${storiesDataUrls.length} fotos enviadas para a Jornada.` }])
      moveNext()
      return
    }

    if (isGameFlow) {
      const allImages = photoDataUrl ? [photoDataUrl, ...storiesDataUrls] : storiesDataUrls
      if (allImages.length !== totalPhotos) {
        setNotice({ type: 'error', message: `Envie exatamente ${totalPhotos} fotos no total para continuar.` })
        return
      }
      const [coverImage, ...extraImages] = allImages

      setLoveData({
        musicaSource: 'none',
        musicaSpotifyUrl: '',
        musicaNome: '',
        fotoCasalDataUrl: coverImage || '',
        totalPhotos: allImages.length,
        storiesImagesDataUrls: extraImages,
        momentHighlights: [],
        memoriesCreated: allImages.length,
      })

      setMessages((prev) => [...prev, { sender: 'user', text: `${allImages.length} fotos enviadas para os capítulos do game.` }])
      moveNext()
      return
    }

    if (storiesDataUrls.length !== totalPhotos) {
      setNotice({ type: 'error', message: `Envie exatamente ${totalPhotos} fotos extras para continuar.` })
      return
    }

    const match = lovelyfyUrl.match(/track\/([a-zA-Z0-9]+)/)
    const trackId = match ? match[1] : null

    if (!trackId) {
      setMusicValidationMessage('')
      setNotice({ type: 'error', message: 'Link do Lovelyfy inválido.' })
      return
    }

    const momentHighlights: MomentHighlight[] = []
    if (momentoEspecialFotoDataUrl) {
      momentHighlights.push({ text: loveData.momentoEspecial || 'Momento mais marcante', imageDataUrl: momentoEspecialFotoDataUrl })
    }
    if (atividadeFotoDataUrl) {
      momentHighlights.push({ text: loveData.atividadeJuntos || 'Nosso momento favorito', imageDataUrl: atividadeFotoDataUrl })
    }

    setMusicValidationMessage('Link válido. Música confirmada.')
    setLoveData({
      musicaSource: 'spotify_link',
      musicaSpotifyUrl: lovelyfyUrl.trim(),
      musicaNome: musicTitle.trim(),
      fotoCasalDataUrl: photoDataUrl,
      totalPhotos,
      storiesImagesDataUrls: storiesDataUrls.slice(0, totalPhotos),
      momentHighlights,
      memoriesCreated: momentHighlights.length + storiesDataUrls.slice(0, totalPhotos).length,
    })

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: `Música confirmada: ${musicTitle.trim() || 'Faixa Lovelyfy'}` },
      { sender: 'user', text: 'Capa e música configuradas com sucesso.' },
    ])
    setNotice(null)
    moveNext()
  }

  const handleMainPhotoFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const dataUrl = await readFileAsDataUrl(file)
    setMainPhotoName(file.name)
    setPhotoDataUrl(dataUrl)
    setLoveData({ fotoCasalDataUrl: dataUrl })
    if (isGameFlow) {
      const maxStories = Math.max(0, totalPhotos - 1)
      setStoriesDataUrls((prev) => prev.slice(0, maxStories))
      setStoriesImageKeys((prev) => prev.slice(0, maxStories))
    }
    event.target.value = ''
  }

  const handleMomentPhotoFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const url = await readFileAsDataUrl(file)
    if (currentQuestion.id === 'momentoEspecialFoto') {
      setMomentoEspecialFotoDataUrl(url)
    } else if (currentQuestion.id === 'atividadeFoto') {
      setAtividadeFotoDataUrl(url)
    }
  }

  const handleLovelyflixHighlightPhoto = async (type: 'momento' | 'atividade', event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const url = await readFileAsDataUrl(file)
    if (type === 'momento') {
      setMomentoEspecialFotoDataUrl(url)
    } else {
      setAtividadeFotoDataUrl(url)
    }
    event.target.value = ''
  }

  const handleExtraStoriesFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) {
      return
    }

    if (remainingPhotos <= 0) {
      setNotice({ type: 'error', message: `Você já enviou ${totalPhotos} de ${totalPhotos} fotos.` })
      return
    }

    const selected = Array.from(files)
    const existingKeys = new Set(storiesImageKeys)
    const uniqueBatch: File[] = []
    const uniqueBatchKeys = new Set<string>()
    let duplicates = 0

    selected.forEach((file) => {
      const key = `${file.name}-${file.size}-${file.lastModified}`
      if (existingKeys.has(key) || uniqueBatchKeys.has(key)) {
        duplicates += 1
        return
      }
      uniqueBatch.push(file)
      uniqueBatchKeys.add(key)
    })

    if (duplicates > 0) {
      setNotice({ type: 'error', message: `${duplicates} foto(s) repetida(s) foram ignoradas.` })
    }

    if (uniqueBatch.length > remainingPhotos) {
      setNotice({ type: 'error', message: `Só faltam ${remainingPhotos} foto(s). O restante foi ignorado.` })
    }

    const limited = uniqueBatch.slice(0, remainingPhotos)
    const nextUrls = await Promise.all(limited.map((file) => readFileAsDataUrl(file)))
    const nextKeys = limited.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
    const mergedUrls = [...storiesDataUrls, ...nextUrls]
    setStoriesDataUrls(mergedUrls)
    setStoriesImageKeys((prev) => [...prev, ...nextKeys])
    event.target.value = ''
  }

  const handleTotalPhotosChange = (value: string) => {
    if (value === '') {
      setTotalPhotosInput('')
      return
    }
    if (!/^\d+$/.test(value)) {
      return
    }
    const next = Number(value)
    const safe = Number.isNaN(next) ? totalPhotos : Math.max(1, Math.min(20, next))
    setTotalPhotosInput(String(next))
    setTotalPhotos(safe)
    const maxStories = isGameFlow && photoDataUrl ? Math.max(0, safe - 1) : safe
    setStoriesDataUrls((prev) => prev.slice(0, maxStories))
    setStoriesImageKeys((prev) => prev.slice(0, maxStories))
  }

  const handleTotalPhotosBlur = () => {
    if (totalPhotosInput === '') {
      setTotalPhotosInput(String(totalPhotos))
      return
    }
    const next = Number(totalPhotosInput)
    const safe = Number.isNaN(next) ? totalPhotos : Math.max(1, Math.min(20, next))
    setTotalPhotosInput(String(safe))
    if (safe !== totalPhotos) {
      setTotalPhotos(safe)
      const maxStories = isGameFlow && photoDataUrl ? Math.max(0, safe - 1) : safe
      setStoriesDataUrls((prev) => prev.slice(0, maxStories))
      setStoriesImageKeys((prev) => prev.slice(0, maxStories))
    }
  }

  const handleRemoveExtraStoryPhoto = (index: number) => {
    setStoriesDataUrls((prev) => prev.filter((_, idx) => idx !== index))
    setStoriesImageKeys((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleConfirmPhotoStep = () => {
    const hasPhoto = currentQuestion.id === 'momentoEspecialFoto' ? Boolean(momentoEspecialFotoDataUrl) : Boolean(atividadeFotoDataUrl)
    if (!hasPhoto) {
      setNotice({ type: 'error', message: 'Selecione uma foto para continuar.' })
      return
    }

    setMessages((prev) => [...prev, { sender: 'user', text: 'Foto enviada.' }])
    setNotice(null)
    moveNext()
  }

  const handleJornadaPolaroidChange = (index: number, patch: Partial<(typeof jornadaInputs)[number]>) => {
    setJornadaInputs((prev) => prev.map((item, idx) => (idx === index ? { ...item, ...patch } : item)))
  }

  const handleJornadaPolaroidPhoto = async (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    handleJornadaPolaroidChange(index, { imageDataUrl: dataUrl, imageName: file.name })
    event.target.value = ''
  }

  const handleConfirmJornadaPolaroids = () => {
    const missing = jornadaInputs
      .map((item, idx) => (!item.title.trim() || !item.description.trim() || !item.date || !item.imageDataUrl ? idx + 1 : null))
      .filter(Boolean) as number[]

    if (missing.length) {
      setNotice({ type: 'error', message: `Preencha todas as polaroids (título, descrição, data e foto). Faltam: ${missing.join(', ')}.` })
      return
    }

    const cover = jornadaInputs[0]
    const highlights: MomentHighlight[] = jornadaInputs.map((item) => ({
      text: item.title.trim(),
      title: item.title.trim(),
      message: item.description.trim(),
      date: item.date,
      imageDataUrl: item.imageDataUrl,
    }))

    setLoveData({
      fotoCasalDataUrl: cover.imageDataUrl,
      startDate: cover.date,
      momentHighlights: highlights,
      storiesImagesDataUrls: [],
      totalPhotos: 0,
      memoriesCreated: highlights.length,
    })

    setMessages((prev) => [...prev, { sender: 'user', text: 'Polaroids preenchidas com sucesso.' }])
    setNotice(null)
    moveNext()
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()

    if (currentQuestion.kind === 'music' || currentQuestion.kind === 'gallery') {
      handleConfirmMusic()
      return
    }

    if (currentQuestion.kind === 'photo') {
      handleConfirmPhotoStep()
      return
    }

    if (currentQuestion.kind === 'polaroids') {
      handleConfirmJornadaPolaroids()
      return
    }

    const value = answer.trim()
    if (!value) {
      setNotice({ type: 'error', message: 'Preencha a resposta para continuar.' })
      return
    }

    setMessages((prev) => [...prev, { sender: 'user', text: value }])

    if (currentQuestion.kind === 'number') {
      const numericValue = Math.max(1, Number(value))
      const key = currentQuestion.id as keyof LoveData
      setLoveData({ [key]: numericValue } as Partial<LoveData>)
      setAnswer('')
      setNotice(null)
      moveNext()
      return
    }

    const key = currentQuestion.id as keyof LoveData
    if (isLovelyflixFlow && (currentQuestion.id === 'momentoEspecial' || currentQuestion.id === 'atividadeJuntos')) {
      const nextHighlights = buildLovelyflixHighlights(
        currentQuestion.id === 'momentoEspecial' ? { momentoEspecial: value } : { atividadeJuntos: value },
      )
      setLoveData({ [key]: value, momentHighlights: nextHighlights } as Partial<LoveData>)
    } else {
      setLoveData({ [key]: value } as Partial<LoveData>)
    }
    setAnswer('')
    setNotice(null)
    moveNext()
  }

  const handleContinueClick = () => {
    if (currentQuestion.kind === 'music' || currentQuestion.kind === 'gallery') {
      handleConfirmMusic()
      return
    }
    if (currentQuestion.kind === 'photo') {
      handleConfirmPhotoStep()
      return
    }
    if (currentQuestion.kind === 'polaroids') {
      handleConfirmJornadaPolaroids()
      return
    }
    const value = answer.trim()
    if (!value) {
      setNotice({ type: 'error', message: 'Preencha a resposta para continuar.' })
      return
    }
    setMessages((prev) => [...prev, { sender: 'user', text: value }])
    if (currentQuestion.kind === 'number') {
      const numericValue = Math.max(1, Number(value))
      const key = currentQuestion.id as keyof LoveData
      setLoveData({ [key]: numericValue } as Partial<LoveData>)
      setAnswer('')
      setNotice(null)
      moveNext()
      return
    }
    const key = currentQuestion.id as keyof LoveData
    if (isLovelyflixFlow && (currentQuestion.id === 'momentoEspecial' || currentQuestion.id === 'atividadeJuntos')) {
      const nextHighlights = buildLovelyflixHighlights(
        currentQuestion.id === 'momentoEspecial' ? { momentoEspecial: value } : { atividadeJuntos: value },
      )
      setLoveData({ [key]: value, momentHighlights: nextHighlights } as Partial<LoveData>)
    } else {
      setLoveData({ [key]: value } as Partial<LoveData>)
    }
    setAnswer('')
    setNotice(null)
    moveNext()
  }

  const inputType =
    currentQuestion.kind === 'number'
      ? 'number'
      : currentQuestion.kind === 'date'
        ? 'date'
        : currentQuestion.kind === 'datetime'
          ? 'datetime-local'
          : 'text'

  const photoPreview = currentQuestion.id === 'momentoEspecialFoto' ? momentoEspecialFotoDataUrl : atividadeFotoDataUrl
  const momentCounterLabel = useMemo(() => {
    if (isGameFlow) {
      return `${uploadedPhotosCount} de ${totalPhotos} fotos enviadas`
    }
    return `${storiesDataUrls.length} de ${totalPhotos} fotos extras enviadas`
  }, [isGameFlow, storiesDataUrls.length, totalPhotos, uploadedPhotosCount])
  const introQuestionIds = ['nomeCriador', 'nomePessoa', 'startDate']
  const shouldHidePreviewPanel = introQuestionIds.includes(currentQuestion.id)
  const totalSteps = activeQuestions.length + 1
  const progressStep = giftTypeStepDone ? step + 2 : 1
  const progressPercent = Math.round((progressStep / totalSteps) * 100)

  useEffect(() => {
    if (isClassicNormalFlow) {
      return
    }
    if (currentQuestion.kind !== 'text' && currentQuestion.kind !== 'number' && currentQuestion.kind !== 'date' && currentQuestion.kind !== 'datetime') {
      return
    }
    const handle = window.setTimeout(() => textInputRef.current?.focus(), 0)
    return () => window.clearTimeout(handle)
  }, [currentQuestion.kind, isClassicNormalFlow, step])

  useEffect(() => {
    if (!isJornadaFlow || currentQuestion.kind !== 'polaroids') {
      return
    }
    if (loveData.startDate && !jornadaInputs[0]?.date) {
      setJornadaInputs((prev) => prev.map((item, idx) => (idx === 0 ? { ...item, date: loveData.startDate } : item)))
    }
  }, [currentQuestion.kind, isJornadaFlow, jornadaInputs, loveData.startDate])

  useEffect(() => {
    if (loveData.musicaNome && loveData.musicaNome !== musicTitle) {
      setMusicTitle(loveData.musicaNome)
    }
    if (loveData.musicaSpotifyUrl && loveData.musicaSpotifyUrl !== lovelyfyUrl) {
      setLovelyfyUrl(loveData.musicaSpotifyUrl)
    }
    if (loveData.fotoCasalDataUrl && loveData.fotoCasalDataUrl !== photoDataUrl) {
      setPhotoDataUrl(loveData.fotoCasalDataUrl)
    }
  }, [loveData.fotoCasalDataUrl, loveData.musicaNome, loveData.musicaSpotifyUrl, lovelyfyUrl, musicTitle, photoDataUrl])

  useEffect(() => {
    if (currentQuestion.kind !== 'music' && currentQuestion.kind !== 'gallery') {
      return
    }
    const t = window.setTimeout(() => setPreviewTick(Date.now()), 180)
    return () => window.clearTimeout(t)
  }, [currentQuestion.kind, lovelyfyUrl, musicTitle, photoDataUrl, storiesDataUrls.length, momentoEspecialFotoDataUrl, atividadeFotoDataUrl])

  useEffect(() => {
    if (!isDefaultWrappedFlow) {
      return
    }
    if (totalPhotos !== WRAPPED_FIXED_EXTRA_PHOTOS) {
      setTotalPhotos(WRAPPED_FIXED_EXTRA_PHOTOS)
    }
    if (totalPhotosInput !== String(WRAPPED_FIXED_EXTRA_PHOTOS)) {
      setTotalPhotosInput(String(WRAPPED_FIXED_EXTRA_PHOTOS))
    }
    setStoriesDataUrls((prev) => (prev.length > WRAPPED_FIXED_EXTRA_PHOTOS ? prev.slice(0, WRAPPED_FIXED_EXTRA_PHOTOS) : prev))
    setStoriesImageKeys((prev) => (prev.length > WRAPPED_FIXED_EXTRA_PHOTOS ? prev.slice(0, WRAPPED_FIXED_EXTRA_PHOTOS) : prev))
  }, [isDefaultWrappedFlow, totalPhotos, totalPhotosInput])

  if (isClassicNormalFlow) {
    return <ClassicNormalBuilder />
  }

  if (isClassicNetflixFlow) {
    return <ClassicNetflixBuilder />
  }

  if (isGuidedFlow && !giftTypeStepDone) {
    return (
      <main className={`min-h-[100dvh] px-4 py-6 sm:px-6 ${isBuilderDark ? 'bg-[#0f1016] text-[#f5f5f5]' : 'bg-[#ece9f2] text-[#2e2b36]'}`}>
        <div className="mx-auto max-w-6xl">
          <header className={`rounded-3xl border p-4 shadow-sm ${isBuilderDark ? 'border-zinc-700 bg-zinc-900/70' : 'border-[#d6d0e2] bg-[#f7f5fb]'}`}>
            <p className={`text-xs uppercase tracking-[0.2em] ${isBuilderDark ? 'text-pink-300' : 'text-pink-600'}`}>Etapa inicial</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Que tipo de presente vamos criar?</h1>
          </header>

          <div className="mt-5 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <section>
              <div className="mb-4">
                <input
                  type="text"
                  value={giftTypeSearch}
                  onChange={(event) => setGiftTypeSearch(event.target.value)}
                  placeholder="Buscar tipo de homenagem..."
                  className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none ring-pink-400 transition focus:ring ${
                    isBuilderDark ? 'border-zinc-700 bg-zinc-900/75 text-zinc-100' : 'border-[#d6d0e2] bg-[#f7f5fb]'
                  }`}
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredGiftTypes.map((item) => {
                  const active = selectedGiftType?.id === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedGiftType(item)}
                      className={`relative rounded-3xl border p-4 text-left transition ${
                        active
                          ? 'border-pink-400 bg-pink-100/70 shadow-[0_0_0_1px_rgba(236,72,153,0.35)]'
                          : isBuilderDark
                            ? 'border-zinc-700 bg-zinc-900/70 hover:border-pink-400'
                            : 'border-[#d6d0e2] bg-[#f3f0f8] hover:border-pink-300'
                      }`}
                    >
                      {item.featured && (
                        <span className="absolute -top-2 left-4 rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
                          Mais popular
                        </span>
                      )}
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-200 bg-pink-50">
                        <GiftTypeIcon iconKey={item.iconKey} />
                      </div>
                      <p className={`mt-3 text-lg font-semibold ${active ? 'text-pink-600' : ''}`}>{item.label}</p>
                      <p className={`mt-2 text-sm ${isBuilderDark ? 'text-zinc-300' : 'text-[#5f5a6e]'}`}>{item.description}</p>
                    </button>
                  )
                })}
              </div>

              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setGiftTypeStepDone(true)}
                  className="rounded-full bg-pink-500 px-7 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                >
                  Continuar
                </button>
              </div>
            </section>

            <aside className={`rounded-3xl border p-4 shadow-sm ${isBuilderDark ? 'border-zinc-700 bg-zinc-900/70' : 'border-[#d6d0e2] bg-[#f7f5fb]'}`}>
              <p className={`text-xs uppercase tracking-[0.16em] ${isBuilderDark ? 'text-pink-300' : 'text-pink-600'}`}>Preview</p>
              <div className="mt-3 flex justify-center">
                <div className="w-[220px] rounded-[34px] border-[6px] border-[#232226] bg-[#131218] p-2 shadow-2xl">
                  <div className="min-h-[390px] rounded-[24px] bg-[linear-gradient(180deg,#201e2c_0%,#101014_100%)] p-4 text-white">
                    <p className="text-xs uppercase tracking-[0.12em] text-pink-300">{selectedGiftType?.label || 'Presente'}</p>
                    <h3 className="mt-3 text-xl font-black leading-tight">{loveData.nomePessoa || 'Sua pessoa especial'}</h3>
                    <p className="mt-1 text-xs text-zinc-300">Criado por {loveData.nomeCriador || 'você'}</p>
                    <div className="mt-4 rounded-2xl bg-pink-500/20 p-3 text-xs text-pink-100">
                      {selectedGiftType?.description || 'Uma experiência personalizada.'}
                    </div>
                    <div className="mt-6 rounded-full bg-white px-4 py-2 text-center text-xs font-semibold text-black">
                      Modelo de celular
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className={`min-h-[100dvh] px-4 py-5 sm:px-6 ${isBuilderDark ? 'bg-[#0f1016] text-[#f5f5f5]' : 'bg-[#ece9f2] text-[#2e2b36]'}`}>
      <div className="mx-auto max-w-7xl">
        <header className="mb-4">
          <div className={`h-3 w-full overflow-hidden rounded-full ${isBuilderDark ? 'bg-zinc-800' : 'bg-[#dbd6e7]'}`}>
            <div className="h-full rounded-full bg-pink-500 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_0.55fr]">
          <section>
            <div className="mb-5 flex items-start gap-3">
              <video
                src={beijoMascoteVideo}
                className="h-20 w-20 rounded-2xl border border-white/50 object-cover shadow-md"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-label="Mascote"
              />
              <div className={`flex-1 rounded-2xl border p-4 text-base sm:text-[1.03rem] ${isBuilderDark ? 'border-zinc-700 bg-zinc-900/70' : 'border-[#d2cbe2] bg-[#f7f5fb]'}`}>
                {contextualQuestionText}
              </div>
            </div>

            <form onSubmit={handleSubmit} className={`rounded-3xl border p-4 sm:p-5 ${isBuilderDark ? 'border-zinc-700 bg-zinc-900/60' : 'border-[#d2cbe2] bg-[#f7f5fb]'}`}>
              <div className="mx-auto w-full max-w-4xl">
          {(currentQuestion.kind === 'text' || currentQuestion.kind === 'number' || currentQuestion.kind === 'date' || currentQuestion.kind === 'datetime') && (
            <div className="flex gap-3">
              <input
                ref={textInputRef}
                type={inputType}
                value={answer}
                min={currentQuestion.kind === 'number' ? 1 : undefined}
                onChange={(event) => {
                  setAnswer(event.target.value)
                  if (notice) {
                    setNotice(null)
                  }
                }}
                placeholder={currentQuestion.placeholder}
                aria-label={currentQuestion.text}
                className={`flex-1 rounded-2xl border px-4 py-3 text-sm outline-none ring-pink-400 transition focus:ring ${
                  isBuilderDark ? 'border-zinc-700 bg-zinc-900 text-zinc-100' : 'border-[#d2cbe2] bg-white text-[#2e2b36]'
                }`}
              />
            </div>
          )}

          {currentQuestion.kind === 'photo' && (
            <div className="rounded-2xl border border-zinc-700 bg-[#161616] p-4">
              <label className="block rounded-xl border border-dashed border-zinc-600 bg-zinc-900 p-3 text-sm text-zinc-300">
                <span className="block">Selecione uma foto que represente esse momento</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMomentPhotoFile}
                  aria-label="Selecionar foto deste momento"
                  className="mt-3 block w-full text-xs text-zinc-400 file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-pink-500 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-black hover:file:bg-pink-400"
                />
              </label>
              {photoPreview && (
                <p className="mt-2 text-xs text-green-400" aria-live="polite">
                  Foto recebida. Agora você pode continuar.
                </p>
              )}
              <button type="button" onClick={handleConfirmPhotoStep} className="mt-3 rounded-full bg-pink-500 px-5 py-2 text-sm font-semibold text-black">
                Confirmar foto e continuar
              </button>
            </div>
          )}

          {currentQuestion.kind === 'polaroids' && (
            <div className="rounded-2xl border border-zinc-700 bg-[#161616] p-4">
              <p className="text-sm text-zinc-300">Preencha as 5 polaroids com momento, data e foto.</p>
              <div className="mt-4 grid gap-4">
                {jornadaInputs.map((item, index) => (
                  <div key={`polaroid-${index}`} className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
                    <p className="text-sm font-semibold text-pink-300">{index + 1}. {jornadaPolaroids[index]?.label}</p>
                    <div className="mt-3 grid gap-3">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(event) => handleJornadaPolaroidChange(index, { title: event.target.value })}
                        placeholder={jornadaPolaroids[index]?.hint}
                        className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none ring-pink-500 transition focus:ring"
                      />
                      <textarea
                        value={item.description}
                        onChange={(event) => handleJornadaPolaroidChange(index, { description: event.target.value })}
                        placeholder="Escreva uma descrição romântica para esse momento"
                        rows={3}
                        className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none ring-pink-500 transition focus:ring"
                      />
                      <input
                        type="date"
                        value={item.date}
                        onChange={(event) => handleJornadaPolaroidChange(index, { date: event.target.value })}
                        className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none ring-pink-500 transition focus:ring"
                      />
                      <label className="rounded-xl border border-dashed border-zinc-600 bg-zinc-950 p-3 text-sm text-zinc-300">
                        Foto da polaroid
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => handleJornadaPolaroidPhoto(index, event)}
                          className="mt-2 block w-full text-xs"
                        />
                        {item.imageName && <p className="mt-2 text-xs text-green-400">{item.imageName}</p>}
                      </label>
                      {item.imageDataUrl && (
                        <img src={item.imageDataUrl} alt={`Polaroid ${index + 1}`} className="h-24 w-full rounded-xl object-cover" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleConfirmJornadaPolaroids}
                className="mt-4 w-full rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-black"
              >
                Confirmar polaroids e continuar
              </button>
            </div>
          )}

          {currentQuestion.kind === 'music' && (
            <div className="rounded-3xl border border-zinc-700 bg-[#121317] p-4 shadow-[0_20px_45px_rgba(0,0,0,0.35)] sm:p-5">
              <div className="grid gap-3">
                {!isLovelyflixFlow && !isJornadaFlow && !isGameFlow && (
                  <>
                    <input
                      value={lovelyfyUrl}
                      onChange={(event) => {
                        const value = event.target.value
                        setLovelyfyUrl(value)
                        setLoveData({ musicaSpotifyUrl: value })
                      }}
                      placeholder="Cole o link da música no Lovelyfy"
                      aria-label="Link da música no Lovelyfy"
                      className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none ring-green-500 transition focus:ring"
                      required
                    />

                    <input
                      value={musicTitle}
                      onChange={(event) => {
                        const value = event.target.value
                        setMusicTitle(value)
                        setLoveData({ musicaNome: value })
                      }}
                      placeholder="Nome da música (opcional)"
                      aria-label="Nome da música"
                      className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none ring-green-500 transition focus:ring"
                    />
                  </>
                )}

                <label className="rounded-2xl border border-dashed border-zinc-500/80 bg-zinc-900/90 p-4 text-sm text-zinc-300">
                  {isLovelyflixFlow
                    ? 'Foto principal do casal (capa da experiência Lovelyflix)'
                    : isJornadaFlow
                      ? 'Foto principal do casal (capa da Jornada)'
                      : isGameFlow
                        ? 'Foto principal do casal (capa do Game)'
                        : 'Foto principal do casal (capa do Wrapped)'}
                  <input ref={mainPhotoInputRef} type="file" accept="image/*" onChange={handleMainPhotoFile} aria-label="Selecionar foto principal do casal" className="sr-only" />
                  <button
                    type="button"
                    onClick={() => mainPhotoInputRef.current?.click()}
                    className="mt-3 rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                  >
                    Escolher foto da capa
                  </button>
                  <p className="mt-2 text-xs text-zinc-400">
                    {mainPhotoName ? `Arquivo: ${mainPhotoName}` : photoDataUrl ? 'Foto já carregada no preview.' : 'Nenhum arquivo selecionado ainda.'}
                  </p>
                  {photoDataUrl && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-zinc-700">
                      <img src={photoDataUrl} alt="Prévia da capa" className="h-36 w-full object-cover" />
                    </div>
                  )}
                </label>

                <>
                    {isLovelyflixFlow && (
                      <>
                        <label className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900 p-3 text-sm text-zinc-300">
                          Foto do momento mais especial (destaque 1)
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => void handleLovelyflixHighlightPhoto('momento', event)}
                            className="mt-2 block w-full text-xs"
                          />
                          {momentoEspecialFotoDataUrl && <p className="mt-2 text-xs text-emerald-400">Foto do momento especial carregada.</p>}
                        </label>

                        <label className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900 p-3 text-sm text-zinc-300">
                          Foto da atividade favorita (destaque 2)
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => void handleLovelyflixHighlightPhoto('atividade', event)}
                            className="mt-2 block w-full text-xs"
                          />
                          {atividadeFotoDataUrl && <p className="mt-2 text-xs text-emerald-400">Foto da atividade favorita carregada.</p>}
                        </label>
                      </>
                    )}

                    {!isDefaultWrappedFlow && (
                    <label className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-300">
                      Quantas fotos extras você quer na retrospectiva?
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={totalPhotosInput}
                        aria-label="Quantidade de fotos extras"
                        onChange={(event) => handleTotalPhotosChange(event.target.value)}
                        onBlur={handleTotalPhotosBlur}
                        className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                      />
                    </label>
                    )}

                    {isDefaultWrappedFlow && (
                      <p className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-300">
                        Este wrapped usa <span className="font-semibold text-white">{WRAPPED_FIXED_EXTRA_PHOTOS} fotos extras</span> (fixo).
                      </p>
                    )}

                    <label className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900 p-3 text-sm text-zinc-300">
                      {isLovelyflixFlow
                        ? 'Envie as fotos extras para Destaques, Continuar Assistindo e Top 5 (pode selecionar em partes)'
                        : isJornadaFlow
                          ? 'Envie as fotos da linha do tempo da Jornada (pode selecionar em partes)'
                          : isGameFlow
                            ? 'Envie as fotos extras para os capítulos do game (pode selecionar em partes)'
                            : 'Envie as fotos extras para os slides do wrapped (pode selecionar em partes)'}
                      {isLovelyflixFlow && (
                        <p className="mt-2 text-xs text-zinc-400">
                          Sugestão: escolha fotos diferentes entre si para deixar os capítulos mais vivos.
                        </p>
                      )}
                      <input
                        ref={extraPhotosInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleExtraStoriesFiles}
                        className="sr-only"
                        aria-label="Selecionar fotos extras para retrospectiva"
                      />
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => extraPhotosInputRef.current?.click()}
                          className="rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-black transition hover:bg-pink-400"
                        >
                          {storiesDataUrls.length === 0 ? 'Selecionar fotos' : 'Selecionar novamente'}
                        </button>
                        {storiesDataUrls.length > 0 && storiesDataUrls.length < totalPhotos && (
                          <button
                            type="button"
                            onClick={() => extraPhotosInputRef.current?.click()}
                            className="rounded-full border border-zinc-500 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-zinc-400"
                          >
                            Adicionar mais fotos
                          </button>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-zinc-400" aria-live="polite">
                        {momentCounterLabel}
                      </p>
                      {storiesDataUrls.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {storiesDataUrls.map((url, index) => (
                            <div key={`${url}-${index}`} className="relative overflow-hidden rounded-lg border border-zinc-700">
                              <img src={url} alt={`Foto extra ${index + 1}`} className="h-20 w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveExtraStoryPhoto(index)}
                                className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white"
                                aria-label={`Remover foto ${index + 1}`}
                              >
                                x
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </label>
                </>

                {!isLovelyflixFlow && !isJornadaFlow && !isGameFlow && (
                  <>
                    <p className="text-xs text-zinc-400">Etapa obrigatória: informe um link de track válido no Lovelyfy.</p>
                    {spotifyTrackId && <p className="text-xs font-semibold text-green-400">Link válido detectado.</p>}
                    {musicValidationMessage && <p className="text-xs font-semibold text-green-400">{musicValidationMessage}</p>}
                  </>
                )}

              </div>
            </div>
          )}

          {currentQuestion.kind === 'gallery' && (
            <div className="rounded-2xl border border-zinc-700 bg-[#161616] p-4">
              <div className="grid gap-3">
                <label className="rounded-2xl border border-dashed border-pink-400/30 bg-[#121218] p-4 text-sm text-zinc-200">
                  Foto de capa do game
                  <input ref={mainPhotoInputRef} type="file" accept="image/*" onChange={handleMainPhotoFile} aria-label="Selecionar foto de capa do game" className="sr-only" />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => mainPhotoInputRef.current?.click()}
                      className="rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-black transition hover:bg-pink-400"
                    >
                      {photoDataUrl ? 'Trocar capa' : 'Selecionar capa'}
                    </button>
                    <p className="text-xs text-zinc-400">
                      {mainPhotoName ? `Arquivo: ${mainPhotoName}` : photoDataUrl ? 'Capa carregada no preview.' : 'Opcional: se não enviar, o sistema usa a primeira foto.'}
                    </p>
                  </div>
                  {photoDataUrl && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-zinc-700">
                      <img src={photoDataUrl} alt="Prévia da capa do game" className="h-28 w-full object-cover" />
                    </div>
                  )}
                </label>

                <label className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-300">
                  Quantas fotos no total você quer no game?
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={totalPhotosInput}
                    aria-label="Quantidade de fotos extras"
                    onChange={(event) => handleTotalPhotosChange(event.target.value)}
                    onBlur={handleTotalPhotosBlur}
                    className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                  />
                </label>

                <label className="rounded-2xl border border-dashed border-pink-400/30 bg-[#121218] p-4 text-sm text-zinc-200">
                  Envie as fotos dos capítulos do game
                  <input
                    ref={extraPhotosInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleExtraStoriesFiles}
                    className="sr-only"
                    aria-label="Selecionar fotos extras para os capítulos do game"
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => extraPhotosInputRef.current?.click()}
                      className="rounded-full bg-pink-500 px-4 py-2 text-xs font-semibold text-black transition hover:bg-pink-400"
                    >
                      {storiesDataUrls.length === 0 ? 'Selecionar fotos dos capítulos' : 'Selecionar novamente'}
                    </button>
                    {storiesDataUrls.length > 0 && remainingPhotos > 0 && (
                      <button
                        type="button"
                        onClick={() => extraPhotosInputRef.current?.click()}
                        className="rounded-full border border-zinc-500 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-zinc-400"
                      >
                        Adicionar mais fotos
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-zinc-400" aria-live="polite">
                    {momentCounterLabel}
                  </p>
                  {storiesDataUrls.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {storiesDataUrls.map((url, index) => (
                        <div key={`${url}-${index}`} className="relative overflow-hidden rounded-xl border border-pink-400/25 bg-black/40">
                          <img src={url} alt={`Foto extra ${index + 1}`} className="h-20 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveExtraStoryPhoto(index)}
                            className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white"
                            aria-label={`Remover foto ${index + 1}`}
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}

          {notice && (
            <div
              className={`mt-3 rounded-2xl border px-4 py-3 text-sm ${
                notice.type === 'error'
                  ? 'border-rose-400/60 bg-rose-500/15 text-rose-100'
                  : 'border-emerald-400/60 bg-emerald-500/15 text-emerald-100'
              }`}
              role="alert"
              aria-live="polite"
            >
              <p className="font-semibold">{notice.type === 'error' ? 'Atenção' : 'Tudo certo'}</p>
              <p className="mt-1 text-xs text-white/80">{notice.message}</p>
            </div>
          )}
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (step > 0) {
                        setStep((prev) => Math.max(0, prev - 1))
                        setNotice(null)
                        return
                      }
                      if (giftTypeStepDone) {
                        setGiftTypeStepDone(false)
                      }
                    }}
                    className={`rounded-2xl px-5 py-3 text-sm font-semibold ${
                      isBuilderDark ? 'border border-zinc-600 bg-zinc-800 text-zinc-200' : 'border border-[#cfc7df] bg-white text-[#403a4d]'
                    }`}
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueClick}
                    className="rounded-2xl bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition hover:brightness-105"
                  >
                    Continuar
                  </button>
                </div>
              </div>
            </form>
          </section>

          <aside className="hidden lg:block">
            {shouldHidePreviewPanel ? (
              <div className={`sticky top-5 rounded-[32px] border p-5 ${isBuilderDark ? 'border-zinc-700 bg-zinc-900/60 text-zinc-200' : 'border-[#d2cbe2] bg-[#f7f5fb] text-[#4a435c]'}`}>
                <p className="text-xs uppercase tracking-[0.16em] text-pink-500">Etapa Inicial</p>
                <h3 className="mt-2 text-xl font-bold">Primeiro vamos conhecer o casal</h3>
                <p className="mt-2 text-sm">Depois de nome e data de início, o preview original do wrapped aparece automaticamente aqui.</p>
              </div>
            ) : (
              <div className="sticky top-5 relative rounded-[32px] border border-[#1f2230] bg-[#141822] p-3 shadow-2xl">
                <iframe
                  title="Pré-visualização original"
                  src={
                    config.mode === 'wrapped' && config.variant === 'stories'
                      ? `/lovelyflix-profile?builderPreview=1&t=${previewTick}`
                      : `/preview?builderPreview=1&mode=${config.mode}&variant=${config.variant}&theme=${encodeURIComponent(config.theme)}&t=${previewTick}`
                  }
                  className="h-[84vh] min-h-[680px] w-full rounded-[24px] border border-white/10 bg-black"
                />
                <div className="pointer-events-none absolute inset-x-5 bottom-5 rounded-xl border border-white/15 bg-black/55 px-3 py-2 text-center text-xs text-zinc-200 backdrop-blur-sm">
                  Conclua os passos para ter acesso.
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}
