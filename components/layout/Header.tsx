'use client'

import { motion } from 'framer-motion'
import { Bell, Search, User, Radio, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'

interface HeaderProps { title: string; subtitle?: string }

export function Header({ title, subtitle }: HeaderProps) {
  const router = useRouter()
  const { selectedRegion } = useAppStore()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.replace('/auth/login')
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="h-14 flex items-center justify-between px-5 glass border-b border-white/5 sticky top-0 z-30"
    >
      <div>
        <h1 className="font-display text-base font-semibold text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-white/35 mt-0.5 font-mono">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Region indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 glass rounded-lg border border-white/8">
          <div className="w-1.5 h-1.5 rounded-full bg-flux-400" style={{ boxShadow: '0 0 6px rgba(245,158,11,0.9)', animation: 'pulse_amber 2.5s ease-in-out infinite' }} />
          <span className="text-xs text-white/50 font-mono max-w-[160px] truncate">{selectedRegion.name.split(',')[0]}</span>
        </div>

        {/* Live badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-flux-500/10 border border-flux-500/20">
          <Radio className="w-3 h-3 text-flux-400" />
          <span className="text-xs text-flux-400 font-mono hidden sm:block tracking-wider">LIVE</span>
        </div>

        <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 transition-colors hover:border-flux-500/25 border border-transparent">
          <Search className="w-3.5 h-3.5" />
        </button>

        <button className="relative w-8 h-8 glass rounded-lg flex items-center justify-center text-white/40 hover:text-white/70 transition-colors border border-transparent hover:border-flux-500/25">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-flux-400" style={{ boxShadow: '0 0 5px rgba(245,158,11,0.9)' }} />
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-8 h-8 rounded-lg gradient-flux flex items-center justify-center cursor-pointer glow-flux"
          aria-label="Sign out"
        >
          <LogOut className="w-3.5 h-3.5 text-black" />
        </button>
      </div>
    </motion.header>
  )
}
