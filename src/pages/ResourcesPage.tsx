import { StaticPageLayout } from '../components/StaticPageLayout'
import { ThemedContentCard } from '../components/ThemedContentCard'

export default function ResourcesPage() {
  const features = [
    'Modelos clássicos e wrapped com visual cinematográfico.',
    'Player com fotos, vídeos, mensagens e capítulos personalizados.',
    'Compatibilidade com celular e desktop para envio por link.',
    'Fluxo de criação guiado em etapas para facilitar a montagem.',
    'Tema escuro/claro e animações otimizadas para diferentes dispositivos.',
  ]

  return (
    <StaticPageLayout
      eyebrow="Produto"
      title="Recursos da Plataforma"
      description="Tudo que você precisa para criar, publicar e entregar uma experiência personalizada com qualidade profissional."
    >
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Editor guiado por etapas</h2>
        <p className="mt-2 text-zinc-300">
          O formulário orienta você em cada campo importante para não esquecer nenhuma informação da história.
        </p>
      </ThemedContentCard>
      <ul className="space-y-3 text-zinc-300">
        {features.map((item) => (
          <ThemedContentCard key={item} className="rounded-xl py-3">
            {item}
          </ThemedContentCard>
        ))}
      </ul>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Performance e compatibilidade</h2>
        <p className="mt-2 text-zinc-300">
          A Home e os previews usam carregamento progressivo, redução de animações em dispositivos mais fracos e otimizações para mobile.
        </p>
      </ThemedContentCard>
    </StaticPageLayout>
  )
}
