import { Region } from '@/types'

export interface GeoSearchResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  boundingbox: [string, string, string, string] // [minlat, maxlat, minlon, maxlon]
  type: string
  class: string
  address?: {
    city?: string
    town?: string
    village?: string
    state?: string
    country?: string
    country_code?: string
  }
}

/**
 * Search for cities/places using free Nominatim OpenStreetMap API.
 * Rate limit: max 1 req/second. No API key needed.
 */
export async function searchPlaces(query: string): Promise<GeoSearchResult[]> {
  if (!query.trim() || query.length < 2) return []

  try {
    const url = new URL('https://nominatim.openstreetmap.org/search')
    url.searchParams.set('q', query)
    url.searchParams.set('format', 'json')
    url.searchParams.set('limit', '6')
    url.searchParams.set('addressdetails', '1')
    url.searchParams.set('featuretype', 'city')

    const res = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'EcoDrive-EV-Planner/1.0 (educational project)',
        'Accept-Language': 'en',
      },
      next: { revalidate: 3600 }, // cache for 1 hour in Next.js
    })

    if (!res.ok) throw new Error(`Nominatim error: ${res.status}`)
    const data: GeoSearchResult[] = await res.json()

    // Filter to cities/urban areas and sort by relevance
    return data
      .filter(r => ['city', 'town', 'village', 'municipality', 'administrative'].includes(r.type) || r.class === 'place' || r.class === 'boundary')
      .slice(0, 5)
  } catch (err) {
    console.error('Geocoding failed:', err)
    return []
  }
}

/**
 * Convert a Nominatim result into a Region object for the optimizer.
 * Population is estimated from bounding box area since Nominatim doesn't provide it.
 */
export function nominatimToRegion(place: GeoSearchResult): Region {
  const [minLatStr, maxLatStr, minLonStr, maxLonStr] = place.boundingbox
  const minLat = parseFloat(minLatStr)
  const maxLat = parseFloat(maxLatStr)
  const minLon = parseFloat(minLonStr)
  const maxLon = parseFloat(maxLonStr)

  const centerLat = parseFloat(place.lat)
  const centerLng = parseFloat(place.lon)

  // Estimate area in km² using simple approximation
  const latKm = (maxLat - minLat) * 111
  const lngKm = (maxLon - minLon) * 111 * Math.cos((centerLat * Math.PI) / 180)
  const areaKm2 = Math.max(10, Math.round(latKm * lngKm))

  // Estimate population from area using average urban density ~5000 ppl/km²
  // Adjusted by city size (larger bbox = likely metro = higher density)
  const densityFactor = areaKm2 > 1000 ? 8000 : areaKm2 > 300 ? 5000 : areaKm2 > 50 ? 3000 : 1500
  const estimatedPopulation = Math.round(areaKm2 * densityFactor)

  // Estimate EV registrations (~1.1% of population in 2025 for Indian cities, ~0.5% for others)
  const isIndia = place.address?.country_code === 'in'
  const evRatio = isIndia ? 0.011 : 0.018
  const evRegistrations = Math.round(estimatedPopulation * evRatio)

  // Gap score: inversely related to area (smaller cities often have worse coverage)
  const gapScore = Math.min(90, Math.max(45, 85 - Math.log(areaKm2) * 4))

  const cityName = place.address?.city || place.address?.town || place.address?.village || place.display_name.split(',')[0].trim()
  const stateName = place.address?.state || ''
  const country = place.address?.country || ''

  return {
    id: `osm-${place.place_id}`,
    name: cityName + (stateName ? `, ${stateName}` : '') + (country && !stateName ? `, ${country}` : ''),
    state: stateName || country,
    center: { lat: centerLat, lng: centerLng },
    bounds: [
      { lat: minLat, lng: minLon },
      { lat: maxLat, lng: maxLon },
    ],
    population: estimatedPopulation,
    area_km2: areaKm2,
    ev_registrations: evRegistrations,
    charging_gap_score: Math.round(gapScore),
  }
}

/**
 * Get display label for a search result
 */
export function getPlaceLabel(place: GeoSearchResult): string {
  const parts = place.display_name.split(',')
  return parts.slice(0, 3).join(',').trim()
}
