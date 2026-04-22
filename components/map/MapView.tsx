'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChargingStation } from '@/types'
import { getScoreColor } from '@/lib/utils'

interface MapViewProps {
  existingStations: ChargingStation[]
  suggestedStations: ChargingStation[]
  center: [number, number]
  zoom?: number
  onStationClick?: (station: ChargingStation) => void
  className?: string
}

export function MapView({ existingStations, suggestedStations, center, zoom = 12, onStationClick, className = '' }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null)
  const markersRef = useRef<ReturnType<typeof import('leaflet')['marker']>[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return
    let mounted = true

    const init = async () => {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (!mounted || !mapRef.current) return
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null }

      const map = L.map(mapRef.current, { center, zoom, zoomControl: true, attributionControl: true })
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      mapInstanceRef.current = map
      setIsLoaded(true)
    }

    init()
    return () => { mounted = false; if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null } }
  }, [])

  useEffect(() => {
    if (mapInstanceRef.current) mapInstanceRef.current.setView(center, zoom, { animate: true })
  }, [center, zoom])

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    const addMarkers = async () => {
      const L = (await import('leaflet')).default
      const map = mapInstanceRef.current
      if (!map) return

      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      const createIcon = (color: string, size: number, pulse: boolean) => L.divIcon({
        className: '',
        html: `<div style="
          width:${size}px;height:${size}px;
          background:${color};border-radius:50%;
          border:2px solid rgba(255,255,255,0.55);
          box-shadow:0 0 ${pulse ? 14 : 6}px ${color}${pulse ? ',0 0 28px ' + color + '50' : ''};
          cursor:pointer;transition:transform 0.18s,box-shadow 0.18s;
        "
        onmouseenter="this.style.transform='scale(1.45)';this.style.boxShadow='0 0 24px ${color},0 0 48px ${color}60'"
        onmouseleave="this.style.transform='scale(1)';this.style.boxShadow='0 0 ${pulse ? 14 : 6}px ${color}'"
        ></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      const all = [
        ...existingStations.map(s => ({ ...s, _ex: true })),
        ...suggestedStations.map(s => ({ ...s, _ex: false })),
      ]

      all.forEach(station => {
        if (!station.coordinates) return
        const isExisting = station.type === 'existing'
        // New color scheme: existing = amber/teal, suggested = indigo/violet based on score
        const color = isExisting
          ? station.status === 'active' ? '#f59e0b' : '#475569'
          : station.score! >= 80 ? '#a78bfa' : station.score! >= 60 ? '#6b6bec' : '#38bdf8'
        const size = isExisting ? 10 : 13

        const icon = createIcon(color, size, !isExisting && (station.score ?? 0) >= 75)
        const marker = L.marker([station.coordinates.lat, station.coordinates.lng], { icon })

        marker.bindPopup(`
          <div style="font-family:system-ui;min-width:200px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <div style="width:8px;height:8px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color};"></div>
              <strong style="color:#e2e8f0;font-size:13px;">${station.name}</strong>
            </div>
            <div style="font-size:11px;color:#94a3b8;line-height:1.9;">
              <div>Type: <span style="color:#e2e8f0">${isExisting ? 'Existing' : '⚡ AI Suggested'}</span></div>
              ${station.score ? `<div>Score: <span style="color:${color};font-weight:700">${station.score}/100</span></div>` : ''}
              ${station.power_output_kw ? `<div>Power: <span style="color:#e2e8f0">${station.power_output_kw} kW</span></div>` : ''}
              ${station.capacity ? `<div>Ports: <span style="color:#e2e8f0">${station.capacity}</span></div>` : ''}
              ${station.connector_types?.length ? `<div>Connectors: <span style="color:#e2e8f0">${station.connector_types.join(', ')}</span></div>` : ''}
              ${station.demand_served ? `<div>Demand served: <span style="color:#f59e0b">${station.demand_served.toLocaleString()}</span></div>` : ''}
              <div style="margin-top:5px;padding-top:5px;border-top:1px solid rgba(255,255,255,0.1);">${station.city}</div>
            </div>
          </div>
        `, { maxWidth: 280 })

        marker.on('click', () => { if (onStationClick) onStationClick(station) })
        marker.addTo(map)
        markersRef.current.push(marker)
      })
    }
    addMarkers()
  }, [existingStations, suggestedStations, isLoaded, onStationClick])

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/80 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-flux-400 border-t-transparent rounded-full animate-spin" style={{ boxShadow: '0 0 16px rgba(245,158,11,0.5)' }} />
            <span className="text-sm text-flux-400 font-mono tracking-wider">Initialising map...</span>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-xl" />
      {isLoaded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="absolute bottom-4 left-4 glass rounded-xl p-3 z-[1000] space-y-2 border border-white/8">
          <p className="text-xs text-white/35 font-mono uppercase tracking-widest mb-2">Legend</p>
          {[
            { color: '#f59e0b', glow: true, label: 'Active Station' },
            { color: '#475569', glow: false, label: 'Inactive' },
            { color: '#a78bfa', glow: true, label: 'High-score Site' },
            { color: '#6b6bec', glow: true, label: 'AI Suggested' },
          ].map(({ color, glow, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ background: color, boxShadow: glow ? `0 0 8px ${color}` : 'none' }} />
              <span className="text-xs text-white/55">{label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
