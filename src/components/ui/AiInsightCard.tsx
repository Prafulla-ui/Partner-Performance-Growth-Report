import { Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

export function AiInsightCard({
  title,
  children,
  actions,
  estimate,
}: {
  title: string
  children: ReactNode
  actions?: ReactNode
  estimate?: boolean
}) {
  return (
    <section className="rounded-2xl bg-ai-soft p-5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ai">
            <Sparkles size={12} />
            AI-generated
          </span>
          {estimate && (
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-teal">
              Estimate
            </span>
          )}
          <h3 className="text-sm font-semibold text-navy">{title}</h3>
        </div>
        {actions}
      </div>
      <div className="text-sm leading-6 text-navy">{children}</div>
    </section>
  )
}
