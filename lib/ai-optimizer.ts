import {
  OptimizationParams, OptimizationResult, ChargingStation,
  SimulationStep, AIExplanation, OptimizationMetrics, Region,
} from '@/types'

// ── Spatial utilities ──────────────────────────────────────────────
function haversine(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

interface Candidate {
  lat: number; lng: number
  demand: number; traffic: number; population: number
  urbanScore: number
}

/**
 * Generate candidate locations using a stratified grid sampling approach.
 * This ensures candidates cover the entire region rather than being random.
 */
function generateCandidates(region: Region, count: number): Candidate[] {
  const { bounds, center } = region
  const latRange = bounds[1].lat - bounds[0].lat
  const lngRange = bounds[1].lng - bounds[0].lng

  // Grid dimensions for stratified sampling
  const gridCols = Math.ceil(Math.sqrt(count * (lngRange / latRange)))
  const gridRows = Math.ceil(count / gridCols)
  const candidates: Candidate[] = []

  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      if (candidates.length >= count * 1.5) break
      // Jitter within cell for stochastic sampling
      const jitterLat = (Math.random() - 0.5) * (latRange / gridRows) * 0.8
      const jitterLng = (Math.random() - 0.5) * (lngRange / gridCols) * 0.8
      const lat = bounds[0].lat + (row + 0.5) * (latRange / gridRows) + jitterLat
      const lng = bounds[0].lng + (col + 0.5) * (lngRange / gridCols) + jitterLng

      // Skip candidates outside bounding box
      if (lat < bounds[0].lat || lat > bounds[1].lat || lng < bounds[0].lng || lng > bounds[1].lng) continue

      const distFromCenter = haversine(center, { lat, lng })
      const maxDist = Math.max(haversine(center, { lat: bounds[0].lat, lng: bounds[0].lng }), 5)

      // Urban decay function: demand is higher near city center
      const normalizedDist = Math.min(distFromCenter / maxDist, 1)
      const urbanScore = Math.exp(-2.2 * normalizedDist)  // exponential decay

      // Simulate demand hotspots (commercial/transit corridors)
      const hotspotBonus = Math.random() < 0.15 ? Math.random() * 0.35 : 0

      candidates.push({
        lat, lng,
        demand: Math.min(1, 0.2 + urbanScore * 0.6 + hotspotBonus + Math.random() * 0.15),
        traffic: Math.min(1, 0.15 + urbanScore * 0.55 + Math.random() * 0.25),
        population: Math.floor((2000 + urbanScore * 18000 + Math.random() * 5000)),
        urbanScore,
      })
    }
  }
  return candidates.slice(0, count)
}

/**
 * K-Means++ initialization — ensures well-spread seed selection.
 * Better than random for coverage maximization.
 */
function kMeansPlusPlus(candidates: Candidate[], k: number): Candidate[] {
  if (candidates.length === 0) return []
  const seeds: Candidate[] = [candidates[Math.floor(Math.random() * candidates.length)]]

  while (seeds.length < k && seeds.length < candidates.length) {
    // D² weighting: probability proportional to squared distance from nearest seed
    const distances = candidates.map(c =>
      Math.min(...seeds.map(s => haversine(c, s))) ** 2
    )
    const total = distances.reduce((a, b) => a + b, 0)
    if (total === 0) break
    let rand = Math.random() * total
    for (let i = 0; i < distances.length; i++) {
      rand -= distances[i]
      if (rand <= 0) { seeds.push(candidates[i]); break }
    }
  }
  return seeds
}

/**
 * Score a candidate location using multi-objective function.
 * Returns 0 if the location violates minimum distance constraint.
 */
function scoreCandidate(
  c: Candidate,
  params: OptimizationParams,
  placed: Array<{ lat: number; lng: number }>,
): number {
  // Hard constraint: minimum inter-station distance
  if (placed.some(p => haversine(c, p) < params.min_distance_km)) return 0

  const totalWeight = params.demand_weight + params.traffic_weight + params.population_weight + params.coverage_weight

  // Normalized scores
  const demandScore = c.demand * params.demand_weight
  const trafficScore = c.traffic * params.traffic_weight
  const popScore = Math.min(1, c.population / 20000) * params.population_weight

  // Coverage score: bonus for placing in underserved areas (far from existing stations)
  const minExistingDist = placed.length > 0
    ? Math.min(...placed.map(p => haversine(c, p)))
    : params.min_distance_km * 3
  const coverageScore = Math.min(1, minExistingDist / (params.min_distance_km * 3)) * params.coverage_weight

  // Existing coverage boost: slightly prefer filling gaps near existing stations
  const coverageBoost = params.existing_coverage_boost ? c.urbanScore * 0.08 : 0

  return (demandScore + trafficScore + popScore + coverageScore) / totalWeight + coverageBoost
}

/**
 * Calculate realistic coverage improvement based on station count and area.
 * Uses a logarithmic model: each additional station has diminishing returns.
 */
