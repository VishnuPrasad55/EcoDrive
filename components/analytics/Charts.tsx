'use client'

import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line,
} from 'recharts'
import { MOCK_ANALYTICS_DATA } from '@/lib/mock-data'

const COLORS = {
  flux: '#f59e0b',
  surge: '#6b6bec',
  spark: '#0ca5eb',
  ember: '#fb923c',
  red: '#ef4444',
}

const CustomTooltip = ({ active, payload, label }: Record<string, unknown>) => {
  if (!active || !(payload as unknown[])?.length) return null
  return (
    <div className="glass-strong rounded-lg px-3 py-2 border border-white/10 text-xs">
      <p className="text-white/50 mb-1">{String(label)}</p>
      {(payload as Array<{ name: string; value: number; color: string }>).map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/70">{p.name}:</span>
          <span className="text-white font-mono">{typeof p.value === 'number' ? p.value.toLocaleString() : String(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function DemandChart() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="glass rounded-xl p-5">
      <h3 className="font-display font-semibold text-white mb-1">Monthly Demand vs Capacity</h3>
      <p className="text-xs text-white/40 mb-4">EV charging sessions and infrastructure growth</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={MOCK_ANALYTICS_DATA.monthly_demand}>
          <defs>
            <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.flux} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.flux} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="capacityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.surge} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.surge} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} />
          <Area type="monotone" dataKey="demand" name="Demand (kWh)" stroke={COLORS.flux} fill="url(#demandGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="capacity" name="Capacity (kWh)" stroke={COLORS.surge} fill="url(#capacityGrad)" strokeWidth={2} strokeDasharray="5 5" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function CityComparisonChart() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-5">
      <h3 className="font-display font-semibold text-white mb-1">City Coverage Comparison</h3>
      <p className="text-xs text-white/40 mb-4">Coverage % and charging gap score by metro</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={MOCK_ANALYTICS_DATA.city_comparison} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="city" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} />
          <Bar dataKey="coverage_pct" name="Coverage %" fill={COLORS.flux} radius={[4, 4, 0, 0]} />
          <Bar dataKey="gap_score" name="Gap Score" fill={COLORS.red} radius={[4, 4, 0, 0]} opacity={0.7} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function EVGrowthChart() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-5">
      <h3 className="font-display font-semibold text-white mb-1">EV vs Infrastructure Growth</h3>
      <p className="text-xs text-white/40 mb-4">Registration vs station deployment trend</p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={MOCK_ANALYTICS_DATA.ev_growth}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="year" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} />
          <Line yAxisId="left" type="monotone" dataKey="registrations" name="EV Registrations" stroke={COLORS.flux} strokeWidth={2.5} dot={{ fill: COLORS.flux, r: 3 }} />
          <Line yAxisId="right" type="monotone" dataKey="stations" name="Charging Stations" stroke={COLORS.surge} strokeWidth={2.5} dot={{ fill: COLORS.surge, r: 3 }} strokeDasharray="5 5" />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function UtilizationChart() {
  const data = MOCK_ANALYTICS_DATA.utilization_by_type
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="glass rounded-xl p-5">
      <h3 className="font-display font-semibold text-white mb-1">Utilization by Charger Type</h3>
      <p className="text-xs text-white/40 mb-4">Average utilization rate across station categories</p>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={d.type}>
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>{d.type}</span>
              <span className="font-mono text-white">{d.utilization}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.utilization}%` }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${COLORS.flux}, ${COLORS.surge})` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/30 mt-0.5">
              <span>{d.stations} stations</span>
              <span>avg wait: {d.avg_wait_min}min</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export function CoverageGapChart() {
  const data = MOCK_ANALYTICS_DATA.coverage_gap
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="glass rounded-xl p-5">
      <h3 className="font-display font-semibold text-white mb-1">Coverage Gap Analysis</h3>
      <p className="text-xs text-white/40 mb-4">Needed vs existing stations per zone</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis dataKey="zone" type="category" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }} />
          <Bar dataKey="stations_existing" name="Existing" fill={COLORS.flux} radius={[0, 4, 4, 0]} />
          <Bar dataKey="stations_needed" name="Needed" fill={COLORS.red} radius={[0, 4, 4, 0]} opacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

export function RevenueChart() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="glass rounded-xl p-5">
      <h3 className="font-display font-semibold text-white mb-1">Monthly Revenue (₹ Lakh)</h3>
      <p className="text-xs text-white/40 mb-4">Charging session revenue across network</p>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={MOCK_ANALYTICS_DATA.monthly_demand}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.ember} stopOpacity={0.4} />
              <stop offset="95%" stopColor={COLORS.ember} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue_lakh" name="Revenue (₹L)" stroke={COLORS.ember} fill="url(#revGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
