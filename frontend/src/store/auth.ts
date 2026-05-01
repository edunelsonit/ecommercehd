// 1. Added 'restaurant' to match your Prisma Enum
export type Role = 'customer' | 'vendor' | 'rider' | 'restaurant' | 'superadmin' | 'organization' | 'admin'

export type AuthUser = {
  // 2. Changed to number to match your DB 'Int' IDs
  id: number 
  surname: string
  firstName: string // Matches @map("first_name") in Prisma
  phone?: string
  role: Role
  wallet?: {
    id: number
    balance: string // Decimal typically comes as string from JSON
    currency: string
  } | null
  vendorProfile?: {
    id: number
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

/**
 * Loads auth state from localStorage. 
 * Includes a check to ensure the data structure is valid before returning.
 */
export function loadAuth(): AuthState | null {
  if (typeof window === 'undefined') return null // SSR Guard for Next.js/Remix

  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const auth = JSON.parse(raw) as AuthState
    // Basic validation: ensure token and user id exist
    if (!auth.token || !auth.user?.id) {
      throw new Error('Invalid auth structure')
    }
    return auth
  } catch (error) {
    console.error('Failed to parse auth state:', error)
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function saveAuth(auth: AuthState): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth))
  }
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
    // Optional: Force a page reload to clear memory-cached state
    window.location.href = '/login'
  }
}