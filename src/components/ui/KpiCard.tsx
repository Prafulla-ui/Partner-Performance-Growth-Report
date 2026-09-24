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
import { useReport } from '../../context/ReportContext'
import type { KpiMetric } from '../../types'
import { MetricTooltip } from './MetricTooltip'
import { TrendIndicator } from './TrendIndicator'

const icons: Record<string, LucideIcon> = {
  'total-rev': CircleDollarSign,
  'direct-rev': Globe,
  'content-score': FileText,
  'ai-vision': Sparkles,
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

  return (
    <article className="surface-card rounded-2xl p-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rg-blue to-rg-blue-bright text-white shadow-sm">
          <Icon size={15} />
        </span>
        <h3 className="text-xs font-semibold text-navy-muted">{metric.label}</h3>
        <MetricTooltip text={metric.tooltip} />
      </div>
      <p className="text-[26px] font-semibold tracking-tight tabular text-navy">{metric.value}</p>
      {(metric.id === 'content-score' || metric.id === 'ai-vision') && metric.raw != null && (
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas">
          <div className="h-full rounded-full bg-warning" style={{ width: `${metric.raw}%` }} />
        </div>
      )}
      {metric.share && (
        <div className="mt-2 rounded-xl bg-slate-50 px-2.5 py-2 ring-1 ring-line/70">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] text-navy-muted">
              {metric.share.label}
              <MetricTooltip text={metric.share.tooltip} />
            </span>
            <span className="text-sm font-semibold tabular text-navy">{metric.share.value}</span>
          </div>
        </div>
      )}
      {metric.estimate && <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-ai">Estimate</p>}
      <div className="mt-2 flex flex-col gap-1">
        {compareWith !== 'ly' && (
          <div className="flex items-center gap-1.5 text-[11px] text-navy-muted">
            <span>vs {previousCompareName}</span>
            <TrendIndicator value={metric.comparisons.qoq} kind={metric.comparisons.kind} invert={invert} />
          </div>
        )}
        {compareWith !== 'previous' && (
          <div className="flex items-center gap-1.5 text-[11px] text-navy-muted">
            <span>vs {lyCompareName}</span>
            <TrendIndicator value={metric.comparisons.yoy} kind={metric.comparisons.kind} invert={invert} />
          </div>
        )}
      </div>
    </article>
  )
}
