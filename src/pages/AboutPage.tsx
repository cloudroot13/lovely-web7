import { StaticPageLayout } from '../components/StaticPageLayout'

export default function AboutPage() {
  return (
    <StaticPageLayout
      eyebrow="Empresa"
      title="Sobre a Lovelyfy"
      description="Criamos experiências digitais para transformar momentos especiais em presentes memoráveis."
    >
      <p className="text-zinc-300">
        Nosso objetivo é facilitar a criação de páginas personalizadas para celebrar relacionamentos, amizades e datas importantes.
      </p>
      <p className="text-zinc-300">
        Com poucos passos, você transforma fotos, histórias e mensagens em uma experiência visual emocionante.
      </p>
      <p className="text-zinc-300">
        A Lovelyfy nasceu com foco em praticidade: sem necessidade de editar vídeo, sem ferramenta complexa e com resultado premium pronto para compartilhar.
      </p>
      <p className="text-zinc-300">
        Nosso compromisso é manter a plataforma leve, acessível e segura para que cada presente seja entregue com impacto e estabilidade.
      </p>
    </StaticPageLayout>
  )
}
