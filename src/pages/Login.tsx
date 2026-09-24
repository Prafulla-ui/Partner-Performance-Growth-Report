import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { DemoDataBadge } from '../components/ui/Badges'
import { PrimaryButton } from '../components/ui/Buttons'

export function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('priya.sharma@rategain.com')
  const [password, setPassword] = useState('Unifi2026')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/" replace />

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
            One business-review workspace for supply and demand partners — direct performance, channel mix,
            parity and growth recommendations in a single brief.
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
              <p className="mt-1 text-sm text-navy-muted">Account team access for the partner review workspace.</p>
            </div>
            <DemoDataBadge />
          </div>

          <form onSubmit={onSubmit} className="surface-card rounded-2xl p-7">
            <label className="block text-xs font-semibold text-navy-muted">
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

          <div className="mt-4 rounded-xl border border-dashed border-line bg-white px-4 py-3 text-xs text-navy-muted">
            <p className="font-semibold text-navy">Demo credentials</p>
            <p className="mt-1">Email: priya.sharma@rategain.com</p>
            <p>Password: Unifi2026</p>
          </div>
        </div>
      </main>
    </div>
  )
}
