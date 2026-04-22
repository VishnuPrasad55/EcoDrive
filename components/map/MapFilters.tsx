'use client'

import { motion } from 'framer-motion'
import { Filter, X } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { INDIAN_REGIONS } from '@/lib/mock-data'
import { Button } from '@/components/ui'

interface MapFiltersProps {
  onClose?: () => void
}

export function MapFilters({ onClose }: MapFiltersProps) {
  const { filters, setFilters, setSelectedRegion } = useAppStore()

  const handleRegionChange = (regionId: string) => {
    const region = INDIAN_REGIONS.find((r) => r.id === regionId)
    if (region) {
      setSelectedRegion(region)
      setFilters({ region: regionId })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-xl p-4 space-y-5 w-72"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-flux-400" />
          <span className="font-display font-semibold text-white text-sm">Map Filters</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Region Selector */}
      <div className="space-y-2">
        <label className="text-xs text-white/40 uppercase tracking-wider font-mono">City / Region</label>
        <select
          value={filters.region}
          onChange={(e) => handleRegionChange(e.target.value)}
          className="w-full glass rounded-lg px-3 py-2 text-sm text-white bg-transparent border border-white/10 focus:border-flux-500/40 focus:outline-none appearance-none cursor-pointer"
        >
          {INDIAN_REGIONS.map((r) => (
            <option key={r.id} value={r.id} className="bg-gray-900">
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Show/Hide Layers */}
      <div className="space-y-2">
        <label className="text-xs text-white/40 uppercase tracking-wider font-mono">Map Layers</label>
        <div className="space-y-2">
          {[
            { key: 'show_existing', label: 'Existing Stations', color: 'bg-flux-400' },
            { key: 'show_suggested', label: 'AI Suggested', color: 'bg-spark-400' },
            { key: 'show_planned', label: 'Planned Sites', color: 'bg-surge-400' },
          ].map(({ key, label, color }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div
                className={`w-9 h-5 rounded-full relative transition-all duration-200 ${
                  filters[key as keyof typeof filters] ? 'bg-flux-500/30 border border-flux-500/50' : 'bg-white/5 border border-white/10'
                }`}
                onClick={() => setFilters({ [key]: !filters[key as keyof typeof filters] })}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
                    filters[key as keyof typeof filters] ? `${color} translate-x-4` : 'bg-white/30 translate-x-0.5'
                  }`}
                />
              </div>
              <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Demand Density */}
      <div className="space-y-2">
        <label className="text-xs text-white/40 uppercase tracking-wider font-mono">
          Demand Density Range
        </label>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span>{filters.demand_min}</span>
          <div className="flex-1 relative h-1.5 bg-white/10 rounded-full">
            <div
              className="absolute left-0 top-0 h-full bg-flux-500 rounded-full"
              style={{ width: `${filters.demand_max}%` }}
            />
          </div>
          <span>{filters.demand_max}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={filters.demand_max}
          onChange={(e) => setFilters({ demand_max: Number(e.target.value) })}
          className="w-full accent-flux-400"
        />
      </div>

      {/* Connector Types */}
      <div className="space-y-2">
        <label className="text-xs text-white/40 uppercase tracking-wider font-mono">Connector Types</label>
        <div className="flex flex-wrap gap-2">
          {(['CCS', 'CHAdeMO', 'Type2', 'GB/T', 'Tesla'] as const).map((type) => {
            const isActive = filters.connector_types.includes(type)
            return (
              <button
                key={type}
                onClick={() => {
                  const next = isActive
                    ? filters.connector_types.filter((t) => t !== type)
                    : [...filters.connector_types, type]
                  setFilters({ connector_types: next })
                }}
                className={`px-2.5 py-1 rounded-md text-xs border transition-all duration-200 ${
                  isActive
                    ? 'bg-flux-500/20 border-flux-500/40 text-flux-400'
                    : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                }`}
              >
                {type}
              </button>
            )
          })}
        </div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full text-white/40 hover:text-white/60"
        onClick={() =>
          setFilters({
            demand_min: 0,
            demand_max: 100,
            show_existing: true,
            show_suggested: true,
            show_planned: true,
            connector_types: [],
            status: [],
          })
        }
      >
        Reset Filters
      </Button>
    </motion.div>
  )
}
