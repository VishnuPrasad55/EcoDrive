'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Loader2, Globe } from 'lucide-react'
import { searchPlaces, nominatimToRegion, getPlaceLabel, GeoSearchResult } from '@/lib/geocoding'
import { Region } from '@/types'
import { cn } from '@/lib/utils'

interface CitySearchProps {
  onSelect: (region: Region) => void
  placeholder?: string
  className?: string
  defaultValue?: string
}

export function CitySearch({ onSelect, placeholder = 'Search any city worldwide...', className, defaultValue }: CitySearchProps) {
  const [query, setQuery] = useState(defaultValue || '')
  const [results, setResults] = useState<GeoSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(defaultValue || '')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const data = await searchPlaces(q)
      setResults(data)
      setOpen(data.length > 0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (query === selected) return  // Don't re-search if this is the selected value
    debounceRef.current = setTimeout(() => search(query), 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, search, selected])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (place: GeoSearchResult) => {
    const label = getPlaceLabel(place)
    setQuery(label)
    setSelected(label)
    setOpen(false)
    setResults([])
    const region = nominatimToRegion(place)
    onSelect(region)
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className={cn(
        'flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200',
        'glass border',
        open ? 'border-flux-500/50 shadow-flux-glow' : 'border-white/10 hover:border-flux-500/30'
      )}>
        {loading
          ? <Loader2 className="w-4 h-4 text-flux-400 animate-spin flex-shrink-0" />
          : <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
        }
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setSelected('') }}
          onFocus={() => { if (results.length > 0) setOpen(true) }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none min-w-0"
          autoComplete="off"
        />
        {query && (
          <button onClick={() => { setQuery(''); setSelected(''); setResults([]); setOpen(false) }}
            className="text-white/20 hover:text-white/50 transition-colors text-xs px-1">✕</button>
        )}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full glass-strong rounded-xl border border-white/10 overflow-hidden z-50 shadow-glass-card"
          >
            <div className="px-3 py-1.5 border-b border-white/5 flex items-center gap-2">
              <Globe className="w-3 h-3 text-white/30" />
              <span className="text-xs text-white/30">Powered by OpenStreetMap (free)</span>
            </div>
            {results.map((place, i) => (
              <motion.button
                key={place.place_id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => handleSelect(place)}
                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-flux-500/8 transition-colors text-left group border-b border-white/5 last:border-0"
              >
                <MapPin className="w-4 h-4 text-flux-400/60 mt-0.5 flex-shrink-0 group-hover:text-flux-400 transition-colors" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white/80 group-hover:text-white transition-colors truncate">
                    {getPlaceLabel(place)}
                  </p>
                  <p className="text-xs text-white/30 truncate mt-0.5">
                    {place.display_name.split(',').slice(1, 4).join(',').trim()}
                  </p>
                </div>
                <span className="text-xs text-white/20 capitalize flex-shrink-0 mt-0.5">{place.type}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
