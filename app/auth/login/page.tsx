'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.replace('/dashboard')
      }
    }
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    if (!email || !password) {
      setMessage('Enter email and password to continue.')
      setMessageType('error')
      setLoading(false)
      return
    }

    try {
      const authAction = isSignup
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password })

      if (authAction.error) {
        throw authAction.error
      }

      if (isSignup) {
        setMessage('Account created. Check your email for confirmation.')
        setMessageType('success')
      } else {
        setMessage('Signed in successfully. Redirecting...')
        setMessageType('success')
        router.push('/dashboard')
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Authentication failed.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setMessage(null)
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
    if (error) {
      setMessage(error.message)
      setMessageType('error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-6">
      <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-flux-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 rounded-full bg-electric-500/5 blur-3xl pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-flux flex items-center justify-center glow-flux"><Leaf className="w-5 h-5 text-black" /></div>
            <span className="font-display text-2xl font-bold gradient-flux-text">EcoDrive</span>
          </Link>
          <h1 className="font-display text-2xl font-bold text-white">{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-white/40 text-sm mt-2">{isSignup ? 'Start planning EV infrastructure today' : 'Sign in to your EcoDrive account'}</p>
        </div>

        <motion.div className="glass rounded-2xl p-8 border border-white/8" style={{ boxShadow: '0 0 60px rgba(0,240,122,0.06)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="space-y-1.5">
                <label className="text-xs text-white/50 font-mono">Full Name</label>
                <input placeholder="Your Name" className="w-full glass rounded-xl px-4 py-3 text-sm text-white bg-transparent border border-white/10 focus:border-flux-500/40 focus:outline-none placeholder:text-white/20" />
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-mono">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                  className="w-full glass rounded-xl px-4 py-3 pl-10 text-sm text-white bg-transparent border border-white/10 focus:border-flux-500/40 focus:outline-none placeholder:text-white/20" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-white/50 font-mono">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full glass rounded-xl px-4 py-3 pl-10 pr-10 text-sm text-white bg-transparent border border-white/10 focus:border-flux-500/40 focus:outline-none placeholder:text-white/20" required />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {message && (
              <div className={`rounded-xl px-3 py-2 text-sm ${messageType === 'error' ? 'bg-rose-500/10 text-rose-200' : 'bg-emerald-500/10 text-emerald-200'}`}>
                {message}
              </div>
            )}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 gradient-flux text-black font-bold rounded-xl glow-flux mt-2 disabled:opacity-70">
              {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <><span>{isSignup ? 'Create Account' : 'Sign In'}</span><ArrowRight className="w-4 h-4" /></>}
            </motion.button>
          </form>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-xs text-white/20">or</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleGoogleSignIn}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 glass border border-white/10 text-white/70 hover:text-white rounded-xl text-sm font-medium transition-colors">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </motion.button>

          <p className="text-center text-xs text-white/30 mt-5">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => setIsSignup(!isSignup)} className="text-flux-400 hover:text-eco-300 transition-colors">
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </motion.div>

        <p className="text-center text-xs text-white/30 mt-6">Use your Supabase credentials or Google sign-in to access EcoDrive.</p>
      </motion.div>
    </div>
  )
}
