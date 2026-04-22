'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Brain, Target, Download, Save, ChevronDown, ChevronUp, TrendingUp, Users, DollarSign, Leaf, MapPin } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { AIExplanationPanel } from '@/components/optimize/AIExplanationPanel'
import { SimulationPlayback } from '@/components/optimize/SimulationPlayback'
import { CitySearch } from '@/components/map/CitySearch'
import { Button, Badge, Progress } from '@/components/ui'
import { useAppStore } from '@/lib/store'
import { runOptimization } from '@/lib/ai-optimizer'
import { generateExistingStations } from '@/lib/mock-data'
import { OptimizationParams, OptimizationResult, Region } from '@/types'
import { downloadCSV, stationsToCSVRows, formatNumber, formatCurrency } from '@/lib/utils'
import { toast } from '@/components/ui/toaster'

const MapView = dynamic(() => import('@/components/map/MapView').then(m => ({ default: m.MapView })), { ssr: false })

const defaultParams = (region: Region): OptimizationParams => ({
  region, num_stations: 8, demand_weight: 0.4, coverage_weight: 0.3,
  traffic_weight: 0.2, population_weight: 0.1, min_distance_km: 2.5,
  existing_coverage_boost: true,
})

function Slider({ label, value, min, max, step, onChange, fmt }: {
  label: string; value: number; min: number; max: number; step: number
  onChange: (v: number) => void; fmt?: (v: number) => string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between">
        <label className="text-xs text-white/45">{label}</label>
        <span className="text-xs font-mono text-flux-400">{fmt ? fmt(value) : value}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-flux-500" />
    </div>
  )
}