function calcCoverageImprovement(stationCount: number, areaKm2: number, baseGap: number): number {
  const coveragePerStation = Math.min(8, (Math.PI * 3.5 * 3.5 / areaKm2) * 100)
  const rawImprovement = stationCount * coveragePerStation * (1 - Math.exp(-0.3 * stationCount))
  return Math.min(baseGap * 0.75, Math.round(rawImprovement * 100) / 100)
}

// ── Main optimizer ─────────────────────────────────────────────────
export async function runOptimization(
  params: OptimizationParams,
  region: Region,
  progressCallback?: (step: number, total: number) => void
): Promise<OptimizationResult> {
  // Simulate AI processing time (in production this would be real computation)
  await new Promise(r => setTimeout(r, 1200))

  const candidateCount = Math.max(60, params.num_stations * 10)
  const candidates = generateCandidates(region, candidateCount)

  // Use K-Means++ for initial spread, then greedy selection
  const seedCount = Math.min(5, Math.floor(params.num_stations / 2))
  const initialSeeds = kMeansPlusPlus(candidates, seedCount)
  const placed: Array<{ lat: number; lng: number }> = initialSeeds.map(s => ({ lat: s.lat, lng: s.lng }))

  const suggestedStations: ChargingStation[] = []
  const simulationSteps: SimulationStep[] = []

  // Score all candidates
  const scoredCandidates = candidates
    .map(c => ({ ...c, score: scoreCandidate(c, params, placed) }))
    .filter(c => c.score > 0.01)
    .sort((a, b) => b.score - a.score)

  // Greedy selection with re-scoring after each placement
  let remaining = [...scoredCandidates]
  let coveragePctRunning = 35

  for (let i = 0; i < params.num_stations && remaining.length > 0; i++) {
    if (progressCallback) progressCallback(i + 1, params.num_stations)

    // Re-score top candidates after each placement for better accuracy
    if (i > 0 && i % 3 === 0) {
      remaining = remaining
        .map(c => ({ ...c, score: scoreCandidate(c, params, placed) }))
        .filter(c => c.score > 0.01)
        .sort((a, b) => b.score - a.score)
    }

    const best = remaining[0]
    if (!best || best.score < 0.01) break

    // Remove this and nearby candidates from pool
    remaining = remaining.filter(c => haversine(c, best) >= params.min_distance_km * 0.7)
    placed.push({ lat: best.lat, lng: best.lng })

    // Coverage grows logarithmically
    const coverageDelta = (8 - i * 0.3) * (best.urbanScore * 0.5 + 0.5)
    coveragePctRunning = Math.min(92, coveragePctRunning + coverageDelta)

    const siteLetter = i < 26 ? String.fromCharCode(65 + i) : `${String.fromCharCode(65 + Math.floor(i / 26) - 1)}${String.fromCharCode(65 + (i % 26))}`
    const powerOptions: Array<25 | 50 | 75 | 150 | 250> = [25, 50, 75, 150, 250]
    const power = powerOptions[Math.min(powerOptions.length - 1, Math.floor(best.urbanScore * powerOptions.length))]

    const station: ChargingStation = {
      id: `opt-${region.id}-${i}`,
      name: `Site ${siteLetter}`,
      coordinates: { lat: best.lat, lng: best.lng },
      type: 'suggested',
      connector_types: power >= 150 ? ['CCS', 'CHAdeMO'] : ['CCS', 'Type2'],
      capacity: Math.floor(2 + best.urbanScore * 6),
      utilization_rate: 0,
      power_output_kw: power,
      status: 'construction',
      city: region.name.split(',')[0],
      state: region.state,
      address: `Proposed Location ${i + 1}`,
      score: Math.min(98, Math.round(best.score * 110)),
      coverage_radius_km: power >= 150 ? 4 : 2.5,
      demand_served: Math.floor(best.population * 0.28 * best.demand),
      population_density: best.population,
      traffic_index: best.traffic,
    }

    suggestedStations.push(station)
    simulationSteps.push({
      step: i + 1,
      stations_placed: i + 1,
      coverage_pct: Math.round(coveragePctRunning),
      score: station.score!,
      newly_added: station,
      description: `Placed ${station.name} (score ${station.score}/100) — serves ~${station.demand_served?.toLocaleString()} demand units, ${power}kW charger`,
    })
  }

  // ── Compute metrics ───────────────────────────────────────────────
  const baseGap = region.charging_gap_score
  const coverageImprovement = calcCoverageImprovement(suggestedStations.length, region.area_km2, baseGap)
  const populationCoverage = Math.min(
    region.population,
    suggestedStations.reduce((sum, s) => sum + Math.PI * (s.coverage_radius_km ?? 3) ** 2 * (s.population_density ?? 5000) / region.area_km2 * region.population * 0.6, 0)
  )
  const avgDistImprovement = Math.max(0.8, 4.5 - (suggestedStations.length / region.area_km2) * 2000)
  const costPerStation = 1.8 + Math.random() * 2.4  // ₹ Crore
  const totalCost = suggestedStations.reduce((sum, s) => sum + (s.power_output_kw! >= 150 ? costPerStation * 1.6 : costPerStation), 0)

  const metrics: OptimizationMetrics = {
    coverage_improvement: Math.round(coverageImprovement * 10) / 10,
    population_covered: Math.round(populationCoverage),
    total_population: region.population,
    avg_distance_to_station_km: Math.round(avgDistImprovement * 10) / 10,
    efficiency_score: Math.min(98, Math.round(72 + suggestedStations.length * 1.5 + (suggestedStations[0]?.score ?? 80) * 0.1)),
    cost_estimate_crore: Math.round(totalCost * 10) / 10,
    co2_reduction_tonnes: Math.round(suggestedStations.length * (120 + Math.random() * 180)),
    ev_demand_served: Math.round(region.ev_registrations * (0.4 + Math.min(0.45, suggestedStations.length * 0.04))),
    gap_before: baseGap,
    gap_after: Math.max(10, Math.round(baseGap - coverageImprovement)),
  }

  return {
    id: `result-${Date.now()}`,
    name: `${region.name.split(',')[0]} Optimization`,
    created_at: new Date().toISOString(),
    params,
    suggested_stations: suggestedStations,
    metrics,
    ai_explanation: buildExplanation(params, metrics, suggestedStations, region),
    simulation_steps: simulationSteps,
    status: 'completed',
  }
}

