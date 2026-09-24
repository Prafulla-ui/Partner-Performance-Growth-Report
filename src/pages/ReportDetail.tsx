import { ArrowLeft, Download, Pencil, Share2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DemoDataBadge, InternalOnlyBadge } from '../components/ui/Badges'
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { ComparisonSelector } from '../components/ui/ComparisonSelector'
import { DownloadReportModal } from '../components/DownloadReportModal'
import { EditReportModal } from '../components/EditReportModal'
import { EmptyState } from '../components/ui/EmptyState'
import { ShareReportModal } from '../components/ShareReportModal'
import { ReportStatusBadge } from '../components/ui/StatusBadge'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { useReport } from '../context/ReportContext'
import { libraryReports } from '../data/grandMeridian'
import { DemandCoverage } from '../sections/DemandCoverage'
import { DemandOutlook } from '../sections/DemandOutlook'
import { DirectPerformance } from '../sections/DirectPerformance'
import { ExecutiveSummary } from '../sections/ExecutiveSummary'
import { IndirectChannels } from '../sections/IndirectChannels'
import { Marketing } from '../sections/Marketing'
import { NextSteps } from '../sections/NextSteps'
import { RateParity } from '../sections/RateParity'
import { Recommendations } from '../sections/Recommendations'
import type { AccountType, PartnerPerspective, ViewMode, ViewPeriod } from '../types'

