'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  type: ToastType
}

let globalAddToast: ((message: string, type?: ToastType) => void) | null = null

export function toast(message: string, type: ToastType = 'info') {
  if (globalAddToast) globalAddToast(message, type)
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }, [])

  globalAddToast = addToast

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-eco-400" />,
    error: <XCircle className="w-4 h-4 text-red-400" />,
    info: <AlertCircle className="w-4 h-4 text-electric-400" />,
  }

  const colors = {
    success: 'border-eco-500/30 bg-eco-500/10',
    error: 'border-red-500/30 bg-red-500/10',
    info: 'border-electric-500/30 bg-electric-500/10',
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className={cn(
              'flex items-center gap-3 px-4 py-3 glass rounded-xl border max-w-sm pointer-events-auto',
              colors[t.type]
            )}
          >
            {icons[t.type]}
            <span className="text-sm text-white/90 flex-1">{t.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
