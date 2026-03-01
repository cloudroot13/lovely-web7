import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlanById } from '../constants/plans'
import { getCurrentUser, logoutUser } from '../utils/auth'
import { getUserAccess } from '../utils/access'

export default function UserArea() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const access = useMemo(() => (user ? getUserAccess(user.id) : null), [user])
  const plan = getPlanById(access?.planId)

  useEffect(() => {
    if (!user) {
      navigate('/login?returnTo=%2Fminha-conta', { replace: true })
    }
  }, [navigate, user])

  if (!user) {
    return null
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#0f0f0f] px-4 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-zinc-700 bg-zinc-900/80 p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-pink-300">Minha conta</p>
        <h1 className="mt-2 text-2xl font-black">Área do usuário</h1>

        <div className="mt-6 space-y-2 rounded-2xl border border-zinc-700 bg-zinc-950/60 p-4 text-sm">
          <p><span className="text-zinc-400">Nome:</span> {user.name}</p>
          <p><span className="text-zinc-400">E-mail:</span> {user.email}</p>
          <p><span className="text-zinc-400">Telefone:</span> {user.phone || 'Não informado'}</p>
        </div>

        <div className="mt-4 space-y-2 rounded-2xl border border-zinc-700 bg-zinc-950/60 p-4 text-sm">
          <p><span className="text-zinc-400">Status:</span> {access?.status === 'active' ? 'Ativo' : 'Sem acesso ativo'}</p>
          <p><span className="text-zinc-400">Plano:</span> {plan?.name || 'Nenhum'}</p>
          <p><span className="text-zinc-400">Pagamento:</span> {access?.paidAt ? new Date(access.paidAt).toLocaleString('pt-BR') : '-'}</p>
          <p><span className="text-zinc-400">Expira em:</span> {access?.expiresAt ? new Date(access.expiresAt).toLocaleString('pt-BR') : access?.status === 'active' ? 'Sem expiração' : '-'}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => navigate('/checkout?returnTo=%2Fpreview')}
            className="rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Comprar / renovar plano
          </button>
          <button
            type="button"
            onClick={() => navigate('/preview')}
            className="rounded-2xl border border-zinc-600 bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:border-pink-400"
          >
            Ir para preview
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            logoutUser()
            navigate('/login', { replace: true })
          }}
          className="mt-4 w-full rounded-2xl border border-zinc-600 bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-pink-400"
        >
          Sair da conta
        </button>
      </section>
    </main>
  )
}
