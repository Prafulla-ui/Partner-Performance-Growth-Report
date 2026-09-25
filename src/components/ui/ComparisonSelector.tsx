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
        className="h-9 rounded-full border-0 bg-white py-0 pl-3 pr-8 text-xs font-medium text-navy outline-none focus-visible:ring-2 focus-visible:ring-rg-blue/30"
      >
        <option value="none">Select</option>
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
