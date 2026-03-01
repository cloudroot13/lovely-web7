import rostoIcon from '../assets/mascote_cupido/rosto.png'
import './HomeHeader.css'

interface HomeHeaderProps {
  isDark: boolean
  onToggleTheme: () => void
  onBrandClick?: () => void
  onLogin: () => void
  onAccount?: () => void
  showAccount?: boolean
  onCreate: () => void
  onFaq: () => void
  onAbout: () => void
}

export function HomeHeader({
  isDark,
  onToggleTheme,
  onBrandClick,
  onLogin,
  onAccount,
  showAccount = false,
  onCreate,
  onFaq,
  onAbout,
}: HomeHeaderProps) {
  const onTranslate = () => {
    if (typeof window === 'undefined') return
    const language = window.prompt(
      'Digite o código do idioma (ex: en, es, fr, de, it, ja):',
      'en',
    )
    if (!language) return
    const target = language.trim().toLowerCase()
    if (!target || target === 'pt' || target === 'pt-br') return
    const url = window.location.href
    const translateUrl = `https://translate.google.com/translate?sl=pt&tl=${encodeURIComponent(target)}&u=${encodeURIComponent(url)}`
    window.open(translateUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <header className={`home-header ${isDark ? 'home-header-dark' : 'home-header-light'}`}>
      <button type="button" className="home-header-brand" onClick={onBrandClick ?? onLogin}>
        <img src={rostoIcon} alt="Cupido" className="home-header-logo" />
        <span className="home-header-brand-text">Lovely Web</span>
      </button>

      <nav className="home-header-nav" aria-label="Menu principal">
        <button type="button" className="home-header-link" onClick={onLogin}>Login</button>
        {showAccount && <button type="button" className="home-header-link" onClick={onAccount}>Minha conta</button>}
        <button type="button" className="home-header-link home-header-link-primary" onClick={onCreate}>Criar</button>
        <button type="button" className="home-header-link" onClick={onTranslate}>Traduzir</button>
        <button type="button" className="home-header-link" onClick={onFaq}>FAQ</button>
        <button type="button" className="home-header-link" onClick={onAbout}>Sobre nós</button>
      </nav>

      <button type="button" onClick={onToggleTheme} className="home-header-theme" aria-label="Alternar tema claro e escuro">
        <span className={`home-header-theme-chip ${!isDark ? 'home-header-theme-chip-active' : ''}`}>☀ Claro</span>
        <span className={`home-header-theme-chip ${isDark ? 'home-header-theme-chip-active' : ''}`}>🌙 Escuro</span>
      </button>
    </header>
  )
}
