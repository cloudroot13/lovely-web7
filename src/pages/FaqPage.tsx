import { StaticPageLayout } from '../components/StaticPageLayout'
import { ThemedContentCard } from '../components/ThemedContentCard'

export default function FaqPage() {
  const items = [
    ['Como funciona?', 'Você preenche os dados, envia fotos e a plataforma monta sua página automaticamente.'],
    ['Precisa instalar app?', 'Não. Funciona no navegador, no celular e no computador.'],
    ['Posso editar depois?', 'Sim, você pode atualizar informações e conteúdo depois.'],
    ['Quando libera o acesso?', 'Após confirmação de login e pagamento, o acesso é liberado.'],
    ['Quanto tempo leva para criar?', 'Em média de 5 a 15 minutos, dependendo da quantidade de fotos e textos que você quiser inserir.'],
    ['Posso usar em datas especiais?', 'Sim. É muito usado em aniversário, namoro, pedido de casamento, Dia das Mães e outras datas comemorativas.'],
  ]

  return (
    <StaticPageLayout
      eyebrow="FAQ"
      title="Perguntas Frequentes"
      description="Respostas rápidas para as dúvidas mais comuns sobre a Lovelyfy."
    >
      <ThemedContentCard>
        <p className="text-zinc-300">
          Caso sua dúvida não esteja abaixo, use a página de contato para falar com o suporte.
        </p>
      </ThemedContentCard>
      {items.map(([question, answer]) => (
        <ThemedContentCard key={question}>
          <h2 className="text-xl font-bold">{question}</h2>
          <p className="mt-2 text-zinc-300">{answer}</p>
        </ThemedContentCard>
      ))}
    </StaticPageLayout>
  )
}
