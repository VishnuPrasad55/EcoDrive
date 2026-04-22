import { ChargingStation, Region, DemandZone, AnalyticsData } from '@/types'

export const INDIAN_REGIONS: Region[] = [
  {
    id: 'mumbai',
    name: 'Mumbai Metropolitan Region',
    state: 'Maharashtra',
    center: { lat: 19.076, lng: 72.877 },
    bounds: [{ lat: 18.89, lng: 72.77 }, { lat: 19.27, lng: 73.00 }],
    population: 20667656,
    area_km2: 603,
    ev_registrations: 48230,
    charging_gap_score: 72,
  },
  {
    id: 'delhi',
    name: 'Delhi NCR',
    state: 'Delhi',
    center: { lat: 28.704, lng: 77.102 },
    bounds: [{ lat: 28.40, lng: 76.84 }, { lat: 28.88, lng: 77.35 }],
    population: 32941309,
    area_km2: 1484,
    ev_registrations: 89540,
    charging_gap_score: 65,
  },
  {
    id: 'bangalore',
    name: 'Bangalore Urban',
    state: 'Karnataka',
    center: { lat: 12.972, lng: 77.594 },
    bounds: [{ lat: 12.83, lng: 77.46 }, { lat: 13.14, lng: 77.77 }],
    population: 13608613,
    area_km2: 741,
    ev_registrations: 62810,
    charging_gap_score: 58,
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad Metropolitan',
    state: 'Telangana',
    center: { lat: 17.385, lng: 78.486 },
    bounds: [{ lat: 17.20, lng: 78.30 }, { lat: 17.57, lng: 78.68 }],
    population: 10534418,
    area_km2: 650,
    ev_registrations: 31420,
    charging_gap_score: 75,
  },
  {
    id: 'pune',
    name: 'Pune Metropolitan',
    state: 'Maharashtra',
    center: { lat: 18.521, lng: 73.855 },
    bounds: [{ lat: 18.38, lng: 73.73 }, { lat: 18.65, lng: 73.99 }],
    population: 7276143,
    area_km2: 331,
    ev_registrations: 28600,
    charging_gap_score: 68,
  },
  {
    id: 'chennai',
    name: 'Chennai Metropolitan',
    state: 'Tamil Nadu',
    center: { lat: 13.082, lng: 80.272 },
    bounds: [{ lat: 12.93, lng: 80.12 }, { lat: 13.24, lng: 80.42 }],
    population: 10971108,
    area_km2: 426,
    ev_registrations: 24350,
    charging_gap_score: 71,
  },
]

export const generateExistingStations = (region: Region): ChargingStation[] => {
  const { center, id } = region
  const stations: ChargingStation[] = []
  const count = Math.floor(Math.random() * 15) + 10

  const connectorSets: Array<ChargingStation['connector_types']> = [
    ['CCS', 'Type2'],
    ['CHAdeMO', 'CCS'],
    ['Type2'],
    ['CCS'],
    ['GB/T', 'CCS'],
  ]

  for (let i = 0; i < count; i++) {
    const latOffset = (Math.random() - 0.5) * 0.18
    const lngOffset = (Math.random() - 0.5) * 0.18
    const idx = Math.floor(Math.random() * connectorSets.length)

    stations.push({
      id: `${id}-existing-${i}`,
      name: `${region.name} Station ${i + 1}`,
      coordinates: { lat: center.lat + latOffset, lng: center.lng + lngOffset },
      type: 'existing',
      connector_types: connectorSets[idx],
      capacity: Math.floor(Math.random() * 8) + 2,
      utilization_rate: Math.random() * 0.6 + 0.3,
      power_output_kw: [22, 50, 75, 150][Math.floor(Math.random() * 4)],
      status: Math.random() > 0.1 ? 'active' : 'inactive',
      city: region.name,
      state: region.state,
      address: `Station ${i + 1}, ${region.name}`,
      coverage_radius_km: 2.5,
      population_density: Math.floor(Math.random() * 15000) + 5000,
      traffic_index: Math.random() * 0.8 + 0.2,
    })
  }
  return stations
}

export const generateSuggestedStations = (region: Region, count: number = 8): ChargingStation[] => {
  const { center, id } = region
  const stations: ChargingStation[] = []
  const scores = Array.from({ length: count }, () => Math.random() * 0.4 + 0.6)
  scores.sort((a, b) => b - a)

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * 2 * Math.PI + Math.random() * 0.5
    const radius = Math.random() * 0.12 + 0.04
    const lat = center.lat + Math.cos(angle) * radius
    const lng = center.lng + Math.sin(angle) * radius * 1.2

    stations.push({
      id: `${id}-suggested-${i}`,
      name: `Optimal Site ${String.fromCharCode(65 + i)}`,
      coordinates: { lat, lng },
      type: 'suggested',
      connector_types: ['CCS', 'Type2'],
      capacity: Math.floor(Math.random() * 6) + 4,
      utilization_rate: 0,
      power_output_kw: [75, 150, 250][Math.floor(Math.random() * 3)],
      status: 'construction',
      city: region.name,
      state: region.state,
      address: `Proposed Site ${i + 1}`,
      score: Math.round(scores[i] * 100),
      coverage_radius_km: 3.5,
      demand_served: Math.floor(Math.random() * 5000) + 2000,
      population_density: Math.floor(Math.random() * 20000) + 8000,
      traffic_index: Math.random() * 0.5 + 0.5,
    })
  }
  return stations
}

