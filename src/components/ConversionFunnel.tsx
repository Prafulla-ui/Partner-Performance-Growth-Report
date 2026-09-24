import type { FunnelStage } from '../types'
import { formatNumber } from '../lib/format'

const VIEW_W = 400
const VIEW_H = 400
const TOP_W = 360
const BOT_W = 88
const BAND_H = VIEW_H / 6

const fills = ['#122C5C', '#1B4F9C', '#215DB8', '#3B7BD4', '#B45309', '#0F766E']

function widthAt(y: number) {
  return TOP_W + ((BOT_W - TOP_W) * y) / VIEW_H
}

function bandPath(i: number) {
  const y1 = i * BAND_H
  const y2 = (i + 1) * BAND_H
  const w1 = widthAt(y1)
  const w2 = widthAt(y2)
  const x1 = (VIEW_W - w1) / 2
  const x2 = (VIEW_W - w2) / 2
  return `M ${x1} ${y1} L ${x1 + w1} ${y1} L ${x2 + w2} ${y2} L ${x2} ${y2} Z`
}

export function ConversionFunnel({
  stages,
  onSelect,
}: {
  stages: FunnelStage[]
  onSelect: (stage: FunnelStage) => void
}) {
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="mx-auto h-full max-h-[400px] w-full max-w-[380px]" role="img">
      <title>Website conversion funnel</title>
      <defs>
        <filter id="funnel-shadow" x="-10%" y="-4%" width="120%" height="112%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0F1F33" floodOpacity="0.16" />
        </filter>
      </defs>
      <g filter="url(#funnel-shadow)">
        {stages.map((stage, i) => (
          <path
            key={stage.id}
            d={bandPath(i)}
            fill={fills[i]}
            className="cursor-pointer"
            onClick={() => onSelect(stage)}
          />
        ))}
      </g>
      {stages.map((stage, i) => {
        const cy = i * BAND_H + BAND_H / 2 + 3
        return (
          <g key={`${stage.id}-label`} className="pointer-events-none">
            <text x={VIEW_W / 2} y={cy - 8} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="600">
              {stage.label}
            </text>
            <text x={VIEW_W / 2} y={cy + 9} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="700">
              {formatNumber(stage.value)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
