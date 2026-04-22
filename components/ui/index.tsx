'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ── Card ─────────────────────────────────────────
interface CardProps {
  children: ReactNode; className?: string; hover?: boolean; glow?: boolean; onClick?: () => void
}
export function Card({ children, className, hover, glow, onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.003 } : undefined}
      onClick={onClick}
      className={cn('glass rounded-xl p-4', hover && 'cursor-pointer hover:shadow-card-hover transition-shadow duration-300', glow && 'glow-flux', className)}
    >
      {children}
    </motion.div>
  )
}

// ── StatCard ──────────────────────────────────────
interface StatCardProps {
  label: string; value: string | number; sub?: string; icon?: ReactNode
  trend?: number; color?: 'flux' | 'surge' | 'spark' | 'ember' | 'red'; delay?: number
}
export function StatCard({ label, value, sub, icon, trend, color = 'flux', delay = 0 }: StatCardProps) {
  const styles = {
    flux:  { text: 'text-flux-400',  bg: 'bg-flux-500/10',  border: 'border-flux-500/20' },
    surge: { text: 'text-surge-400', bg: 'bg-surge-500/10', border: 'border-surge-500/20' },
    spark: { text: 'text-spark-400', bg: 'bg-spark-500/10', border: 'border-spark-500/20' },
    ember: { text: 'text-ember-400', bg: 'bg-ember-500/10', border: 'border-ember-500/20' },
    red:   { text: 'text-red-400',   bg: 'bg-red-500/10',   border: 'border-red-500/20'  },
  }[color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -3 }}
      className="glass rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-white/40 font-medium uppercase tracking-wider">{label}</span>
        {icon && (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center border', styles.text, styles.bg, styles.border)}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className={cn('text-2xl font-display font-bold', styles.text)}>{value}</span>
        {trend !== undefined && (
          <span className={cn('text-xs mb-1 font-mono', trend >= 0 ? 'text-flux-400' : 'text-red-400')}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </motion.div>
  )
}

// ── Badge ─────────────────────────────────────────
interface BadgeProps { children: ReactNode; variant?: 'flux' | 'surge' | 'spark' | 'ember' | 'red' | 'muted'; size?: 'sm' | 'md' }
export function Badge({ children, variant = 'flux', size = 'sm' }: BadgeProps) {
  const variants = {
    flux:  'bg-flux-500/15 text-flux-400 border-flux-500/30',
    surge: 'bg-surge-500/15 text-surge-400 border-surge-500/30',
    spark: 'bg-spark-500/15 text-spark-400 border-spark-500/30',
    ember: 'bg-ember-500/15 text-ember-400 border-ember-500/30',
    red:   'bg-red-500/15 text-red-400 border-red-500/30',
    muted: 'bg-white/5 text-white/45 border-white/10',
  }
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm' }
  return (
    <span className={cn('inline-flex items-center rounded-md border font-medium', variants[variant], sizes[size])}>
      {children}
    </span>
  )
}

// ── Button ────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg'
  loading?: boolean; icon?: ReactNode
}
export function Button({ children, variant = 'primary', size = 'md', loading, icon, className, ...props }: ButtonProps) {
  const variants = {
    primary:   'gradient-flux text-black font-semibold hover:opacity-90 glow-flux',
    secondary: 'glass border border-white/10 text-white hover:border-flux-500/35 hover:text-flux-400',
    ghost:     'text-white/55 hover:text-white hover:bg-white/5',
    danger:    'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20',
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
      className={cn('inline-flex items-center gap-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed', variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        : icon ?? null}
      {children}
    </motion.button>
  )
}

// ── Skeleton ──────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-lg', className)} />
}

// ── Divider ───────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return <div className={cn('border-t border-white/5', className)} />
}

// ── Progress Bar ──────────────────────────────────
interface ProgressProps { value: number; color?: 'flux' | 'surge' | 'spark'; className?: string }
export function Progress({ value, color = 'flux', className }: ProgressProps) {
  const gradients = {
    flux:  'from-flux-500 to-ember-500',
    surge: 'from-surge-500 to-spark-500',
    spark: 'from-spark-400 to-surge-400',
  }
  return (
    <div className={cn('w-full h-1.5 bg-white/8 rounded-full overflow-hidden', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={cn('h-full rounded-full bg-gradient-to-r', gradients[color])}
      />
    </div>
  )
}
