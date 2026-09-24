import { ChevronDown, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useReport } from '../../context/ReportContext'
import { owners } from '../../data/grandMeridian'
import type { RecPriority, RecStatus, Recommendation } from '../../types'
import { CustomerVisibleBadge } from './Badges'
import { GhostButton, SecondaryButton } from './Buttons'
import { PriorityBadge, RecStatusBadge } from './StatusBadge'

export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const { isInternal, updateRecommendation } = useReport()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(rec.title)

  return (
    <article className="surface-card rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rg-blue to-rg-blue-bright text-sm font-semibold text-white shadow-sm">
          {rec.rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {editing ? (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-8 flex-1 rounded-md border border-line px-2 text-sm"
              />
            ) : (
              <h3 className="text-sm font-semibold text-navy">{rec.title}</h3>
            )}
            <PriorityBadge priority={rec.priority} />
            <RecStatusBadge status={rec.status} />
            <CustomerVisibleBadge visible={rec.customerVisible} />
          </div>
          <p className="mt-2 text-sm text-navy-muted">{rec.evidence}</p>
          <div className="mt-3 grid grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-navy-muted">Estimated impact</p>
              <p className="mt-0.5 font-semibold text-navy">{rec.impact}</p>
              <p className="text-[11px] uppercase tracking-wide text-ai">Estimate</p>
            </div>
            <div>
              <p className="text-navy-muted">Impact confidence</p>
              <p className="mt-0.5 font-semibold text-navy">{rec.confidence}</p>
            </div>
            <div>
              <p className="text-navy-muted">Suggested owner</p>
              {isInternal ? (
                <select
                  value={rec.owner}
                  onChange={(e) => updateRecommendation(rec.id, { owner: e.target.value })}
                  className="mt-0.5 w-full rounded-md border border-line bg-white px-1.5 py-1 text-xs text-navy"
                >
                  {[rec.owner, ...owners.filter((o) => o !== rec.owner)].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <p className="mt-0.5 font-semibold text-navy">{rec.owner}</p>
              )}
            </div>
            <div>
              <p className="text-navy-muted">Priority</p>
              {isInternal ? (
                <select
                  value={rec.priority}
                  onChange={(e) => updateRecommendation(rec.id, { priority: e.target.value as RecPriority })}
                  className="mt-0.5 w-full rounded-md border border-line bg-white px-1.5 py-1 text-xs text-navy"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              ) : (
                <p className="mt-0.5 font-semibold capitalize text-navy">{rec.priority}</p>
              )}
            </div>
          </div>
          {open && (
            <div className="mt-4 rounded-lg bg-canvas p-3 text-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">Calculation assumptions</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-navy">
                {rec.assumptions.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-navy-muted">Source metrics</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-navy">
                {rec.sources.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <GhostButton onClick={() => setOpen((v) => !v)}>
              <ChevronDown size={14} className={open ? 'rotate-180' : ''} />
              {open ? 'Hide details' : 'Expand details'}
            </GhostButton>
            {isInternal && (
              <>
                {editing ? (
                  <SecondaryButton
                    onClick={() => {
                      updateRecommendation(rec.id, { title })
                      setEditing(false)
                    }}
                  >
                    Save title
                  </SecondaryButton>
                ) : (
                  <GhostButton onClick={() => setEditing(true)}>
                    <Pencil size={13} />
                    Edit
                  </GhostButton>
                )}
                <GhostButton onClick={() => updateRecommendation(rec.id, { status: 'accepted' as RecStatus })}>
                  Accept
                </GhostButton>
                <GhostButton onClick={() => updateRecommendation(rec.id, { status: 'deferred' })}>Defer</GhostButton>
                <GhostButton onClick={() => updateRecommendation(rec.id, { status: 'rejected' })}>Reject</GhostButton>
                <label className="ml-auto flex items-center gap-2 text-xs text-navy">
                  <input
                    type="checkbox"
                    checked={rec.customerVisible}
                    onChange={(e) => updateRecommendation(rec.id, { customerVisible: e.target.checked })}
                  />
                  Mark as customer-visible
                </label>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
