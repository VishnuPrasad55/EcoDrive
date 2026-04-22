'use client'
import { AppShell } from '@/components/layout/AppShell'
import { DemandChart, CityComparisonChart, EVGrowthChart, UtilizationChart, CoverageGapChart, RevenueChart } from '@/components/analytics/Charts'
import { StatCard } from '@/components/ui'
import { MOCK_ANALYTICS_DATA } from '@/lib/mock-data'
import { BarChart3, TrendingUp, Zap, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  const lastMonth = MOCK_ANALYTICS_DATA.monthly_demand[11]
  const prevMonth = MOCK_ANALYTICS_DATA.monthly_demand[10]
  const growthPct = Math.round(((lastMonth.demand - prevMonth.demand) / prevMonth.demand) * 100)

  return (
    <AppShell title="Analytics" subtitle="EV charging demand and infrastructure metrics">
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Dec Demand (kWh)" value={lastMonth.demand.toLocaleString()} trend={growthPct} color="flux" icon={<BarChart3 className="w-4 h-4" />} delay={0} />
          <StatCard label="Monthly Sessions" value={lastMonth.sessions.toLocaleString()} trend={12} color="surge" icon={<Zap className="w-4 h-4" />} delay={0.05} />
          <StatCard label="Monthly Revenue" value={`₹${lastMonth.revenue_lakh}L`} trend={9} color="spark" icon={<TrendingUp className="w-4 h-4" />} delay={0.1} />
          <StatCard label="Avg Utilization" value="61.4%" trend={5} color="flux" icon={<Activity className="w-4 h-4" />} delay={0.15} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DemandChart />
          <UtilizationChart />
          <CoverageGapChart />
          <RevenueChart />
          <EVGrowthChart />
          <CityComparisonChart />
        </div>
      </div>
    </AppShell>
  )
}
