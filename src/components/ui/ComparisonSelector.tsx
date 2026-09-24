import { useReport } from '../../context/ReportContext'
import type { CompareWith } from '../../types'

export function ComparisonSelector() {
  const { compareWith, setCompareWith, previousCompareLabel, previousCompareName, lyCompareLabel, lyCompareName } =
    useReport()

  return (
    <label className="flex min-w-[200px] flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-muted">Compare with</span>
      <select
        value={compareWith}
        onChange={(e) => setCompareWith(e.target.value as CompareWith)}
        className="h-8 rounded-lg border border-line bg-white px-2.5 text-xs font-medium text-navy outline-none focus:border-rg-blue"
      >
        <option value="previous">
          {previousCompareLabel} · {previousCompareName}
        </option>
        <option value="ly">
          {lyCompareLabel} · {lyCompareName}
        </option>
        <option value="both">Both · {previousCompareName} and {lyCompareName}</option>
      </select>
    </label>
  )
}
