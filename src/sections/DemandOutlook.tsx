import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { GhostButton } from '../components/ui/Buttons'
import { ConfirmModal } from '../components/ui/ConfirmModal'
import { SectionHeader } from '../components/ui/SectionHeader'
import { demandMarkets } from '../data/grandMeridian'

const levelStyle = {
  High: 'bg-positive-soft text-positive',
  'Above average': 'bg-rg-blue-soft text-rg-blue',
  Soft: 'bg-warning-soft text-warning',
}

export function DemandOutlook() {
  const [open, setOpen] = useState(false)

  return (
    <section>
      <SectionHeader
        id="demand-outlook"
        title="Market demand outlook"
        description="Forward-looking 90-day demand for the three primary destinations. Figures are a forecast, not actual results."
      />
      <div className="grid grid-cols-3 gap-3">
        {demandMarkets.map((m) => (
          <article key={m.id} className="surface-card rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-navy">{m.market}</h3>
                <p className="text-xs text-navy-muted">Demand index {m.index}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${levelStyle[m.level]}`}>{m.level}</span>
            </div>
            <div className="my-3 h-14">
              <ResponsiveContainer>
                <LineChart data={m.trend.map((v, i) => ({ i, v }))}>
                  <Line type="monotone" dataKey="v" stroke="#1B4F9C" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-navy-muted">Important events</dt>
                <dd className="font-medium text-navy">{m.events}</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-muted">Expected peak dates</dt>
                <dd className="font-medium text-navy">{m.peak}</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-muted">Suggested commercial posture</dt>
                <dd className="font-medium text-navy">{m.posture}</dd>
              </div>
              <div>
                <dt className="text-xs text-navy-muted">Affected properties</dt>
                <dd className="font-medium text-navy">{m.properties.join(', ')}</dd>
              </div>
            </dl>
            <GhostButton className="mt-3 px-0" onClick={() => setOpen(true)}>
              <ExternalLink size={13} />
              Open Demand Navigator
            </GhostButton>
          </article>
        ))}
      </div>
      <ConfirmModal open={open} title="Demand Navigator" onClose={() => setOpen(false)}>
        <p className="text-sm text-navy-muted">
          Production would open Demand Navigator for the selected destination. This prototype keeps the 90-day outlook
          inside the unified review.
        </p>
      </ConfirmModal>
    </section>
  )
}
