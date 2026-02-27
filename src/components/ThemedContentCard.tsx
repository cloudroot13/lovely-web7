import type { ReactNode } from 'react'

interface ThemedContentCardProps {
  children: ReactNode
  className?: string
}

export function ThemedContentCard({ children, className = '' }: ThemedContentCardProps) {
  const isDark = typeof window === 'undefined' ? true : window.localStorage.getItem('lovely-home-theme') !== 'light'

  return (
    <article
      className={`rounded-2xl border p-4 ${
        isDark
          ? 'border-zinc-700 bg-[#14141b] text-zinc-100'
          : 'border-pink-200 bg-white text-zinc-800 [&_.text-zinc-100]:!text-zinc-900 [&_.text-zinc-300]:!text-zinc-600 [&_.text-zinc-400]:!text-zinc-500 [&_.border-zinc-600]:!border-pink-200'
      } ${className}`}
    >
      {children}
    </article>
  )
}
