'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { LayoutDashboard, Map, Zap, BarChart3, FolderOpen, GitCompare, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/map', icon: Map, label: 'Live Map' },
  { href: '/optimize', icon: Zap, label: 'AI Optimize' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/plans', icon: FolderOpen, label: 'Saved Plans' },
  { href: '/compare', icon: GitCompare, label: 'Compare' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed left-0 top-0 bottom-0 w-16 lg:w-60 z-40 flex flex-col glass border-r border-white/5"
      style={{ borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg gradient-flux flex items-center justify-center flex-shrink-0 glow-flux relative overflow-hidden">
            <Zap className="w-4 h-4 text-black font-bold" />
          </div>
          <div className="hidden lg:block">
            <span className="font-display text-lg font-bold gradient-flux-text">EcoDrive</span>
            <div className="text-xs text-white/25 font-mono -mt-0.5">EV Optimizer</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative',
                    isActive
                      ? 'bg-flux-500/10 text-flux-400 border border-flux-500/20'
                      : 'text-white/45 hover:text-white/75 hover:bg-white/4 border border-transparent'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-flux-400 rounded-full"
                      style={{ boxShadow: '0 0 8px rgba(245,158,11,0.8)' }}
                    />
                  )}
                  <item.icon className={cn('w-4.5 h-4.5 flex-shrink-0', isActive ? 'text-flux-400' : '')} style={{ width: '18px', height: '18px' }} />
                  <span className="hidden lg:block text-sm font-medium">{item.label}</span>
                  {isActive && <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-flux-400" style={{ boxShadow: '0 0 6px rgba(245,158,11,0.9)' }} />}
                </motion.div>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="py-3 px-2 border-t border-white/5 space-y-0.5">
        <Link href="/settings">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/45 hover:text-white/75 hover:bg-white/4 transition-all duration-200">
            <Settings style={{ width: '18px', height: '18px' }} className="flex-shrink-0" />
            <span className="hidden lg:block text-sm font-medium">Settings</span>
          </div>
        </Link>
        <Link href="/auth/login">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200">
            <LogOut style={{ width: '18px', height: '18px' }} className="flex-shrink-0" />
            <span className="hidden lg:block text-sm font-medium">Sign Out</span>
          </div>
        </Link>
      </div>
    </motion.aside>
  )
}
