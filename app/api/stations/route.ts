import { NextRequest, NextResponse } from 'next/server'
import { generateExistingStations, INDIAN_REGIONS } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const regionId = searchParams.get('region') || 'bangalore'
  const type = searchParams.get('type') // 'existing' | 'suggested' | 'all'

  const region = INDIAN_REGIONS.find((r) => r.id === regionId) || INDIAN_REGIONS[2]
  const stations = generateExistingStations(region)

  const filtered = type && type !== 'all' ? stations.filter((s) => s.type === type) : stations

  return NextResponse.json({
    success: true,
    region: regionId,
    count: filtered.length,
    stations: filtered,
  })
}
