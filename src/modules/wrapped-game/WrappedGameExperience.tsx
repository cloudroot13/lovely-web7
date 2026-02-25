import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../context/appStore'
import { WRAPPED_STORY_DURATION_MS } from '../../constants/wrappedTiming'
import './wrappedGame.css'

type Step = 'intro' | 'stories'
type StoryId = 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's10'
type Difficulty = 'easy' | 'hard'

const SEARCH_SIZE = 10
const MOBILE_SEARCH_SIZE = 6

function randomLetter() {
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return alpha[Math.floor(Math.random() * alpha.length)]
}

function normalizeWords(_: string, difficulty: Difficulty) {
  const fallback = difficulty === 'hard'
    ? ['SORRISO', 'CABELO', 'PIADAS', 'ABRAÇO', 'OLHAR']
    : ['SORRISO', 'CABELO', 'PIADAS']
  return fallback
}

function parseWheelOptions(_: string) {
  const fallback = ['Seu abraço', 'Seu sorriso', 'Ver filmes com você', 'Seu olhar', 'Seu jeitinho', 'Seu carinho', 'Nossas risadas', 'Nossos planos']
  return fallback
}

function formatWheelLabel(label: string) {
  const clean = label.trim()
  if (clean.length <= 20) return clean
  return `${clean.slice(0, 20)}...`
}

function toGridWords(words: string[]) {
  return words.map((word) => word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Z]/g, '').slice(0, 10)).filter(Boolean)
}

function idxToRC(idx: number, size: number) {
  return { r: Math.floor(idx / size), c: idx % size }
}

function rcToIdx(r: number, c: number, size: number) {
  return r * size + c
}

function inBounds(r: number, c: number, size: number) {
  return r >= 0 && r < size && c >= 0 && c < size
}

function lineCells(start: number, end: number, size: number) {
  const a = idxToRC(start, size)
  const b = idxToRC(end, size)
  const dr = b.r - a.r
  const dc = b.c - a.c
  const stepR = dr === 0 ? 0 : dr / Math.abs(dr)
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc)
  const absR = Math.abs(dr)
  const absC = Math.abs(dc)
  const straight = absR === 0 || absC === 0 || absR === absC
  if (!straight) return []
  const len = Math.max(absR, absC)
  const cells: number[] = []
  for (let i = 0; i <= len; i += 1) {
    cells.push(rcToIdx(a.r + stepR * i, a.c + stepC * i, size))
  }
  return cells
}

function buildWordSearch(words: string[], size: number) {
  const grid = Array.from({ length: size * size }, () => '')
  const dirs: Array<[number, number]> = [
    [0, 1],
    [1, 0],
    [1, 1],
    [-1, 1],
    [0, -1],
    [-1, 0],
    [-1, -1],
    [1, -1],
  ]

  const placements = words.map((word) => {
    let cells: number[] = []
    let placed = false
      for (let guard = 0; guard < 280 && !placed; guard += 1) {
        const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)]
        const r = Math.floor(Math.random() * size)
        const c = Math.floor(Math.random() * size)
        const test: number[] = []
        let ok = true
        for (let i = 0; i < word.length; i += 1) {
          const rr = r + dr * i
          const cc = c + dc * i
          if (!inBounds(rr, cc, size)) {
            ok = false
            break
          }
          const idx = rcToIdx(rr, cc, size)
          const ch = grid[idx]
          if (ch && ch !== word[i]) {
          ok = false
          break
        }
        test.push(idx)
      }
      if (!ok) continue
      test.forEach((idx, i) => {
        grid[idx] = word[i]
      })
      cells = test
      placed = true
    }
    if (!placed) {
      const row = Math.floor(Math.random() * size)
      const startCol = Math.max(0, Math.floor(Math.random() * (size - word.length)))
      cells = []
      word.split('').forEach((ch, i) => {
        const idx = rcToIdx(row, startCol + i, size)
        grid[idx] = ch
        cells.push(idx)
      })
    }
    return { word, cells }
  })

  for (let i = 0; i < grid.length; i += 1) {
    if (!grid[i]) grid[i] = randomLetter()
  }

  return { grid, placements }
}

