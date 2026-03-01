import type { ReactNode } from 'react'

interface ThemedContentCardProps {
  children: ReactNode
  className?: string
}

export function ThemedContentCard({ children, className = '' }: ThemedContentCardProps) {
  return (
    <article
      className={`themed-content-card rounded-2xl border p-4 ${className}`}
    >
      {children}
    </article>
  )
}
