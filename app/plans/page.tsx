'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { FolderOpen, Trash2, Download, Calendar, MapPin, TrendingUp, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Button, Badge } from '@/components/ui'
import { useAppStore } from '@/lib/store'
import { formatDate, formatNumber, downloadCSV, stationsToCSVRows } from '@/lib/utils'
import Link from 'next/link'
import { toast } from '@/components/ui/toaster'

export default function PlansPage() {
  const { savedPlans, setSavedPlans, removeSavedPlan } = useAppStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans')
        if (!response.ok) {
          throw new Error('Unable to load saved plans')
        }
        const data = await response.json()
        setSavedPlans(Array.isArray(data.saved_plans) ? data.saved_plans : [])
      } catch (error) {
        console.error('Saved plans fetch failed:', error)
        toast('Could not load saved plans. Please sign in again.', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [setSavedPlans])

  const handleExport = (plan: typeof savedPlans[0]) => {
    if (!plan?.optimization_result) {
      toast('No optimization result available to export.', 'error')
      return
    }
    downloadCSV(stationsToCSVRows(plan.optimization_result.suggested_stations), `ecodrive-plan-${plan.id}.csv`)
    toast('Plan exported as CSV', 'success')
  }

  const handleRemove = async (planId: string) => {
    try {
      const response = await fetch(`/api/plans?id=${encodeURIComponent(planId)}`, { method: 'DELETE' })
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Failed to delete plan')
      }
      removeSavedPlan(planId)
      toast('Plan deleted', 'info')
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Could not delete plan', 'error')
      console.error('Delete plan failed:', error)
    }
  }

  return (
    <AppShell title="Saved Plans" subtitle="View and manage optimization results">
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center text-white/40">
            <div className="w-12 h-12 rounded-full border-2 border-flux-400 border-t-transparent animate-spin mb-4" />
            <p>Loading saved plans…</p>
          </div>
        ) : savedPlans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4"><FolderOpen className="w-8 h-8 text-white/20" /></div>
            <h3 className="font-display text-xl font-semibold text-white/40 mb-2">No Plans Yet</h3>
            <p className="text-white/30 text-sm max-w-sm mb-6">Run your first AI optimization to save a plan to your account.</p>
            <Link href="/optimize"><Button variant="primary" icon={<Plus className="w-4 h-4" />}>Create First Plan</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white/40">{savedPlans.length} plan{savedPlans.length !== 1 ? 's' : ''} saved</p>
              <Link href="/compare"><Button variant="secondary" size="sm">Compare Plans</Button></Link>
            </div>
            <AnimatePresence>
              {savedPlans.map((plan, i) => (
                <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ delay: i * 0.06 }}
                  className="glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-white">{plan.name}</h3>
                        <Badge variant="flux" size="sm">{plan.optimization_result?.params.num_stations ?? 0} sites</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/40">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(plan.created_at)}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{plan.optimization_result?.params.region.name ?? 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleExport(plan)} className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-flux-400 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleRemove(plan.id)} className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Coverage +', value: `+${plan.optimization_result?.metrics.coverage_improvement ?? 0}%`, color: 'text-flux-400' },
                      { label: 'Population', value: formatNumber(plan.optimization_result?.metrics.population_covered ?? 0), color: 'text-surge-400' },
                      { label: 'Efficiency', value: `${plan.optimization_result?.metrics.efficiency_score ?? 0}/100`, color: 'text-spark-400' },
                      { label: 'Cost Est.', value: `\u20B9${plan.optimization_result?.metrics.cost_estimate_crore ?? 0}Cr`, color: 'text-white/70' },
                    ].map((m) => (
                      <div key={m.label} className="glass rounded-lg px-3 py-2">
                        <p className="text-xs text-white/40 mb-0.5">{m.label}</p>
                        <p className={`text-sm font-mono font-semibold ${m.color}`}>{m.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      {plan.optimization_result?.suggested_stations.slice(0, 3).map((s) => (<Badge key={s.id} variant="muted" size="sm">{s.name} ({s.score})</Badge>))}
                      {plan.optimization_result && plan.optimization_result.suggested_stations.length > 3 && <Badge variant="muted" size="sm">+{plan.optimization_result.suggested_stations.length - 3} more</Badge>}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white/30"><TrendingUp className="w-3 h-3" /><span>{plan.optimization_result?.ai_explanation.confidence_score ?? 0}% confidence</span></div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppShell>
  )
}
