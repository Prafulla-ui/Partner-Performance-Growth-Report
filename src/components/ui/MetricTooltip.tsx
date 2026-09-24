import { Info } from 'lucide-react'
import { useState } from 'react'

export function MetricTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="text-navy-muted hover:text-rg-blue"
        aria-label="Metric definition"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <Info size={13} />
      </button>
      {open && (
        <span className="absolute left-0 top-5 z-30 w-64 rounded-lg border border-line bg-white p-2 text-xs leading-5 text-navy shadow-lg">
          {text}
        </span>
      )}
    </span>
  )
}
