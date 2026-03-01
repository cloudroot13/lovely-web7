import { Link } from 'react-router-dom'
import { StaticPageLayout } from '../components/StaticPageLayout'
import { ThemedContentCard } from '../components/ThemedContentCard'
import { PLANS } from '../constants/plans'

export default function PricingPage() {
  const oldPrices: Record<string, string> = {
    '24h': 'R$ 25,00',
    anual: 'R$ 45,00',
    vitalicio: 'R$ 67,00',
  }

  return (
    <StaticPageLayout
      eyebrow="Produto"
      title="Preços e Planos"
      description="Pagamento único, sem mensalidade, com planos pensados para ocasiões pontuais ou lembranças permanentes."
    >
      <ThemedContentCard>
        <h2 className="text-xl font-bold">O que está incluído em todos os planos</h2>
        <ul className="mt-2 space-y-1 text-zinc-300">
          <li>• Personalização de fotos, textos e capítulos.</li>
          <li>• Compartilhamento via link em qualquer dispositivo.</li>
          <li>• Acesso ao fluxo completo de criação e preview.</li>
        </ul>
      </ThemedContentCard>
      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => (
          <ThemedContentCard key={plan.id}>
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="mt-2 text-sm text-zinc-400 line-through">{oldPrices[plan.id]}</p>
            <p className="text-3xl font-black">{plan.priceLabel}</p>
            <p className="mt-2 text-zinc-300">{plan.description}</p>
          </ThemedContentCard>
        ))}
      </div>
      <p className="text-zinc-300">
        Em caso de dúvidas sobre qual plano escolher, recomendamos o anual para presentes recorrentes e o vitalício para memórias permanentes.
      </p>
      <Link to="/choose-mode" className="inline-flex rounded-xl bg-pink-500 px-5 py-3 font-semibold text-black">
        Criar meu presente
      </Link>
    </StaticPageLayout>
  )
}
