import type { ButtonHTMLAttributes, ReactNode } from 'react'

export function PrimaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-rg-blue-bright to-rg-blue px-3.5 text-sm font-semibold text-white shadow-sm hover:brightness-110 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function SecondaryButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line bg-white px-3.5 text-sm font-semibold text-navy shadow-sm hover:bg-slate-50 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function GhostButton({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      type="button"
      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2 text-xs font-semibold text-rg-blue hover:bg-rg-blue-soft ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