export function ReportDetail({ publicView = false }: { publicView?: boolean }) {
  const { id } = useParams()
  const report = libraryReports.find((r) => r.id === id) ?? libraryReports[0]
  const ctx = useReport()
  const [editOpen, setEditOpen] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)

  useEffect(() => {
    if (publicView) ctx.setViewMode('customer')
  }, [publicView, ctx.setViewMode])

  const nav = useMemo(() => {
    const items = [
      { id: 'scorecard', label: 'Snapshot' },
      { id: 'direct-performance', label: ctx.isSupply ? 'Direct Performance' : 'Contribution' },
    ]
    if (ctx.isSupply && ctx.isFullStack) items.push({ id: 'indirect-channels', label: 'Indirect Channels' })
    if (!ctx.isSupply) items.push({ id: 'indirect-channels', label: 'Market & Coverage' })
    if (ctx.isSupply) items.push({ id: 'rate-parity', label: 'Rate Parity' })
    items.push(
      { id: 'marketing', label: 'Marketing' },
      { id: 'demand-outlook', label: 'Demand Outlook' },
      { id: 'recommendations', label: 'Recommendations' },
      { id: 'next-steps', label: 'Next Steps' },
    )
    return items
  }, [ctx.isSupply, ctx.isFullStack])

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

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 shadow-[0_8px_24px_rgba(15,31,51,0.06)] backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-8 py-3">
          <div className="flex min-w-0 items-center gap-3">
            {publicView ? (
              <div className="flex h-9 items-center rounded-md bg-gradient-to-br from-rg-blue-bright to-rg-blue px-2.5 text-xs font-bold tracking-wide text-white shadow-sm">
                UNIFI
              </div>
            ) : (
              <Link
                to="/"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-navy hover:bg-canvas"
                aria-label="Back to report library"
              >
                <ArrowLeft size={16} />
              </Link>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-[15px] font-semibold text-navy">{ctx.reportTitle}</h1>
                <DemoDataBadge />
                {!publicView && <ReportStatusBadge status={ctx.reportStatus} />}
              </div>
              <p className="truncate text-xs text-navy-muted">{report.partner}</p>
            </div>
          </div>
          {!publicView && (
            <div className="flex shrink-0 items-center gap-3">
              <SegmentedControl<ViewMode>
                value={ctx.viewMode}
                onChange={ctx.setViewMode}
                options={[
                  { value: 'internal', label: 'Internal' },
                  { value: 'customer', label: 'Client preview' },
                ]}
              />
              <div className="h-6 w-px bg-line" />
              {ctx.isInternal && (
                <SecondaryButton onClick={() => setEditOpen(true)}>
                  <Pencil size={14} />
                  Edit report
                </SecondaryButton>
              )}
              <SecondaryButton onClick={() => setDownloadOpen(true)}>
                <Download size={14} />
                Download
              </SecondaryButton>
              <PrimaryButton onClick={() => setShareOpen(true)}>
                <Share2 size={14} />
                Share
              </PrimaryButton>
            </div>
          )}
        </div>

        <div className="border-t border-line bg-slate-50/80">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-end gap-5 px-8 py-3">
            {publicView ? (
              <p className="text-sm text-navy-muted">
                {ctx.periodLabel}
                {ctx.compareWith === 'both'
                  ? ` · compared with ${ctx.previousCompareName} and ${ctx.lyCompareName}`
                  : ctx.compareWith === 'previous'
                    ? ` · compared with ${ctx.previousCompareName}`
                    : ` · compared with ${ctx.lyCompareName}`}
              </p>
            ) : (
              <>
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-muted">Perspective</span>
                  <SegmentedControl<PartnerPerspective>
                    value={ctx.perspective}
                    onChange={ctx.setPerspective}
                    options={[
                      { value: 'supply', label: 'Supply' },
                      { value: 'demand', label: 'Demand' },
                    ]}
                  />
                </label>
                <div className="hidden h-10 w-px bg-line sm:block" />
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-muted">Account type</span>
                  <SegmentedControl<AccountType>
                    value={ctx.accountType}
                    onChange={ctx.setAccountType}
                    options={[
                      { value: 'direct', label: 'Direct Stack' },
                      { value: 'full', label: 'Full Stack' },
                    ]}
                  />
                </label>
                <div className="hidden h-10 w-px bg-line sm:block" />
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-muted">Period</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={ctx.viewPeriod}
                      onChange={(e) => ctx.setViewPeriod(e.target.value as ViewPeriod)}
                      className="h-8 rounded-lg border border-line bg-white px-2.5 text-xs font-medium text-navy outline-none focus:border-rg-blue"
                    >
                      <option value="month">Month</option>
                      <option value="quarter">Quarter</option>
                    </select>
                    <span className="rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-navy ring-1 ring-line">
                      {ctx.periodLabel}
                    </span>
                  </div>
                </label>
                <div className="hidden h-10 w-px bg-line sm:block" />
                <ComparisonSelector />
              </>
            )}
          </div>
        </div>

        <nav className="border-t border-line bg-white">
          <div className="mx-auto flex max-w-[1440px] gap-1 overflow-x-auto px-8">
            {nav.map((item) => {
              const active = activeNav === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveNav(item.id)}
                  className={`relative whitespace-nowrap px-3 py-2.5 text-xs font-semibold transition-colors ${
                    active ? 'text-rg-blue' : 'text-navy-muted hover:text-navy'
                  }`}
                >
                  {item.label}
                  {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-rg-blue" />}
                </a>
              )
            })}
          </div>
        </nav>
      </header>

      {publicView ? (
        <div className="bg-teal text-center text-sm font-medium text-white">
          Shared report · View only. Sent by Priya Sharma.
        </div>
      ) : (
        !ctx.isInternal && (
          <div className="bg-teal text-center text-sm font-medium text-white">
            You are viewing the version that will be shared with the client.
          </div>
        )
      )}

      <main className="mx-auto max-w-[1440px] space-y-12 px-8 py-8">
        {ctx.isInternal && (
          <div className="surface-card flex items-start justify-between gap-4 rounded-2xl px-4 py-3 text-sm">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <InternalOnlyBadge />
                <span className="font-semibold text-navy">Account-manager note</span>
              </div>
              <p className="text-navy-muted">
                Priya Sharma: lead with payment drop-off and Agoda mapping. Do not open wholesale partner names in the
                customer preview until legal has reviewed the two B2B contracts.
              </p>
            </div>
          </div>
        )}

        <ExecutiveSummary />
        <DirectPerformance />
        {ctx.isSupply && ctx.isFullStack && <IndirectChannels />}
        {!ctx.isSupply && <DemandCoverage />}
        {ctx.isSupply && <RateParity />}
        <Marketing />
        <DemandOutlook />
        <Recommendations />
        <NextSteps />

        {ctx.isInternal && ctx.accountType === 'direct' && (
          <EmptyState kind="not_subscribed" />
        )}
      </main>

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
    </div>
  )
}
