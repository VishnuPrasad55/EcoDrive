import { NextRequest, NextResponse } from 'next/server'
import { generateExistingStations, INDIAN_REGIONS } from '@/lib/mock-data'
import { supabase } from '@/lib/supabase'

function mapRowToStation(row: any) {
  return {
    id: row.id,
    name: row.name || 'Charging Station',
    type: row.type || 'existing',
    coordinates: { lat: Number(row.lat), lng: Number(row.lng) },
    connector_types: row.connector_types || ['CCS'],
    capacity: row.capacity || 2,
    utilization_rate: Number(row.utilization_rate ?? 0),
    power_output_kw: row.power_output_kw || 22,
    status: row.status || 'active',
    city: row.city || '',
    state: row.state || '',
    address: row.address || '',
    score: row.score,
    coverage_radius_km: Number(row.coverage_radius_km ?? 2.5),
    demand_served: Number(row.demand_served ?? 0),
    population_density: row.population_density || 0,
    traffic_index: Number(row.traffic_index ?? 0),
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const regionId = searchParams.get('region') || 'bangalore'
  const type = searchParams.get('type') // 'existing' | 'suggested' | 'all'

  const region = INDIAN_REGIONS.find((r) => r.id === regionId) || INDIAN_REGIONS[2]
  let stations = generateExistingStations(region)

  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const city = region.name.split(',')[0]
    const query = supabase.from('charging_stations').select('*').eq('city', city).limit(200)
    const { data, error } = await query

    if (!error && Array.isArray(data) && data.length > 0) {
      stations = data.map(mapRowToStation)
    }
  }

  const filtered = type && type !== 'all' ? stations.filter((s) => s.type === type) : stations

  return NextResponse.json({
    success: true,
    region: regionId,
    count: filtered.length,
    stations: filtered,
  })
}
