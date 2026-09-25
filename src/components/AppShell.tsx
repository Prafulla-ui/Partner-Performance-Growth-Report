import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { cn } from '../design-system/utils/cn'

const NAV_COLLAPSE_KEY = 'unifi-nav-collapsed'

export interface AppNavItem {
  id: string
  label: string
  href: string
  active?: boolean
  muted?: boolean
  icon?: LucideIcon
  children?: AppNavItem[]
}

function NavLink({
  item,
  collapsed,
  nested = false,
}: {
  item: AppNavItem
  collapsed: boolean
  nested?: boolean
}) {
  const Icon = item.icon
  const className = cn(
    'flex items-center gap-2.5 rounded-xl text-sm font-medium transition-colors',
    collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2',
    nested && !collapsed && 'py-1.5 text-[13px]',
    item.active
      ? 'bg-[var(--ds-brand-primary-soft)] text-[var(--ds-brand-primary)]'
      : item.muted
        ? 'text-navy-muted/60 hover:bg-[#f6f7f9]'
        : 'text-navy-muted hover:bg-[#f6f7f9] hover:text-navy',
  )

  const content = (
    <>
      {Icon && <Icon size={collapsed ? 18 : 16} className="shrink-0" aria-hidden />}
      {!collapsed && (
        <span className="truncate">
          {item.label}
          {item.muted && <span className="ml-1 text-[10px]">· hidden</span>}
        </span>
      )}
    </>
  )

  if (item.href.startsWith('/')) {
    return (
      <Link to={item.href} className={className} title={collapsed ? item.label : undefined} aria-label={item.label}>
        {content}
      </Link>
    )
  }

  return (
    <a href={item.href} className={className} title={collapsed ? item.label : undefined} aria-label={item.label}>
      {content}
    </a>
  )
}

export function AppShell({
  contextLabel,
  title,
  description,
  meta,
  actions,
  navItems = [],
  children,
  hideNav = false,
  backTo,
}: {
  contextLabel?: string
  title: string
  description?: string
  meta?: ReactNode
  actions?: ReactNode
  navItems?: AppNavItem[]
  children: ReactNode
  hideNav?: boolean
  backTo?: { label: string; href: string }
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      setCollapsed(sessionStorage.getItem(NAV_COLLAPSE_KEY) === '1')
    } catch {
      /* ignore */
    }
  }, [])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        sessionStorage.setItem(NAV_COLLAPSE_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return (
    <div className="flex min-h-screen bg-[#f6f7f9]">
      {!hideNav && (
        <aside
          className={cn(
            'sticky top-0 flex h-screen shrink-0 flex-col self-start overflow-y-auto border-r border-[#eceef2] bg-white py-5 transition-[width] duration-200',
            collapsed ? 'w-[72px] px-2' : 'w-[220px] px-4',
          )}
        >
          <div className={cn('mb-6 flex items-center', collapsed ? 'flex-col gap-3' : 'justify-between gap-2 px-1')}>
            <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--ds-brand-primary)] text-[10px] font-bold text-white">
                U
              </span>
              {!collapsed && (
                <div>
                  <p className="text-sm font-semibold text-navy">UNIFI</p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-navy-muted">Workspace</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              title={collapsed ? 'Expand' : 'Collapse'}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-navy-muted hover:bg-[#f6f7f9] hover:text-navy"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <div key={item.id}>
                <NavLink item={item} collapsed={collapsed} />
                {!collapsed && item.children && item.children.length > 0 && (
                  <div className="mt-1 ml-3 space-y-0.5 border-l border-[#eceef2] pl-2">
                    {item.children.map((child) => (
                      <NavLink key={child.id} item={child} collapsed={false} nested />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-[#eceef2]/80 bg-[#f6f7f9]/95 px-8 backdrop-blur">
          <p className="inline-flex min-w-0 max-w-[min(100%,42rem)] items-center truncate rounded-full bg-[var(--ds-brand-primary-soft)] px-3 py-1 text-sm font-semibold text-[var(--ds-brand-primary)]">
            {contextLabel ?? 'Partner Performance'}
          </p>
          <div className="flex shrink-0 items-center gap-3 text-sm">
            {actions && (
              <div className="flex items-center gap-2">{actions}</div>
            )}
            {user && (
              <>
                {actions && <div className="hidden h-6 w-px bg-[#eceef2] sm:block" />}
                <span className="hidden text-navy-muted lg:inline">{user.email}</span>
                <button
                  type="button"
                  className="font-medium text-navy hover:text-[var(--ds-brand-primary)]"
                  onClick={() => {
                    logout()
                    navigate('/login', { replace: true })
                  }}
                >
                  Sign out
                </button>
              </>
            )}
          </div>
        </header>

        <div className="px-8 pb-16">
          {backTo && (
            <Link
              to={backTo.href}
              className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-rg-blue hover:underline"
            >
              <ArrowLeft size={14} />
              {backTo.label}
            </Link>
          )}
          <div className="mb-8">
            <h1 className="text-lg font-semibold leading-snug tracking-tight text-navy">{title}</h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm leading-6 text-navy-muted">{description}</p>
            )}
            {meta && <div className="mt-3">{meta}</div>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
