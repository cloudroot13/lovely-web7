import cupidoCoracao from '../assets/mascote_cupido/coracao.png'
import { Link } from 'react-router-dom'

interface HomeFooterProps {
  isDark: boolean
}

const footerGiftLinks = ['Presente para Namorada', 'Presente para Namorado', 'Presente para Amiga', 'Presente para Mãe', 'Presente para Avó', 'Presente para Pai']

export function HomeFooter({ isDark }: HomeFooterProps) {
  return (
    <footer className={`relative left-1/2 w-screen -translate-x-1/2 border-t px-4 py-8 sm:px-8 ${isDark ? 'border-zinc-700 bg-[#0d0d13]' : 'border-pink-200 bg-[#fff6fb]'}`}>
      <div className="mx-auto w-full max-w-6xl">
        <div>
          <h3 className="text-3xl font-black sm:text-4xl">Explore mais presentes</h3>
          <p className={`mt-2 text-base ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Descubra outras formas de surpreender quem você ama.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {footerGiftLinks.map((item) => (
              <Link
                to="/choose-mode"
                key={item}
                className={`rounded-full border px-4 py-2 text-sm transition ${isDark ? 'border-zinc-600 bg-zinc-900 text-zinc-200 hover:border-pink-400/70' : 'border-pink-200 bg-pink-50 text-zinc-700 hover:border-pink-400/70'}`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div className={`my-8 h-px ${isDark ? 'bg-zinc-700' : 'bg-pink-200'}`} />

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <img src={cupidoCoracao} alt="Lovelyfy" className="h-10 w-10 rounded-xl object-cover" />
              <p className="text-2xl font-black sm:text-3xl">Lovelyfy</p>
            </div>
            <p className={`mt-4 max-w-md text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Criamos experiências únicas para eternizar momentos especiais com presentes virtuais e personalizados.
            </p>
          </div>

          <div>
            <p className="text-lg font-bold sm:text-xl">Produto</p>
            <ul className={`mt-3 space-y-2 text-sm sm:text-base ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <li><Link to="/como-funciona">Como funciona</Link></li>
              <li><Link to="/recursos">Recursos</Link></li>
              <li><Link to="/precos">Preços</Link></li>
              <li><Link to="/exemplos">Exemplos</Link></li>
              <li><Link to="/choose-mode">Criar presente</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-lg font-bold sm:text-xl">Empresa</p>
            <ul className={`mt-3 space-y-2 text-sm sm:text-base ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <li><Link to="/sobre">Sobre nós</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/contato">Contato</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-lg font-bold sm:text-xl">Legal</p>
            <ul className={`mt-3 space-y-2 text-sm sm:text-base ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              <li><Link to="/termos-de-uso">Termos de uso</Link></li>
              <li><Link to="/politica-de-privacidade">Política de privacidade</Link></li>
              <li><Link to="/politica-de-cookies">Política de cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className={`my-8 h-px ${isDark ? 'bg-zinc-700' : 'bg-pink-200'}`} />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>© 2026 Lovelyfy. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2">
            <span className={`grid h-10 w-10 place-items-center rounded-xl border text-lg ${isDark ? 'border-zinc-600 bg-zinc-900' : 'border-pink-200 bg-white'}`}>◎</span>
            <span className={`grid h-10 w-10 place-items-center rounded-xl border text-lg ${isDark ? 'border-zinc-600 bg-zinc-900' : 'border-pink-200 bg-white'}`}>♪</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Feito com 💜 no Brasil</p>
        </div>
      </div>
    </footer>
  )
}
