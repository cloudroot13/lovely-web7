export type PlanId = '24h' | 'anual' | 'vitalicio'

export interface PlanDefinition {
  id: PlanId
  name: string
  priceLabel: string
  price: number
  description: string
  durationHours: number | null
}

export const PLANS: PlanDefinition[] = [
  {
    id: '24h',
    name: 'Só Hoje (24h)',
    priceLabel: 'R$ 15,00',
    price: 15,
    description: 'Acesso por 24h para surpreender em uma data especial.',
    durationHours: 24,
  },
  {
    id: 'anual',
    name: 'Plano Anual',
    priceLabel: 'R$ 20,00',
    price: 20,
    description: 'Disponível por 12 meses com edições ilimitadas.',
    durationHours: 24 * 365,
  },
  {
    id: 'vitalicio',
    name: 'Vitalício',
    priceLabel: 'R$ 27,00',
    price: 27,
    description: 'Acesso para sempre ao presente digital criado.',
    durationHours: null,
  },
]

export function getPlanById(planId: string | null | undefined) {
  return PLANS.find((plan) => plan.id === planId) ?? null
}

