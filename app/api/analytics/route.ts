import { NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase-server'
import { MOCK_ANALYTICS_DATA, DASHBOARD_STATS } from '@/lib/mock-data'

export async function GET() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = createSupabaseAdminClient()
      const [{ count: optCount }, { count: planCount }, { count: stationCount }] = await Promise.all([
        supabase.from('optimization_results').select('id', { count: 'exact', head: true }),
        supabase.from('saved_plans').select('id', { count: 'exact', head: true }),
        supabase.from('charging_stations').select('id', { count: 'exact', head: true }),
      ])

      const dashboard_stats = {
        ...DASHBOARD_STATS,
        total_stations: stationCount ?? DASHBOARD_STATS.total_stations,
        optimizations_run: optCount ?? DASHBOARD_STATS.optimizations_run,
      }

      return NextResponse.json({
        success: true,
        dashboard_stats,
        analytics: MOCK_ANALYTICS_DATA,
        saved_plans: planCount ?? 0,
        generated_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Analytics API error:', error)
    }
  }

  return NextResponse.json({
    success: true,
    dashboard_stats: DASHBOARD_STATS,
    analytics: MOCK_ANALYTICS_DATA,
    generated_at: new Date().toISOString(),
  })
}