export function WrappedGameExperience() {
  const navigate = useNavigate()
  const { config, loveData } = useAppContext()
  const [step, setStep] = useState<Step>('intro')
  const [difficulty, setDifficulty] = useState<Difficulty>('easy')
  const [storyIdx, setStoryIdx] = useState(0)
  const [storyProgress, setStoryProgress] = useState(0)
  const [typedStart, setTypedStart] = useState('')

  const [foundWords, setFoundWords] = useState<string[]>([])
  const [foundCells, setFoundCells] = useState<Set<number>>(new Set())
  const [dragStart, setDragStart] = useState<number | null>(null)
  const [dragEnd, setDragEnd] = useState<number | null>(null)
  const [selectedCells, setSelectedCells] = useState<number[]>([])
  const [wordMessage, setWordMessage] = useState('')
  const [tapSelectionMode, setTapSelectionMode] = useState(false)

  const [wheelRotation, setWheelRotation] = useState(0)
  const [wheelSpinning, setWheelSpinning] = useState(false)
  const [wheelResult, setWheelResult] = useState('')
  const wheelTimeoutRef = useRef<number | null>(null)

  const [challengeDone, setChallengeDone] = useState(false)
  const [challengeSequence, setChallengeSequence] = useState<number[]>([])
  const [challengeActiveStep, setChallengeActiveStep] = useState(-1)
  const [challengeInputIdx, setChallengeInputIdx] = useState(0)
  const [challengeMessage, setChallengeMessage] = useState('')
  const [challengeShake, setChallengeShake] = useState(false)
  const [minutesCounter, setMinutesCounter] = useState(0)
  const challengeTimeoutsRef = useRef<number[]>([])

  const stories: StoryId[] = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's10']
  const currentStory = stories[storyIdx]

  useEffect(() => {
    if (config.mode !== 'wrapped' || config.variant !== 'game') {
      navigate('/choose-mode', { replace: true })
    }
  }, [config.mode, config.variant, navigate])

  useEffect(() => {
    const text = 'GAME EXPERIENCE'
    let i = 0
    const t = window.setInterval(() => {
      i += 1
      setTypedStart(text.slice(0, i))
      if (i >= text.length) window.clearInterval(t)
    }, 90)
    return () => window.clearInterval(t)
  }, [])

  const wordsFromChat = useMemo(() => toGridWords(normalizeWords(loveData.momentoEspecial || '', difficulty)), [loveData.momentoEspecial, difficulty])
  const themeFromChat = useMemo(() => (loveData.oQueMaisAmo || 'O que mais gosto em você').trim(), [loveData.oQueMaisAmo])
  const wheelOptions = useMemo(() => parseWheelOptions(loveData.atividadeJuntos || ''), [loveData.atividadeJuntos])
  const searchWords = useMemo(() => {
    const fixed = difficulty === 'hard'
      ? ['SORRISO', 'CABELO', 'PIADAS', 'ABRAÇO', 'OLHAR']
      : ['SORRISO', 'CABELO', 'PIADAS']
    return Array.from(new Set([...fixed, ...wordsFromChat])).slice(0, difficulty === 'hard' ? 5 : 3)
  }, [wordsFromChat, difficulty])
  const [isSmallScreen, setIsSmallScreen] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 420px)')
    const apply = () => setIsSmallScreen(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])
  const searchSize = isSmallScreen ? MOBILE_SEARCH_SIZE : SEARCH_SIZE
  const searchData = useMemo(() => buildWordSearch(searchWords, searchSize), [searchWords, searchSize])
  const galleryImages = useMemo(() => {
    const items = [
      loveData.fotoCasalDataUrl,
      ...loveData.storiesImagesDataUrls,
      ...loveData.momentHighlights.map((item) => item.imageDataUrl),
    ].filter(Boolean)
    return Array.from(new Set(items))
  }, [loveData.fotoCasalDataUrl, loveData.storiesImagesDataUrls, loveData.momentHighlights])
  const hintCells = useMemo(() => {
    if (difficulty !== 'easy') return new Set<number>()
    const hints = new Set<number>()
    searchData.placements.forEach((placement) => {
      if (!foundWords.includes(placement.word) && placement.cells.length) {
        hints.add(placement.cells[0])
      }
    })
    return hints
  }, [difficulty, searchData.placements, foundWords])
  const wheelSegments = useMemo(() => {
    const palette = ['#E50914', '#1E3A8A']
    return wheelOptions.map((label, index) => ({
      label,
      displayLabel: formatWheelLabel(label),
      color: palette[index % 2],
    }))
  }, [wheelOptions])
  const wheelGradient = useMemo(() => {
    const count = wheelSegments.length || 1
    const part = 100 / count
    return `conic-gradient(${wheelSegments
      .map((seg, idx) => `${seg.color} ${idx * part}% ${(idx + 1) * part}%`)
      .join(',')})`
  }, [wheelSegments])
  const wheelLabelPoints = useMemo(() => {
    const count = wheelSegments.length || 1
    const step = 360 / count
    const radius = 102
    return wheelSegments.map((_, index) => {
      const angle = -90 + index * step + step / 2
      const rad = (angle * Math.PI) / 180
      return {
        x: Math.cos(rad) * radius,
        y: Math.sin(rad) * radius,
      }
    })
  }, [wheelSegments])

  useEffect(() => {
    const media = window.matchMedia('(hover: none), (pointer: coarse)')
    const applyMode = () => setTapSelectionMode(media.matches)
    applyMode()
    media.addEventListener('change', applyMode)
    return () => media.removeEventListener('change', applyMode)
  }, [])

  useEffect(() => {
    if (step !== 'stories') return

    let raf = 0
    const startedAt = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const progress = Math.min(100, (elapsed / WRAPPED_STORY_DURATION_MS) * 100)
      setStoryProgress(progress)

      if (progress < 100) {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [step, storyIdx])

  const computeMinutesTogether = useMemo(() => {
    const start = loveData.startDate ? new Date(`${loveData.startDate}T00:00:00`) : null
    if (start && !Number.isNaN(start.getTime())) {
      return Math.max(1, Math.floor((Date.now() - start.getTime()) / 60000))
    }
    const fallbackDays = Math.max(1, loveData.anos * 365 + loveData.meses * 30 + loveData.dias)
    return Math.max(1, fallbackDays * 24 * 60)
  }, [loveData.startDate, loveData.anos, loveData.meses, loveData.dias])

  useEffect(() => {
    if (currentStory !== 's8') return
    const target = computeMinutesTogether
    let raf = 0
    const start = performance.now()
    const duration = 1200
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      const value = Math.floor(target * eased)
      setMinutesCounter(value)
      if (p < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setMinutesCounter(target)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [currentStory, computeMinutesTogether])

  const goNext = () => {
    if (storyIdx >= stories.length - 1) {
      navigate('/preview', { replace: true })
      return
    }
    setStoryIdx((prev) => Math.min(stories.length - 1, prev + 1))
    setStoryProgress(0)
  }

  const goPrev = () => {
    if (storyIdx <= 0) {
      return
    }
    setStoryIdx((prev) => Math.max(0, prev - 1))
    setStoryProgress(0)
  }

  const resetGameState = () => {
    setStoryIdx(0)
    setStoryProgress(0)
    setFoundWords([])
    setFoundCells(new Set())
    setDragStart(null)
    setDragEnd(null)
    setSelectedCells([])
    setWordMessage('')
    setWheelRotation(0)
    setWheelSpinning(false)
    setWheelResult('')
    setChallengeDone(false)
    setChallengeSequence([])
    setChallengeActiveStep(-1)
    setChallengeInputIdx(0)
    setChallengeMessage('')
    setChallengeShake(false)
  }

  const startSelect = (index: number) => {
    setDragStart(index)
    setDragEnd(index)
    setSelectedCells([index])
  }

  const moveSelect = (index: number) => {
    if (dragStart === null) return
    setDragEnd(index)
    setSelectedCells(lineCells(dragStart, index, searchSize))
  }

  const endSelect = () => {
    if (dragStart === null || dragEnd === null) {
      return
    }
    const line = lineCells(dragStart, dragEnd, searchSize)
    const candidate = line.map((idx) => searchData.grid[idx]).join('')
    const reverse = candidate.split('').reverse().join('')
    const hit = searchData.placements.find((item) => (item.word === candidate || item.word === reverse) && !foundWords.includes(item.word))
    if (hit) {
      setFoundWords((prev) => [...prev, hit.word])
      setFoundCells((prev) => new Set([...prev, ...hit.cells]))
      setWordMessage(`Perfeito! Você encontrou "${hit.word}".`)
    }
    setDragStart(null)
    setDragEnd(null)
    setSelectedCells([])
  }

  const handleTapSelect = (index: number) => {
    if (foundCells.has(index)) {
      return
    }

    if (selectedCells.includes(index)) {
      return
    }

    const next = [...selectedCells, index]
    const availablePlacements = searchData.placements.filter((item) => !foundWords.includes(item.word))

    const matchesPrefix = availablePlacements.filter((item) => {
      const directPrefix = item.cells.slice(0, next.length)
      const reverseCells = [...item.cells].reverse()
      const reversePrefix = reverseCells.slice(0, next.length)
      const direct = directPrefix.every((cell, idx) => cell === next[idx])
      const reverse = reversePrefix.every((cell, idx) => cell === next[idx])
      return direct || reverse
    })

    if (!matchesPrefix.length) {
      setWordMessage('Sequência incorreta. Tente outra combinação.')
      setSelectedCells([])
      return
    }

    const found = matchesPrefix.find((item) => item.cells.length === next.length)
    if (found) {
      setFoundWords((prev) => [...prev, found.word])
      setFoundCells((prev) => new Set([...prev, ...found.cells]))
      setWordMessage(`Perfeito! Você encontrou "${found.word}".`)
      setSelectedCells([])
      return
    }

    setSelectedCells(next)
  }

  const handleCellPointerDown = (event: ReactPointerEvent<HTMLButtonElement>, index: number) => {
    if (tapSelectionMode || event.pointerType !== 'mouse') {
      event.preventDefault()
      handleTapSelect(index)
      return
    }

    startSelect(index)
  }

  const handleCellPointerEnter = (event: ReactPointerEvent<HTMLButtonElement>, index: number) => {
    if (tapSelectionMode || event.pointerType !== 'mouse') {
      return
    }
    moveSelect(index)
  }


  const spinWheel = () => {
    if (wheelSpinning) return
    setWheelSpinning(true)
    const idx = Math.floor(Math.random() * wheelOptions.length)
    const per = 360 / wheelOptions.length
    const targetDelta = 360 * 6 + (360 - idx * per - per / 2)
    setWheelRotation((prev) => prev + targetDelta)
    if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current)
    wheelTimeoutRef.current = window.setTimeout(() => {
      setWheelResult(wheelOptions[idx])
      setWheelSpinning(false)
    }, 4100)
  }

  const clearChallengeTimeouts = () => {
    challengeTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
    challengeTimeoutsRef.current = []
  }

  const playChallengeSequence = (seq: number[]) => {
    if (!seq.length) return
    clearChallengeTimeouts()
    let t = 0
    const add = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay)
      challengeTimeoutsRef.current.push(id)
    }

    add(() => setChallengeActiveStep(-1), t)
    seq.forEach((step, index) => {
      const flashes = index > 0 && seq[index - 1] === step ? 2 : 1
      for (let f = 0; f < flashes; f += 1) {
        add(() => setChallengeActiveStep(step), t)
        t += 350
        add(() => setChallengeActiveStep(-1), t)
        t += 170
      }
      t += 120
    })
  }

  useEffect(() => {
    if (currentStory !== 's4') return
    const seqSize = difficulty === 'hard' ? 4 : 3
    const seq = Array.from({ length: seqSize }).map(() => Math.floor(Math.random() * 6))
    const boot = window.setTimeout(() => {
      setChallengeSequence(seq)
      setChallengeActiveStep(-1)
      setChallengeInputIdx(0)
      setChallengeDone(false)
      setChallengeMessage('Memorize a sequência e repita.')
    }, 0)
    playChallengeSequence(seq)
    return () => {
      window.clearTimeout(boot)
      clearChallengeTimeouts()
    }
  }, [currentStory, difficulty])

  const onChallengeTap = (idx: number) => {
    if (!challengeSequence.length || challengeDone) return
    const expected = challengeSequence[challengeInputIdx]
    if (idx === expected) {
      const next = challengeInputIdx + 1
      setChallengeInputIdx(next)
      if (next >= challengeSequence.length) {
        setChallengeDone(true)
        setChallengeMessage('Perfeito! Sequência completa. 💖')
      } else {
        setChallengeMessage(`Boa! ${next}/${challengeSequence.length}`)
      }
      return
    }
    setChallengeInputIdx(0)
    setChallengeShake(true)
    setChallengeMessage('Ops, você errou. Tente de novo!')
    window.setTimeout(() => setChallengeShake(false), 350)
  }

  const replayChallenge = () => {
    if (!challengeSequence.length) return
    setChallengeActiveStep(-1)
    setChallengeInputIdx(0)
    setChallengeDone(false)
    setChallengeMessage('Memorize a sequência e repita.')
    playChallengeSequence(challengeSequence)
  }

  const storyLabel = useMemo(() => `Story ${storyIdx + 1}/${stories.length}`, [storyIdx, stories.length])
  const searchDone = currentStory === 's2' && foundWords.length >= searchWords.length
  const wheelDone = currentStory === 's3' && Boolean(wheelResult)
  const challengeDoneCard = currentStory === 's4' && challengeDone
  const canAdvance = useMemo(() => {
    if (currentStory === 's2') return searchDone
    if (currentStory === 's3') return wheelDone
    if (currentStory === 's4') return challengeDone
    return true
  }, [challengeDone, currentStory, searchDone, wheelDone])

  useEffect(
    () => () => {
      if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current)
    },
    [],
  )

  if (step === 'intro') {
    return (
      <main className="game-root">
        <div className="game-shell">
          <div className="game-layer">
            {Array.from({ length: 24 }).map((_, idx) => (
              <span
                key={`intro-dot-${idx}`}
                className="game-dot"
                style={{
                  left: `${6 + (idx % 8) * 12}%`,
                  top: `${8 + Math.floor(idx / 8) * 28}%`,
                  ['--dur' as string]: `${2.6 + (idx % 4) * 0.5}s`,
                  ['--delay' as string]: `${idx * 0.11}s`,
                }}
              />
            ))}
          </div>
          <div className="game-content">
            <div className="game-story">
              <div className="game-card">
                <div className="game-center">
                  <p className="game-title">Está pronta para começar a melhor experiência?</p>
                  <p className="game-subtitle">
                    {typedStart}
                    <span style={{ opacity: 0.7 }}> |</span>
                  </p>
                  <button type="button" className="game-button" onClick={() => setStep('stories')}>
                    Começar Jogo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="game-root">
      <div className="game-shell">
        <button className="game-close" onClick={() => navigate('/preview', { replace: true })} aria-label="Fechar">
          X
        </button>

        <header className="game-progress">
          <div className="game-progress-row">
            {stories.map((id, idx) => (
              <span key={id} className="game-progress-track">
                <span className="game-progress-fill" style={{ width: idx < storyIdx ? '100%' : idx === storyIdx ? `${storyProgress}%` : '0%' }} />
              </span>
            ))}
          </div>
          <div style={{ marginTop: 7, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(224,233,255,0.8)' }}>{storyLabel}</div>
        </header>

        <div className="game-layer">
          {Array.from({ length: 18 }).map((_, idx) => (
            <span
              key={`story-dot-${idx}`}
              className="game-dot"
              style={{
                left: `${8 + (idx % 6) * 15}%`,
                top: `${10 + Math.floor(idx / 6) * 27}%`,
                ['--dur' as string]: `${2.4 + (idx % 5) * 0.4}s`,
                ['--delay' as string]: `${idx * 0.09}s`,
              }}
            />
          ))}
        </div>

        <div className="game-content">
          <section className="game-story">
            <article className="game-card">
              {currentStory !== 's2' && (
                <>
                  <button
                    type="button"
                    className="game-tap-zone game-tap-zone-left"
                    aria-label="Voltar"
                    onClick={() => {
                      if (!canAdvance || storyIdx === 0) return
                      goPrev()
                    }}
                  />
                  <button
                    type="button"
                    className="game-tap-zone game-tap-zone-right"
                    aria-label="Avançar"
                    onClick={() => {
                      if (!canAdvance) return
                      goNext()
                    }}
                  />
                </>
              )}
              {currentStory === 's1' && (
                <div className="game-center">
                  <p className="game-title">Game Start</p>
                  <p className="game-subtitle">Modo romance ativado. Prepare-se para os próximos desafios.</p>
                  <div className="game-mode-row">
                    <button type="button" className={`game-mode-btn ${difficulty === 'easy' ? 'game-mode-btn-active' : ''}`} onClick={() => setDifficulty('easy')}>
                      Fácil
                    </button>
                    <button type="button" className={`game-mode-btn ${difficulty === 'hard' ? 'game-mode-btn-active' : ''}`} onClick={() => setDifficulty('hard')}>
                      Difícil
                    </button>
                  </div>
                  <p className="game-subtitle">
                    {difficulty === 'easy'
                      ? 'Fácil: dicas no caça-palavras e desafio mais simples.'
                      : 'Difícil: 5 palavras e sequência maior no desafio.'}
                  </p>
                  <button
                    type="button"
                    className="game-button"
                    onClick={() => {
                      setStoryIdx(1)
                      setStoryProgress(0)
                    }}
                  >
                    Continuar
                  </button>
                </div>
              )}

              {currentStory === 's2' && (
                <div className="game-center game-center-tight" style={{ justifyContent: 'flex-start', paddingTop: 18 }}>
                  <p className="game-title" style={{ fontSize: 24 }}>Caça-Palavras Premium</p>
                  <p className="game-subtitle">{themeFromChat || 'Ache as coisas que mais amo em você'}</p>
                  <p className="game-word-obs">Obs: quando você clicar na palavra correta, ela ficará em azul.</p>
                  <p className="game-counter">{foundWords.length}/{searchWords.length} palavras</p>
                  {difficulty === 'easy' && <p className="game-subtitle">Dica: letras iniciais destacadas.</p>}
                  <div
                    className={`game-word-grid game-word-grid--${searchSize}`}
                    onPointerUp={() => {
                      if (!tapSelectionMode) {
                        endSelect()
                      }
                    }}
                    onPointerLeave={() => {
                      if (!tapSelectionMode) {
                        endSelect()
                      }
                    }}
                  >
                    {searchData.grid.map((letter, index) => {
                      const found = foundCells.has(index)
                      const selecting = selectedCells.includes(index)
                      return (
                        <button
                          key={`cell-${index}`}
                          type="button"
                          className={`game-cell game-cell--${searchSize} ${found ? 'game-cell-found' : ''} ${selecting ? 'game-cell-selecting' : ''} ${hintCells.has(index) ? 'game-cell-hint' : ''}`}
                          onPointerDown={(event) => handleCellPointerDown(event, index)}
                          onPointerEnter={(event) => handleCellPointerEnter(event, index)}
                          onClick={() => {
                            if (tapSelectionMode && dragStart === null) {
                              handleTapSelect(index)
                            }
                          }}
                          aria-pressed={found || selecting}
                          aria-label={`Letra ${letter}`}
                        >
                          {letter}
                        </button>
                      )
                    })}
                  </div>
                  <div className="game-chip-row">
                    {searchWords.map((word) => (
                      <span key={word} className={`game-chip ${foundWords.includes(word) ? 'game-chip-found' : ''}`}>
                        {word}
                      </span>
                    ))}
                  </div>
                  <p className="game-subtitle" style={{ minHeight: 20 }}>{wordMessage}</p>
                </div>
              )}

              {currentStory === 's3' && (
                <div className="game-center" style={{ justifyContent: 'flex-start', paddingTop: 18 }}>
                  <p className="game-title" style={{ fontSize: 24 }}>Roleta Romântica</p>
                  <p className="game-subtitle">Gire e descubra coisas que eu amo em você.</p>
                  <div className="game-wheel-pointer" />
                  <div className="game-wheel-wrap">
                    <div className={`game-wheel ${wheelSpinning ? 'game-wheel-spinning' : ''}`} style={{ transform: `rotate(${wheelRotation}deg)`, background: wheelGradient }}>
                      {wheelSegments.map((item, index) => {
                        const point = wheelLabelPoints[index]
                        return (
                          <span
                            key={`${item.label}-${index}`}
                            className="game-wheel-item"
                            style={{
                              left: `calc(50% + ${point.x}px)`,
                              top: `calc(50% + ${point.y}px)`,
                            }}
                            title={item.label}
                          >
                            {item.displayLabel}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <p className="game-wheel-hint">Toque em girar e veja a sorte do amor.</p>
                  <button type="button" className="game-button" onClick={spinWheel}>
                    Girar
                  </button>
                  {wheelResult && <div className="game-wheel-result">{wheelResult}</div>}
                </div>
              )}

              {currentStory === 's4' && (
                <div className="game-center">
                  <p className="game-title" style={{ fontSize: 24 }}>Desafio de Memória</p>
                  <p className="game-subtitle">Repita a sequência de toques.</p>
                  <div className={`game-choice-grid-2 ${challengeShake ? 'game-choice-grid-2-shake' : ''}`}>
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <button
                        key={`memory-${idx}`}
                        type="button"
                        className={`game-memory-cell ${challengeDone ? 'game-memory-cell-win' : ''} ${challengeActiveStep === idx ? 'game-memory-cell-active' : ''}`}
                        onClick={() => onChallengeTap(idx)}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  <p className="game-subtitle">{challengeMessage}</p>
                  <button type="button" className="game-button" onClick={replayChallenge}>
                    Mostrar sequência novamente
                  </button>
                </div>
              )}

              {currentStory === 's5' && (
                <div className="game-center">
                  {Array.from({ length: 38 }).map((_, idx) => (
                    <span
                      key={`final-conf-${idx}`}
                      className="game-confetti"
                      style={{
                        left: `${8 + (idx % 8) * 11}%`,
                        top: `${-6 + Math.floor(idx / 8) * 2}%`,
                        background: idx % 2 === 0 ? '#8fd7ff' : idx % 3 === 0 ? '#ff9ecb' : '#ffffff',
                        ['--dur' as string]: `${2 + (idx % 5) * 0.4}s`,
                        animationDelay: `${(idx % 7) * 0.18}s`,
                      }}
                    />
                  ))}
                  <p className="game-final-win">Parabéns, concluiu as missões do presente especial com sucesso.</p>
                  <button type="button" className="game-button" onClick={goNext}>
                    Continuar história
                  </button>
                </div>
              )}

              {currentStory === 's6' && (
                <div className="game-center">
                  <p className="game-title" style={{ fontSize: 24 }}>Capítulo de Fotos 1</p>
                  <p className="game-subtitle">Nosso momento especial em destaque.</p>
                  {galleryImages[0] ? (
                    <img src={galleryImages[0]} alt="Momento do casal" className="game-photo-frame game-photo-frame-a" />
                  ) : (
                    <div className="game-photo-frame game-photo-placeholder">Adicione fotos no chat para aparecer aqui</div>
                  )}
                </div>
              )}

              {currentStory === 's7' && (
                <div className="game-center">
                  <p className="game-title" style={{ fontSize: 24 }}>Capítulo de Fotos 2</p>
                  <p className="game-subtitle">Mais um registro lindo da nossa história.</p>
                  {galleryImages[1] ? (
                    <img src={galleryImages[1]} alt="Outro momento do casal" className="game-photo-frame game-photo-frame-b" />
                  ) : (
                    <div className="game-photo-frame game-photo-placeholder">Envie ao menos 2 fotos no chat para completar</div>
                  )}
                </div>
              )}

              {currentStory === 's8' && (
                <div className="game-center">
                  <p className="game-title" style={{ fontSize: 24 }}>Contador da Nossa História</p>
                  <p className="game-subtitle">Vivendo esse amor há</p>
                  <p className="game-time-counter">{minutesCounter.toLocaleString('pt-BR')} minutos</p>
                  <p className="game-subtitle">e contando a cada minuto ✨</p>
                </div>
              )}

              {currentStory === 's10' && (
                <div className="game-center">
                  {Array.from({ length: 26 }).map((_, idx) => (
                    <span
                      key={`extra-final-conf-${idx}`}
                      className="game-confetti"
                      style={{
                        left: `${8 + (idx % 7) * 12}%`,
                        top: `${-4 + Math.floor(idx / 7) * 2}%`,
                        background: idx % 2 === 0 ? '#8fd7ff' : idx % 3 === 0 ? '#ff9ecb' : '#ffffff',
                        ['--dur' as string]: `${2 + (idx % 5) * 0.45}s`,
                      }}
                    />
                  ))}
                  <p className="game-final-win">Fim do jogo. Você concluiu cada etapa com muito amor. 💖</p>
                  <button type="button" className="game-button" onClick={resetGameState}>
                    Voltar
                  </button>
                </div>
              )}

            </article>
            {searchDone && (
              <div className="game-complete-overlay">
                <div className="game-complete-card">
                  <p className="game-complete-title">Parabéns! 🎉</p>
                  <p className="game-complete-line">As palavras eram: {searchWords.join(', ')}</p>
                  <button type="button" className="game-complete-next" onClick={goNext}>
                    Próxima Seção
                  </button>
                </div>
              </div>
            )}
            {wheelDone && (
              <div className="game-complete-overlay">
                <div className="game-complete-card">
                  <p className="game-complete-title">Parabéns! 🎉</p>
                  <p className="game-complete-line">A missão sorteada foi:</p>
                  <p className="game-complete-highlight">{wheelResult}</p>
                  <button type="button" className="game-complete-next" onClick={goNext}>
                    Próxima Seção
                  </button>
                </div>
              </div>
            )}
            {challengeDoneCard && (
              <div className="game-complete-overlay">
                <div className="game-complete-card">
                  <p className="game-complete-title">Parabéns! 🎉</p>
                  <p className="game-complete-line">Você completou o desafio de memória.</p>
                  <button type="button" className="game-complete-next" onClick={goNext}>
                    Próxima Seção
                  </button>
                </div>
              </div>
            )}

          </section>
        </div>
      </div>
    </main>
  )
}

export default WrappedGameExperience
