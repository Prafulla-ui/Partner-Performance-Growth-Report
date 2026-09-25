import {
  CalendarRange,
  ChartColumn,
  Download,
  Globe2,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Megaphone,
  Pencil,
  Scale,
  Share2,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { DemoDataBadge } from '../components/ui/Badges'
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { ComparisonSelector } from '../components/ui/ComparisonSelector'
import { DownloadReportModal } from '../components/DownloadReportModal'
import { EditReportModal } from '../components/EditReportModal'
import { EmptyState } from '../components/ui/EmptyState'
import { ShareReportModal } from '../components/ShareReportModal'
import { PeriodSelector } from '../components/ui/PeriodSelector'
import { ReportStatusBadge } from '../components/ui/StatusBadge'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { useAuth } from '../context/AuthContext'
import { useReport } from '../context/ReportContext'
import { libraryReports, chainHierarchy, getPropertiesForBrand } from '../data/grandMeridian'
import { DemandCoverage } from '../sections/DemandCoverage'
import { DemandOutlook } from '../sections/DemandOutlook'
import { DirectPerformance } from '../sections/DirectPerformance'
import { ExecutiveSummary } from '../sections/ExecutiveSummary'
import { IndirectChannels } from '../sections/IndirectChannels'
import { Marketing } from '../sections/Marketing'
import { NextSteps } from '../sections/NextSteps'
import { RateParity } from '../sections/RateParity'
import { Recommendations } from '../sections/Recommendations'
import type { AccountType, PartnerPerspective, ViewMode } from '../types'

export function ReportDetail({ publicView = false }: { publicView?: boolean }) {
  const { id } = useParams()
  const { user, isHotelier, isAccountManager } = useAuth()
  const report = libraryReports.find((r) => r.id === id) ?? libraryReports[0]
  const ctx = useReport()
  const canOpen =
    publicView || !user?.allowedReportIds || !id || user.allowedReportIds.includes(id)

  const [editOpen, setEditOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [filtersPinned, setFiltersPinned] = useState(false)
  const filterSentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (publicView || isHotelier) ctx.setViewMode('customer')
  }, [publicView, isHotelier, ctx.setViewMode])

  useEffect(() => {
    const sentinel = filterSentinelRef.current
    if (!sentinel || publicView) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the sentinel leaves the viewport, the filter bar is stuck — move Download/Share into it.
        setFiltersPinned(!entry.isIntersecting)
      },
      {
        // Account for sticky top header (h-14 = 56px)
        rootMargin: '-56px 0px 0px 0px',
        threshold: 0,
      },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [publicView])

  const shareDownloadActions = !publicView ? (
    <>
      <SecondaryButton onClick={() => setDownloadOpen(true)}>
        <Download size={14} />
        Download
      </SecondaryButton>
      {isAccountManager && (
        <PrimaryButton onClick={() => setShareOpen(true)}>
          <Share2 size={14} />
          Share
        </PrimaryButton>
      )}
    </>
  ) : null

  const nav = useMemo(() => {
    const items: {
      id: string
      label: string
      moduleId: typeof ctx.enabledModules[number]
      icon: LucideIcon
      muted?: boolean
    }[] = []
    const push = (
      id: string,
      label: string,
      moduleId: typeof ctx.enabledModules[number],
      icon: LucideIcon,
      eligible = true,
    ) => {
      if (!eligible) return
      const shared = ctx.isModuleShared(moduleId)
      if (!ctx.isInternal && !shared) return
      items.push({ id, label, moduleId, icon, muted: ctx.isInternal && !shared })
    }
    push('scorecard', 'Executive summary', 'scorecard', LayoutDashboard)
    push('direct-performance', ctx.isSupply ? 'Direct Performance' : 'Contribution', 'direct', ChartColumn)
    push('indirect-channels', 'Indirect Channels', 'indirect', Globe2, ctx.isSupply && ctx.isFullStack)
    push('indirect-channels', 'Market & Coverage', 'indirect', Globe2, !ctx.isSupply)
    push('rate-parity', 'Rate Parity', 'parity', Scale, ctx.isSupply)
    push('marketing', 'Marketing', 'marketing', Megaphone)
    push('demand-outlook', 'Demand Outlook', 'outlook', CalendarRange)
    push('recommendations', 'Recommendations', 'recommendations', Lightbulb)
    push('next-steps', 'Next Steps', 'next-steps', ListChecks)
    return items
  }, [ctx.isSupply, ctx.isFullStack, ctx.isInternal, ctx.enabledModules, ctx.isModuleShared])

  const [activeNav, setActiveNav] = useState('scorecard')

  useEffect(() => {
    const observers = nav.map((item) => {
      const el = document.getElementById(item.id)
      if (!el) return null
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveNav(item.id)
        },
        { rootMargin: '-25% 0px -65% 0px', threshold: 0.1 },
      )
      observer.observe(el)
      return observer
    })
    return () => observers.forEach((observer) => observer?.disconnect())
  }, [nav])

  if (!canOpen) {
    return <Navigate to={user?.homeReportId ? `/reports/${user.homeReportId}` : '/'} replace />
  }

  const scopeHint = isHotelier || (ctx.canDrillScope && ctx.isSupply) ? ` · ${ctx.activeScopeLabel}` : ''

  return (
    <AppShell
      hideNav={publicView}
      contextLabel={`${report.partner}${scopeHint}`}
      title={ctx.reportTitle}
      description="Availability, conversion and distribution signals for the partner review."
      meta={
        <div className="flex flex-wrap items-center gap-2">
          <DemoDataBadge />
          {!publicView && <ReportStatusBadge status={ctx.reportStatus} />}
          {isHotelier && (
            <span className="rounded-full bg-teal-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-teal">
              Hotelier view
            </span>
          )}
        </div>
      }
      navItems={nav.map((item) => ({
        id: item.id,
        label: item.label,
        href: `#${item.id}`,
        active: activeNav === item.id,
        muted: item.muted,
        icon: item.icon,
      }))}
      backTo={{ label: 'Back to reports', href: '/' }}
      actions={
        publicView ? undefined : (
          <>
            {isAccountManager && (
              <SegmentedControl<ViewMode>
                value={ctx.viewMode}
                onChange={ctx.setViewMode}
                options={[
                  { value: 'internal', label: 'Internal' },
                  { value: 'customer', label: 'Client preview' },
                ]}
              />
            )}
            {ctx.isInternal && (
              <SecondaryButton onClick={() => setEditOpen(true)}>
                <Pencil size={14} />
                Edit
              </SecondaryButton>
            )}
            {!filtersPinned && shareDownloadActions}
          </>
        )
      }
    >
        <div ref={filterSentinelRef} className="h-0 w-full" aria-hidden />
        <div className="sticky top-14 z-30 -mx-8 mb-8 border-b border-[#eceef2] bg-[#f6f7f9]/95 px-8 py-3 backdrop-blur">
          <div className="flex flex-nowrap items-end gap-4 overflow-x-auto">
            {publicView ? (
              <p className="text-sm text-navy-muted">
                {ctx.periodLabel}
                {ctx.compareWith === 'both'
                  ? ` · compared with ${ctx.previousCompareName} and ${ctx.lyCompareName}`
                  : ctx.compareWith === 'previous'
                    ? ` · compared with ${ctx.previousCompareName}`
                    : ctx.compareWith === 'ly'
                      ? ` · compared with ${ctx.lyCompareName}`
                      : ''}
              </p>
            ) : (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-muted">Perspective</span>
                  <select
                    value={ctx.perspective}
                    onChange={(e) => ctx.setPerspective(e.target.value as PartnerPerspective)}
                    className="h-9 min-w-[140px] rounded-full border-0 bg-white py-0 pl-3 pr-8 text-xs font-medium text-navy outline-none focus-visible:ring-2 focus-visible:ring-rg-blue/30"
                  >
                    <option value="supply">Supply Partner</option>
                    <option value="demand">Demand Partner</option>
                  </select>
                </label>
                <div className="hidden h-10 w-px shrink-0 bg-line sm:block" />
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-muted">Account type</span>
                  <select
                    value={ctx.accountType}
                    onChange={(e) => ctx.setAccountType(e.target.value as AccountType)}
                    className="h-9 min-w-[140px] rounded-full border-0 bg-white py-0 pl-3 pr-8 text-xs font-medium text-navy outline-none focus-visible:ring-2 focus-visible:ring-rg-blue/30"
                  >
                    <option value="direct">Direct Stack</option>
                    <option value="full">Full Stack</option>
                  </select>
                </label>
                <div className="hidden h-10 w-px shrink-0 bg-line sm:block" />
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-muted">Brand</span>
                  <select
                    value={ctx.selectedBrandId ?? 'all'}
                    disabled={!ctx.isSupply}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === 'all') ctx.goToScope('chain')
                      else ctx.openBrand(v)
                    }}
                    className="h-9 min-w-[160px] rounded-full border-0 bg-white py-0 pl-3 pr-8 text-xs font-medium text-navy outline-none focus-visible:ring-2 focus-visible:ring-rg-blue/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">All brands</option>
                    {chainHierarchy.brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-muted">Property</span>
                  <select
                    value={ctx.selectedPropertyId ?? 'all'}
                    disabled={!ctx.isSupply}
                    onChange={(e) => {
                      const v = e.target.value
                      if (v === 'all') {
                        if (ctx.selectedBrandId) ctx.goToScope('brand')
                        else ctx.goToScope('chain')
                      } else {
                        ctx.openProperty(v)
                      }
                    }}
                    className="h-9 min-w-[170px] rounded-full border-0 bg-white py-0 pl-3 pr-8 text-xs font-medium text-navy outline-none focus-visible:ring-2 focus-visible:ring-rg-blue/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="all">
                      {ctx.selectedBrandId ? 'All properties in brand' : 'All properties'}
                    </option>
                    {(ctx.selectedBrandId
                      ? getPropertiesForBrand(ctx.selectedBrandId)
                      : chainHierarchy.properties
                    ).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="hidden h-10 w-px shrink-0 bg-line sm:block" />
                <PeriodSelector />
                <div className="hidden h-10 w-px shrink-0 bg-line sm:block" />
                <ComparisonSelector />
                {filtersPinned && (
                  <>
                    <div className="hidden h-10 w-px shrink-0 bg-line sm:block" />
                    <div className="flex shrink-0 items-center gap-2 self-end">{shareDownloadActions}</div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

      {publicView ? (
        <div className="mb-6 rounded-2xl bg-[#ecf8f6] px-4 py-3 text-sm text-teal">
          Shared report · View only. Sent by Priya Sharma.
        </div>
      ) : !ctx.isInternal ? (
        <div className="mb-6 rounded-2xl bg-[#ecf8f6] px-4 py-3 text-sm text-teal">
          {isHotelier
            ? `Hotelier ${user?.hotelierLevel ?? ''} view · client report only`
            : 'You are viewing the version that will be shared with the client.'}
        </div>
      ) : null}

      <div className="space-y-12">
        {ctx.shouldShowModule('scorecard') && <ExecutiveSummary />}
        {ctx.shouldShowModule('direct') && <DirectPerformance />}
        {ctx.shouldShowModule('indirect') && ctx.isSupply && ctx.isFullStack && <IndirectChannels />}
        {ctx.shouldShowModule('indirect') && !ctx.isSupply && <DemandCoverage />}
        {ctx.shouldShowModule('parity') && ctx.isSupply && <RateParity />}
        {ctx.shouldShowModule('marketing') && <Marketing />}
        {ctx.shouldShowModule('outlook') && <DemandOutlook />}
        {ctx.shouldShowModule('recommendations') && <Recommendations />}
        {ctx.shouldShowModule('next-steps') && <NextSteps />}

        {ctx.isInternal && ctx.accountType === 'direct' && (
          <EmptyState kind="not_subscribed" />
        )}
      </div>

      <EditReportModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onDownload={() => setDownloadOpen(true)}
        onShare={() => setShareOpen(true)}
      />

      <DownloadReportModal
        open={downloadOpen}
        onClose={() => setDownloadOpen(false)}
        partner={report.partner}
      />
      <ShareReportModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        reportId={report.id}
        partner={report.partner}
      />
    </AppShell>
  )
}
