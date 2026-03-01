export interface UserAccount {
  id: string
  name: string
  email: string
  phone: string
  password: string
  createdAt: string
}

const USERS_KEY = 'lovely-users-v1'
const SESSION_KEY = 'lovely-auth-user-id'
const LEGACY_ACCOUNT_KEY = 'lovely-account'

export function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
}

function readUsers() {
  if (typeof window === 'undefined') return [] as UserAccount[]
  const raw = window.localStorage.getItem(USERS_KEY)
  if (!raw) return [] as UserAccount[]
  try {
    const parsed = JSON.parse(raw) as UserAccount[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUsers(users: UserAccount[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function migrateLegacyAccount() {
  if (typeof window === 'undefined') return
  const legacyRaw = window.localStorage.getItem(LEGACY_ACCOUNT_KEY)
  if (!legacyRaw) return
  const users = readUsers()
  if (users.length > 0) return
  try {
    const legacy = JSON.parse(legacyRaw) as { name?: string; email?: string; password?: string }
    if (!legacy.email || !legacy.password) return
    const migrated: UserAccount = {
      id: `usr_${Date.now()}`,
      name: legacy.name?.trim() || 'Usuário',
      email: legacy.email.trim().toLowerCase(),
      phone: '',
      password: legacy.password,
      createdAt: new Date().toISOString(),
    }
    writeUsers([migrated])
  } catch {
    // noop
  }
}

export function ensureAuthMigration() {
  migrateLegacyAccount()
}

export function registerUser(input: { name: string; email: string; phone: string; password: string }) {
  ensureAuthMigration()
  const users = readUsers()
  const email = input.email.trim().toLowerCase()
  const phone = normalizePhone(input.phone)
  if (users.some((user) => user.email === email)) {
    return { ok: false as const, error: 'Já existe uma conta com este e-mail.' }
  }
  if (phone && users.some((user) => normalizePhone(user.phone) === phone)) {
    return { ok: false as const, error: 'Já existe uma conta com este telefone.' }
  }
  const user: UserAccount = {
    id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    email,
    phone,
    password: input.password,
    createdAt: new Date().toISOString(),
  }
  writeUsers([...users, user])
  return { ok: true as const, user }
}

export function loginUser(input: { email: string; phone: string; password: string }) {
  ensureAuthMigration()
  const users = readUsers()
  const email = input.email.trim().toLowerCase()
  const phone = normalizePhone(input.phone)
  const user = users.find((item) => item.email === email && normalizePhone(item.phone) === phone)
  if (!user) {
    return { ok: false as const, error: 'Conta não encontrada com este e-mail e telefone.' }
  }
  if (user.password !== input.password) {
    return { ok: false as const, error: 'Senha inválida.' }
  }
  startSession(user.id)
  return { ok: true as const, user }
}

export function startSession(userId: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SESSION_KEY, userId)
  window.localStorage.setItem('lovely-auth', '1')
}

export function getCurrentUser() {
  ensureAuthMigration()
  if (typeof window === 'undefined') return null
  const userId = window.localStorage.getItem(SESSION_KEY)
  if (!userId) return null
  return readUsers().find((user) => user.id === userId) ?? null
}

export function isAuthenticated() {
  return Boolean(getCurrentUser())
}

export function logoutUser() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_KEY)
  window.localStorage.removeItem('lovely-auth')
}
