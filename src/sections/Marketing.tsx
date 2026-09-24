import { OrganicSessionsChart, PaidSpendRevenueChart } from '../components/ChannelCharts'
import { InternalOnlyBadge } from '../components/ui/Badges'
import { ChartContainer } from '../components/ui/ChartContainer'
import { DataTable, type Column } from '../components/ui/DataTable'
import { EmptyState } from '../components/ui/EmptyState'
import { KpiCard } from '../components/ui/KpiCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { useReport } from '../context/ReportContext'
import { campaigns, marketingKpis, organicTrend, paidTrend } from '../data/grandMeridian'
import { formatCurrency, formatNumber } from '../lib/format'
import type { CampaignRow } from '../types'

export function Marketing() {
  const { isInternal } = useReport()
  const kpis = marketingKpis.filter((k) => isInternal || !k.internalOnly)

  const columns: Column<CampaignRow>[] = [
    { key: 'name', header: 'Campaign', render: (r) => r.name },
    { key: 'book', header: 'Bookings', align: 'right', render: (r) => formatNumber(r.bookings) },
    { key: 'rev', header: 'Revenue', align: 'right', render: (r) => formatCurrency(r.revenue, true) },
  ]
  if (isInternal) {
    columns.splice(1, 0, { key: 'spend', header: 'Spend', align: 'right', render: (r) => formatCurrency(r.spend, true) })
    columns.push({ key: 'roas', header: 'ROAS', align: 'right', render: (r) => `${r.roas.toFixed(1)}x` })
  }

  return (
    <section>
      <SectionHeader
        id="marketing"
        title="Digital marketing and SEO"
        description="Organic quality is compounding. Paid media is still efficient, led by Brand-Protect-SEM."
        action={isInternal ? <InternalOnlyBadge /> : undefined}
      />
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <ChartContainer title="Organic traffic trend" subtitle="Sessions from unpaid search">
          <OrganicSessionsChart data={organicTrend} />
        </ChartContainer>
        <ChartContainer
          title="Paid spend versus revenue"
          subtitle={isInternal ? 'Internal media cost versus attributed revenue' : 'Attributed paid-media revenue'}
        >
          <PaidSpendRevenueChart data={paidTrend} showSpend={isInternal} />
        </ChartContainer>
      </div>
      <div className="mt-4">
        <DataTable title="Campaign performance" columns={columns} rows={campaigns} rowKey={(r) => r.name} />
      </div>
      {isInternal && (
        <div className="mt-3">
          <EmptyState kind="integration" compact />
        </div>
      )}
    </section>
  )
}
