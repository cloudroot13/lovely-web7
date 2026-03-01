type ApiRequest = {
  method?: string
  body: unknown
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

  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
  if (!accessToken) {
    res.status(500).json({ error: 'MERCADO_PAGO_ACCESS_TOKEN não configurado.' })
    return
  }

  const { paymentId } = req.body as { paymentId?: string }
  if (!paymentId) {
    res.status(400).json({ error: 'paymentId é obrigatório.' })
    return
  }

  try {
    const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    const payload = await response.json() as {
      id?: number
      status?: string
      external_reference?: string
      transaction_amount?: number
    }

    if (!response.ok) {
      res.status(400).json({ error: 'Não foi possível consultar o pagamento.' })
      return
    }

    if (payload.status !== 'approved') {
      res.status(200).json({ approved: false, error: 'Pagamento ainda não aprovado.' })
      return
    }

    res.status(200).json({
      approved: true,
      paymentId: String(payload.id || paymentId),
      externalReference: payload.external_reference || '',
      amount: payload.transaction_amount || 0,
    })
  } catch {
    res.status(500).json({ error: 'Erro inesperado ao verificar pagamento.' })
  }
}
