import { Link } from 'react-router-dom'
import { StaticPageLayout } from '../components/StaticPageLayout'
import { ThemedContentCard } from '../components/ThemedContentCard'

export default function ExamplesPage() {
  return (
    <StaticPageLayout
      eyebrow="Produto"
      title="Exemplos de Experiência"
      description="Veja modelos prontos para entender o ritmo da narrativa, estilo visual e formato de entrega."
    >
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Wrapped Lovelyflix Demo</h2>
        <p className="mt-2 text-zinc-300">
          Experiência interativa com capítulos, visual cinematográfico e narrativa emocional.
        </p>
        <Link to="/demo/wrapped-lovelyflix" className="mt-4 inline-flex rounded-xl bg-pink-500 px-4 py-2 font-semibold text-black">
          Abrir demo
        </Link>
      </ThemedContentCard>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Modelos Clássicos</h2>
        <p className="mt-2 text-zinc-300">
          Página romântica com fotos e mensagens em layout elegante, ideal para presentes tradicionais.
        </p>
        <Link to="/choose-mode" className="mt-4 inline-flex rounded-xl border border-zinc-600 px-4 py-2 font-semibold text-zinc-100">
          Ver formatos
        </Link>
      </ThemedContentCard>
      <ThemedContentCard>
        <h2 className="text-xl font-bold">Quando usar cada formato</h2>
        <p className="mt-2 text-zinc-300">
          Wrapped é ideal para impacto visual e sequência de capítulos. Clássico é indicado para mensagens diretas e apresentação romântica tradicional.
        </p>
      </ThemedContentCard>
    </StaticPageLayout>
  )
}
