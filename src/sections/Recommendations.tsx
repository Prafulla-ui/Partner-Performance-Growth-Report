import { RecommendationCard } from '../components/ui/RecommendationCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { useReport } from '../context/ReportContext'
import { formatCurrency } from '../lib/format'

export function Recommendations() {
  const { recommendations, isInternal, isSupply } = useReport()
  const visible = isInternal
    ? recommendations
    : recommendations.filter((r) => r.customerVisible && r.status === 'accepted')
  const upside = visible.reduce((sum, r) => sum + r.impactValue, 0)

  return (
    <section>
      <SectionHeader
        id="recommendations"
        title="Growth recommendations"
        description={
          isSupply
            ? 'Ranked by estimated recoverable value. Account managers review, edit and approve before the partner meeting.'
            : 'Joint growth actions that expand production quality and incremental demand — not cost-cutting on the partner.'
        }
      />
      <article className="mb-4 rounded-2xl border border-ai/20 bg-gradient-to-r from-ai-soft via-white to-teal-soft p-6 shadow-[var(--shadow-card)]">
        <p className="text-xs font-semibold uppercase tracking-wide text-ai">Combined estimated upside</p>
        <p className="mt-1 text-3xl font-semibold tabular text-navy">{formatCurrency(upside, true)} next quarter</p>
        <p className="mt-1 text-sm text-navy-muted">
          All impact values are estimates based on current volumes and stated assumptions. They are not booked revenue.
        </p>
      </article>
      <div className="space-y-3">
        {visible.map((rec) => (
          <RecommendationCard key={rec.id} rec={rec} />
        ))}
      </div>
    </section>
  )
}
