'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Leaf, Zap, Map, BarChart3, ArrowRight, Shield, Globe, TrendingUp, Brain, ChevronRight } from 'lucide-react'

const features = [
  { icon: Brain, title: 'AI Optimization', desc: 'K-Means++ clustering + greedy coverage maximization for placement', color: 'eco' },
  { icon: Map, title: 'Interactive Maps', desc: 'Real-time visualization of existing and proposed charging sites', color: 'electric' },
  { icon: BarChart3, title: 'Deep Analytics', desc: 'EV demand heatmaps, coverage gaps, utilization trends', color: 'volt' },
  { icon: Shield, title: 'Supabase Auth', desc: 'Secure authentication with saved plans and collaboration', color: 'eco' },
  { icon: Globe, title: 'VAAHAN Dataset', desc: 'Real Indian EV registration data and traffic flow integration', color: 'electric' },
  { icon: TrendingUp, title: 'ROI Forecasting', desc: 'Cost estimation, CO2 reduction, and demand projections', color: 'volt' },
]

const stats = [
  { value: '12,847', label: 'Stations Mapped' },
  { value: '6', label: 'Major Metros' },
  { value: '94%', label: 'AI Accuracy' },
  { value: '284K t', label: 'CO2 Reduction' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background grid-bg overflow-hidden">
      <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-flux flex items-center justify-center glow-flux">
              <Leaf className="w-4 h-4 text-black" />
            </div>
            <span className="font-display text-xl font-bold gradient-flux-text">EcoDrive</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors">
                Sign In
              </motion.button>
            </Link>
            <Link href="/dashboard">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="px-4 py-2 text-sm gradient-flux text-black font-semibold rounded-lg glow-flux">
                Launch App
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-24 px-6 relative">
        <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-flux-500/5 blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full bg-electric-500/5 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-flux-500/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-flux-400 animate-pulse-amber" />
            <span className="text-sm text-flux-400 font-mono">AI-Powered EV Infrastructure Planning</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-6xl md:text-7xl font-bold text-white leading-tight mb-6">
            Charge India&apos;s<br /><span className="gradient-flux-text">Electric Future</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            EcoDrive uses machine learning and spatial optimization to identify the perfect locations for EV charging stations — maximizing coverage, minimizing cost.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-8 py-4 gradient-flux text-black font-bold text-base rounded-xl glow-flux">
                <Zap className="w-5 h-5" />Start Optimizing<ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <Link href="/map">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-8 py-4 glass border border-white/10 text-white font-medium text-base rounded-xl hover:border-flux-500/30 transition-colors">
                <Map className="w-5 h-5 text-flux-400" />Explore Map
              </motion.button>
            </Link>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-5xl mx-auto mt-20 glass rounded-2xl border border-white/8 overflow-hidden"
          style={{ boxShadow: '0 40px 120px rgba(0,240,122,0.1)' }}>
          <div className="h-8 bg-white/3 flex items-center gap-2 px-4 border-b border-white/5">
            {['#ef4444','#facc15','#00f07a'].map((c, i) => <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
            <span className="ml-3 text-xs text-white/20 font-mono">ecodrive.app/dashboard</span>
          </div>
          <div className="p-6 grid grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 + i * 0.1 }}
                className="glass rounded-xl p-4 text-center">
                <div className="text-2xl font-display font-bold text-flux-400">{s.value}</div>
                <div className="text-xs text-white/40 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-white mb-4">Everything You Need</h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">A complete platform for EV infrastructure planning, from data ingestion to deployment.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }} className="glass rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${f.color === 'eco' ? 'bg-flux-500/10 border border-flux-500/20' : f.color === 'electric' ? 'bg-electric-500/10 border border-electric-500/20' : 'bg-volt-400/10 border border-volt-400/20'}`}>
                  <f.icon className={`w-5 h-5 ${f.color === 'eco' ? 'text-flux-400' : f.color === 'electric' ? 'text-electric-400' : 'text-volt-400'}`} />
                </div>
                <h3 className="font-display font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-3xl mx-auto glass rounded-2xl p-12 text-center border border-flux-500/15"
          style={{ boxShadow: '0 0 80px rgba(0,240,122,0.08)' }}>
          <h2 className="font-display text-4xl font-bold text-white mb-4">Ready to Electrify India?</h2>
          <p className="text-white/40 mb-8">Join urban planners, EV companies, and government agencies using EcoDrive.</p>
          <Link href="/auth/login">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 px-8 py-4 gradient-flux text-black font-bold rounded-xl glow-flux text-base">
              Get Started Free<ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-flux-400" />
            <span className="text-sm text-white/30 font-mono">EcoDrive v1.0</span>
          </div>
          <span className="text-xs text-white/20">Built for India&apos;s EV Revolution</span>
        </div>
      </footer>
    </div>
  )
}
