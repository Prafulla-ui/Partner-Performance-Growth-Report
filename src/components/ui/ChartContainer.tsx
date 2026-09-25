import type { ReactNode } from 'react'

export function ChartContainer({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-[#eceef2] bg-white p-5">
      <div className="mb-4 flex shrink-0 items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold tracking-tight text-navy">{title}</h3>
          {subtitle && <p className="mt-1 text-xs leading-5 text-navy-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  )
}
