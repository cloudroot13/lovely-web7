import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { ProgressBar } from './ProgressBar'

interface SlideContainerProps {
  slides: ReactNode[]
  className?: string
  progressColorClass?: string
  hint?: string
  autoAdvanceMs?: number
  fullscreenFixed?: boolean
}

export function SlideContainer({
  slides,
  className = 'bg-black text-white',
  progressColorClass = 'bg-pink-500',
  hint = 'Toque na tela ou use Enter para avançar',
  autoAdvanceMs,
  fullscreenFixed = false,
}: SlideContainerProps) {
  const [current, setCurrent] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)

  const hasAutoplay = Boolean(autoAdvanceMs && autoAdvanceMs > 0)

  useEffect(() => {
    if (!hasAutoplay || !autoAdvanceMs) {
      return
    }

    const interval = window.setInterval(() => {
      setElapsedMs((prev) => {
        const next = prev + 100
        if (next >= autoAdvanceMs) {
          setCurrent((slide) => (slide < slides.length - 1 ? slide + 1 : slide))
          return 0
        }
        return next
      })
    }, 100)

    return () => window.clearInterval(interval)
  }, [autoAdvanceMs, hasAutoplay, slides.length])

  const nextSlide = () => {
    setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : prev))
    setElapsedMs(0)
  }

  const onContainerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      nextSlide()
    }
  }

  const currentProgress = hasAutoplay && autoAdvanceMs ? elapsedMs / autoAdvanceMs : 0.55

  return (
    <div
      className={`${fullscreenFixed ? 'fixed inset-0 h-screen w-screen' : 'relative min-h-screen w-full'} flex flex-col ${className}`}
      onClick={nextSlide}
      onKeyDown={onContainerKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Container de stories"
    >
      <ProgressBar total={slides.length} current={current} colorClass={progressColorClass} currentProgress={currentProgress} />

      <div className="flex flex-1 items-center justify-center px-6 py-10 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-3xl"
          >
            {slides[current]}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="pb-4 text-center text-xs text-zinc-400">{hint}</p>
    </div>
  )
}
