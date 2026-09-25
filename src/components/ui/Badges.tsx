import { Eye, EyeOff, Lock } from 'lucide-react'

export function InternalOnlyBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-navy-muted">
      <Lock size={11} />
      Internal only
    </span>
  )
}

export function NotSharedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-warning">
      <EyeOff size={11} />
      Not shared with client
    </span>
  )
}

export function CustomerVisibleBadge({ visible }: { visible: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        visible ? 'bg-teal-soft text-teal' : 'bg-slate-100 text-navy-muted'
      }`}
    >
      <Eye size={11} />
      {visible ? 'Customer visible' : 'Hidden from customer'}
    </span>
  )
}

export function DemoDataBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-warning-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-warning">
      Demo
    </span>
  )
}
