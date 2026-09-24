import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReport } from '../context/ReportContext'
import { partners } from '../data/grandMeridian'
import type { AccountType, CompareWith, Granularity, OutputFormat, PartnerPerspective, ScopeLevel, ViewPeriod } from '../types'
import { PrimaryButton, SecondaryButton } from './ui/Buttons'
import { Field, Select } from './ui/FilterBar'
import { SideDrawer } from './ui/SideDrawer'

export function GenerateReportDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { setPerspective, setAccountType, setViewPeriod, setCompareWith } = useReport()
  const [step, setStep] = useState<'form' | 'progress'>('form')
  const [progress, setProgress] = useState(12)
  const [partner, setPartner] = useState(partners[0])
  const [perspective, setLocalPerspective] = useState<PartnerPerspective>('supply')
  const [accountType, setLocalAccount] = useState<AccountType>('full')
  const [viewPeriod, setLocalPeriod] = useState<ViewPeriod>('quarter')
  const [compare, setCompare] = useState<CompareWith>('both')
  const [granularity, setGranularity] = useState<Granularity>('monthly')
  const [scope, setScope] = useState<ScopeLevel>('chain')
  const [currency, setCurrency] = useState('USD')
  const [output, setOutput] = useState<OutputFormat>('in_app')

  const generate = () => {
    setStep('progress')
    setProgress(18)
    const ticks = [42, 67, 88, 100]
    ticks.forEach((value, i) => {
      window.setTimeout(() => {
        setProgress(value)
        if (value === 100) {
          window.setTimeout(() => {
            setPerspective(perspective)
            setAccountType(accountType)
            setViewPeriod(viewPeriod)
            setCompareWith(compare)
            setStep('form')
            setProgress(12)
            onClose()
            navigate('/reports/grand-meridian-q2-2026')
          }, 350)
        }
      }, 350 * (i + 1))
    })
  }

  return (
    <SideDrawer
      open={open}
      onClose={() => {
        if (step === 'form') onClose()
      }}
      title={step === 'form' ? 'Generate report' : 'Assembling report'}
      width="max-w-xl"
      footer={
        step === 'form' ? (
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
            <PrimaryButton onClick={generate}>Generate Report</PrimaryButton>
          </div>
        ) : null
      }
    >
      {step === 'progress' ? (
        <div className="py-10">
          <p className="text-sm text-navy-muted">
            Rolling up {partner} · {scope} · {granularity} · {currency} · {output.replace('_', ' ')}
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-canvas">
            <div className="h-full bg-rg-blue transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs font-medium text-rg-blue">{progress}% complete</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Partner">
            <Select value={partner} onChange={setPartner} options={partners.map((p) => ({ value: p, label: p }))} />
          </Field>
          <Field label="Partner perspective">
            <Select
              value={perspective}
              onChange={(v) => setLocalPerspective(v as PartnerPerspective)}
              options={[
                { value: 'supply', label: 'Supply Partner' },
                { value: 'demand', label: 'Demand Partner' },
              ]}
            />
          </Field>
          <Field label="Account type">
            <Select
              value={accountType}
              onChange={(v) => setLocalAccount(v as AccountType)}
              options={[
                { value: 'full', label: 'Full Stack' },
                { value: 'direct', label: 'Direct Stack' },
              ]}
            />
          </Field>
          <Field label="View period">
            <Select
              value={viewPeriod}
              onChange={(v) => setLocalPeriod(v as ViewPeriod)}
              options={[
                { value: 'month', label: 'Month' },
                { value: 'quarter', label: 'Quarter' },
              ]}
            />
          </Field>
          <Field label="Period">
            <Select value="q2-2026" onChange={() => undefined} options={[{ value: 'q2-2026', label: 'Q2 2026' }]} />
          </Field>
          <Field label="Compare with">
            <Select
              value={compare}
              onChange={(v) => setCompare(v as CompareWith)}
              options={[
                { value: 'previous', label: 'Previous period' },
                { value: 'ly', label: 'Same period last year' },
                { value: 'both', label: 'Both' },
              ]}
            />
          </Field>
          <Field label="Granularity">
            <Select
              value={granularity}
              onChange={(v) => setGranularity(v as Granularity)}
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
            />
          </Field>
          <Field label="Scope">
            <Select
              value={scope}
              onChange={(v) => setScope(v as ScopeLevel)}
              options={[
                { value: 'chain', label: 'Chain' },
                { value: 'brand', label: 'Brand' },
                { value: 'property', label: 'Property' },
              ]}
            />
          </Field>
          <Field label="Currency">
            <Select value={currency} onChange={setCurrency} options={[{ value: 'USD', label: 'USD' }]} />
          </Field>
          <Field label="Output">
            <Select
              value={output}
              onChange={(v) => setOutput(v as OutputFormat)}
              options={[
                { value: 'in_app', label: 'In-app' },
                { value: 'pdf', label: 'PDF' },
                { value: 'xlsx', label: 'XLSX' },
                { value: 'email', label: 'Scheduled email' },
              ]}
            />
          </Field>
        </div>
      )}
    </SideDrawer>
  )
}
