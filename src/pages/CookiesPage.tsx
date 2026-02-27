import { StaticPageLayout } from '../components/StaticPageLayout'
import { ThemedContentCard } from '../components/ThemedContentCard'

export default function CookiesPage() {
  return (
    <StaticPageLayout
      eyebrow="Legal"
      title="Política de Cookies"
      description="Informações sobre o uso de cookies na navegação."
    >
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Cookies essenciais</h2>
        <p className="mt-2 text-zinc-300">Utilizamos cookies para manter sessão, preferências de tema e estabilidade da experiência.</p>
      </ThemedContentCard>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Cookies opcionais</h2>
        <p className="mt-2 text-zinc-300">Podem ser utilizados para análises de performance e melhoria contínua da plataforma.</p>
      </ThemedContentCard>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Controle do usuário</h2>
        <p className="mt-2 text-zinc-300">Você pode desativar cookies no navegador, ciente de que isso pode limitar algumas funcionalidades.</p>
      </ThemedContentCard>
    </StaticPageLayout>
  )
}
