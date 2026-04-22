'use client'

import { motion } from 'framer-motion'
import { Brain, Target, CheckCircle, ChevronRight, Info } from 'lucide-react'
import { AIExplanation } from '@/types'
import { Badge } from '@/components/ui'

interface AIExplanationPanelProps {
  explanation: AIExplanation
}

export function AIExplanationPanel({ explanation }: AIExplanationPanelProps) {
  const impactColors = {
    high: 'eco' as const,
    medium: 'electric' as const,
    low: 'muted' as const,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="glass rounded-xl p-5 border border-flux-500/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-flux-500/10 border border-flux-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-flux-400" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-sm">AI Decision Rationale</h3>
            <p className="text-xs text-white/40 font-mono">
              Algorithm: {explanation.algorithm_used}
            </p>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xl font-display font-bold text-flux-400">{explanation.confidence_score}%</div>
            <div className="text-xs text-white/40">confidence</div>
          </div>
        </div>
        <p className="text-sm text-white/70 leading-relaxed">{explanation.summary}</p>
      </div>

      {/* Key Factors */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-surge-400" />
          <h3 className="font-display font-semibold text-white text-sm">Optimization Factors</h3>
        </div>
        <div className="space-y-3">
          {explanation.key_factors.map((factor, i) => (
            <motion.div
              key={factor.factor}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-lg p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-white">{factor.factor}</span>
                  <Badge variant={impactColors[factor.impact]} size="sm">
                    {factor.impact} impact
                  </Badge>
                </div>
                <span className="text-xs font-mono text-flux-400">w={factor.weight.toFixed(1)}</span>
              </div>
              <p className="text-xs text-white/50 leading-relaxed">{factor.description}</p>
              <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${factor.weight * 100}%` }}
                  transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                  className="h-full rounded-full bg-gradient-to-r from-eco-400 to-electric-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-spark-400" />
          <h3 className="font-display font-semibold text-white text-sm">AI Recommendations</h3>
        </div>
        <div className="space-y-2">
          {explanation.recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 + 0.2 }}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/3 transition-colors"
            >
              <CheckCircle className="w-4 h-4 text-flux-400 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-white/70 leading-relaxed">{rec}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
