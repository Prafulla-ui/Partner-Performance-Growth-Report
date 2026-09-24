import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { DEMO_USERS, useAuth } from '../context/AuthContext'
import { DemoDataBadge } from '../components/ui/Badges'
import { PrimaryButton } from '../components/ui/Buttons'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import type { ScopeLevel, UserKind } from '../types'

export function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [kind, setKind] = useState<UserKind>('account_manager')
  const [level, setLevel] = useState<ScopeLevel>('chain')
  const [email, setEmail] = useState(DEMO_USERS[0].email)
  const [password, setPassword] = useState(DEMO_USERS[0].password)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (user) {
    const dest = user.homeReportId ? `/reports/${user.homeReportId}` : '/'
    return <Navigate to={dest} replace />
  }

  const applyDemo = (nextKind: UserKind, nextLevel: ScopeLevel) => {
    const match =
      nextKind === 'account_manager'
        ? DEMO_USERS.find((u) => u.kind === 'account_manager')
        : DEMO_USERS.find((u) => u.kind === 'hotelier' && u.hotelierLevel === nextLevel)
    if (!match) return
    setEmail(match.email)
    setPassword(match.password)
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
      const matched = DEMO_USERS.find((u) => u.email === email.trim().toLowerCase())
      navigate(matched?.homeReportId ? `/reports/${matched.homeReportId}` : '/', { replace: true })
    }, 450)
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <aside className="relative hidden w-[44%] flex-col justify-between overflow-hidden bg-navy px-12 py-12 text-white lg:flex">
        <div className="pointer-events-none absolute -left-16 top-10 h-64 w-64 rounded-full bg-rg-blue/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-72 w-72 rounded-full bg-teal/30 blur-3xl" />
        <div className="relative flex h-9 w-fit items-center rounded-md bg-white/15 px-2.5 text-xs font-bold tracking-wide ring-1 ring-white/20">
          UNIFI
        </div>
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">RateGain</p>
          <h1 className="mt-3 max-w-md text-4xl font-semibold leading-tight tracking-tight">
            Partner Performance & Growth Reports
          </h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
            Account managers prepare the internal brief. Hoteliers open the same report in client view — chain, brand or
            property — without internal notes or cost.
          </p>
        </div>
        <p className="text-xs text-white/45">Demo environment · dummy data only</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="mb-3 flex h-9 w-fit items-center rounded-md bg-rg-blue px-2.5 text-xs font-bold tracking-wide text-white lg:hidden">
                UNIFI
              </div>
              <h2 className="text-2xl font-semibold text-navy">Sign in</h2>
              <p className="mt-1 text-sm text-navy-muted">
                {kind === 'account_manager'
                  ? 'Account team access to prepare and share reviews.'
                  : 'Hotelier access to the client-facing report only.'}
              </p>
            </div>
            <DemoDataBadge />
          </div>

          <form onSubmit={onSubmit} className="surface-card rounded-2xl p-7">
            <p className="mb-3 text-xs font-semibold text-navy-muted">Sign in as</p>
            <SegmentedControl<UserKind>
              value={kind}
              onChange={(next) => {
                setKind(next)
                applyDemo(next, level)
              }}
              options={[
                { value: 'account_manager', label: 'Account manager' },
                { value: 'hotelier', label: 'Hotelier' },
              ]}
            />
            {kind === 'hotelier' && (
              <div className="mt-3">
                <p className="mb-2 text-xs font-semibold text-navy-muted">Hotelier level</p>
                <SegmentedControl<ScopeLevel>
                  value={level}
                  onChange={(next) => {
                    setLevel(next)
                    applyDemo('hotelier', next)
                  }}
                  options={[
                    { value: 'chain', label: 'Chain' },
                    { value: 'brand', label: 'Brand' },
                    { value: 'property', label: 'Property' },
                  ]}
                />
              </div>
            )}
            <label className="mt-4 block text-xs font-semibold text-navy-muted">
              Work email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-navy outline-none focus:border-rg-blue"
              />
            </label>
            <label className="mt-4 block text-xs font-semibold text-navy-muted">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-navy outline-none focus:border-rg-blue"
              />
            </label>
            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
            <PrimaryButton type="submit" className="mt-5 w-full" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </PrimaryButton>
          </form>

          <div className="mt-4 space-y-3 rounded-xl border border-dashed border-line bg-white px-4 py-3 text-xs text-navy-muted">
            <p className="font-semibold text-navy">Demo credentials</p>
            <div>
              <p className="font-semibold text-navy">Account manager</p>
              <p>priya.sharma@rategain.com · Unifi2026</p>
            </div>
            <div>
              <p className="font-semibold text-navy">Hotelier (password Hotelier2026)</p>
              <p>Chain: ananya.mehta@grandmeridian.com</p>
              <p>Brand: james.cole@azuresands.com</p>
              <p>Property: nina.kapoor@grandmeridian.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
