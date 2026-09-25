/** Shared chart colors — keep bar, pie, and trend charts on one palette. */

export const chartColors = {
  primary: '#1B4F9C',
  primaryBright: '#3B82F6',
  secondary: '#0F766E',
  tertiary: '#F59E0B',
  tertiaryDeep: '#D97706',
  muted: '#94A3B8',
  mutedDeep: '#64748B',
  positive: '#0F7B4A',
  warning: '#B45309',
  danger: '#B42318',
  grid: '#E8EEF6',
  axis: '#4A5B70',
  axisMuted: '#94A3B8',
  ink: '#0F1F33',
  track: '#EEF1F5',
  white: '#FFFFFF',
} as const

/** Ordered slices for channel / revenue mix pies */
export const chartSeries = {
  direct: chartColors.primary,
  ota: chartColors.tertiary,
  indirect: chartColors.tertiary,
  gds: chartColors.secondary,
  current: chartColors.primary,
  previous: chartColors.muted,
  ly: chartColors.secondary,
  revenue: chartColors.primary,
  commission: chartColors.tertiaryDeep,
  spend: chartColors.mutedDeep,
} as const

export const chartGradients = {
  primaryBar: { from: chartColors.primaryBright, to: chartColors.primary },
  accentBar: { from: '#FBBF24', to: chartColors.tertiaryDeep },
  mutedBar: { from: chartColors.muted, to: chartColors.mutedDeep },
  primaryArea: chartColors.primary,
} as const
