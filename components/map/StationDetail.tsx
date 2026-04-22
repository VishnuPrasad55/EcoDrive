'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Users, TrendingUp, MapPin, Activity } from 'lucide-react'
import { ChargingStation } from '@/types'
import { Badge, Card } from '@/components/ui'
import { getScoreColor, formatNumber } from '@/lib/utils'

interface StationDetailProps {
  station: ChargingStation | null
  onClose: () => void
}

export function StationDetail({ station, onClose }: StationDetailProps) {
  if (!station) return null

  const scoreColor = station.score ? getScoreColor(station.score) : '#00f07a'

  return (
    <AnimatePresence>
      <motion.div
        key={station.id}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="glass-strong rounded-xl p-5 w-72 border border-white/10"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: scoreColor, boxShadow: `0 0 8px ${scoreColor}` }}
              />
              <span className="text-xs font-mono text-white/40 uppercase">
                {station.type === 'existing' ? 'Existing' : 'AI Suggested'}
              </span>
            </div>
            <h3 className="font-display font-semibold text-white text-sm leading-snug">{station.name}</h3>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-white/30" />
              <span className="text-xs text-white/40">{station.city}, {station.state}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score */}
        {station.score && (
          <div className="mb-4 p-3 rounded-lg" style={{ background: `${scoreColor}15`, border: `1px solid ${scoreColor}30` }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-white/50">Optimization Score</span>
              <span className="font-display font-bold text-lg" style={{ color: scoreColor }}>
                {station.score}/100
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${station.score}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: scoreColor }}
              />
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="glass rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3 h-3 text-spark-400" />
              <span className="text-xs text-white/40">Power</span>
            </div>
            <span className="text-sm font-semibold text-white">{station.power_output_kw} kW</span>
          </div>
          <div className="glass rounded-lg p-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Activity className="w-3 h-3 text-flux-400" />
              <span className="text-xs text-white/40">Ports</span>
            </div>
            <span className="text-sm font-semibold text-white">{station.capacity}</span>
          </div>
          {station.demand_served && (
            <div className="glass rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="w-3 h-3 text-surge-400" />
                <span className="text-xs text-white/40">Demand</span>
              </div>
              <span className="text-sm font-semibold text-white">{formatNumber(station.demand_served)}</span>
            </div>
          )}
          {station.coverage_radius_km && (
            <div className="glass rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-3 h-3 text-flux-400" />
                <span className="text-xs text-white/40">Coverage</span>
              </div>
              <span className="text-sm font-semibold text-white">{station.coverage_radius_km} km</span>
            </div>
          )}
        </div>

        {/* Connectors */}
        <div className="space-y-1.5">
          <span className="text-xs text-white/40 font-mono uppercase">Connectors</span>
          <div className="flex flex-wrap gap-1.5">
            {station.connector_types.map((c) => (
              <Badge key={c} variant="surge" size="sm">{c}</Badge>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-white/40">Status</span>
          <Badge
            variant={station.status === 'active' ? 'eco' : station.status === 'construction' ? 'volt' : 'muted'}
            size="sm"
          >
            {station.status}
          </Badge>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
