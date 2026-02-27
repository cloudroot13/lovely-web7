import { StaticPageLayout } from '../components/StaticPageLayout'
import { ThemedContentCard } from '../components/ThemedContentCard'

export default function PrivacyPage() {
  return (
    <StaticPageLayout
      eyebrow="Legal"
      title="Política de Privacidade"
      description="Como tratamos os dados coletados na Lovelyfy."
    >
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Dados coletados</h2>
        <p className="mt-2 text-zinc-300">Coletamos somente dados necessários para criar, personalizar e disponibilizar sua experiência digital.</p>
      </ThemedContentCard>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Segurança</h2>
        <p className="mt-2 text-zinc-300">Não vendemos dados pessoais e seguimos boas práticas de segurança no armazenamento das informações.</p>
      </ThemedContentCard>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Direitos do usuário</h2>
        <p className="mt-2 text-zinc-300">Você pode solicitar atualização ou remoção de dados pelos nossos canais oficiais de contato.</p>
      </ThemedContentCard>
    </StaticPageLayout>
  )
}
