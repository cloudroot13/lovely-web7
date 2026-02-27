import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const returnTo = useMemo(() => {
    const params = new URLSearchParams(location.search)
    return params.get('returnTo') || '/preview'
  }, [location.search])

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#0f0f0f] px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-700 bg-zinc-900/80 p-6">
        <p className="text-xs uppercase tracking-[0.18em] text-pink-300">Pagamento</p>
        <h1 className="mt-2 text-2xl font-black">Finalize para liberar o preview</h1>
        <p className="mt-3 text-sm text-zinc-300">Depois do pagamento o preview abre em tela cheia.</p>

        <button
          type="button"
          onClick={() => {
            window.localStorage.setItem('lovely-paid', '1')
            navigate(returnTo, { replace: true })
          }}
          className="mt-6 w-full rounded-2xl bg-pink-500 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105"
        >
          Confirmar pagamento
        </button>
      </section>
    </main>
  )
}

