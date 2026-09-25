import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { RevenueCommissionChart } from '../components/ChannelCharts'
import { GhostButton } from '../components/ui/Buttons'
import { ChartContainer } from '../components/ui/ChartContainer'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { DataTable, type Column } from '../components/ui/DataTable'
import { SectionHeader } from '../components/ui/SectionHeader'
import { SideDrawer } from '../components/ui/SideDrawer'
import { TrendIndicator } from '../components/ui/TrendIndicator'
import { channelRows, propertyProduction } from '../data/grandMeridian'
import { formatCurrency, formatNumber } from '../lib/format'
import type { ChannelRow } from '../types'

export function IndirectChannels() {
  const [propertyOpen, setPropertyOpen] = useState(false)
  const [dashOpen, setDashOpen] = useState(false)

  const columns: Column<ChannelRow>[] = [
    { key: 'ch', header: 'Channel', render: (r) => r.channel },
    { key: 'rn', header: 'Room nights', align: 'right', render: (r) => formatNumber(r.roomNights) },
    { key: 'rev', header: 'Revenue', align: 'right', render: (r) => formatCurrency(r.revenue, true) },
    { key: 'share', header: 'Revenue share', align: 'right', render: (r) => `${r.share.toFixed(1)}%` },
    { key: 'cp', header: 'Commission %', align: 'right', render: (r) => `${r.commissionPct}%` },
    { key: 'ca', header: 'Commission amount', align: 'right', render: (r) => formatCurrency(r.commission, true) },
    { key: 'ly', header: 'Revenue vs last year', align: 'right', render: (r) => <TrendIndicator value={r.vsLy} kind="pct" /> },
    { key: 'cx', header: 'Cancellation rate', align: 'right', render: (r) => `${r.cancelRate.toFixed(1)}%` },
    { key: 'lt', header: 'Average lead time', align: 'right', render: (r) => `${r.leadTime} days` },
  ]

  return (
    <section>
      <SectionHeader
        id="indirect-channels"
        moduleId="indirect"
        title="Indirect channel performance"
        description="OTA and wholesale production alongside commission. Use this to decide where mix, not just cost, should move."
        action={
          <GhostButton onClick={() => setDashOpen(true)}>
            <ExternalLink size={14} />
            Open source dashboard
          </GhostButton>
        }
      />

      <div className="mb-3 grid grid-cols-3 gap-3">
        <article className="surface-card rounded-2xl p-4">
          <p className="text-xs text-navy-muted">Total indirect revenue</p>
          <p className="mt-1 text-2xl font-semibold tabular">$2.53M</p>
        </article>
        <article className="surface-card rounded-2xl p-4">
          <p className="text-xs text-navy-muted">Total commission</p>
          <p className="mt-1 text-2xl font-semibold tabular">$455K</p>
          <p className="text-[11px] uppercase tracking-wide text-ai">Estimate</p>
        </article>
        <article className="surface-card rounded-2xl p-4">
          <p className="text-xs text-navy-muted">OTA revenue share</p>
          <p className="mt-1 text-2xl font-semibold tabular">37.1%</p>
        </article>
      </div>

      <DataTable title="Channel production" columns={columns} rows={channelRows} rowKey={(r) => r.channel} />
      <div className="mt-2 flex justify-end">
        <GhostButton onClick={() => setPropertyOpen(true)}>Property drill-down</GhostButton>
      </div>

      <div className="mt-4">
        <ChartContainer title="Revenue versus commission" subtitle="Where production is expensive relative to yield">
          <RevenueCommissionChart rows={channelRows} />
        </ChartContainer>
      </div>

      <SideDrawer open={propertyOpen} title="Property production" onClose={() => setPropertyOpen(false)}>
        <p className="mb-3 text-sm text-navy-muted">Top properties contributing to indirect production this quarter.</p>
        <ul className="space-y-2 text-sm">
          {propertyProduction.map((p) => (
            <li key={p.property} className="rounded-lg border border-line p-3">
              <p className="font-semibold text-navy">{p.property}</p>
              <p className="mt-1 text-navy-muted">
                {formatNumber(p.nights)} nights · {formatCurrency(p.revenue, true)} · Lead channel {p.channel}
              </p>
            </li>
          ))}
        </ul>
      </SideDrawer>

      <ConfirmModal open={dashOpen} title="Open source dashboard" onClose={() => setDashOpen(false)}>
        <p className="text-sm text-navy-muted">
          In production this would deep-link to the channel-manager reporting module for Grand Meridian. This prototype
          keeps the jump in-app so the pitch can stay on one screen.
        </p>
      </ConfirmModal>
    </section>
  )
}
