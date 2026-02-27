import { StaticPageLayout } from '../components/StaticPageLayout'
import { ThemedContentCard } from '../components/ThemedContentCard'

export default function TermsPage() {
  return (
    <StaticPageLayout
      eyebrow="Legal"
      title="Termos de Uso"
      description="Condições para utilização da plataforma Lovelyfy."
    >
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Uso da plataforma</h2>
        <p className="mt-2 text-zinc-300">Ao usar a Lovelyfy, você concorda com os termos de uso e com as políticas vigentes.</p>
      </ThemedContentCard>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Responsabilidade de conteúdo</h2>
        <p className="mt-2 text-zinc-300">O usuário é responsável pelo conteúdo enviado e pela autorização de uso de imagens, textos e músicas.</p>
      </ThemedContentCard>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Atualizações</h2>
        <p className="mt-2 text-zinc-300">A equipe pode atualizar estes termos para melhorar segurança, compliance e experiência do usuário.</p>
      </ThemedContentCard>
    </StaticPageLayout>
  )
}
