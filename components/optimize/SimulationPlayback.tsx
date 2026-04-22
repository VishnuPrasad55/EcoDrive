'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, SkipForward, Activity } from 'lucide-react'
import { SimulationStep } from '@/types'
import { Button } from '@/components/ui'

interface SimulationPlaybackProps {
  steps: SimulationStep[]
  onStepChange?: (step: SimulationStep) => void
}

export function SimulationPlayback({ steps, onStepChange }: SimulationPlaybackProps) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000)

  const currentStep = steps[currentIdx]

  const advance = useCallback(() => {
    setCurrentIdx((prev) => {
      const next = prev + 1
      if (next >= steps.length) {
        setIsPlaying(false)
        return prev
      }
      return next
    })
  }, [steps.length])

  useEffect(() => {
    if (!isPlaying) return
    const timer = setInterval(advance, speed)
    return () => clearInterval(timer)
  }, [isPlaying, advance, speed])

  useEffect(() => {
    if (currentStep && onStepChange) onStepChange(currentStep)
  }, [currentStep, onStepChange])

  const reset = () => {
    setIsPlaying(false)
    setCurrentIdx(0)
  }

  if (steps.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-5 border border-surge-500/20"
    >
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-surge-400" />
        <h3 className="font-display font-semibold text-white text-sm">Simulation Playback</h3>
        <span className="ml-auto text-xs font-mono text-white/40">
          Step {currentIdx + 1} / {steps.length}
        </span>
      </div>

      <div className="relative mb-4">
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${((currentIdx + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-surge-400 to-eco-400 rounded-full"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="glass rounded-lg p-3 mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-surge-400">Step {currentStep?.step}</span>
            <div className="flex items-center gap-3 text-xs text-white/60">
              <span>Coverage: <span className="text-flux-400 font-mono">{currentStep?.coverage_pct}%</span></span>
              <span>Score: <span className="text-spark-400 font-mono">{currentStep?.score}</span></span>
            </div>
          </div>
          <p className="text-xs text-white/70">{currentStep?.description}</p>
          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${currentStep?.coverage_pct}%` }}
              className="h-full bg-flux-400 rounded-full"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={reset} icon={<RotateCcw className="w-3.5 h-3.5" />}>
          Reset
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          icon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          className="flex-1"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => { advance(); setIsPlaying(false) }}
          icon={<SkipForward className="w-3.5 h-3.5" />}
        >
          Step
        </Button>
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="glass rounded-lg px-2 py-1.5 text-xs text-white/60 bg-transparent border border-white/10 focus:outline-none"
        >
          <option value={2000} className="bg-gray-900">0.5x</option>
          <option value={1000} className="bg-gray-900">1x</option>
          <option value={500} className="bg-gray-900">2x</option>
          <option value={250} className="bg-gray-900">4x</option>
        </select>
      </div>
    </motion.div>
  )
}
