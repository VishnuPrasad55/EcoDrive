'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  ChargingStation,
  OptimizationResult,
  Region,
  FilterState,
  SavedPlan,
} from '@/types'
import { INDIAN_REGIONS } from './mock-data'

interface AppState {
  selectedRegion: Region
  setSelectedRegion: (region: Region) => void

  existingStations: ChargingStation[]
  setExistingStations: (stations: ChargingStation[]) => void

  suggestedStations: ChargingStation[]
  setSuggestedStations: (stations: ChargingStation[]) => void

  filters: FilterState
  setFilters: (filters: Partial<FilterState>) => void

  currentOptimization: OptimizationResult | null
  setCurrentOptimization: (result: OptimizationResult | null) => void

  optimizationHistory: OptimizationResult[]
  setOptimizationHistory: (results: OptimizationResult[]) => void
  addOptimizationResult: (result: OptimizationResult) => void

  savedPlans: SavedPlan[]
  setSavedPlans: (plans: SavedPlan[]) => void
  addSavedPlan: (plan: SavedPlan) => void
  removeSavedPlan: (id: string) => void

  isOptimizing: boolean
  setIsOptimizing: (v: boolean) => void

  simulationStep: number
  setSimulationStep: (step: number) => void

  mapCenter: [number, number]
  setMapCenter: (center: [number, number]) => void

  mapZoom: number
  setMapZoom: (zoom: number) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedRegion: INDIAN_REGIONS[2],
      setSelectedRegion: (region) => set({ selectedRegion: region, mapCenter: [region.center.lat, region.center.lng] }),

      existingStations: [],
      setExistingStations: (stations) => set({ existingStations: stations }),

      suggestedStations: [],
      setSuggestedStations: (stations) => set({ suggestedStations: stations }),

      filters: {
        region: 'bangalore',
        demand_min: 0,
        demand_max: 100,
        show_existing: true,
        show_suggested: true,
        show_planned: true,
        connector_types: [],
        status: [],
      },
      setFilters: (partial) => set((s) => ({ filters: { ...s.filters, ...partial } })),

      currentOptimization: null,
      setCurrentOptimization: (result) => set({ currentOptimization: result }),

      optimizationHistory: [],
      setOptimizationHistory: (results) => set({ optimizationHistory: results }),
      addOptimizationResult: (result) =>
        set((s) => ({ optimizationHistory: [result, ...s.optimizationHistory].slice(0, 20) })),

      savedPlans: [],
      setSavedPlans: (plans) => set({ savedPlans: plans }),
      addSavedPlan: (plan) => set((s) => ({ savedPlans: [plan, ...s.savedPlans] })),
      removeSavedPlan: (id) => set((s) => ({ savedPlans: s.savedPlans.filter((p) => p.id !== id) })),

      isOptimizing: false,
      setIsOptimizing: (v) => set({ isOptimizing: v }),

      simulationStep: 0,
      setSimulationStep: (step) => set({ simulationStep: step }),

      mapCenter: [12.972, 77.594],
      setMapCenter: (center) => set({ mapCenter: center }),

      mapZoom: 12,
      setMapZoom: (zoom) => set({ mapZoom: zoom }),
    }),
    {
      name: 'ecodrive-flux-v2',
      partialize: (state) => ({
        savedPlans: state.savedPlans,
        optimizationHistory: state.optimizationHistory,
        selectedRegion: state.selectedRegion,
        filters: state.filters,
      }),
    }
  )
)
