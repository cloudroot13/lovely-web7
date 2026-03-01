type ApiRequest = {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body: unknown
}

type ApiResponse = {
  status: (code: number) => ApiResponse
  json: (payload: unknown) => void
}

const PLAN_CONFIG: Record<string, { title: string; price: number }> = {
  '24h': { title: 'Lovelyfy - Plano 24h', price: 15 },
  anual: { title: 'Lovelyfy - Plano Anual', price: 20 },
  vitalicio: { title: 'Lovelyfy - Plano Vitalício', price: 27 },
}

function getBaseUrl(req: ApiRequest) {
  const headerOrigin = req.headers.origin
  if (headerOrigin) return headerOrigin
  if (process.env.APP_URL) return process.env.APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:5173'
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

  const { planId, userId, returnTo } = req.body as { planId?: string; userId?: string; returnTo?: string }
  if (!planId || !userId || !PLAN_CONFIG[planId]) {
    res.status(400).json({ error: 'Dados inválidos para criar pagamento.' })
    return
  }

  const plan = PLAN_CONFIG[planId]
  const baseUrl = getBaseUrl(req)
  const checkoutReturn = `${baseUrl}/checkout?returnTo=${encodeURIComponent(returnTo || '/preview')}`

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: plan.title,
            quantity: 1,
            unit_price: plan.price,
            currency_id: 'BRL',
          },
        ],
        external_reference: `${userId}:${planId}`,
        back_urls: {
          success: checkoutReturn,
          failure: checkoutReturn,
          pending: checkoutReturn,
        },
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        auto_return: 'approved',
      }),
    })

    const payload = await response.json() as { init_point?: string; sandbox_init_point?: string; message?: string }
    if (!response.ok) {
      res.status(400).json({ error: payload.message || 'Falha ao criar preferência no Mercado Pago.' })
      return
    }

    res.status(200).json({
      initPoint: payload.init_point || payload.sandbox_init_point,
    })
  } catch {
    res.status(500).json({ error: 'Erro inesperado ao criar pagamento.' })
  }
}
