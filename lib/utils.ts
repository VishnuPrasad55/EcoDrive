import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export function formatCurrency(crore: number): string {
  return `₹${crore.toFixed(1)} Cr`
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function interpolateColor(value: number, min = 0, max = 100): string {
  const ratio = (value - min) / (max - min)
  const r = Math.round(255 * (1 - ratio))
  const g = Math.round(255 * ratio)
  return `rgb(${r}, ${g}, 60)`
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#00f07a'
  if (score >= 60) return '#22d3ee'
  if (score >= 40) return '#facc15'
  return '#ef4444'
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return '#00f07a'
    case 'inactive': return '#6b7280'
    case 'construction': return '#facc15'
    default: return '#9ca3af'
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadCSV(rows: Record<string, unknown>[], filename: string): void {
  if (rows.length === 0) return
  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')),
  ].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function stationsToCSVRows(stations: import('@/types').ChargingStation[]): Record<string, unknown>[] {
  return stations.map((s) => ({
    id: s.id,
    name: s.name,
    latitude: s.coordinates.lat,
    longitude: s.coordinates.lng,
    type: s.type,
    score: s.score ?? '',
    capacity: s.capacity,
    power_kw: s.power_output_kw,
    connector_types: s.connector_types.join(';'),
    coverage_radius_km: s.coverage_radius_km ?? '',
    demand_served: s.demand_served ?? '',
    city: s.city,
    state: s.state,
    status: s.status,
  }))
}

export function clampTo(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}
