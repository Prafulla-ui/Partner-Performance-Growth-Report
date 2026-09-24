import { Link2, Pencil } from 'lucide-react'
import { useState } from 'react'
import { CustomerVisibleBadge } from '../components/ui/Badges'
import { GhostButton, PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { KpiCard } from '../components/ui/KpiCard'
import { SectionHeader } from '../components/ui/SectionHeader'
import { AiInsightCard } from '../components/ui/AiInsightCard'
import { useReport } from '../context/ReportContext'
import { demandKpis, supplyKpis } from '../data/grandMeridian'

export function ExecutiveSummary() {
  const { isSupply, isFullStack, isInternal, narrative, setNarrative } = useReport()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(narrative)
  const kpis = (isSupply ? supplyKpis : demandKpis).filter((k) => isFullStack || !k.fullStackOnly)

  return (
    <section>
      <SectionHeader
        id="scorecard"
        title="Performance snapshot"
        description={
          isSupply
            ? 'Headline results for the selected period, with movement versus the comparison you chose above.'
            : 'Headline contribution for the demand partnership, with movement versus the comparison you chose above.'
        }
      />
      <div className="grid grid-cols-4 gap-3">
        {kpis.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </div>
      <div className="mt-4">
        <AiInsightCard
          title="AI-generated narrative"
          estimate
          actions={
            <div className="flex items-center gap-2">
              <CustomerVisibleBadge visible />
              {isInternal && (
                <GhostButton
                  onClick={() => {
                    setDraft(narrative)
                    setEditing(true)
                  }}
                >
                  <Pencil size={13} />
                  Edit
                </GhostButton>
              )}
              <GhostButton
                onClick={() => document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Link2 size={13} />
                View supporting data
              </GhostButton>
            </div>
          }
        >
          {narrative}
        </AiInsightCard>
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
