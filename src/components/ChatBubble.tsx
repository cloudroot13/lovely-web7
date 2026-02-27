import { motion } from 'framer-motion'
import botAvatarVideo from '../assets/mascote_cupido/beijo.mov'

interface ChatBubbleProps {
  text: string
  sender: 'bot' | 'user'
}

export function ChatBubble({ text, sender }: ChatBubbleProps) {
  const isBot = sender === 'bot'

  return (
    <motion.div initial={{ opacity: 0, y: 12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.28 }} className={`flex w-full ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[88%] items-end gap-2.5 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {isBot && (
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-pink-400/60 bg-zinc-900 shadow-[0_0_12px_rgba(236,72,153,0.35)]">
            <video
              src={botAvatarVideo}
              className="h-full w-full object-cover object-center"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              aria-hidden
            />
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm shadow-lg md:text-base ${
            isBot
              ? 'rounded-bl-sm bg-zinc-900 text-zinc-100'
              : 'rounded-br-sm bg-gradient-to-r from-pink-500 to-pink-600 text-white'
          }`}
        >
          {text}
        </div>
      </div>
    </motion.div>
  )
}
