import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency, formatNumber } from '../lib/format'
import type { ChannelRow } from '../types'

interface MixItem {
  name: string
  value: number
  color: string
}

function MixTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean
  payload?: { name: string; value: number; payload: MixItem }[]
  unit: string
}) {
  if (!active || !payload?.[0]) return null
  const item = payload[0]
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 text-xs shadow-[var(--shadow-card-hover)]">
      <p className="font-semibold text-navy">{item.name}</p>
      <p className="mt-0.5 tabular text-navy-muted">
        {item.value}% {unit}
      </p>
    </div>
  )
}

export function ChannelMixChart({
  data,
  centerLabel = 'All channels',
  centerValue = '100%',
  unit = 'of room revenue',
}: {
  data: MixItem[]
  centerLabel?: string
  centerValue?: string
  unit?: string
}) {
  return (
    <div className="flex h-full min-h-64 w-full items-center gap-4">
      <div className="relative h-full min-w-0 flex-1">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={3}
              stroke="#fff"
              strokeWidth={3}
            >
              {data.map((c) => (
                <Cell key={c.name} fill={c.color} />
              ))}
            </Pie>
            <Tooltip content={<MixTooltip unit={unit} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[11px] font-semibold text-navy-muted">{centerLabel}</p>
          <p className="text-lg font-semibold tabular text-navy">{centerValue}</p>
        </div>
      </div>
      <ul className="w-44 shrink-0 space-y-2.5">
        {data.map((c) => (
          <li key={c.name} className="flex items-center justify-between gap-2 text-xs">
            <span className="inline-flex items-center gap-2 text-navy">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />
              {c.name}
            </span>
            <span className="font-semibold tabular">{c.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2.5 shadow-[var(--shadow-card-hover)]">
      <p className="mb-1.5 text-xs font-semibold text-navy">{label}</p>
      <ul className="space-y-1">
        {payload.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-6 text-xs">
            <span className="inline-flex items-center gap-1.5 text-navy-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
              {item.name}
            </span>
            <span className="font-semibold tabular text-navy">{formatCurrency(item.value, true)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const shortName: Record<string, string> = {
  'Booking.com': 'Booking',
  'Expedia Group': 'Expedia',
  Agoda: 'Agoda',
  'Trip.com': 'Trip.com',
  'GDS / Wholesale': 'GDS',
}

export function RevenueCommissionChart({ rows }: { rows: ChannelRow[] }) {
  const data = rows.map((r) => ({
    ...r,
    label: shortName[r.channel] ?? r.channel,
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} barCategoryGap="22%" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1B4F9C" />
            </linearGradient>
            <linearGradient id="commBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E8EEF6" vertical={false} />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#4A5B70', fontSize: 11, fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={52}
            tick={{ fill: '#4A5B70', fontSize: 11 }}
            tickFormatter={(v: number) => formatCurrency(v, true)}
          />
          <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgb(27 79 156 / 0.05)' }} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: '#4A5B70', paddingBottom: 6 }}
          />
          <Bar dataKey="revenue" name="Revenue" fill="url(#revBar)" radius={[6, 6, 0, 0]} maxBarSize={22} />
          <Bar dataKey="commission" name="Commission" fill="url(#commBar)" radius={[6, 6, 0, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PaidSpendRevenueChart({
  data,
  showSpend,
}: {
  data: { month: string; spend: number; revenue: number }[]
  showSpend: boolean
}) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={4} barCategoryGap="28%" margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="paidRevBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1B4F9C" />
            </linearGradient>
            <linearGradient id="paidSpendBar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E8EEF6" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4A5B70', fontSize: 12, fontWeight: 600 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={52}
            tick={{ fill: '#4A5B70', fontSize: 11 }}
            tickFormatter={(v: number) => formatCurrency(v, true)}
          />
          <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgb(27 79 156 / 0.05)' }} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: '#4A5B70', paddingBottom: 6 }}
          />
          {showSpend && (
            <Bar dataKey="spend" name="Spend" fill="url(#paidSpendBar)" radius={[6, 6, 0, 0]} maxBarSize={28} />
          )}
          <Bar dataKey="revenue" name="Revenue" fill="url(#paidRevBar)" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function SessionTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.[0]) return null
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 text-xs shadow-[var(--shadow-card-hover)]">
      <p className="font-semibold text-navy">{label}</p>
      <p className="mt-0.5 tabular text-navy-muted">{formatNumber(payload[0].value)} sessions</p>
    </div>
  )
}

export function OrganicSessionsChart({ data }: { data: { month: string; sessions: number }[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="orgFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E8EEF6" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#4A5B70', fontSize: 12, fontWeight: 600 }} />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={48}
            tick={{ fill: '#4A5B70', fontSize: 11 }}
            tickFormatter={(v: number) => formatNumber(v)}
          />
          <Tooltip content={<SessionTooltip />} cursor={{ stroke: '#1B4F9C', strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="sessions"
            name="Organic sessions"
            stroke="#1B4F9C"
            strokeWidth={2.5}
            fill="url(#orgFill)"
            dot={{ r: 3.5, fill: '#1B4F9C', stroke: '#fff', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
