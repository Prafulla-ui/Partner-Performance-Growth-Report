import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency, formatNumber } from '../lib/format'
import type { ChartMetric } from '../types'

interface Point {
  month: string
  current: number
  previous: number
  ly: number
}

function formatAxis(value: number, metric: ChartMetric) {
  if (metric === 'revenue') return formatCurrency(value, true)
  if (metric === 'adr') return `$${value}`
  return formatNumber(value)
}

function TrendTooltip({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean
  payload?: { name: string; value: number; color: string }[]
  label?: string
  metric: ChartMetric
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-white/95 px-3 py-2.5 shadow-[var(--shadow-card-hover)] backdrop-blur">
      <p className="mb-1.5 text-xs font-semibold text-navy">{label}</p>
      <ul className="space-y-1">
        {payload.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-6 text-xs">
            <span className="inline-flex items-center gap-1.5 text-navy-muted">
              <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
              {item.name}
            </span>
            <span className="font-semibold tabular text-navy">{formatAxis(item.value, metric)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function MonthlyTrendChart({
  data,
  metric,
  showPrevious,
  showLy,
}: {
  data: Point[]
  metric: ChartMetric
  showPrevious: boolean
  showLy: boolean
}) {
  return (
    <div className="h-full min-h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="trendCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E8EEF6" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#4A5B70', fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={64}
            tick={{ fill: '#4A5B70', fontSize: 11 }}
            tickFormatter={(v: number) => formatAxis(v, metric)}
          />
          <Tooltip content={<TrendTooltip metric={metric} />} cursor={{ stroke: '#1B4F9C', strokeDasharray: '4 4' }} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: 12, color: '#4A5B70', paddingBottom: 8 }}
          />
          {showPrevious && (
            <Line
              type="monotone"
              dataKey="previous"
              name="Previous period"
              stroke="#94A3B8"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
          {showLy && (
            <Line
              type="monotone"
              dataKey="ly"
              name="Same period last year"
              stroke="#0F766E"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
          <Area
            type="monotone"
            dataKey="current"
            name="Current period"
            stroke="#1B4F9C"
            strokeWidth={2.5}
            fill="url(#trendCurrent)"
            dot={{ r: 3.5, fill: '#1B4F9C', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 5 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
