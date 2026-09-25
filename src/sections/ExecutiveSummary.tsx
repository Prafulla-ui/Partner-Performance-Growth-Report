import { ChevronDown, ChevronRight, Link2, Pencil, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { CustomerVisibleBadge } from '../components/ui/Badges'
import { GhostButton, PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { DataTable, type Column } from '../components/ui/DataTable'
import { KpiCard } from '../components/ui/KpiCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { TrendIndicator } from '../components/ui/TrendIndicator'
import { useAuth } from '../context/AuthContext'
import { useReport } from '../context/ReportContext'
import { chainHierarchy, demandKpis, supplyKpis } from '../data/grandMeridian'
import { chartColors, chartSeries } from '../lib/chartTheme'
import { formatCurrency } from '../lib/format'
import type { HierarchyProperty, KpiMetric, ScopeKpis } from '../types'

const onlineRevenue = [
  {
    name: 'Direct',
    amount: 2410000,
    amountLabel: '$2.41M',
    share: 47.4,
    color: chartSeries.direct,
    qoq: 12.6,
    yoy: 21.9,
  },
  {
    name: 'Indirect',
    amount: 2530000,
    amountLabel: '$2.53M',
    share: 49.7,
    color: chartSeries.indirect,
    qoq: 6.1,
    yoy: 8.7,
  },
  {
    name: 'GDS',
    amount: 146000,
    amountLabel: '$146K',
    share: 2.9,
    color: chartSeries.gds,
    qoq: -1.6,
    yoy: -3.4,
  },
]

const revenueOpportunities = [
  {
    title: 'Reduce OTA dependency by 20%',
    kind: 'Commission saved',
    detail: '$506K moves to direct at 18% commission.',
    value: 91000,
  },
  {
    title: 'Fix parity',
    kind: 'Revenue saved',
    detail: 'Recovered when direct is no longer undercut.',
    value: 182000,
  },
  {
    title: 'Improve the conversion funnel',
    kind: 'Added booking revenue',
    detail: '780 bookings at $287 each.',
    value: 224000,
  },
]

function scopedKpis(base: KpiMetric[], scope: ScopeKpis, label: string): KpiMetric[] {
  return base.map((metric) => {
    if (metric.id === 'total-rev') {
      return {
        ...metric,
        value: scope.revenue,
        raw: scope.revenueRaw,
        comparisons: { ...metric.comparisons, qoq: scope.revenueVsPrior },
        tooltip: `${metric.tooltip} Scoped to ${label}.`,
      }
    }
    if (metric.id === 'direct-rev') {
      return {
        ...metric,
        value: scope.directRevenue,
        comparisons: { ...metric.comparisons, qoq: scope.directVsPrior },
        share: metric.share
          ? {
              ...metric.share,
              value: scope.directShare,
              comparisons: { ...metric.share.comparisons, qoq: scope.directVsPrior },
            }
          : undefined,
        tooltip: `${metric.tooltip} Scoped to ${label}.`,
      }
    }
    if (metric.id === 'parity-win') {
      return {
        ...metric,
        value: scope.parityWin,
        comparisons: { ...metric.comparisons, qoq: scope.parityWinVsPrior },
        tooltip: `${metric.tooltip} Scoped to ${label}.`,
      }
    }
    if (metric.id === 'conversion') {
      return {
        ...metric,
        value: scope.conversion,
        comparisons: { ...metric.comparisons, qoq: scope.conversionVsPrior },
        tooltip: `${metric.tooltip} Scoped to ${label}.`,
      }
    }
    if (metric.id === 'rn' || metric.id === 'room-nights') {
      return {
        ...metric,
        value: scope.roomNights,
        raw: scope.roomNightsRaw,
        comparisons: { ...metric.comparisons, qoq: scope.roomNightsVsPrior },
        tooltip: `${metric.tooltip} Scoped to ${label}.`,
      }
    }
    return metric
  })
}

function OnlineRevenueCard() {
  const { compareWith } = useReport()
  const total = onlineRevenue.reduce((sum, row) => sum + row.amount, 0)
  const pieData = onlineRevenue.map((row) => ({ name: row.name, value: row.share, color: row.color }))
  const showQoq = compareWith === 'previous' || compareWith === 'both'
  const showYoy = compareWith === 'ly' || compareWith === 'both'
  const showCompare = showQoq || showYoy

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#eceef2] bg-white p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-navy">Online revenue</h3>
        <p className="text-xs text-navy-muted">Direct, indirect, and GDS</p>
      </div>

      <div className="relative mx-auto h-[180px] w-full max-w-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={2}
              stroke={chartColors.white}
              strokeWidth={3}
            >
              {pieData.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-muted">Total</p>
          <p className="text-xl font-semibold tabular text-navy">{formatCurrency(total, true)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[#f0f1f3] pt-4">
        {onlineRevenue.map((row) => (
          <div key={row.name}>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-navy">
              <span className="h-2 w-2 rounded-full" style={{ background: row.color }} />
              {row.name}
            </p>
            <p className="mt-1 text-base font-semibold tabular text-navy">{row.amountLabel}</p>
            <p className="text-[11px] text-navy-muted">{row.share.toFixed(1)}%</p>
            {showCompare && (
              <div className="mt-1.5 space-y-0.5">
                {showQoq && (
                  <div className="flex items-center gap-1 text-[10px] text-navy-muted">
                    <span>QoQ</span>
                    <TrendIndicator value={row.qoq} kind="pct" />
                  </div>
                )}
                {showYoy && (
                  <div className="flex items-center gap-1 text-[10px] text-navy-muted">
                    <span>YoY</span>
                    <TrendIndicator value={row.yoy} kind="pct" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </article>
  )
}

function RevenueOpportunitiesCard() {
  const combined = revenueOpportunities.reduce((sum, row) => sum + row.value, 0)

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[#eceef2] bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-navy">Revenue opportunities</h3>
        <p className="text-xs text-navy-muted">This quarter</p>
      </div>

      <ul className="flex-1 space-y-0 divide-y divide-[#f0f1f3]">
        {revenueOpportunities.map((row) => (
          <li key={row.title} className="flex items-start justify-between gap-4 py-3 first:pt-0">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-navy">{row.title}</p>
              <p className="mt-0.5 text-xs text-navy-muted">{row.kind}</p>
              <p className="mt-0.5 text-[11px] leading-4 text-navy-muted/80">{row.detail}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold tabular text-navy">{formatCurrency(row.value, true)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center justify-between border-t border-[#eceef2] pt-3">
        <p className="text-sm font-semibold text-navy">Combined</p>
        <p className="text-base font-semibold tabular text-navy">{formatCurrency(combined, true)}</p>
      </div>
    </article>
  )
}

export function ExecutiveSummary() {
  const { isHotelier } = useAuth()
  const {
    isSupply,
    isFullStack,
    isInternal,
    narrative,
    setNarrative,
    scopeLevel,
    maxScopeLevel,
    activeScopeLabel,
    activeScopeKpis,
    visibleBrands,
    visibleProperties,
    openProperty,
    goToScope,
    canDrillScope,
    selectedBrandId,
    shouldShowModule,
    periodLabel,
  } = useReport()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(narrative)
  const [narrativeOpen, setNarrativeOpen] = useState(true)

  const baseKpis = (isSupply ? supplyKpis : demandKpis)
    .filter((k) => isFullStack || !k.fullStackOnly)
    .filter((k) => {
      if (k.id === 'content-score') return shouldShowModule('content-score')
      if (k.id === 'ai-visibility') return shouldShowModule('ai-visibility')
      return true
    })
  const showDrill = canDrillScope && isSupply
  const kpis = useMemo(
    () => (showDrill ? scopedKpis(baseKpis, activeScopeKpis, activeScopeLabel) : baseKpis),
    [showDrill, baseKpis, activeScopeKpis, activeScopeLabel],
  )

  const propertyColumns: Column<HierarchyProperty>[] = [
    {
      key: 'name',
      header: 'Property',
      render: (r) => (
        <button type="button" className="text-left font-semibold text-rg-blue hover:underline" onClick={() => openProperty(r.id)}>
          {r.name}
        </button>
      ),
    },
    { key: 'city', header: 'City', render: (r) => r.city },
    { key: 'rev', header: 'Revenue', align: 'right', render: (r) => r.kpis.revenue },
    { key: 'direct', header: 'Direct share', align: 'right', render: (r) => r.kpis.directShare },
    {
      key: 'vs',
      header: 'Vs prior',
      align: 'right',
      render: (r) => <TrendIndicator value={r.kpis.revenueVsPrior} kind="pct" />,
    },
    { key: 'parity', header: 'Parity win', align: 'right', render: (r) => r.kpis.parityWin },
  ]

  const canGoChain = maxScopeLevel === 'chain'
  const canGoBrand = maxScopeLevel === 'chain' || maxScopeLevel === 'brand'
  const activeBrandName = visibleBrands.find((b) => b.id === selectedBrandId)?.name

  return (
    <section>
      <SectionHeader
        id="scorecard"
        moduleId="scorecard"
        title="Executive summary"
        description={`${periodLabel}. Currency USD. Headline mix, opportunity upside, and the KPIs that drive the partner review.`}
      />

      {showDrill && (
        <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs" aria-label="Scope breadcrumb">
          {canGoChain ? (
            <button
              type="button"
              className={`font-semibold ${scopeLevel === 'chain' ? 'text-navy' : 'text-rg-blue hover:underline'}`}
              onClick={() => goToScope('chain')}
            >
              {chainHierarchy.name}
            </button>
          ) : (
            <span className="font-semibold text-navy-muted">{chainHierarchy.name}</span>
          )}
          {(scopeLevel === 'brand' || scopeLevel === 'property') && activeBrandName && (
            <>
              <ChevronRight size={12} className="text-navy-muted" />
              {canGoBrand ? (
                <button
                  type="button"
                  className={`font-semibold ${scopeLevel === 'brand' ? 'text-navy' : 'text-rg-blue hover:underline'}`}
                  onClick={() => goToScope('brand')}
                >
                  {activeBrandName}
                </button>
              ) : (
                <span className="font-semibold text-navy">{activeBrandName}</span>
              )}
            </>
          )}
          {scopeLevel === 'property' && (
            <>
              <ChevronRight size={12} className="text-navy-muted" />
              <span className="font-semibold text-navy">{activeScopeLabel}</span>
            </>
          )}
          <span className="ml-2 rounded-full bg-rg-blue-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rg-blue">
            {scopeLevel} view
          </span>
        </nav>
      )}

      <div className="scroll-x-hover mb-4 pb-1">
        <div className="flex w-max min-w-full gap-3">
          {kpis.map((metric) => (
            <div key={metric.id} className="w-[220px] shrink-0">
              <KpiCard metric={metric} />
            </div>
          ))}
        </div>
      </div>

      {isSupply && isFullStack && (
        <div className="mb-4 grid grid-cols-2 items-stretch gap-3">
          <OnlineRevenueCard />
          <RevenueOpportunitiesCard />
        </div>
      )}

      {showDrill && scopeLevel === 'brand' && (
        <div className="mt-4">
          <DataTable title="Properties in this brand" columns={propertyColumns} rows={visibleProperties} rowKey={(r) => r.id} />
        </div>
      )}

      {showDrill && scopeLevel === 'property' && (
        <p className="mt-4 rounded-xl border border-line bg-white px-4 py-3 text-sm text-navy-muted">
          You are viewing <span className="font-semibold text-navy">{activeScopeLabel}</span>
          {isHotelier ? '. This is the deepest level for your hotelier access.' : '. Use the breadcrumb to move back up.'}
        </p>
      )}

      <div className="mt-4 overflow-hidden rounded-2xl bg-ai-soft">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left hover:bg-white/40"
          onClick={() => setNarrativeOpen((v) => !v)}
          aria-expanded={narrativeOpen}
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ai">
              <Sparkles size={12} />
              AI-generated
            </span>
            <span className="text-sm font-semibold text-navy">Executive narrative</span>
            <CustomerVisibleBadge visible />
          </div>
          <div className="flex items-center gap-2">
            {isInternal && (
              <GhostButton
                onClick={(e) => {
                  e.stopPropagation()
                  setDraft(narrative)
                  setEditing(true)
                }}
              >
                <Pencil size={13} />
                Edit
              </GhostButton>
            )}
            <GhostButton
              onClick={(e) => {
                e.stopPropagation()
                document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Link2 size={13} />
              Supporting data
            </GhostButton>
            <ChevronDown
              size={16}
              className={`text-navy-muted transition-transform ${narrativeOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>
        {narrativeOpen && (
          <div className="border-t border-ai/10 px-5 py-4 text-sm leading-6 text-navy">{narrative}</div>
        )}
      </div>

      <ConfirmModal
        open={editing}
        title="Edit executive narrative"
        onClose={() => setEditing(false)}
        footer={
          <>
            <SecondaryButton onClick={() => setEditing(false)}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                setNarrative(draft)
                setEditing(false)
              }}
            >
              Save narrative
            </PrimaryButton>
          </>
        }
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={6}
          className="w-full rounded-lg border border-line p-3 text-sm text-navy"
        />
      </ConfirmModal>
    </section>
  )
}
