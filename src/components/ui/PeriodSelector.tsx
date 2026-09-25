import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useReport } from '../../context/ReportContext'
import type { ViewPeriod } from '../../types'

const PRESET_RANGES: Record<Exclude<ViewPeriod, 'custom'>, string> = {
  month: '1 Jun – 30 Jun 2026',
  quarter: '1 Apr – 30 Jun 2026',
  ytd: '1 Jan – 30 Jun 2026',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDisplayDate(iso: string) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

function toIso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function parseIso(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return { y, m: m - 1, d }
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate()
}

function DateRangePicker({
  from,
  to,
  onChange,
}: {
  from: string
  to: string
  onChange: (from: string, to: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(() => {
    const p = parseIso(from)
    return { y: p.y, m: p.m }
  })
  const [draftFrom, setDraftFrom] = useState(from)
  const [draftTo, setDraftTo] = useState(to)
  const [picking, setPicking] = useState<'start' | 'end'>('start')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    setDraftFrom(from)
    setDraftTo(to)
    setPicking('start')
    const p = parseIso(from)
    setCursor({ y: p.y, m: p.m })
  }, [open, from, to])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const cells = useMemo(() => {
    const firstDow = new Date(cursor.y, cursor.m, 1).getDay()
    const total = daysInMonth(cursor.y, cursor.m)
    const list: ({ day: number; iso: string } | null)[] = []
    for (let i = 0; i < firstDow; i++) list.push(null)
    for (let d = 1; d <= total; d++) list.push({ day: d, iso: toIso(cursor.y, cursor.m, d) })
    return list
  }, [cursor])

  const pick = (iso: string) => {
    if (picking === 'start' || iso < draftFrom) {
      setDraftFrom(iso)
      setDraftTo(iso)
      setPicking('end')
      return
    }
    setDraftTo(iso)
    onChange(draftFrom, iso)
    setOpen(false)
  }

  const inRange = (iso: string) => iso >= draftFrom && iso <= draftTo
  const isEdge = (iso: string) => iso === draftFrom || iso === draftTo

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-2.5 text-xs font-semibold text-navy ring-1 ring-line hover:bg-rg-blue-soft/40"
      >
        <CalendarDays size={13} className="text-navy-muted" />
        {formatDisplayDate(from)} – {formatDisplayDate(to)}
      </button>

      {open && (
        <div className="absolute left-0 top-9 z-50 w-[280px] rounded-xl border border-line bg-white p-3 shadow-[var(--shadow-card-hover)]">
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              className="rounded-md p-1 text-navy-muted hover:bg-canvas"
              onClick={() =>
                setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }))
              }
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>
            <p className="text-xs font-semibold text-navy">
              {MONTHS[cursor.m]} {cursor.y}
            </p>
            <button
              type="button"
              className="rounded-md p-1 text-navy-muted hover:bg-canvas"
              onClick={() =>
                setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }))
              }
              aria-label="Next month"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <p className="mb-2 text-[11px] text-navy-muted">
            {picking === 'start' ? 'Select start date' : 'Select end date'}
            <span className="ml-1 font-semibold text-navy">
              {formatDisplayDate(draftFrom)} – {formatDisplayDate(draftTo)}
            </span>
          </p>

          <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold uppercase text-navy-muted">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((cell, i) =>
              cell ? (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => pick(cell.iso)}
                  className={`h-8 rounded-md text-xs font-medium transition-colors ${
                    isEdge(cell.iso)
                      ? 'bg-rg-blue text-white'
                      : inRange(cell.iso)
                        ? 'bg-rg-blue-soft text-rg-blue'
                        : 'text-navy hover:bg-canvas'
                  }`}
                >
                  {cell.day}
                </button>
              ) : (
                <span key={`e-${i}`} />
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function PeriodSelector() {
  const { viewPeriod, setViewPeriod, customFrom, customTo, setCustomRange } = useReport()

  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-navy-muted">Period</span>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={viewPeriod}
          onChange={(e) => setViewPeriod(e.target.value as ViewPeriod)}
          className="h-9 min-w-[120px] rounded-full border-0 bg-white py-0 pl-3 pr-8 text-xs font-medium text-navy outline-none focus-visible:ring-2 focus-visible:ring-rg-blue/30"
        >
          <option value="month">Month</option>
          <option value="quarter">Quarter</option>
          <option value="ytd">YTD</option>
          <option value="custom">Custom</option>
        </select>
        {viewPeriod === 'custom' ? (
          <DateRangePicker from={customFrom} to={customTo} onChange={setCustomRange} />
        ) : (
          <span className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-white px-2.5 text-xs font-semibold text-navy ring-1 ring-line">
            <CalendarDays size={13} className="text-navy-muted" />
            {PRESET_RANGES[viewPeriod]}
          </span>
        )}
      </div>
    </label>
  )
}
