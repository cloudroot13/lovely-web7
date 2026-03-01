import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loginUser, normalizePhone } from '../utils/auth'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('returnTo') || '/minha-conta'
  }, [location.search])

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#0f0f0f] px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-700 bg-zinc-900/80 p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-pink-300">Acesso necessário</p>
        <h1 className="mt-2 text-2xl font-black">Faça login para continuar</h1>
        <p className="mt-3 text-sm text-zinc-300">Entre com e-mail, telefone e senha para continuar com segurança.</p>

        <label className="mt-6 block text-sm font-semibold text-zinc-200">
          E-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-pink-400"
            placeholder="voce@email.com"
          />
        </label>
        <label className="mt-3 block text-sm font-semibold text-zinc-200">
          Telefone
          <input
            type="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-pink-400"
            placeholder="(11) 99999-9999"
          />
        </label>
        <label className="mt-3 block text-sm font-semibold text-zinc-200">
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-pink-400"
            placeholder="••••••••"
          />
        </label>

        <button
          type="button"
          onClick={() => {
            if (!email.trim() || !phone.trim() || !password.trim()) return
            if (normalizePhone(phone).length < 10) {
              setError('Informe um telefone válido com DDD.')
              return
            }
            const result = loginUser({ email, phone, password })
            if (!result.ok) {
              setError(result.error)
              return
            }

            setError('')
            navigate(returnTo, { replace: true })
          }}
          className="mt-6 w-full rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!email.trim() || !phone.trim() || !password.trim()}
        >
          Entrar
        </button>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        <p className="mt-5 text-center text-sm text-zinc-300">
          Não tem conta?{' '}
          <Link to={`/criar-conta?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-pink-300 hover:text-pink-200">
            Criar conta
          </Link>
        </p>
      </section>
    </main>
  )
}