export default function OptimizePage() {
  const { selectedRegion, setSelectedRegion, setSuggestedStations, existingStations, setExistingStations, addOptimizationResult, isOptimizing, setIsOptimizing } = useAppStore()
  const [params, setParams] = useState<OptimizationParams>(defaultParams(selectedRegion))
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [tab, setTab] = useState<'params' | 'results'>('params')
  const [showExplanation, setShowExplanation] = useState(true)
  const [progress, setProgress] = useState(0)

  const setParam = <K extends keyof OptimizationParams>(k: K, v: OptimizationParams[K]) =>
    setParams(p => ({ ...p, [k]: v }))

  const handleRegionSelect = (region: Region) => {
    setSelectedRegion(region)
    setParam('region', region)
    setExistingStations(generateExistingStations(region))
    toast(`Region set: ${region.name.split(',')[0]}`, 'info')
  }

  const handleRun = async () => {
    setIsOptimizing(true)
    setResult(null)
    setProgress(0)
    try {
      const r = await runOptimization(params, params.region, (step, total) => {
        setProgress(Math.round((step / total) * 100))
      })
      setResult(r)
      setSuggestedStations(r.suggested_stations)
      addOptimizationResult(r)
      setTab('results')
      toast(`✓ Found ${r.suggested_stations.length} optimal sites in ${r.params.region.name.split(',')[0]}`, 'success')
    } catch (err) {
      toast('Optimization failed — check console', 'error')
      console.error(err)
    } finally {
      setIsOptimizing(false)
      setProgress(0)
    }
  }

  const existing = existingStations.length > 0 ? existingStations : generateExistingStations(selectedRegion)
  const suggested = result?.suggested_stations ?? []
  const mapCenter: [number, number] = [params.region.center.lat, params.region.center.lng]

  return (
    <AppShell title="AI Optimize" subtitle="Select any city and configure spatial optimization">
      <div className="flex h-[calc(100vh-3.5rem)]">
        {/* ── Left panel ── */}
        <div className="w-80 flex-shrink-0 flex flex-col border-r border-white/5 overflow-y-auto">
          {/* Tabs */}
          <div className="flex border-b border-white/5 flex-shrink-0">
            {(['params', 'results'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${t === tab ? 'text-flux-400 border-b-2 border-flux-400' : 'text-white/35 hover:text-white/60'}`}>
                {t === 'params' ? 'Parameters' : 'Results'}
                {t === 'results' && result && <span className="ml-1.5 px-1.5 py-0.5 rounded text-xs bg-flux-500/20 text-flux-400">✓</span>}
              </button>
            ))}
          </div>

          <div className="flex-1 p-4 space-y-5 overflow-y-auto">
            {tab === 'params' && (
              <>
                {/* City Search */}
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-wider font-mono">Target City</label>
                  <CitySearch onSelect={handleRegionSelect} defaultValue={params.region.name.split(',')[0]} placeholder="Search any city worldwide..." />
                  <div className="glass-flux rounded-lg p-3 text-xs space-y-1">
                    <div className="flex justify-between"><span className="text-white/40">Population</span><span className="text-white/70 font-mono">{formatNumber(params.region.population)}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Est. EV Fleet</span><span className="text-white/70 font-mono">{formatNumber(params.region.ev_registrations)}</span></div>
                    <div className="flex justify-between"><span className="text-white/40">Coverage Gap</span>
                      <span className={`font-mono font-bold ${params.region.charging_gap_score > 70 ? 'text-red-400' : 'text-flux-400'}`}>{params.region.charging_gap_score}/100</span>
                    </div>
                    <div className="flex justify-between"><span className="text-white/40">Area</span><span className="text-white/70 font-mono">{params.region.area_km2.toLocaleString()} km²</span></div>
                  </div>
                </div>

                {/* Optimization settings */}
                <div className="space-y-3">
                  <label className="text-xs text-white/40 uppercase tracking-wider font-mono">Optimization</label>
                  <Slider label="Number of New Stations" value={params.num_stations} min={3} max={25} step={1} onChange={v => setParam('num_stations', v)} />
                  <Slider label="Min. Station Spacing" value={params.min_distance_km} min={0.5} max={15} step={0.5} onChange={v => setParam('min_distance_km', v)} fmt={v => `${v} km`} />
                </div>

                {/* Weights */}
                <div className="space-y-3">
                  <label className="text-xs text-white/40 uppercase tracking-wider font-mono">Objective Weights</label>
                  <Slider label="EV Demand" value={params.demand_weight} min={0} max={1} step={0.05} onChange={v => setParam('demand_weight', v)} fmt={v => v.toFixed(2)} />
                  <Slider label="Coverage Gap" value={params.coverage_weight} min={0} max={1} step={0.05} onChange={v => setParam('coverage_weight', v)} fmt={v => v.toFixed(2)} />
                  <Slider label="Traffic Flow" value={params.traffic_weight} min={0} max={1} step={0.05} onChange={v => setParam('traffic_weight', v)} fmt={v => v.toFixed(2)} />
                  <Slider label="Population Density" value={params.population_weight} min={0} max={1} step={0.05} onChange={v => setParam('population_weight', v)} fmt={v => v.toFixed(2)} />
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-white/55">Boost existing gaps</span>
                  <button onClick={() => setParam('existing_coverage_boost', !params.existing_coverage_boost)}
                    className={`w-9 h-5 rounded-full relative transition-all ${params.existing_coverage_boost ? 'bg-flux-500/30 border border-flux-500/50' : 'bg-white/5 border border-white/10'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${params.existing_coverage_boost ? 'bg-flux-400 translate-x-4' : 'bg-white/30 translate-x-0.5'}`} />
                  </button>
                </div>

                <Button variant="primary" size="lg" onClick={handleRun} loading={isOptimizing} className="w-full" icon={<Zap className="w-4 h-4" />}>
                  {isOptimizing ? `Optimising... ${progress}%` : 'Run AI Optimization'}
                </Button>
                {isOptimizing && <Progress value={progress} color="flux" />}
              </>
            )}

            {tab === 'results' && result && (
              <>
                <div className="space-y-2">
                  <label className="text-xs text-white/40 uppercase tracking-wider font-mono">Metrics</label>
                  {[
                    { label: 'Coverage Improvement', value: `+${result.metrics.coverage_improvement}%`, color: 'text-flux-400', icon: TrendingUp },
                    { label: 'Population Covered',   value: formatNumber(result.metrics.population_covered), color: 'text-surge-400', icon: Users },
                    { label: 'Cost Estimate',         value: formatCurrency(result.metrics.cost_estimate_crore), color: 'text-spark-400', icon: DollarSign },
                    { label: 'CO₂ Reduction',        value: `${formatNumber(result.metrics.co2_reduction_tonnes)}t`, color: 'text-flux-400', icon: Leaf },
                    { label: 'Efficiency Score',      value: `${result.metrics.efficiency_score}/100`, color: 'text-flux-400', icon: Brain },
                    { label: 'Avg. Station Distance', value: `${result.metrics.avg_distance_to_station_km} km`, color: 'text-surge-400', icon: Target },
                  ].map(m => (
                    <div key={m.label} className="flex items-center justify-between glass rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2"><m.icon className="w-3.5 h-3.5 text-white/25" /><span className="text-xs text-white/45">{m.label}</span></div>
                      <span className={`text-sm font-mono font-semibold ${m.color}`}>{m.value}</span>
                    </div>
                  ))}
                </div>

                {/* Before/after gap */}
                <div className="glass-flux rounded-xl p-4 border border-flux-500/20">
                  <p className="text-xs text-white/45 mb-3 font-mono">Coverage Gap Reduction</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 text-center"><div className="text-2xl font-display font-bold text-red-400">{result.metrics.gap_before}%</div><div className="text-xs text-white/35 mt-1">Before</div></div>
                    <div className="text-flux-400 text-lg font-bold">→</div>
                    <div className="flex-1 text-center"><div className="text-2xl font-display font-bold text-flux-400">{result.metrics.gap_after}%</div><div className="text-xs text-white/35 mt-1">After</div></div>
                  </div>
                </div>

                {/* Site list */}
                <div className="space-y-1.5">
                  <label className="text-xs text-white/40 uppercase tracking-wider font-mono">Suggested Sites ({result.suggested_stations.length})</label>
                  {result.suggested_stations.map((s, i) => (
                    <motion.div key={s.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                      className="glass rounded-lg px-3 py-2 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-white">{s.name}</p>
                        <p className="text-xs text-white/25 font-mono">{s.coordinates.lat.toFixed(4)}, {s.coordinates.lng.toFixed(4)}</p>
                      </div>
                      <Badge variant={s.score! >= 80 ? 'flux' : s.score! >= 60 ? 'surge' : 'spark'}>{s.score}/100</Badge>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" icon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => { downloadCSV(stationsToCSVRows(result.suggested_stations), `ecodrive-${result.params.region.id}.csv`); toast('CSV exported', 'success') }}
                    className="flex-1">CSV</Button>
                  <Button variant="secondary" size="sm" icon={<Save className="w-3.5 h-3.5" />}
                    onClick={() => toast('Plan saved', 'success')} className="flex-1">Save</Button>
                </div>
              </>
            )}

            {tab === 'results' && !result && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <MapPin className="w-10 h-10 text-white/10 mb-3" />
                <p className="text-sm text-white/30">Search a city, configure parameters, then run optimization.</p>
                <Button variant="ghost" size="sm" onClick={() => setTab('params')} className="mt-4">Set Parameters</Button>
              </div>
            )}
          </div>
        </div>

        {/* ── Main: map + explanation ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 pb-0 min-h-0 relative">
            {isOptimizing ? (
              <div className="h-full glass rounded-xl flex flex-col items-center justify-center gap-5">
                <div className="relative w-20 h-20">
                  <div className="w-20 h-20 rounded-full border-2 border-flux-400/15 animate-ping absolute inset-0" />
                  <div className="w-20 h-20 rounded-full border-2 border-flux-400 border-t-transparent animate-spin" style={{ boxShadow: '0 0 24px rgba(245,158,11,0.4)' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-flux-400 font-mono text-sm font-bold">{progress}%</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-flux-400 font-display font-semibold">AI Optimizing {params.region.name.split(',')[0]}</p>
                  <p className="text-xs text-white/35 mt-1 font-mono">Sampling {params.num_stations * 10}+ candidate locations...</p>
                </div>
                <Progress value={progress} color="flux" className="w-48" />
              </div>
            ) : (
              <MapView existingStations={existing} suggestedStations={suggested} center={mapCenter} zoom={12} className="h-full rounded-xl" />
            )}
          </div>

          {result && (
            <div className="flex-shrink-0 p-4 pt-3 max-h-[42%] overflow-y-auto space-y-3">
              <button onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 w-full text-left group">
                <Brain className="w-4 h-4 text-surge-400" />
                <span className="text-sm font-display font-semibold text-white group-hover:text-flux-300 transition-colors">AI Decision Rationale</span>
                <span className="ml-auto">{showExplanation ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}</span>
              </button>
              <AnimatePresence>
                {showExplanation && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <AIExplanationPanel explanation={result.ai_explanation} />
                      <SimulationPlayback steps={result.simulation_steps} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
