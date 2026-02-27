import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { HomeHeader } from './HomeHeader'

interface StaticPageLayoutProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

export function StaticPageLayout({ eyebrow, title, description, children }: StaticPageLayoutProps) {
  const navigate = useNavigate()
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark'
    return window.localStorage.getItem('lovely-home-theme') === 'light' ? 'light' : 'dark'
  })

  useEffect(() => {
    window.localStorage.setItem('lovely-home-theme', theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <main className={`min-h-[100dvh] px-4 pb-10 pt-24 sm:px-6 sm:pt-28 ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-[#fff6fb] text-[#2d1222]'}`}>
      <div className="fixed inset-x-0 top-3 z-[80] px-3 sm:px-6">
        <HomeHeader
          isDark={isDark}
          onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          onLogin={() => navigate('/login')}
          onCreate={() => navigate('/choose-mode')}
          onFaq={() => navigate('/faq')}
          onAbout={() => navigate('/sobre')}
        />
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <p className={`text-xs uppercase tracking-[0.2em] ${isDark ? 'text-pink-300' : 'text-pink-700'}`}>{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
        <p className={`mt-4 max-w-3xl ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{description}</p>
        <section className={`mt-8 space-y-4 rounded-3xl border p-6 ${isDark ? 'border-zinc-700 bg-zinc-900/70' : 'border-pink-200 bg-white/90'}`}>{children}</section>
      </div>
    </main>
  )
}
