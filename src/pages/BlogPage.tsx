import { StaticPageLayout } from '../components/StaticPageLayout'
import { ThemedContentCard } from '../components/ThemedContentCard'

export default function BlogPage() {
  return (
    <StaticPageLayout
      eyebrow="Blog"
      title="Conteúdos e Inspirações"
      description="Dicas para criar presentes digitais mais criativos e emocionantes."
    >
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Guia de mensagens emocionantes</h2>
        <p className="mt-2 text-zinc-300">
          Como escrever textos curtos e fortes para cada capítulo da sua história, sem parecer genérico.
        </p>
      </ThemedContentCard>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Roteiro ideal para retrospecitva</h2>
        <p className="mt-2 text-zinc-300">
          Estrutura recomendada: começo da história, marco especial, evolução do casal e mensagem final.
        </p>
      </ThemedContentCard>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Checklist de entrega da surpresa</h2>
        <p className="mt-2 text-zinc-300">
          Dicas para enviar por link ou QR Code no momento certo e criar uma reação memorável.
        </p>
      </ThemedContentCard>
    </StaticPageLayout>
  )
}
