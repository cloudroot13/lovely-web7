import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('returnTo') || '/checkout'
  }, [location.search])

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#0f0f0f] px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-700 bg-zinc-900/80 p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-pink-300">Criar conta</p>
        <h1 className="mt-2 text-2xl font-black">Cadastre-se para continuar</h1>
        <p className="mt-3 text-sm text-zinc-300">Depois da conta criada, você segue para login e checkout automaticamente.</p>

        <label className="mt-6 block text-sm font-semibold text-zinc-200">
          Nome
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-pink-400"
            placeholder="Seu nome"
          />
        </label>
        <label className="mt-3 block text-sm font-semibold text-zinc-200">
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
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-pink-400"
            placeholder="••••••••"
          />
        </label>
        <label className="mt-3 block text-sm font-semibold text-zinc-200">
          Confirmar senha
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-pink-400"
            placeholder="••••••••"
          />
        </label>

        <button
          type="button"
          onClick={() => {
            if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) return
            if (password !== confirmPassword) {
              setError('As senhas não conferem.')
              return
            }
            setError('')
            window.localStorage.setItem(
              'lovely-account',
              JSON.stringify({ name: name.trim(), email: email.trim(), password }),
            )
            window.localStorage.setItem('lovely-auth', '1')
            navigate(returnTo, { replace: true })
          }}
          className="mt-6 w-full rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()}
        >
          Criar conta
        </button>

        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

        <p className="mt-5 text-center text-sm text-zinc-300">
          Já tem conta?{' '}
          <Link to={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="font-semibold text-pink-300 hover:text-pink-200">
            Fazer login
          </Link>
        </p>
      </section>
    </main>
  )
}
