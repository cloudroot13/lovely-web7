import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatBubble } from '../components/ChatBubble'
import { useAppContext } from '../context/appStore'
import ClassicNormalBuilder from './ClassicNormalBuilder'
import ClassicNetflixBuilder from './ClassicNetflixBuilder'
import type { LoveData, MomentHighlight } from '../types/types'
import { readFileAsDataUrl } from '../utils/file'

type QuestionKind = 'text' | 'music' | 'gallery' | 'number' | 'date' | 'datetime' | 'photo'

interface Question {
  id: string
  text: string
  placeholder: string
  kind: QuestionKind
}

const questions: Question[] = [
  { id: 'nomeCriador', text: 'Antes de tudo, qual é o seu nome?', placeholder: 'Ex: Leonardo', kind: 'text' },
  { id: 'nomePessoa', text: 'Qual o nome da sua pessoa amada?', placeholder: 'Ex: Amanda', kind: 'text' },
  { id: 'apelido', text: 'Como você chama ela no dia a dia?', placeholder: 'Ex: Meu amor, vida, meu bem...', kind: 'text' },
  { id: 'comoConheceram', text: 'Me conta como vocês se conheceram.', placeholder: 'Ex: na escola, no trabalho, por amigos...', kind: 'text' },
  {
    id: 'momentoEspecial',
    text: 'Qual foi o momento que mais marcou a relação de vocês?',
    placeholder: 'Ex: quando pedi ela em namoro',
    kind: 'text',
  },
  {
    id: 'momentoEspecialFoto',
    text: 'Lindo. Agora compartilhe uma foto desse momento.',
    placeholder: '',
    kind: 'photo',
  },
  {
    id: 'atividadeJuntos',
    text: 'O que vocês mais gostam de fazer juntos?',
    placeholder: 'Ex: cozinhar juntos, ver filme abraçados, passear...',
    kind: 'text',
  },
  {
    id: 'atividadeFoto',
    text: 'Perfeito. Compartilhe uma foto desse momento também.',
    placeholder: '',
    kind: 'photo',
  },
  { id: 'dataImportante', text: 'Selecione uma data importante para destacar.', placeholder: '', kind: 'date' },
  { id: 'startDate', text: 'Qual a data que vocês se conheceram?', placeholder: '', kind: 'date' },
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
  {
    id: 'music',
    text: 'Agora escolha a música de vocês e envie as outras fotos da retrospectiva',
    placeholder: '',
    kind: 'music',
  },
]

const lovelyflixQuestions: Question[] = [
  { id: 'nomeCriador', text: 'Vamos montar seu painel Lovelyflix. Qual é o seu nome?', placeholder: 'Ex: Leonardo', kind: 'text' },
  { id: 'nomePessoa', text: 'Quem estrela essa história com você?', placeholder: 'Ex: Amanda', kind: 'text' },
  { id: 'apelido', text: 'Qual apelido carinhoso aparece nos créditos?', placeholder: 'Ex: Meu amor, vida, princesa...', kind: 'text' },
  {
    id: 'comoConheceram',
    text: 'Conte o episódio piloto: como vocês se conheceram?',
    placeholder: 'Ex: na escola, trabalho, por amigos...',
    kind: 'text',
  },
  {
    id: 'momentoEspecial',
    text: 'Qual foi o momento mais especial de vocês? (vamos usar como destaque principal)',
    placeholder: 'Ex: o pedido de namoro, a primeira viagem...',
    kind: 'text',
  },
  {
    id: 'momentoEspecialFoto',
    text: 'Agora envie a foto desse momento especial.',
    placeholder: '',
    kind: 'photo',
  },
  {
    id: 'atividadeJuntos',
    text: 'Qual atividade vocês mais gostam de fazer juntos?',
    placeholder: 'Ex: ver filme, cozinhar, sair para jantar...',
    kind: 'text',
  },
  {
    id: 'atividadeFoto',
    text: 'Envie uma foto dessa atividade favorita.',
    placeholder: '',
    kind: 'photo',
  },
  { id: 'dataImportante', text: 'Selecione a data importante que deve aparecer na experiência.', placeholder: '', kind: 'date' },
  { id: 'startDate', text: 'Qual a data que vocês se conheceram?', placeholder: '', kind: 'date' },
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
    id: 'music',
    text: 'Envie 5 fotos diferentes para os capítulos: encontro, viagem, selfie, comemoração e momento espontâneo.',
    placeholder: '',
    kind: 'music',
  },
]

