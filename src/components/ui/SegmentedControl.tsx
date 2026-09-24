export function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <div className="inline-flex rounded-lg bg-slate-100 p-1">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              active ? 'bg-white text-navy shadow-sm' : 'text-navy-muted hover:text-navy'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
