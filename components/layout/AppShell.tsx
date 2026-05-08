'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { supabase } from '@/lib/supabase'

interface AppShellProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AppShell({ children, title, subtitle }: AppShellProps) {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        router.replace('/auth/login')
        return
      }
      setCheckingAuth(false)
    }
    checkSession()
  }, [router])

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background grid-bg flex items-center justify-center text-white/70">
        <div className="space-y-3 text-center">
          <div className="w-16 h-16 border-2 border-flux-400 rounded-full animate-spin border-t-transparent mx-auto" />
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <Sidebar />
      <div className="ml-16 lg:ml-60 flex flex-col min-h-screen">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
