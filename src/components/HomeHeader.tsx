import rostoIcon from '../assets/mascote_cupido/rosto.png'
import './HomeHeader.css'

interface HomeHeaderProps {
  isDark: boolean
  onToggleTheme: () => void
  onLogin: () => void
  onCreate: () => void
  onFaq: () => void
  onAbout: () => void
}

export function HomeHeader({ isDark, onToggleTheme, onLogin, onCreate, onFaq, onAbout }: HomeHeaderProps) {
  return (
    <header className={`home-header ${isDark ? 'home-header-dark' : 'home-header-light'}`}>
      <div className="home-header-brand">
        <img src={rostoIcon} alt="Cupido" className="home-header-logo" />
        <span className="home-header-brand-text">Lovely Web</span>
      </div>

      <nav className="home-header-nav" aria-label="Menu principal">
        <button type="button" className="home-header-link" onClick={onLogin}>Login</button>
        <button type="button" className="home-header-link home-header-link-primary" onClick={onCreate}>Criar</button>
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
