import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PLANS, type PlanId, getPlanById } from '../constants/plans'
import { activateAccessForUser } from '../utils/access'
import { getCurrentUser } from '../utils/auth'

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('anual')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const user = getCurrentUser()
  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('returnTo') || '/preview'
  }, [location.search])

  useEffect(() => {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent(location.pathname + location.search)}`, { replace: true })
    }
  }, [location.pathname, location.search, navigate, user])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const paymentId = params.get('payment_id')
    if (!user || !paymentId) return

    const validate = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/mercadopago/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId }),
        })
        const payload = (await response.json()) as {
          approved?: boolean
          externalReference?: string
          paymentId?: string
          error?: string
        }
        if (!response.ok || !payload.approved) {
          setError(payload.error || 'Pagamento não aprovado.')
          return
        }
        const [userId, planId] = (payload.externalReference || '').split(':')
        if (!userId || !planId || userId !== user.id || !getPlanById(planId)) {
          setError('Pagamento inválido para este usuário.')
          return
        }
        activateAccessForUser(user.id, planId as PlanId, payload.paymentId)
        navigate(returnTo, { replace: true })
      } catch {
        setError('Não foi possível validar o pagamento.')
      } finally {
        setLoading(false)
      }
    }

    validate()
  }, [location.search, navigate, returnTo, user])

  if (!user) return null

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#0f0f0f] px-4 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-zinc-700 bg-zinc-900/80 p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-pink-300">Pagamento</p>
        <h1 className="mt-2 text-2xl font-black">Escolha seu plano</h1>
        <p className="mt-3 text-sm text-zinc-300">Pagamento único via Mercado Pago. O acesso será liberado após confirmação.</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelectedPlanId(plan.id)}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedPlanId === plan.id ? 'border-pink-400 bg-pink-500/15' : 'border-zinc-700 bg-zinc-950/60'
              }`}
            >
              <p className="text-sm font-semibold">{plan.name}</p>
              <p className="mt-1 text-2xl font-black">{plan.priceLabel}</p>
              <p className="mt-2 text-xs text-zinc-300">{plan.description}</p>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={async () => {
            setError('')
            setLoading(true)
            try {
              const response = await fetch('/api/mercadopago/create-preference', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  planId: selectedPlanId,
                  userId: user.id,
                  returnTo,
                }),
              })
              const payload = (await response.json()) as { initPoint?: string; error?: string }
              if (!response.ok || !payload.initPoint) {
                setError(payload.error || 'Falha ao iniciar pagamento.')
                return
              }
              window.location.href = payload.initPoint
            } catch {
              setError('Não foi possível iniciar o checkout agora.')
            } finally {
              setLoading(false)
            }
          }}
          className="mt-6 w-full rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Pagar com Mercado Pago'}
        </button>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </section>
    </main>
  )
}
