import { StaticPageLayout } from '../components/StaticPageLayout'
import { ThemedContentCard } from '../components/ThemedContentCard'

export default function HowItWorksPage() {
  const steps = [
    {
      title: '1. Escolha o formato',
      body: 'Selecione entre modelos clássicos e wrapped para definir o estilo da experiência.',
    },
    {
      title: '2. Personalize com sua história',
      body: 'Adicione nomes, mensagens, datas especiais, fotos e vídeos para deixar o presente único.',
    },
    {
      title: '3. Revise e confirme',
      body: 'Visualize em preview e ajuste os detalhes finais antes de liberar para a pessoa presenteada.',
    },
    {
      title: '4. Compartilhe o link',
      body: 'Envie por WhatsApp, Instagram, e-mail ou QR Code para criar o momento de surpresa.',
    },
  ]

  return (
    <StaticPageLayout
      eyebrow="Produto"
      title="Como funciona"
      description="Processo completo para criar, revisar e entregar um presente digital com visual premium em poucos minutos."
    >
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Visão geral</h2>
        <p className="mt-2 text-zinc-300">
          A Lovelyfy foi pensada para pessoas que querem surpreender sem precisar editar vídeo manualmente.
          Você escolhe o formato, envia conteúdo e recebe uma experiência pronta para compartilhar.
        </p>
      </ThemedContentCard>
      {steps.map((step) => (
        <ThemedContentCard key={step.title}>
          <h2 className="text-xl font-bold">{step.title}</h2>
          <p className="mt-2 text-zinc-300">{step.body}</p>
        </ThemedContentCard>
      ))}
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Entrega da surpresa</h2>
        <p className="mt-2 text-zinc-300">
          Você pode entregar por link direto, QR Code em cartão físico, mensagem surpresa no WhatsApp ou post privado no Instagram.
        </p>
      </ThemedContentCard>
    </StaticPageLayout>
  )
}
