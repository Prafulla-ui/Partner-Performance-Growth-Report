import { CalendarClock, Download, Plus } from 'lucide-react'
import { useState } from 'react'
import { PrimaryButton, SecondaryButton } from '../components/ui/Buttons'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { DataTable, type Column } from '../components/ui/DataTable'
import { Field, Select, TextInput } from '../components/ui/FilterBar'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ActionStatusBadge } from '../components/ui/StatusBadge'
import { useReport } from '../context/ReportContext'
import { owners } from '../data/grandMeridian'
import type { ActionStatus, ReviewAction } from '../types'

export function NextSteps() {
  const { actions, addAction, isInternal } = useReport()
  const [addOpen, setAddOpen] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [form, setForm] = useState({ action: '', owner: owners[0], due: '15 Aug 2026', related: '', notes: '' })

  const columns: Column<ReviewAction>[] = [
    { key: 'action', header: 'Action', wrap: true, render: (r) => r.action },
    { key: 'owner', header: 'Owner', render: (r) => r.owner },
    { key: 'due', header: 'Due date', render: (r) => r.due },
    { key: 'status', header: 'Status', render: (r) => <ActionStatusBadge status={r.status} /> },
    { key: 'related', header: 'Related recommendation', render: (r) => r.related },
    { key: 'notes', header: 'Notes', wrap: true, render: (r) => r.notes },
  ]

  return (
    <section>
      <SectionHeader
        id="next-steps"
        title="Review actions and next steps"
        description="Carry-forward actions from the Q1 review and the date of the next business review."
        action={
          <div className="flex gap-2">
            {isInternal && (
              <PrimaryButton onClick={() => setAddOpen(true)}>
                <Plus size={14} />
                Add Action
              </PrimaryButton>
            )}
            {isInternal && (
              <>
                <SecondaryButton onClick={() => setScheduleOpen(true)}>
                  <CalendarClock size={14} />
                  Schedule Next Review
                </SecondaryButton>
                <SecondaryButton onClick={() => setExportOpen(true)}>
                  <Download size={14} />
                  Export Action Plan
                </SecondaryButton>
              </>
            )}
          </div>
        }
      />
      <DataTable title="Review actions" columns={columns} rows={actions} rowKey={(r) => r.id} />
      <p className="surface-card mt-4 rounded-2xl px-4 py-3 text-sm text-navy">
        Next business review: <strong>Week of 5 October 2026</strong>
      </p>

      <ConfirmModal
        open={addOpen}
        title="Add action"
        onClose={() => setAddOpen(false)}
        footer={
          <>
            <SecondaryButton onClick={() => setAddOpen(false)}>Cancel</SecondaryButton>
            <PrimaryButton
              onClick={() => {
                addAction({
                  id: `a-${Date.now()}`,
                  action: form.action || 'New follow-up action',
                  owner: form.owner,
                  due: form.due,
                  status: 'open' as ActionStatus,
                  related: form.related || '—',
                  notes: form.notes || 'Added during this review.',
                })
                setAddOpen(false)
              }}
            >
              Add action
            </PrimaryButton>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Action">
            <TextInput value={form.action} onChange={(action) => setForm({ ...form, action })} placeholder="Describe the action" />
          </Field>
          <Field label="Owner">
            <Select value={form.owner} onChange={(owner) => setForm({ ...form, owner })} options={owners.map((o) => ({ value: o, label: o }))} />
          </Field>
          <Field label="Due date">
            <TextInput value={form.due} onChange={(due) => setForm({ ...form, due })} />
          </Field>
          <Field label="Related recommendation">
            <TextInput value={form.related} onChange={(related) => setForm({ ...form, related })} />
          </Field>
          <div className="col-span-2">
            <Field label="Notes">
              <TextInput value={form.notes} onChange={(notes) => setForm({ ...form, notes })} />
            </Field>
          </div>
        </div>
      </ConfirmModal>

      <ConfirmModal open={scheduleOpen} title="Schedule next review" onClose={() => setScheduleOpen(false)}>
        <p className="text-sm text-navy">
          The next Grand Meridian business review is held for the week of 5 October 2026. Calendar holds would be sent
          to Priya Sharma and the partner revenue team in production.
        </p>
      </ConfirmModal>
      <ConfirmModal open={exportOpen} title="Export action plan" onClose={() => setExportOpen(false)}>
        <p className="text-sm text-navy">
          A PDF and XLSX action plan would download here. This prototype keeps the plan on-screen for the pitch.
        </p>
      </ConfirmModal>
    </section>
  )
}