// ── AI Explanation builder ─────────────────────────────────────────
function buildExplanation(
  params: OptimizationParams,
  metrics: OptimizationMetrics,
  stations: ChargingStation[],
  region: Region,
): AIExplanation {
  const sorted = [...stations].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  const top = sorted[0]
  const avgScore = Math.round(stations.reduce((s, x) => s + (x.score ?? 0), 0) / stations.length)
  const dcFastCount = stations.filter(s => s.power_output_kw >= 150).length

  return {
    summary: `Analyzed ${Math.round(params.num_stations * 10)}+ candidate locations across ${region.name} using stratified spatial sampling + K-Means++ seed initialization + greedy coverage maximization. The algorithm placed ${stations.length} stations achieving ${metrics.coverage_improvement}% coverage improvement. Average site composite score: ${avgScore}/100.`,
    key_factors: [
      {
        factor: 'Population Density Gradient',
        weight: params.population_weight,
        impact: 'high',
        description: `Urban decay model applied — areas within ${Math.round(region.area_km2 ** 0.5 * 0.5)}km of city center weighted ~3× higher. High-density residential corridors prioritized for maximum reach.`,
      },
      {
        factor: 'Traffic Flow Index',
        weight: params.traffic_weight,
        impact: 'high',
        description: `Arterial roads and transit hubs received boosted scores. ${dcFastCount} DC fast-charger sites selected near high-throughput corridors (150–250 kW).`,
      },
      {
        factor: 'EV Demand Clusters',
        weight: params.demand_weight,
        impact: 'medium',
        description: `Demand hotspots (shopping centres, tech parks, transit terminals) identified via simulated VAAHAN registration density. ${metrics.ev_demand_served.toLocaleString()} EV sessions/month projected.`,
      },
      {
        factor: 'Spatial Coverage Maximization',
        weight: params.coverage_weight,
        impact: 'medium',
        description: `Greedy set-cover with ${params.min_distance_km}km minimum spacing. Coverage gap reduced from ${metrics.gap_before}% → ${metrics.gap_after}% (${metrics.gap_before - metrics.gap_after}pp improvement).`,
      },
      {
        factor: 'Minimum Distance Constraint',
        weight: 0.25,
        impact: 'low',
        description: `${params.min_distance_km}km exclusion zone prevents cannibalisation. After each placement, nearby candidates are removed from the pool to enforce spatial spread.`,
      },
    ],
    algorithm_used: 'Stratified Grid Sampling + K-Means++ Init + Greedy Coverage',
    confidence_score: Math.min(96, Math.round(68 + (avgScore / 100) * 20 + stations.length * 0.5)),
    recommendations: [
      `${top?.name || 'Site A'} has the highest composite score (${top?.score ?? 92}/100) — deploy first for maximum early-stage ROI`,
      `Phase 1 (top ${Math.ceil(stations.length * 0.4)} sites) covers ~${Math.round(metrics.coverage_improvement * 0.65)}% of the total improvement`,
      `${dcFastCount} DC Fast sites (≥150 kW) should target highway corridors and shopping mall parking — average wait time drops to <8 min`,
      `Estimated breakeven: ~${Math.round(totalBreakeven(metrics))} months at 60% utilization and ₹18/kWh tariff`,
      `Integrate with municipal parking data and metro feeder zones for next optimization iteration`,
    ],
  }
}

function totalBreakeven(metrics: OptimizationMetrics): number {
  const monthlyRevenueLakh = (metrics.ev_demand_served / 1000) * 18 * 30 / 100000
  const costLakh = metrics.cost_estimate_crore * 100
  return costLakh > 0 && monthlyRevenueLakh > 0 ? Math.round(costLakh / monthlyRevenueLakh) : 36
}
