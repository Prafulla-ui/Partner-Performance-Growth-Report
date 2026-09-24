import type { ReactNode } from 'react'

export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  action,
}: {
  id: string
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-36 mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-rg-blue">{eyebrow}</p>}
        <h2 className="text-[22px] font-semibold tracking-tight text-navy">{title}</h2>
        {description && <p className="mt-1 max-w-3xl text-sm text-navy-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
