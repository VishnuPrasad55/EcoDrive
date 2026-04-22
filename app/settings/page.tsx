'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Database } from 'lucide-react'
import { AppShell } from '@/components/layout/AppShell'
import { Button, Badge } from '@/components/ui'
import { toast } from '@/components/ui/toaster'

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'data', label: 'Data & API', icon: Database },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile')
  const [name, setName] = useState('EcoDrive User')
  const [email, setEmail] = useState('user@ecodrive.app')
  const [emailNotifs, setEmailNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(false)
  const handleSave = () => toast('Settings saved successfully', 'success')

  return (
    <AppShell title="Settings" subtitle="Manage your account and preferences">
      <div className="p-6 flex gap-6">
        <div className="w-52 flex-shrink-0 space-y-1">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${activeSection === s.id ? 'bg-flux-500/10 text-flux-400 border border-flux-500/20' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
              <s.icon className="w-4 h-4" />{s.label}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-2xl">
          {activeSection === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-5">
              <h2 className="font-display font-semibold text-white">Profile Information</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl gradient-flux flex items-center justify-center text-black text-2xl font-bold">{name.charAt(0)}</div>
                <div><p className="text-white font-medium">{name}</p><p className="text-sm text-white/40">{email}</p><Badge variant="flux" size="sm">Analyst</Badge></div>
              </div>
              <div className="space-y-3">
                {[{ label: 'Full Name', value: name, setter: setName }, { label: 'Email Address', value: email, setter: setEmail }].map(({ label, value, setter }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-xs text-white/40 font-mono">{label}</label>
                    <input value={value} onChange={(e) => setter(e.target.value)} className="w-full glass rounded-lg px-3 py-2.5 text-sm text-white bg-transparent border border-white/10 focus:border-flux-500/40 focus:outline-none" />
                  </div>
                ))}
              </div>
              <Button variant="primary" onClick={handleSave}>Save Changes</Button>
            </motion.div>
          )}
          {activeSection === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-5">
              <h2 className="font-display font-semibold text-white">Notification Preferences</h2>
              {[
                { label: 'Email Notifications', desc: 'Get notified of optimization completions via email', value: emailNotifs, setter: setEmailNotifs },
                { label: 'Push Notifications', desc: 'Browser push notifications for real-time updates', value: pushNotifs, setter: setPushNotifs },
              ].map(({ label, desc, value, setter }) => (
                <div key={label} className="flex items-center justify-between py-3 border-b border-white/5">
                  <div><p className="text-sm text-white/80">{label}</p><p className="text-xs text-white/40">{desc}</p></div>
                  <button onClick={() => setter(!value)} className={`w-9 h-5 rounded-full relative transition-all ${value ? 'bg-flux-500/30 border border-flux-500/50' : 'bg-white/5 border border-white/10'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${value ? 'bg-eco-400 translate-x-4' : 'bg-white/30 translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
              <Button variant="primary" onClick={handleSave}>Save Preferences</Button>
            </motion.div>
          )}
          {activeSection === 'data' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="glass rounded-xl p-6 space-y-4">
                <h2 className="font-display font-semibold text-white">API Configuration</h2>
                {[{ label: 'Supabase URL', placeholder: 'https://your-project.supabase.co' }, { label: 'Mapbox Token', placeholder: 'pk.eyJ1...' }].map(({ label, placeholder }) => (
                  <div key={label} className="space-y-1.5">
                    <label className="text-xs text-white/40 font-mono">{label}</label>
                    <input placeholder={placeholder} className="w-full glass rounded-lg px-3 py-2.5 text-sm text-white/50 bg-transparent border border-white/10 focus:border-flux-500/40 focus:outline-none placeholder:text-white/20 font-mono" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          {activeSection === 'security' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-xl p-6 space-y-5">
              <h2 className="font-display font-semibold text-white">Security Settings</h2>
              <div className="space-y-3">
                {['Current Password', 'New Password'].map((l) => (
                  <div key={l} className="space-y-1.5">
                    <label className="text-xs text-white/40 font-mono">{l}</label>
                    <input type="password" className="w-full glass rounded-lg px-3 py-2.5 text-sm text-white bg-transparent border border-white/10 focus:border-flux-500/40 focus:outline-none" />
                  </div>
                ))}
              </div>
              <Button variant="primary" onClick={() => toast('Password updated', 'success')}>Update Password</Button>
            </motion.div>
          )}
        </div>
      </div>
    </AppShell>
  )
}
