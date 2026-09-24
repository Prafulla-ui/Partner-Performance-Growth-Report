import { createContext, useContext, useState, type ReactNode } from 'react'
import {
  demandNarrative,
  demandRecommendations,
  initialActions,
  supplyNarrative,
  supplyRecommendations,
} from '../data/grandMeridian'
import type {
  AccountType,
  ChartMetric,
  CompareWith,
  PartnerPerspective,
  Recommendation,
  ReviewAction,
  ViewMode,
  ViewPeriod,
  ReportStatus,
} from '../types'

interface ReportState {
  perspective: PartnerPerspective
  accountType: AccountType
  viewMode: ViewMode
  viewPeriod: ViewPeriod
  periodLabel: string
  compareWith: CompareWith
  previousCompareLabel: string
  lyCompareLabel: string
  previousCompareName: string
  lyCompareName: string
  chartMetric: ChartMetric
  narrative: string
  recommendations: Recommendation[]
  actions: ReviewAction[]
  reportTitle: string
  reportStatus: ReportStatus
  setReportTitle: (v: string) => void
  setReportStatus: (v: ReportStatus) => void
  setPerspective: (v: PartnerPerspective) => void
  setAccountType: (v: AccountType) => void
  setViewMode: (v: ViewMode) => void
  setViewPeriod: (v: ViewPeriod) => void
  setCompareWith: (v: CompareWith) => void
  setChartMetric: (v: ChartMetric) => void
  setNarrative: (v: string) => void
  updateRecommendation: (id: string, patch: Partial<Recommendation>) => void
  addAction: (action: ReviewAction) => void
  updateAction: (id: string, patch: Partial<ReviewAction>) => void
  isInternal: boolean
  isFullStack: boolean
  isSupply: boolean
}

const ReportContext = createContext<ReportState | null>(null)

const periodLabels: Record<ViewPeriod, string> = {
  month: 'June 2026',
  quarter: 'Q2 2026',
  ytd: 'YTD 2026',
  custom: '1 Apr–30 Jun 2026',
}

const compareMeta: Record<
  ViewPeriod,
  { previousLabel: string; previousName: string; lyLabel: string; lyName: string }
> = {
  month: {
    previousLabel: 'Previous month',
    previousName: 'May 2026',
    lyLabel: 'Same month last year',
    lyName: 'June 2025',
  },
  quarter: {
    previousLabel: 'Previous quarter',
    previousName: 'Q1 2026',
    lyLabel: 'Same quarter last year',
    lyName: 'Q2 2025',
  },
  ytd: {
    previousLabel: 'Prior year-to-date',
    previousName: 'YTD 2025',
    lyLabel: 'Same YTD last year',
    lyName: 'YTD 2025',
  },
  custom: {
    previousLabel: 'Previous period',
    previousName: '1 Jan–31 Mar 2026',
    lyLabel: 'Same dates last year',
    lyName: '1 Apr–30 Jun 2025',
  },
}

export function ReportProvider({ children }: { children: ReactNode }) {
  const [perspective, setPerspectiveState] = useState<PartnerPerspective>('supply')
  const [accountType, setAccountType] = useState<AccountType>('full')
  const [viewMode, setViewMode] = useState<ViewMode>('internal')
  const [viewPeriod, setViewPeriodState] = useState<ViewPeriod>('quarter')
  const [periodLabel, setPeriodLabel] = useState('Q2 2026')
  const [compareWith, setCompareWith] = useState<CompareWith>('both')
  const [chartMetric, setChartMetric] = useState<ChartMetric>('revenue')
  const [supplyText, setSupplyText] = useState(supplyNarrative)
  const [demandText, setDemandText] = useState(demandNarrative)
  const [supplyRecs, setSupplyRecs] = useState(supplyRecommendations)
  const [demandRecs, setDemandRecs] = useState(demandRecommendations)
  const [actions, setActions] = useState(initialActions)
  const [reportTitle, setReportTitle] = useState('Partner Performance & Growth Report')
  const [reportStatus, setReportStatus] = useState<ReportStatus>('approved')

  const setPerspective = (v: PartnerPerspective) => setPerspectiveState(v)
  const setViewPeriod = (v: ViewPeriod) => {
    setViewPeriodState(v)
    setPeriodLabel(periodLabels[v])
  }

  const isSupply = perspective === 'supply'
  const compare = compareMeta[viewPeriod]
  const narrative = isSupply ? supplyText : demandText
  const recommendations = isSupply ? supplyRecs : demandRecs

  const setNarrative = (v: string) => {
    if (isSupply) setSupplyText(v)
    else setDemandText(v)
  }

  const updateRecommendation = (id: string, patch: Partial<Recommendation>) => {
    const updater = (list: Recommendation[]) => list.map((r) => (r.id === id ? { ...r, ...patch } : r))
    if (isSupply) setSupplyRecs(updater)
    else setDemandRecs(updater)
  }

  const addAction = (action: ReviewAction) => setActions((prev) => [action, ...prev])
  const updateAction = (id: string, patch: Partial<ReviewAction>) => {
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }

  const value: ReportState = {
    perspective,
    accountType,
    viewMode,
    viewPeriod,
    periodLabel,
    compareWith,
    previousCompareLabel: compare.previousLabel,
    lyCompareLabel: compare.lyLabel,
    previousCompareName: compare.previousName,
    lyCompareName: compare.lyName,
    chartMetric,
    narrative,
    recommendations,
    actions,
    reportTitle,
    reportStatus,
    setReportTitle,
    setReportStatus,
    setPerspective,
    setAccountType,
    setViewMode,
    setViewPeriod,
    setCompareWith,
    setChartMetric,
    setNarrative,
    updateRecommendation,
    addAction,
    updateAction,
    isInternal: viewMode === 'internal',
    isFullStack: accountType === 'full',
    isSupply,
  }

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
}

export function useReport() {
  const ctx = useContext(ReportContext)
  if (!ctx) throw new Error('useReport must be used within ReportProvider')
  return ctx
}
