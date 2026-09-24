import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

export function SideDrawer({
  open,
  title,
  onClose,
  children,
  footer,
  width = 'max-w-md',
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  width?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button type="button" className="absolute inset-0 bg-navy/30" aria-label="Close drawer" onClick={onClose} />
      <aside className={`relative flex h-full w-full ${width} flex-col bg-white shadow-[0_16px_48px_rgba(15,31,51,0.2)]`}>
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-base font-semibold text-navy">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-md p-1 text-navy-muted hover:bg-canvas">
            <X size={18} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <footer className="border-t border-line px-5 py-3">{footer}</footer>}
      </aside>
    </div>
  )
}
