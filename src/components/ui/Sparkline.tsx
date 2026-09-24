import { Line, LineChart, ResponsiveContainer } from 'recharts'

export function Sparkline({ data, color = '#1B4F9C' }: { data: number[]; color?: string }) {
  const series = data.map((v, i) => ({ i, v }))
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series}>
          <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.6} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
