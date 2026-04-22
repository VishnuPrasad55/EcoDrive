import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      charging_stations: {
        Row: {
          id: string
          name: string
          lat: number
          lng: number
          type: string
          city: string
          state: string
          address: string
          capacity: number
          utilization_rate: number
          power_output_kw: number
          status: string
          connector_types: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['charging_stations']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['charging_stations']['Insert']>
      }
      optimization_results: {
        Row: {
          id: string
          user_id: string
          name: string
          params: Record<string, unknown>
          result: Record<string, unknown>
          status: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['optimization_results']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['optimization_results']['Insert']>
      }
      saved_plans: {
        Row: {
          id: string
          user_id: string
          name: string
          optimization_id: string
          notes: string | null
          tags: string[]
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['saved_plans']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['saved_plans']['Insert']>
      }
    }
  }
}
