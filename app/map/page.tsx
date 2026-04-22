'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { Filter, RefreshCw } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { MapFilters } from '@/components/map/MapFilters'
import { StationDetail } from '@/components/map/StationDetail'
import { CitySearch } from '@/components/map/CitySearch'
import { Badge, Button } from '@/components/ui'
import { useAppStore } from '@/lib/store'
import { generateExistingStations } from '@/lib/mock-data'
import { ChargingStation, Region } from '@/types'
import { toast } from '@/components/ui/toaster'

const MapView = dynamic(() => import('@/components/map/MapView').then(m => ({ default: m.MapView })), { ssr: false })

export default function MapPage() {
  const { selectedRegion, setSelectedRegion, existingStations, suggestedStations, setExistingStations, filters, mapCenter, setMapCenter } = useAppStore()
  const [selectedStation, setSelectedStation] = useState<ChargingStation | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (existingStations.length === 0) setExistingStations(generateExistingStations(selectedRegion))
  }, [selectedRegion, existingStations.length, setExistingStations])

  const handleCitySelect = (region: Region) => {
    setSelectedRegion(region)
    setMapCenter([region.center.lat, region.center.lng])
    setExistingStations(generateExistingStations(region))
    toast(`Navigated to ${region.name.split(',')[0]}`, 'info')
  }

  const filteredExisting = filters.show_existing ? existingStations : []
  const filteredSuggested = filters.show_suggested ? suggestedStations : []

  return (
    <AppShell title="Live Map" subtitle={`${filteredExisting.length + filteredSuggested.length} stations visible`}>
      <div className="flex h-[calc(100vh-3.5rem)]">
        <div className="flex-1 relative p-3">
          <MapView
            existingStations={filteredExisting}
            suggestedStations={filteredSuggested}
            center={mapCenter}
            zoom={12}
            onStationClick={setSelectedStation}
            className="h-full rounded-xl"
          />

          {/* City search overlay */}
          <div className="absolute top-7 left-1/2 -translate-x-1/2 w-80 z-[1000]">
            <CitySearch
              onSelect={handleCitySelect}
              placeholder="Jump to any city..."
              defaultValue={selectedRegion.name.split(',')[0]}
            />
          </div>

          {/* Controls */}
          <div className="absolute top-7 right-7 flex gap-2 z-[999]">
            <Button variant="secondary" size="sm" icon={<Filter className="w-3.5 h-3.5" />} onClick={() => setShowFilters(!showFilters)}>
              Filters
            </Button>
            <Button variant="secondary" size="sm" icon={<RefreshCw className="w-3.5 h-3.5" />}
              onClick={() => { setExistingStations(generateExistingStations(selectedRegion)); toast('Stations refreshed', 'info') }}>
              Refresh
            </Button>
          </div>

          {/* Station badges */}
          <div className="absolute bottom-20 left-7 flex gap-2 z-[999]">
            <Badge variant="flux">{filteredExisting.length} Existing</Badge>
            {filteredSuggested.length > 0 && <Badge variant="surge">{filteredSuggested.length} AI Suggested</Badge>}
          </div>

          {/* Station detail */}
          {selectedStation && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-24 left-7 z-[1000]">
              <StationDetail station={selectedStation} onClose={() => setSelectedStation(null)} />
            </motion.div>
          )}
        </div>

        {/* Filters sidebar */}
        {showFilters && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
            className="w-72 p-3 pl-0 flex-shrink-0">
            <MapFilters onClose={() => setShowFilters(false)} />
          </motion.div>
        )}
      </div>
    </AppShell>
  )
}