const jornadaQuestions: Question[] = [
  { id: 'nomeCriador', text: 'Antes de tudo, qual é o seu nome?', placeholder: 'Ex: Leonardo', kind: 'text' },
  { id: 'nomePessoa', text: 'Qual o nome da sua pessoa amada?', placeholder: 'Ex: Amanda', kind: 'text' },
  { id: 'apelido', text: 'Como você chama ela no dia a dia?', placeholder: 'Ex: Meu amor, vida, meu bem...', kind: 'text' },
  {
    id: 'comoConheceram',
    text: 'Vamos começar pela primeira polaroid: como foi o primeiro encontro de vocês?',
    placeholder: 'Ex: café no fim da tarde, cinema, praça...',
    kind: 'text',
  },
  {
    id: 'momentoEspecial',
    text: 'Agora a segunda polaroid: descreva o primeiro beijo de vocês.',
    placeholder: 'Ex: depois do cinema, na chuva, no carro...',
    kind: 'text',
  },
  {
    id: 'momentoEspecialFoto',
    text: 'Envie a foto que vai representar esse capítulo.',
    placeholder: '',
    kind: 'photo',
  },
  {
    id: 'atividadeJuntos',
    text: 'Terceira polaroid: qual foi a primeira viagem ou passeio inesquecível?',
    placeholder: 'Ex: praia, interior, viagem curta de fim de semana...',
    kind: 'text',
  },
  {
    id: 'atividadeFoto',
    text: 'Perfeito. Envie a foto dessa viagem/passeio.',
    placeholder: '',
    kind: 'photo',
  },
  { id: 'dataImportante', text: 'Qual foi a data do pedido de namoro (quarta polaroid)?', placeholder: '', kind: 'date' },
  { id: 'startDate', text: 'Qual foi a data do primeiro encontro?', placeholder: '', kind: 'date' },
  {
    id: 'weeklyMeetups',
    text: 'Em média, quantas vezes por mês vocês criam novos momentos juntos?',
    placeholder: 'Ex: 4',
    kind: 'number',
  },
  {
    id: 'oQueMaisAmo',
    text: 'Quinta polaroid: descreva o momento especial que não pode faltar na Jornada.',
    placeholder: 'Ex: jantar surpresa, conquista juntos, data marcante...',
    kind: 'text',
  },
  {
    id: 'music',
    text: 'Envie a foto principal e mais 5 fotos na ordem: encontro, beijo, viagem, pedido e momento especial.',
    placeholder: '',
    kind: 'music',
  },
]

