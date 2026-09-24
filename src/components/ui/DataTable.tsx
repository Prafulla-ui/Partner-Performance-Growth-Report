import type { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  align?: 'left' | 'right'
  wrap?: boolean
  render: (row: T) => ReactNode
}

export function DataTable<T extends object>({
  title,
  columns,
  rows,
  rowKey,
}: {
  title?: string
  columns: Column<T>[]
  rows: T[]
  rowKey: (row: T) => string
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[var(--shadow-card)]">
      {title ? (
        <div className="border-b border-line bg-[#F8FAFC] px-5 py-3">
          <h3 className="text-sm font-semibold text-navy">{title}</h3>
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-x-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  className={`sticky top-0 z-10 whitespace-nowrap border-b border-line bg-[#F3F6FB] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-navy-muted ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  } ${i === 0 ? 'pl-5' : ''} ${i === columns.length - 1 ? 'pr-5' : ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowKey(row)}
                className={`transition-colors ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'} hover:bg-rg-blue-soft/70`}
              >
                {columns.map((col, i) => (
                  <td
                    key={col.key}
                    className={`border-b border-line/80 px-4 py-3.5 align-middle text-navy ${
                      col.align === 'right' ? 'text-right tabular font-medium' : ''
                    } ${col.wrap ? 'max-w-[280px] leading-5' : 'whitespace-nowrap'} ${
                      i === 0 ? 'pl-5 font-semibold' : ''
                    } ${i === columns.length - 1 ? 'pr-5' : ''}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-line bg-[#F8FAFC] px-5 py-2.5 text-[11px] font-medium text-navy-muted">
        {rows.length} {rows.length === 1 ? 'row' : 'rows'}
      </div>
    </div>
  )
}