export const MOCK_ANALYTICS_DATA: AnalyticsData = {
  monthly_demand: [
    { month: 'Jan', demand: 12400, capacity: 18000, sessions: 8240, revenue_lakh: 24.6 },
    { month: 'Feb', demand: 13100, capacity: 18000, sessions: 8710, revenue_lakh: 26.1 },
    { month: 'Mar', demand: 14800, capacity: 19200, sessions: 9840, revenue_lakh: 29.5 },
    { month: 'Apr', demand: 16200, capacity: 20400, sessions: 10780, revenue_lakh: 32.4 },
    { month: 'May', demand: 17900, capacity: 20400, sessions: 11900, revenue_lakh: 35.8 },
    { month: 'Jun', demand: 15600, capacity: 21600, sessions: 10380, revenue_lakh: 31.2 },
    { month: 'Jul', demand: 14200, capacity: 21600, sessions: 9450, revenue_lakh: 28.4 },
    { month: 'Aug', demand: 16800, capacity: 22800, sessions: 11170, revenue_lakh: 33.6 },
    { month: 'Sep', demand: 18900, capacity: 22800, sessions: 12570, revenue_lakh: 37.8 },
    { month: 'Oct', demand: 21400, capacity: 24000, sessions: 14230, revenue_lakh: 42.8 },
    { month: 'Nov', demand: 23100, capacity: 26400, sessions: 15370, revenue_lakh: 46.2 },
    { month: 'Dec', demand: 25800, capacity: 28800, sessions: 17160, revenue_lakh: 51.6 },
  ],
  city_comparison: [
    { city: 'Delhi', stations: 312, ev_vehicles: 89540, coverage_pct: 67, gap_score: 65 },
    { city: 'Mumbai', stations: 198, ev_vehicles: 48230, coverage_pct: 58, gap_score: 72 },
    { city: 'Bangalore', stations: 245, ev_vehicles: 62810, coverage_pct: 71, gap_score: 58 },
    { city: 'Hyderabad', stations: 134, ev_vehicles: 31420, coverage_pct: 49, gap_score: 75 },
    { city: 'Pune', stations: 112, ev_vehicles: 28600, coverage_pct: 53, gap_score: 68 },
    { city: 'Chennai', stations: 98, ev_vehicles: 24350, coverage_pct: 45, gap_score: 71 },
  ],
  utilization_by_type: [
    { type: 'DC Fast (150kW)', utilization: 78, stations: 342, avg_wait_min: 12 },
    { type: 'DC Ultra (250kW)', utilization: 84, stations: 128, avg_wait_min: 18 },
    { type: 'AC Level 2 (22kW)', utilization: 52, stations: 891, avg_wait_min: 4 },
    { type: 'AC Level 1 (7kW)', utilization: 31, stations: 1240, avg_wait_min: 2 },
  ],
  coverage_gap: [
    { zone: 'Central Business', population: 890000, ev_count: 12400, stations_needed: 45, stations_existing: 28 },
    { zone: 'Residential North', population: 2100000, ev_count: 28600, stations_needed: 82, stations_existing: 34 },
    { zone: 'Industrial South', population: 640000, ev_count: 8200, stations_needed: 28, stations_existing: 19 },
    { zone: 'Airport Corridor', population: 310000, ev_count: 5800, stations_needed: 18, stations_existing: 12 },
    { zone: 'Tech Parks East', population: 480000, ev_count: 9600, stations_needed: 32, stations_existing: 14 },
    { zone: 'Old City', population: 1820000, ev_count: 14200, stations_needed: 56, stations_existing: 21 },
  ],
  ev_growth: [
    { year: '2019', registrations: 168000, stations: 1200, ratio: 140 },
    { year: '2020', registrations: 154000, stations: 1580, ratio: 97 },
    { year: '2021', registrations: 329000, stations: 2140, ratio: 154 },
    { year: '2022', registrations: 1034000, stations: 3960, ratio: 261 },
    { year: '2023', registrations: 1507000, stations: 6840, ratio: 220 },
    { year: '2024', registrations: 1980000, stations: 12400, ratio: 160 },
    { year: '2025', registrations: 2740000, stations: 22800, ratio: 120 },
  ],
  heatmap_data: [],
}

export const DASHBOARD_STATS = {
  total_stations: 12847,
  active_stations: 11234,
  total_cities: 247,
  ev_vehicles_india: 4280000,
  avg_utilization: 61.4,
  coverage_pct: 54.8,
  optimizations_run: 3429,
  co2_saved_tonnes: 284500,
}
