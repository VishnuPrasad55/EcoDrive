import { NextResponse } from 'next/server'
import { MOCK_ANALYTICS_DATA, DASHBOARD_STATS } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json({
    success: true,
    dashboard_stats: DASHBOARD_STATS,
    analytics: MOCK_ANALYTICS_DATA,
    generated_at: new Date().toISOString(),
  })
}
