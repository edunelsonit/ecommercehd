export type Role = 'customer' | 'vendor' | 'rider' | 'superadmin' | 'organization' | 'admin'

export type AuthUser = {
  id: string
  surname?: string
  first_name?: string
  phone?: string
  role: Role
  wallet?: {
    id: string
    balance: string
    currency: string
  } | null
  vendorProfile?: {
    id: string
    businessName: string
    vendorType: string
    isVerified: boolean
  } | null
}

export type AuthState = {
  token: string
  user: AuthUser
}

const STORAGE_KEY = 'elvekas.auth'

export function loadAuth(): AuthState | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthState
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function saveAuth(auth: AuthState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY)
}