const gameQuestions: Question[] = [
  { id: 'nomeCriador', text: 'Qual o seu nome de jogador(a)?', placeholder: 'Ex: Leo', kind: 'text' },
  { id: 'nomePessoa', text: 'Quem joga essa aventura com você?', placeholder: 'Ex: Amanda', kind: 'text' },
  {
    id: 'momentoEspecial',
    text: 'Quais palavras quer usar no caça-palavras? (separe por vírgula)',
    placeholder: 'Ex: sorriso, cabelo, piadas, abraço',
    kind: 'text',
  },
  {
    id: 'oQueMaisAmo',
    text: 'Qual tema da frase do jogo? (ex: O que mais gosto em você)',
    placeholder: 'Ex: O que mais gosto em você',
    kind: 'text',
  },
  {
    id: 'atividadeJuntos',
    text: 'Digite opções da roleta (coisas que você ama nela), separadas por vírgula.',
    placeholder: 'Ex: seu abraço, seu sorriso, ver filmes com você, seu olhar',
    kind: 'text',
  },
  {
    id: 'momentoEspecialFoto',
    text: 'Envie uma foto do momento especial para os capítulos extras.',
    placeholder: '',
    kind: 'photo',
  },
  {
    id: 'atividadeFoto',
    text: 'Agora envie outra foto para o segundo capítulo de fotos.',
    placeholder: '',
    kind: 'photo',
  },
  {
    id: 'gameGallery',
    text: 'Envie a foto principal do casal e as fotos extras para os novos slides.',
    placeholder: '',
    kind: 'gallery',
  },
]

