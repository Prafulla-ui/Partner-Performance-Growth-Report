import { Download, MoreHorizontal, Pencil, Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { useAuth } from '../context/AuthContext'
import { GenerateReportDrawer } from '../components/GenerateReportDrawer'
import { DemoDataBadge } from '../components/ui/Badges'
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { DataTable, type Column } from '../components/ui/DataTable'
import { Field, FilterBar, Select, TextInput } from '../components/ui/FilterBar'
import { ReportStatusBadge } from '../components/ui/StatusBadge'
import { libraryReports } from '../data/grandMeridian'
import type { LibraryReport } from '../types'

export function ReportLibrary() {
  const navigate = useNavigate()
  const { user, isHotelier, isAccountManager } = useAuth()
  const [query, setQuery] = useState('')
  const [perspective, setPerspective] = useState('all')
  const [accountType, setAccountType] = useState('all')
  const [region, setRegion] = useState('all')
  const [status, setStatus] = useState('all')
  const [open, setOpen] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)

  const rows = useMemo(() => {
    return libraryReports.filter((r) => {
      const allowed = !user?.allowedReportIds || user.allowedReportIds.includes(r.id)
      const q = query.toLowerCase()
      const matchesQuery = !q || r.partner.toLowerCase().includes(q) || r.period.toLowerCase().includes(q)
      const matchesPerspective = perspective === 'all' || r.perspective === perspective
      const matchesType = accountType === 'all' || r.accountType === accountType
      const matchesRegion = region === 'all' || r.region === region
      const matchesStatus = status === 'all' || r.status === status
      return allowed && matchesQuery && matchesPerspective && matchesType && matchesRegion && matchesStatus
    })
  }, [query, perspective, accountType, region, status, user])

  const columns: Column<LibraryReport>[] = [
    {
      key: 'partner',
      header: 'Partner',
      render: (r) => (
        <button
          type="button"
          className="text-left font-semibold text-rg-blue hover:underline"
          onClick={() => navigate(`/reports/${r.id}`)}
        >
          {r.partner}
        </button>
      ),
    },
    {
      key: 'perspective',
      header: 'Partner perspective',
      render: (r) => (r.perspective === 'supply' ? 'Supply Partner' : 'Demand Partner'),
    },
    {
      key: 'account',
      header: 'Account type',
      render: (r) => (r.accountType === 'full' ? 'Full Stack' : 'Direct Stack'),
    },
    { key: 'scope', header: 'Scope', render: (r) => r.scope },
    { key: 'period', header: 'Report period', render: (r) => r.period },
        { key: 'status', header: 'Status', render: (r) => <ReportStatusBadge status={r.status} /> },
    { key: 'generated', header: 'Generated date', render: (r) => r.generated },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="relative flex items-center gap-1">
          <SecondaryButton className="h-8 px-2 text-xs" onClick={() => navigate(`/reports/${r.id}`)}>
            View
          </SecondaryButton>
          {isAccountManager && (
            <>
              <SecondaryButton className="h-8 px-2 text-xs" onClick={() => navigate(`/reports/${r.id}`)}>
                <Pencil size={12} />
                Edit
              </SecondaryButton>
              <SecondaryButton className="h-8 px-2 text-xs">
                <Download size={12} />
                Download
              </SecondaryButton>
              <button
                type="button"
                className="rounded-md p-1.5 text-navy-muted hover:bg-canvas"
                onClick={() => setMenuId(menuId === r.id ? null : r.id)}
              >
                <MoreHorizontal size={16} />
              </button>
              {menuId === r.id && (
                <div className="absolute right-0 top-9 z-10 w-40 rounded-lg border border-line bg-white py-1 text-sm shadow-lg">
                  <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-canvas">
                    Duplicate
                  </button>
                  <button type="button" className="block w-full px-3 py-1.5 text-left hover:bg-canvas">
                    Archive
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <AppShell
      hideNav
      contextLabel={isHotelier && user?.partner ? user.partner : 'Account team workspace'}
      title={isHotelier ? 'Your reports' : 'Reports'}
      description={
        isHotelier
          ? `${user?.scopeLabel ?? 'Shared partner briefs'} ready for review.`
          : 'Prepare, review and share partner performance briefs.'
      }
      meta={<DemoDataBadge />}
      actions={
        isAccountManager ? (
          <PrimaryButton onClick={() => setOpen(true)}>
            <Plus size={16} />
            Generate report
          </PrimaryButton>
        ) : undefined
      }
    >
        <div className="mb-6">
          <FilterBar>
            <Field label="Search">
              <div className="relative w-72">
                <Search size={14} className="pointer-events-none absolute left-2.5 top-2.5 text-navy-muted" />
                <TextInput value={query} onChange={setQuery} placeholder="Search partner or period" className="pl-8" />
              </div>
            </Field>
            <Field label="Partner type">
              <Select
                value={perspective}
                onChange={setPerspective}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'supply', label: 'Supply Partner' },
                  { value: 'demand', label: 'Demand Partner' },
                ]}
              />
            </Field>
            <Field label="Account type">
              <Select
                value={accountType}
                onChange={setAccountType}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'direct', label: 'Direct Stack' },
                  { value: 'full', label: 'Full Stack' },
                ]}
              />
            </Field>
            <Field label="Region">
              <Select
                value={region}
                onChange={setRegion}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'APMEA', label: 'APMEA' },
                  { value: 'APAC', label: 'APAC' },
                  { value: 'EMEA', label: 'EMEA' },
                  { value: 'Americas', label: 'Americas' },
                ]}
              />
            </Field>
            <Field label="Report status">
              <Select
                value={status}
                onChange={setStatus}
                options={[
                  { value: 'all', label: 'All' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'ready', label: 'Ready for review' },
                  { value: 'approved', label: 'Approved' },
                  { value: 'shared', label: 'Shared' },
                ]}
              />
            </Field>
          </FilterBar>
        </div>

        {rows.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-navy-muted">No reports match the current filters.</p>
        ) : (
          <DataTable title="Reports" columns={columns} rows={rows} rowKey={(r) => r.id} />
        )}

      <GenerateReportDrawer open={open} onClose={() => setOpen(false)} />
    </AppShell>
  )
}
