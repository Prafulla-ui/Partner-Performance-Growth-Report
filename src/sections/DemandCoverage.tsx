import { DataTable, type Column } from '../components/ui/DataTable'
import { SectionHeader } from '../components/ui/SectionHeader'
import { formatCurrency, formatNumber } from '../lib/format'

const coverage = [
  { market: 'Dubai', properties: 2, bookings: 1680, nights: 4120, revenue: 548000, incremental: 112000 },
  { market: 'Singapore', properties: 2, bookings: 1420, nights: 3360, revenue: 462000, incremental: 86000 },
  { market: 'Bangkok', properties: 2, bookings: 980, nights: 2410, revenue: 248000, incremental: 41000 },
  { market: 'Mumbai / Delhi', properties: 3, bookings: 1260, nights: 2890, revenue: 268000, incremental: 47000 },
  { market: 'Other APMEA', properties: 3, bookings: 800, nights: 2040, revenue: 154000, incremental: 26000 },
]

export function DemandCoverage() {
  const columns: Column<(typeof coverage)[number]>[] = [
    { key: 'm', header: 'Market', render: (r) => r.market },
    { key: 'p', header: 'Properties covered', align: 'right', render: (r) => `${r.properties}` },
    { key: 'b', header: 'Bookings', align: 'right', render: (r) => formatNumber(r.bookings) },
    { key: 'n', header: 'Room nights', align: 'right', render: (r) => formatNumber(r.nights) },
    { key: 'r', header: 'Revenue', align: 'right', render: (r) => formatCurrency(r.revenue, true) },
    { key: 'i', header: 'Est. incremental', align: 'right', render: (r) => (
      <span>
        {formatCurrency(r.incremental, true)}{' '}
        <span className="text-[10px] font-semibold uppercase tracking-wide text-ai">Est.</span>
      </span>
    ) },
  ]

  return (
    <section>
      <SectionHeader
        id="indirect-channels"
        title="Market and property coverage"
        description="Live production across the 12-property chain. Coverage is complete; incremental demand is strongest in Dubai and Singapore."
      />
      <DataTable title="Market coverage" columns={columns} rows={coverage} rowKey={(r) => r.market} />
    </section>
  )
}
