import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Badge, Button, Card, ErrorMessage, FormField, Input } from '@/design-system'
import { DEMO_USERS, useAuth } from '../context/AuthContext'

const AM = DEMO_USERS.find((u) => u.kind === 'account_manager') ?? DEMO_USERS[0]

export function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState(AM.email)
  const [password, setPassword] = useState(AM.password)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (user) {
    const dest = user.homeReportId ? `/reports/${user.homeReportId}` : '/'
    return <Navigate to={dest} replace />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    window.setTimeout(() => {
      const message = login(email, password)
      setBusy(false)
      if (message) {
        setError(message)
        return
      }
      navigate('/', { replace: true })
    }, 450)
  }

  return (
    <div className="flex min-h-screen bg-[var(--ds-bg-primary)]">
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-[var(--ds-bg-inverse)] px-12 py-12 text-[var(--ds-text-inverse)] lg:flex">
        <div className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-[var(--ds-brand-primary)]/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-72 w-72 rounded-full bg-[var(--ds-brand-accent)]/30 blur-3xl" />
        <div className="relative flex h-9 w-fit items-center rounded-md bg-white/15 px-2.5 text-xs font-bold tracking-wide ring-1 ring-white/20">
          UNIFI
        </div>
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">RateGain</p>
          <h1 className="mt-3 max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Partner Performance & Growth Reports
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
            Account team workspace to prepare partner reviews — direct performance, channel mix, parity and growth
            recommendations in a single brief.
          </p>
        </div>
        <p className="text-xs text-white/45">Demo environment · dummy data only</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="mb-3 flex h-9 w-fit items-center rounded-md bg-[var(--ds-brand-primary)] px-2.5 text-xs font-bold tracking-wide text-[var(--ds-text-inverse)] lg:hidden">
                UNIFI
              </div>
              <h2 className="text-2xl font-semibold text-[var(--ds-text-primary)]">Sign in</h2>
              <p className="mt-1 text-sm text-[var(--ds-text-secondary)]">
                Account team access to prepare and share reviews.
              </p>
            </div>
            <Badge tone="warning" className="uppercase tracking-wide">
              Demo
            </Badge>
          </div>

          <Card padded={false} className="bg-white p-7">
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField label="Work email" htmlFor="login-email" required>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  invalid={Boolean(error)}
                />
              </FormField>
              <FormField label="Password" htmlFor="login-password" required>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  invalid={Boolean(error)}
                />
              </FormField>
              {error && <ErrorMessage>{error}</ErrorMessage>}
              <Button type="submit" className="w-full" loading={busy} size="lg">
                {busy ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>
          </Card>

          <div className="mt-4 rounded-[var(--ds-radius-xl)] border border-dashed border-[var(--ds-border-default)] bg-[var(--ds-bg-elevated)] px-4 py-3 text-xs text-[var(--ds-text-secondary)]">
            <p className="font-semibold text-[var(--ds-text-primary)]">Demo credentials</p>
            <p className="mt-1">Email: priya.sharma@rategain.com</p>
            <p>Password: Unifi2026</p>
          </div>
        </div>
      </main>
    </div>
  )
}
