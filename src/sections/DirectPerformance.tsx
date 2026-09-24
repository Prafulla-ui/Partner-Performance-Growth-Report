import { useState } from 'react'
import { ConversionFunnel } from '../components/ConversionFunnel'
import { MonthlyTrendChart } from '../components/MonthlyTrendChart'
import { InternalOnlyBadge } from '../components/ui/Badges'
import { ChartContainer } from '../components/ui/ChartContainer'
import { DataTable, type Column } from '../components/ui/DataTable'
import { EmptyState } from '../components/ui/EmptyState'
import { KpiCard } from '../components/ui/KpiCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { SegmentedControl } from '../components/ui/SegmentedControl'
import { SideDrawer } from '../components/ui/SideDrawer'
import { TrendIndicator } from '../components/ui/TrendIndicator'
import { useReport } from '../context/ReportContext'
import { attributionRows, bookingKpis, demandKpis, funnelStages, monthlyTrend } from '../data/grandMeridian'
import { formatCurrency, formatNumber } from '../lib/format'
import type { AttributionRow, ChartMetric, FunnelStage } from '../types'

const metricOptions: { value: ChartMetric; label: string }[] = [
  { value: 'revenue', label: 'Revenue' },
  { value: 'reservations', label: 'Reservations' },
  { value: 'roomNights', label: 'Room nights' },
  { value: 'adr', label: 'ADR' },
]

export function DirectPerformance() {
  const { isSupply, isInternal, chartMetric, setChartMetric, compareWith } = useReport()
  const kpis = isSupply ? bookingKpis : demandKpis
  const [stage, setStage] = useState<FunnelStage | null>(null)
  const series = monthlyTrend[chartMetric]
  const chartData = monthlyTrend.labels.map((month, i) => ({
    month,
    current: series.current[i],
    previous: series.previous[i],
    ly: series.ly[i],
  }))

  const columns: Column<AttributionRow>[] = [
    { key: 'source', header: 'Source', render: (r) => r.source },
    { key: 'sessions', header: 'Sessions', align: 'right', render: (r) => formatNumber(r.sessions) },
    { key: 'bookings', header: 'Bookings', align: 'right', render: (r) => formatNumber(r.bookings) },
    { key: 'revenue', header: 'Revenue', align: 'right', render: (r) => formatCurrency(r.revenue, true) },
    { key: 'conv', header: 'Conversion rate', align: 'right', render: (r) => `${r.conversion.toFixed(2)}%` },
    {
      key: 'trend',
      header: 'Trend',
      align: 'right',
      render: (r) => <TrendIndicator value={r.trend} kind="pct" />,
    },
  ]

  if (isInternal) {
    columns.push(
      { key: 'type', header: 'Paid / organic', render: (r) => (
        <span className="inline-flex items-center gap-1">
          {r.type} <InternalOnlyBadge />
        </span>
      ) },
      { key: 'paid', header: 'Paid source', render: (r) => r.paidSource },
      { key: 'spend', header: 'Media spend', align: 'right', render: (r) => (r.spend == null ? '—' : formatCurrency(r.spend, true)) },
      { key: 'roas', header: 'ROAS', align: 'right', render: (r) => (r.roas == null ? '—' : `${r.roas.toFixed(1)}x`) },
    )
  }

  return (
    <section>
      <SectionHeader
        id="direct-performance"
        title={isSupply ? 'Direct channel performance' : 'Contribution performance'}
        description={
          isSupply
            ? 'Booking-engine production, conversion quality and traffic mix for the 12-property chain.'
            : 'How the demand partnership is producing bookings, room nights and conversion quality — not commission cost.'
        }
      />
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className={`mt-4 grid items-stretch gap-3 ${isSupply ? 'grid-cols-5' : 'grid-cols-1'}`}>
        <div className={isSupply ? 'col-span-3 h-full' : ''}>
          <ChartContainer
            title="Monthly trend"
            subtitle="Q2 2026 versus selected comparisons"
            action={<SegmentedControl value={chartMetric} onChange={setChartMetric} options={metricOptions} />}
          >
            <MonthlyTrendChart
              data={chartData}
              metric={chartMetric}
              showPrevious={compareWith !== 'ly'}
              showLy={compareWith !== 'previous'}
            />
          </ChartContainer>
        </div>
        {isSupply && (
          <div className="col-span-2 h-full">
            <ChartContainer title="Conversion funnel" subtitle="Click a stage for drop-off detail">
              <div className="flex h-full min-h-[360px] items-center justify-center">
                <ConversionFunnel stages={funnelStages} onSelect={setStage} />
              </div>
            </ChartContainer>
          </div>
        )}
      </div>

      {isSupply && <div className="mt-4">
        <div className="mb-2 flex justify-end">{isInternal && <InternalOnlyBadge />}</div>
        <DataTable title="Traffic and attribution" columns={columns} rows={attributionRows} rowKey={(r) => r.source} />
        {isInternal && (
          <div className="mt-3">
            <EmptyState kind="partial" compact />
          </div>
        )}
      </div>}

      <SideDrawer open={!!stage} title={stage?.label ?? 'Funnel stage'} onClose={() => setStage(null)}>
        {stage && (
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">Stage definition</p>
              <p className="mt-1 text-navy">{stage.definition}</p>
            </div>
            {stage.dropOff != null && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">Drop-off from previous stage</p>
                <p className="mt-1 text-lg font-semibold tabular text-navy">{stage.dropOff.toFixed(1)}%</p>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">Device split</p>
              <ul className="mt-2 space-y-1">
                {stage.deviceSplit.map((d) => (
                  <li key={d.device} className="flex justify-between">
                    <span>{d.device}</span>
                    <span className="tabular">{d.share}%</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">Top affected properties</p>
              <ul className="mt-2 space-y-1">
                {stage.properties.map((p) => (
                  <li key={p.name} className="flex justify-between">
                    <span>{p.name}</span>
                    <span className="tabular">{p.dropOff ? `${p.dropOff}% drop-off` : '—'}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-ai-soft p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ai">Suggested action</p>
              <p className="mt-1">{stage.action}</p>
            </div>
          </div>
        )}
      </SideDrawer>
    </section>
  )
}
