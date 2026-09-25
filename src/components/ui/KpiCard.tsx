import {
  BadgeDollarSign,
  Banknote,
  BedDouble,
  BookmarkCheck,
  CircleDollarSign,
  Clock,
  Eye,
  FileText,
  Globe,
  Hotel,
  MousePointerClick,
  Percent,
  Scale,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { insightForKpi } from '../../data/kpiInsights'
import { useReport } from '../../context/ReportContext'
import type { KpiMetric } from '../../types'
import { KpiInsightNudge } from './KpiInsightNudge'
import { MetricTooltip } from './MetricTooltip'
import { TrendIndicator } from './TrendIndicator'

const icons: Record<string, LucideIcon> = {
  'total-rev': CircleDollarSign,
  'direct-rev': Globe,
  'content-score': FileText,
  'ai-visibility': Sparkles,
  'indirect-rev': Hotel,
  'ota-comm': Percent,
  'parity-win': Scale,
  conversion: MousePointerClick,
  'parity-leak': Eye,
  'partner-bookings': BookmarkCheck,
  'partner-rev': Wallet,
  'room-nights': BedDouble,
  coverage: Hotel,
  'look-book': Search,
  cancel: Clock,
  lead: Clock,
  incremental: TrendingUp,
  res: BookmarkCheck,
  rn: BedDouble,
  drev: CircleDollarSign,
  adr: BadgeDollarSign,
  abv: Banknote,
  leadtime: Clock,
  cx: Clock,
  sessions: Users,
  'org-sess': Search,
  kw: FileText,
  dr: Scale,
  'org-book': BookmarkCheck,
  'paid-spend': Banknote,
  'paid-rev': CircleDollarSign,
  roas: TrendingUp,
}

export function KpiCard({ metric }: { metric: KpiMetric }) {
  const { compareWith, previousCompareName, lyCompareName } = useReport()
  const invert = metric.id === 'cx' || metric.id === 'cancel' || metric.id === 'parity-leak' || metric.id === 'ota-comm'
  const Icon = icons[metric.id] ?? CircleDollarSign
  const insight = insightForKpi(metric.id)
  const showCompare = compareWith === 'previous' || compareWith === 'both' || compareWith === 'ly'

  return (
    <article className="relative flex h-full min-h-[108px] flex-col overflow-visible rounded-xl border border-[#eceef2] bg-white px-3.5 py-3">
      <div className="flex items-start gap-1.5">
        <h3 className="min-w-0 flex-1 text-[10px] font-semibold uppercase leading-snug tracking-[0.06em] text-navy-muted">
          {metric.label}
        </h3>
        <div className="flex shrink-0 items-center gap-1">
          <MetricTooltip text={metric.tooltip} />
          {insight && <KpiInsightNudge insight={insight} />}
          <span className="text-slate-300">
            <Icon size={12} />
          </span>
        </div>
      </div>

      <p className="mt-2 text-[22px] font-semibold leading-none tracking-tight tabular text-navy">
        {metric.value}
      </p>

      <div className="mt-auto flex min-h-[18px] flex-col justify-end gap-0.5 pt-2">
        {metric.share && (
          <p className="truncate text-[11px] text-navy-muted">
            {metric.share.label}{' '}
            <span className="font-semibold tabular text-navy">{metric.share.value}</span>
          </p>
        )}
        {metric.estimate && !metric.share && (
          <p className="text-[10px] font-medium uppercase tracking-wide text-ai">Estimate</p>
        )}
        {showCompare && (compareWith === 'previous' || compareWith === 'both') && (
          <div className="flex items-center gap-1 text-[11px] text-navy-muted">
            <span>vs {previousCompareName}</span>
            <TrendIndicator value={metric.comparisons.qoq} kind={metric.comparisons.kind} invert={invert} />
          </div>
        )}
        {showCompare && (compareWith === 'ly' || compareWith === 'both') && (
          <div className="flex items-center gap-1 text-[11px] text-navy-muted">
            <span>vs {lyCompareName}</span>
            <TrendIndicator value={metric.comparisons.yoy} kind={metric.comparisons.kind} invert={invert} />
          </div>
        )}
      </div>
    </article>
  )
}
