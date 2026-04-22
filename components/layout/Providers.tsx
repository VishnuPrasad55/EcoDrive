'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      {children}
    </AnimatePresence>
  )
}