function extractLovelyfyTrackId(url: string) {
  const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/)
  return match?.[1] ?? ''
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
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    { sender: 'bot', text: activeQuestions[0].text },
  ])

  const [musicTitle, setMusicTitle] = useState('')
  const [lovelyfyUrl, setLovelyfyUrl] = useState('')
  const [photoDataUrl, setPhotoDataUrl] = useState('')
  const [totalPhotos, setTotalPhotos] = useState(5)
  const [storiesDataUrls, setStoriesDataUrls] = useState<string[]>([])
  const [storiesImageKeys, setStoriesImageKeys] = useState<string[]>([])
  const [musicValidationMessage, setMusicValidationMessage] = useState('')
  const [momentoEspecialFotoDataUrl, setMomentoEspecialFotoDataUrl] = useState('')
  const [atividadeFotoDataUrl, setAtividadeFotoDataUrl] = useState('')
  const extraPhotosInputRef = useRef<HTMLInputElement | null>(null)
  const messagesContainerRef = useRef<HTMLElement | null>(null)

  const currentQuestion = activeQuestions[step]
  const spotifyTrackId = extractLovelyfyTrackId(lovelyfyUrl.trim())
  const remainingPhotos = Math.max(0, totalPhotos - storiesDataUrls.length)

  const moveNext = () => {
    const nextStep = step + 1
    if (nextStep >= activeQuestions.length) {
      navigate(isLovelyflixFlow ? '/lovelyflix-profile' : '/preview')
      return
    }
    setStep(nextStep)
    setMessages((prev) => [...prev, { sender: 'bot', text: activeQuestions[nextStep].text }])
  }

  const handleConfirmMusic = () => {
    if (isLovelyflixFlow) {
      if (!momentoEspecialFotoDataUrl || !atividadeFotoDataUrl) {
        alert('Antes de continuar, envie as 2 fotos dos momentos marcantes.')
        return
      }

      if (storiesDataUrls.length !== totalPhotos) {
        alert(`Envie exatamente ${totalPhotos} fotos extras para continuar.`)
        return
      }

      const momentHighlights: MomentHighlight[] = [
        { text: loveData.momentoEspecial || 'Destaque principal', imageDataUrl: momentoEspecialFotoDataUrl },
        { text: loveData.atividadeJuntos || 'Momento do Top 5', imageDataUrl: atividadeFotoDataUrl },
      ]

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
        alert('Antes de continuar, envie as 2 fotos dos momentos marcantes.')
        return
      }

      if (!photoDataUrl) {
        alert('Envie a foto principal do casal para continuar.')
        return
      }

      if (storiesDataUrls.length !== totalPhotos) {
        alert(`Envie exatamente ${totalPhotos} fotos extras para continuar.`)
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
      if (!momentoEspecialFotoDataUrl || !atividadeFotoDataUrl) {
        alert('Antes de continuar, envie as 2 fotos dos momentos marcantes.')
        return
      }

      if (!photoDataUrl) {
        alert('Envie a foto principal do casal para continuar.')
        return
      }

      if (storiesDataUrls.length !== totalPhotos) {
        alert(`Envie exatamente ${totalPhotos} fotos extras para continuar.`)
        return
      }

      const momentHighlights: MomentHighlight[] = [
        { text: loveData.momentoEspecial || 'Momento mais marcante', imageDataUrl: momentoEspecialFotoDataUrl },
        { text: loveData.atividadeJuntos || 'Coisas que eu amo em você', imageDataUrl: atividadeFotoDataUrl },
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

      setMessages((prev) => [...prev, { sender: 'user', text: `${storiesDataUrls.length} fotos extras enviadas para os capítulos do game.` }])
      moveNext()
      return
    }

    const match = lovelyfyUrl.match(/track\/([a-zA-Z0-9]+)/)
    const trackId = match ? match[1] : null

    if (!trackId) {
      setMusicValidationMessage('')
      alert('Link do Lovelyfy inválido')
      return
    }

    if (storiesDataUrls.length !== totalPhotos) {
      alert(`Envie exatamente ${totalPhotos} fotos extras para continuar.`)
      return
    }

    if (!momentoEspecialFotoDataUrl || !atividadeFotoDataUrl) {
      alert('Antes de continuar, envie as 2 fotos dos momentos marcantes.')
      return
    }

    const momentHighlights: MomentHighlight[] = [
      { text: loveData.momentoEspecial || 'Momento mais marcante', imageDataUrl: momentoEspecialFotoDataUrl },
      { text: loveData.atividadeJuntos || 'Nosso momento favorito', imageDataUrl: atividadeFotoDataUrl },
    ]

    setMusicValidationMessage('Link válido. Música confirmada.')
    setLoveData({
      musicaSource: 'spotify_link',
      musicaSpotifyUrl: lovelyfyUrl.trim(),
      musicaNome: musicTitle.trim(),
      fotoCasalDataUrl: photoDataUrl,
      totalPhotos,
      storiesImagesDataUrls: storiesDataUrls,
      momentHighlights,
      memoriesCreated: momentHighlights.length + storiesDataUrls.length,
    })

    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: `Música confirmada: ${musicTitle.trim() || 'Faixa Lovelyfy'}` },
      { sender: 'user', text: `${storiesDataUrls.length} fotos extras enviadas para retrospectiva.` },
    ])
    moveNext()
  }

  const handleMainPhotoFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }
    const dataUrl = await readFileAsDataUrl(file)
    setPhotoDataUrl(dataUrl)
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

  const handleExtraStoriesFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) {
      return
    }

    if (remainingPhotos <= 0) {
      alert(`Você já enviou ${totalPhotos} de ${totalPhotos} fotos.`)
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
      alert(`${duplicates} foto(s) repetida(s) foram ignoradas.`)
    }

    if (uniqueBatch.length > remainingPhotos) {
      alert(`Só faltam ${remainingPhotos} foto(s). O restante foi ignorado.`)
    }

    const limited = uniqueBatch.slice(0, remainingPhotos)
    const nextUrls = await Promise.all(limited.map((file) => readFileAsDataUrl(file)))
    const nextKeys = limited.map((file) => `${file.name}-${file.size}-${file.lastModified}`)
    setStoriesDataUrls((prev) => [...prev, ...nextUrls])
    setStoriesImageKeys((prev) => [...prev, ...nextKeys])
    event.target.value = ''
  }

  const handleRemoveExtraStoryPhoto = (index: number) => {
    setStoriesDataUrls((prev) => prev.filter((_, idx) => idx !== index))
    setStoriesImageKeys((prev) => prev.filter((_, idx) => idx !== index))
  }

  const handleConfirmPhotoStep = () => {
    const hasPhoto = currentQuestion.id === 'momentoEspecialFoto' ? Boolean(momentoEspecialFotoDataUrl) : Boolean(atividadeFotoDataUrl)
    if (!hasPhoto) {
      alert('Selecione uma foto para continuar.')
      return
    }

    setMessages((prev) => [...prev, { sender: 'user', text: 'Foto enviada.' }])
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

    const value = answer.trim()
    if (!value) {
      return
    }

    setMessages((prev) => [...prev, { sender: 'user', text: value }])

    if (currentQuestion.kind === 'number') {
      const numericValue = Math.max(1, Number(value))
      const key = currentQuestion.id as keyof LoveData
      setLoveData({ [key]: numericValue } as Partial<LoveData>)
      setAnswer('')
      moveNext()
      return
    }

    const key = currentQuestion.id as keyof LoveData
    setLoveData({ [key]: value } as Partial<LoveData>)
    setAnswer('')
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
  const momentCounterLabel = useMemo(() => `${storiesDataUrls.length} de ${totalPhotos} fotos extras enviadas`, [storiesDataUrls.length, totalPhotos])

  useEffect(() => {
    if (isClassicNormalFlow) {
      return
    }

    if (!messagesContainerRef.current) {
      return
    }

    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
  }, [isClassicNormalFlow, messages])

  if (isClassicNormalFlow) {
    return <ClassicNormalBuilder />
  }

  if (isClassicNetflixFlow) {
    return <ClassicNetflixBuilder />
  }

  return (
    <main className="flex min-h-[100dvh] flex-col bg-[#0f0f0f] text-[#f5f5f5]">
      <header className="border-b border-zinc-800 px-5 py-4 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-pink-300">Builder Interativo</p>
        <h1 className="text-xl font-semibold md:text-2xl">Monte sua declaração em formato de chat</h1>
      </header>

      <section
        ref={messagesContainerRef}
        className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-3 overflow-y-auto px-4 py-6"
        role="log"
        aria-live="polite"
        aria-label="Histórico do chat"
      >
        {messages.map((message, index) => (
          <ChatBubble key={`${index}-${message.sender}`} text={message.text} sender={message.sender} />
        ))}
      </section>

      <form onSubmit={handleSubmit} className="shrink-0 border-t border-zinc-800 bg-zinc-950 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-full max-w-3xl">
          {(currentQuestion.kind === 'text' || currentQuestion.kind === 'number' || currentQuestion.kind === 'date' || currentQuestion.kind === 'datetime') && (
            <div className="flex gap-3">
              <input
                type={inputType}
                value={answer}
                min={currentQuestion.kind === 'number' ? 1 : undefined}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder={currentQuestion.placeholder}
                aria-label={currentQuestion.text}
                className="flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none ring-pink-500 transition focus:ring"
              />
              <button
                type="submit"
                disabled={answer.trim().length === 0}
                className="rounded-full bg-pink-500 px-6 py-3 font-semibold text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                Enviar
              </button>
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

          {currentQuestion.kind === 'music' && (
            <div className="rounded-2xl border border-zinc-700 bg-[#161616] p-4">
              <div className="grid gap-3">
                {!isLovelyflixFlow && !isJornadaFlow && !isGameFlow && (
                  <>
                    <input
                      value={lovelyfyUrl}
                      onChange={(event) => setLovelyfyUrl(event.target.value)}
                      placeholder="Cole o link da música no Lovelyfy"
                      aria-label="Link da música no Lovelyfy"
                      className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none ring-green-500 transition focus:ring"
                      required
                    />

                    <input
                      value={musicTitle}
                      onChange={(event) => setMusicTitle(event.target.value)}
                      placeholder="Nome da música (opcional)"
                      aria-label="Nome da música"
                      className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm outline-none ring-green-500 transition focus:ring"
                    />
                  </>
                )}

                <label className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900 p-3 text-sm text-zinc-300">
                  {isLovelyflixFlow
                    ? 'Foto principal do casal (capa da experiência Lovelyflix)'
                    : isJornadaFlow
                      ? 'Foto principal do casal (capa da Jornada)'
                      : isGameFlow
                        ? 'Foto principal do casal (capa do Game)'
                        : 'Foto principal do casal (capa do Wrapped)'}
                  <input type="file" accept="image/*" onChange={handleMainPhotoFile} aria-label="Selecionar foto principal do casal" className="mt-2 block w-full text-xs" />
                </label>

                <label className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-300">
                  Quantas fotos extras você quer na retrospectiva?
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={totalPhotos}
                    aria-label="Quantidade de fotos extras"
                    onChange={(event) => {
                      const next = Number(event.target.value)
                      const safe = Number.isNaN(next) ? 1 : Math.max(1, Math.min(20, next))
                      setTotalPhotos(safe)
                      setStoriesDataUrls((prev) => prev.slice(0, safe))
                      setStoriesImageKeys((prev) => prev.slice(0, safe))
                    }}
                    className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                  />
                </label>

                <label className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900 p-3 text-sm text-zinc-300">
                  {isLovelyflixFlow
                    ? 'Envie as fotos extras para Destaques, Continuar Assistindo e Top 5 (pode selecionar em partes)'
                    : isJornadaFlow
                      ? 'Envie as fotos da linha do tempo da Jornada (pode selecionar em partes)'
                      : isGameFlow
                        ? 'Envie as fotos extras para os capítulos do game (pode selecionar em partes)'
                        : 'Envie as fotos extras da história (pode selecionar em partes)'}
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

                {!isLovelyflixFlow && !isJornadaFlow && !isGameFlow && (
                  <>
                    <p className="text-xs text-zinc-400">Etapa obrigatória: informe um link de track válido no Lovelyfy.</p>
                    {spotifyTrackId && <p className="text-xs font-semibold text-green-400">Link válido detectado.</p>}
                    {musicValidationMessage && <p className="text-xs font-semibold text-green-400">{musicValidationMessage}</p>}
                  </>
                )}

                <button
                  type="button"
                  onClick={handleConfirmMusic}
                  className="mt-1 rounded-full bg-[#1DB954] px-6 py-3 text-sm font-semibold text-black"
                >
                  {isLovelyflixFlow
                    ? 'Confirmar conteúdo e continuar'
                    : isJornadaFlow
                      ? 'Confirmar jornada e continuar'
                      : isGameFlow
                        ? 'Confirmar game e continuar'
                        : 'Confirmar música e continuar'}
                </button>
              </div>
            </div>
          )}

          {currentQuestion.kind === 'gallery' && (
            <div className="rounded-2xl border border-zinc-700 bg-[#161616] p-4">
              <div className="grid gap-3">
                <label className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900 p-3 text-sm text-zinc-300">
                  Foto principal do casal (capa do Game)
                  <input type="file" accept="image/*" onChange={handleMainPhotoFile} aria-label="Selecionar foto principal do casal" className="mt-2 block w-full text-xs" />
                </label>

                <label className="rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-300">
                  Quantas fotos extras você quer na retrospectiva?
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={totalPhotos}
                    aria-label="Quantidade de fotos extras"
                    onChange={(event) => {
                      const next = Number(event.target.value)
                      const safe = Number.isNaN(next) ? 1 : Math.max(1, Math.min(20, next))
                      setTotalPhotos(safe)
                      setStoriesDataUrls((prev) => prev.slice(0, safe))
                      setStoriesImageKeys((prev) => prev.slice(0, safe))
                    }}
                    className="mt-2 block w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
                  />
                </label>

                <label className="rounded-xl border border-dashed border-zinc-600 bg-zinc-900 p-3 text-sm text-zinc-300">
                  Envie as fotos extras para os capítulos do game (pode selecionar em partes)
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

                <button
                  type="button"
                  onClick={handleConfirmMusic}
                  className="mt-1 rounded-full bg-[#1DB954] px-6 py-3 text-sm font-semibold text-black"
                >
                  Confirmar game e continuar
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </main>
  )
}
