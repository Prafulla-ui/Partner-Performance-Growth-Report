import type { ReactNode } from 'react'
import { useReport } from '../../context/ReportContext'
import type { ReportModuleId } from '../../types'
import { NotSharedBadge } from './Badges'

export function SectionHeader({
  id,
  moduleId,
  eyebrow,
  title,
  description,
  action,
}: {
  id: string
  moduleId?: ReportModuleId
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}) {
  const { isInternal, isModuleShared } = useReport()
  const showNotShared = Boolean(moduleId && isInternal && !isModuleShared(moduleId))

  return (
    <div id={id} className="scroll-mt-36 mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-rg-blue">{eyebrow}</p>}
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-semibold tracking-tight text-navy">{title}</h2>
          {showNotShared && <NotSharedBadge />}
        </div>
        {description && <p className="mt-1 max-w-3xl text-sm text-navy-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}
