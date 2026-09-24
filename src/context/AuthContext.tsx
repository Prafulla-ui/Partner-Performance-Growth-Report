import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'unifi-demo-session'

export interface AuthUser {
  name: string
  email: string
  role: string
}

interface AuthState {
  user: AuthUser | null
  login: (email: string, password: string) => string | null
  logout: () => void
}

const DEMO_USER: AuthUser = {
  name: 'Priya Sharma',
  email: 'priya.sharma@rategain.com',
  role: 'Account manager',
}

const AuthContext = createContext<AuthState | null>(null)

function readSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readSession())

  const login = (email: string, password: string) => {
    const trimmed = email.trim().toLowerCase()
    const validEmail = trimmed === DEMO_USER.email
    const validPassword = password === 'Unifi2026'
    if (!validEmail || !validPassword) {
      return 'Use the demo credentials shown below the form.'
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER))
    setUser(DEMO_USER)
    return null
  }

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
