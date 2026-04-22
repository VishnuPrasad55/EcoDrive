'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, MapPin, TrendingUp, Leaf, Activity, Users, Globe, Battery } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { StatCard, Card } from '@/components/ui'
import { DemandChart, CityComparisonChart } from '@/components/analytics/Charts'
import { useAppStore } from '@/lib/store'
import { DASHBOARD_STATS, generateExistingStations, INDIAN_REGIONS } from '@/lib/mock-data'
import { formatNumber } from '@/lib/utils'
import Link from 'next/link'

const recentActivity = [
  { action: 'Optimization completed', region: 'Bangalore Urban', time: '2m ago', type: 'success' },
  { action: 'New stations mapped', region: 'Delhi NCR', time: '18m ago', type: 'info' },
  { action: 'Coverage gap detected', region: 'Hyderabad', time: '1h ago', type: 'warning' },
  { action: 'Report exported', region: 'Mumbai MMR', time: '3h ago', type: 'success' },
  { action: 'Analysis saved', region: 'Pune Metro', time: '5h ago', type: 'info' },
]

export default function DashboardPage() {
  const { setExistingStations, selectedRegion } = useAppStore()
  useEffect(() => { setExistingStations(generateExistingStations(selectedRegion)) }, [selectedRegion, setExistingStations])

  return (
    <AppShell title="Dashboard" subtitle="Overview of India's EV charging network">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Stations" value={formatNumber(DASHBOARD_STATS.total_stations)} sub={`${formatNumber(DASHBOARD_STATS.active_stations)} active`} icon={<MapPin className="w-4 h-4" />} trend={12} color="flux" delay={0} />
          <StatCard label="EV Vehicles (India)" value={formatNumber(DASHBOARD_STATS.ev_vehicles_india)} sub="As of 2025" icon={<Zap className="w-4 h-4" />} trend={34} color="surge" delay={0.05} />
          <StatCard label="Avg Utilization" value={`${DASHBOARD_STATS.avg_utilization}%`} sub="Across all charger types" icon={<Activity className="w-4 h-4" />} trend={8} color="spark" delay={0.1} />
          <StatCard label="CO2 Saved" value={`${formatNumber(DASHBOARD_STATS.co2_saved_tonnes)}t`} sub="Annual estimate" icon={<Leaf className="w-4 h-4" />} trend={22} color="flux" delay={0.15} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Cities Covered" value={DASHBOARD_STATS.total_cities} sub="Tier 1, 2 and 3" icon={<Globe className="w-4 h-4" />} color="surge" delay={0.2} />
          <StatCard label="Network Coverage" value={`${DASHBOARD_STATS.coverage_pct}%`} sub="+3.2% this month" icon={<TrendingUp className="w-4 h-4" />} trend={3} color="flux" delay={0.25} />
          <StatCard label="Optimizations Run" value={formatNumber(DASHBOARD_STATS.optimizations_run)} sub="All-time" icon={<Battery className="w-4 h-4" />} color="spark" delay={0.3} />
          <StatCard label="Users Active" value="1,247" sub="Planning sessions" icon={<Users className="w-4 h-4" />} trend={5} color="surge" delay={0.35} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <DemandChart />
            <CityComparisonChart />
          </div>
          <div className="space-y-4">
            <Card>
              <h3 className="font-display font-semibold text-white text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { href: '/optimize', label: 'Run AI Optimization', icon: Zap, color: 'text-flux-400 bg-flux-500/10' },
                  { href: '/map', label: 'View Live Map', icon: MapPin, color: 'text-surge-400 bg-surge-500/10' },
                  { href: '/analytics', label: 'Open Analytics', icon: TrendingUp, color: 'text-volt-400 bg-spark-400/10' },
                ].map((a) => (
                  <Link key={a.href} href={a.href}>
                    <motion.div whileHover={{ x: 4 }} className="flex items-center gap-3 p-3 glass rounded-lg hover:border-white/10 transition-all cursor-pointer border border-transparent">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${a.color}`}><a.icon className="w-4 h-4" /></div>
                      <span className="text-sm text-white/70">{a.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="font-display font-semibold text-white text-sm mb-3">Region Overview</h3>
              <div className="space-y-2">
                {INDIAN_REGIONS.slice(0, 5).map((r, i) => (
                  <motion.div key={r.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm text-white/80">{r.name.split(' ')[0]}</p>
                      <p className="text-xs text-white/40">{formatNumber(r.ev_registrations)} EVs</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-white/60">Gap: <span className={r.charging_gap_score > 70 ? 'text-red-400' : 'text-volt-400'}>{r.charging_gap_score}</span></div>
                      <div className="w-20 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${100 - r.charging_gap_score}%`, background: r.charging_gap_score > 70 ? '#ef4444' : '#facc15' }} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
            <Card>
              <h3 className="font-display font-semibold text-white text-sm mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.type === 'success' ? 'bg-flux-400' : a.type === 'warning' ? 'bg-spark-400' : 'bg-electric-400'}`} />
                    <div>
                      <p className="text-xs text-white/70">{a.action}</p>
                      <p className="text-xs text-white/30">{a.region} · {a.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
