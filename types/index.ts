export interface Coordinates {
  lat: number
  lng: number
}

export interface ChargingStation {
  id: string
  name: string
  coordinates: Coordinates
  type: 'existing' | 'suggested' | 'planned'
  connector_types: ConnectorType[]
  capacity: number
  utilization_rate: number
  power_output_kw: number
  status: 'active' | 'inactive' | 'construction'
  city: string
  state: string
  address: string
  score?: number
  coverage_radius_km?: number
  demand_served?: number
  population_density?: number
  traffic_index?: number
}

export type ConnectorType = 'CCS' | 'CHAdeMO' | 'Type2' | 'GB/T' | 'Tesla'

export interface OptimizationParams {
  region: Region
  num_stations: number
  demand_weight: number
  coverage_weight: number
  traffic_weight: number
  population_weight: number
  min_distance_km: number
  budget_constraint?: number
  existing_coverage_boost: boolean
}

export interface OptimizationResult {
  id: string
  name: string
  created_at: string
  params: OptimizationParams
  suggested_stations: ChargingStation[]
  metrics: OptimizationMetrics
  ai_explanation: AIExplanation
  simulation_steps: SimulationStep[]
  status: 'pending' | 'running' | 'completed' | 'failed'
}

export interface OptimizationMetrics {
  coverage_improvement: number
  population_covered: number
  total_population: number
  avg_distance_to_station_km: number
  efficiency_score: number
  cost_estimate_crore: number
  co2_reduction_tonnes: number
  ev_demand_served: number
  gap_before: number
  gap_after: number
}

export interface AIExplanation {
  summary: string
  key_factors: ExplanationFactor[]
  algorithm_used: string
  confidence_score: number
  recommendations: string[]
}

export interface ExplanationFactor {
  factor: string
  weight: number
  impact: 'high' | 'medium' | 'low'
  description: string
}

export interface SimulationStep {
  step: number
  stations_placed: number
  coverage_pct: number
  score: number
  newly_added?: ChargingStation
  description: string
}

export interface Region {
  id: string
  name: string
  state: string
  center: Coordinates
  bounds: [Coordinates, Coordinates]
  population: number
  area_km2: number
  ev_registrations: number
  charging_gap_score: number
}

export interface DemandZone {
  id: string
  center: Coordinates
  radius_km: number
  demand_score: number
  population: number
  ev_vehicles: number
  avg_daily_trips: number
  zone_type: 'residential' | 'commercial' | 'industrial' | 'transit'
}

export interface AnalyticsData {
  monthly_demand: MonthlyDataPoint[]
  city_comparison: CityComparisonPoint[]
  utilization_by_type: UtilizationPoint[]
  coverage_gap: CoverageGapPoint[]
  ev_growth: EVGrowthPoint[]
  heatmap_data: HeatmapCell[]
}

export interface MonthlyDataPoint {
  month: string
  demand: number
  capacity: number
  sessions: number
  revenue_lakh: number
}

export interface CityComparisonPoint {
  city: string
  stations: number
  ev_vehicles: number
  coverage_pct: number
  gap_score: number
}

export interface UtilizationPoint {
  type: string
  utilization: number
  stations: number
  avg_wait_min: number
}

export interface CoverageGapPoint {
  zone: string
  population: number
  ev_count: number
  stations_needed: number
  stations_existing: number
}

export interface EVGrowthPoint {
  year: string
  registrations: number
  stations: number
  ratio: number
}

export interface HeatmapCell {
  lat: number
  lng: number
  intensity: number
}

export interface SavedPlan {
  id: string
  name: string
  created_at: string
  user_id: string
  optimization_result: OptimizationResult
  tags: string[]
  notes?: string
}

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  role: 'admin' | 'analyst' | 'viewer'
  created_at: string
  saved_plans_count: number
}

export interface FilterState {
  region: string
  demand_min: number
  demand_max: number
  show_existing: boolean
  show_suggested: boolean
  show_planned: boolean
  connector_types: ConnectorType[]
  status: string[]
}

export interface CompareResult {
  plan_a: OptimizationResult
  plan_b: OptimizationResult
  difference: {
    coverage: number
    efficiency: number
    cost: number
    stations_count: number
    population_covered: number
  }
}
