import { type PlanId, getPlanById } from '../constants/plans'

interface UserAccess {
  planId: PlanId
  status: 'active' | 'expired'
  paidAt: string
  expiresAt: string | null
  paymentId?: string
}

const ACCESS_KEY = 'lovely-access-v1'

function readAccessMap() {
  if (typeof window === 'undefined') return {} as Record<string, UserAccess>
  const raw = window.localStorage.getItem(ACCESS_KEY)
  if (!raw) return {} as Record<string, UserAccess>
  try {
    const parsed = JSON.parse(raw) as Record<string, UserAccess>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeAccessMap(map: Record<string, UserAccess>) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(ACCESS_KEY, JSON.stringify(map))
}

function computeExpiry(planId: PlanId, paidAt: Date) {
  const plan = getPlanById(planId)
  if (!plan || plan.durationHours === null) return null
  return new Date(paidAt.getTime() + plan.durationHours * 60 * 60 * 1000).toISOString()
}

export function activateAccessForUser(userId: string, planId: PlanId, paymentId?: string) {
  const now = new Date()
  const map = readAccessMap()
  map[userId] = {
    planId,
    status: 'active',
    paidAt: now.toISOString(),
    expiresAt: computeExpiry(planId, now),
    paymentId,
  }
  writeAccessMap(map)
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('lovely-paid', '1')
  }
}

export function getUserAccess(userId: string) {
  const map = readAccessMap()
  const access = map[userId]
  if (!access) return null
  if (access.expiresAt && new Date(access.expiresAt).getTime() <= Date.now()) {
    if (access.status !== 'expired') {
      map[userId] = { ...access, status: 'expired' }
      writeAccessMap(map)
    }
    return { ...access, status: 'expired' as const }
  }
  return access
}

export function hasActiveAccess(userId: string) {
  const access = getUserAccess(userId)
  return Boolean(access && access.status === 'active')
}

