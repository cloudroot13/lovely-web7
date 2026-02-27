import { Link } from 'react-router-dom'
import { StaticPageLayout } from '../components/StaticPageLayout'
import { ThemedContentCard } from '../components/ThemedContentCard'

export default function PricingPage() {
  const plans = [
    { name: 'Só Hoje (24h)', oldPrice: 'R$ 25,00', price: 'R$ 15,00', details: 'Acesso por 24h para surpreender em uma data especial.' },
    { name: 'Plano Anual', oldPrice: 'R$ 45,00', price: 'R$ 20,00', details: 'Disponível por 12 meses com edições ilimitadas.' },
    { name: 'Vitalício', oldPrice: 'R$ 67,00', price: 'R$ 27,00', details: 'Acesso para sempre ao presente digital criado.' },
  ]

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
        {plans.map((plan) => (
          <ThemedContentCard key={plan.name}>
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="mt-2 text-sm text-zinc-400 line-through">{plan.oldPrice}</p>
            <p className="text-3xl font-black">{plan.price}</p>
            <p className="mt-2 text-zinc-300">{plan.details}</p>
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
