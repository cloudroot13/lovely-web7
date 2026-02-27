import { StaticPageLayout } from '../components/StaticPageLayout'
import { ThemedContentCard } from '../components/ThemedContentCard'

export default function ContactPage() {
  return (
    <StaticPageLayout
      eyebrow="Contato"
      title="Fale com a gente"
      description="Se precisar de ajuda para montar seu presente, estamos aqui para te atender."
    >
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Atendimento oficial</h2>
        <p className="mt-2 text-zinc-300">Instagram: @lovelyfy.oficial</p>
        <p className="text-zinc-300">E-mail: suporte@lovelyfy.com.br</p>
        <p className="text-zinc-300">Horário: segunda a sexta, das 9h às 18h.</p>
      </ThemedContentCard>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Suporte de criação</h2>
        <p className="mt-2 text-zinc-300">
          Se estiver em dúvida sobre formato, fotos ideais ou texto da homenagem, nossa equipe ajuda a direcionar o melhor caminho.
        </p>
      </ThemedContentCard>
    </StaticPageLayout>
  )
}
