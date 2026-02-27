import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface NetflixBootIntroProps {
  onDone: () => void
  label?: string
}

export function NetflixBootIntro({ onDone, label = 'LOVELYFLIX' }: NetflixBootIntroProps) {
  useEffect(() => {
    const timeout = window.setTimeout(() => onDone(), 4000)
    return () => window.clearTimeout(timeout)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden bg-black">
      <motion.div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.24)_0%,rgba(229,9,20,0.1)_34%,rgba(0,0,0,0)_72%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.15] }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative px-6"
        initial={{ opacity: 0, scale: 0.84, filter: 'blur(8px)' }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.84, 1.03, 1, 1.08], filter: ['blur(8px)', 'blur(0px)', 'blur(0px)', 'blur(2px)'] }}
        transition={{ duration: 3.9, times: [0, 0.18, 0.8, 1], ease: 'easeInOut' }}
      >
        <h1 className="text-center text-[2.1rem] font-black tracking-[0.28em] text-[#E50914] sm:text-[2.8rem]">
          {label}
        </h1>
      </motion.div>
    </div>
  )
}

export default NetflixBootIntro
