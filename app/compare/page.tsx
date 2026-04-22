'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { GitCompare, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { useAppStore } from '@/lib/store'
import { formatNumber } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui'

export default function ComparePage() {
  const { optimizationHistory } = useAppStore()
  const [idxA, setIdxA] = useState(0)
  const [idxB, setIdxB] = useState(1)

  if (optimizationHistory.length < 2) {
    return (
      <AppShell title="Compare" subtitle="Side-by-side plan comparison">
        <div className="flex flex-col items-center justify-center py-32 text-center p-6">
          <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4"><GitCompare className="w-8 h-8 text-white/20" /></div>
          <h3 className="font-display text-xl font-semibold text-white/40 mb-2">Need At Least 2 Plans</h3>
          <p className="text-white/30 text-sm max-w-sm mb-6">Run two or more optimizations to compare results side-by-side.</p>
          <Link href="/optimize"><Button variant="primary">Run Optimization</Button></Link>
        </div>
      </AppShell>
    )
  }

  const planA = optimizationHistory[idxA]
  const planB = optimizationHistory[idxB]

  const metrics = [
    { label: 'Coverage Improvement', a: planA.metrics.coverage_improvement, b: planB.metrics.coverage_improvement, format: (v: number) => `+${v}%`, higher: true },
    { label: 'Population Covered', a: planA.metrics.population_covered, b: planB.metrics.population_covered, format: (v: number) => formatNumber(v), higher: true },
    { label: 'Efficiency Score', a: planA.metrics.efficiency_score, b: planB.metrics.efficiency_score, format: (v: number) => `${v}/100`, higher: true },
    { label: 'Cost Estimate (Cr)', a: planA.metrics.cost_estimate_crore, b: planB.metrics.cost_estimate_crore, format: (v: number) => `\u20B9${v}Cr`, higher: false },
    { label: 'CO2 Reduction (t)', a: planA.metrics.co2_reduction_tonnes, b: planB.metrics.co2_reduction_tonnes, format: (v: number) => formatNumber(v), higher: true },
    { label: 'Gap After (%)', a: planA.metrics.gap_after, b: planB.metrics.gap_after, format: (v: number) => `${v}%`, higher: false },
    { label: 'AI Confidence', a: planA.ai_explanation.confidence_score, b: planB.ai_explanation.confidence_score, format: (v: number) => `${v}%`, higher: true },
    { label: 'Stations Suggested', a: planA.suggested_stations.length, b: planB.suggested_stations.length, format: (v: number) => String(v), higher: true },
  ]

  const SelectPlan = ({ value, onChange }: { value: number; onChange: (i: number) => void }) => (
    <select value={value} onChange={(e) => onChange(Number(e.target.value))}
      className="glass rounded-lg px-3 py-2 text-sm text-white bg-transparent border border-white/10 focus:border-flux-500/40 focus:outline-none appearance-none">
      {optimizationHistory.map((r, i) => <option key={r.id} value={i} className="bg-gray-900">{r.name} ({r.params.region.name})</option>)}
    </select>
  )

  return (
    <AppShell title="Compare Plans" subtitle="Side-by-side optimization comparison">
      <div className="p-6 space-y-6">
        {/* Plan selectors */}
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-1">
            <label className="text-xs text-white/40 font-mono">Plan A</label>
            <SelectPlan value={idxA} onChange={setIdxA} />
          </div>
          <div className="flex-shrink-0 mt-5"><ArrowRight className="w-5 h-5 text-white/20" /></div>
          <div className="flex-1 space-y-1">
            <label className="text-xs text-white/40 font-mono">Plan B</label>
            <SelectPlan value={idxB} onChange={setIdxB} />
          </div>
        </div>

        {/* Comparison grid */}
        <div className="space-y-2">
          {metrics.map((m, i) => {
            const aWins = m.higher ? m.a >= m.b : m.a <= m.b
            const diff = Math.abs(m.a - m.b)
            const pct = m.b > 0 ? Math.round((diff / m.b) * 100) : 0
            return (
              <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass rounded-xl p-4 grid grid-cols-3 items-center gap-4">
                <div className={`text-right p-2 rounded-lg ${aWins ? 'bg-flux-500/10 border border-flux-500/20' : 'glass'}`}>
                  <div className={`text-lg font-display font-bold ${aWins ? 'text-flux-400' : 'text-white/60'}`}>{m.format(m.a)}</div>
                  {aWins && <div className="flex items-center justify-end gap-1 text-xs text-flux-400/70 mt-0.5"><TrendingUp className="w-3 h-3" />Winner</div>}
                </div>
                <div className="text-center">
                  <p className="text-xs text-white/40 mb-1">{m.label}</p>
                  {pct > 0 && <span className="text-xs font-mono text-white/30">{pct}% diff</span>}
                </div>
                <div className={`text-left p-2 rounded-lg ${!aWins ? 'bg-flux-500/10 border border-flux-500/20' : 'glass'}`}>
                  <div className={`text-lg font-display font-bold ${!aWins ? 'text-flux-400' : 'text-white/60'}`}>{m.format(m.b)}</div>
                  {!aWins && <div className="flex items-center gap-1 text-xs text-flux-400/70 mt-0.5"><TrendingUp className="w-3 h-3" />Winner</div>}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Summary */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="glass rounded-xl p-5 border border-flux-500/15">
          <h3 className="font-display font-semibold text-white mb-3">Comparison Summary</h3>
          {(() => {
            const aWins = metrics.filter(m => m.higher ? m.a >= m.b : m.a <= m.b).length
            const bWins = metrics.length - aWins
            const winner = aWins > bWins ? planA : planB
            return (
              <p className="text-sm text-white/60 leading-relaxed">
                <span className="text-flux-400 font-semibold">{winner.name}</span> wins overall with{' '}
                <span className="text-white">{Math.max(aWins, bWins)}/{metrics.length}</span> metric categories.
                It achieves superior {aWins > bWins ? 'coverage improvement and efficiency' : 'cost efficiency and gap reduction'}.
              </p>
            )
          })()}
        </motion.div>
      </div>
    </AppShell>
  )
}
