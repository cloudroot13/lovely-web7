type ApiRequest = {
  method?: string
  body: unknown
  query: Record<string, string | string[] | undefined>
}

type ApiResponse = {
  status: (code: number) => ApiResponse
  json: (payload: unknown) => void
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  // Endpoint pronto para receber notificações.
  // Nesta versão sem banco, apenas confirmamos recebimento.
  // Em produção, aqui você deve persistir o pagamento e atualizar status do usuário.
  res.status(200).json({ received: true, query: req.query, body: req.body })
}

