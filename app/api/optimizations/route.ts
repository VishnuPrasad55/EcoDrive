import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient, getUserFromRequest } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('optimization_results')
    .select('id, name, params, result, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Optimization results fetch error:', error)
    return NextResponse.json({ error: 'Failed to load optimization results' }, { status: 500 })
  }

  const results = (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    created_at: row.created_at,
    params: row.params,
    suggested_stations: row.result?.suggested_stations || [],
    metrics: row.result?.metrics || {},
    ai_explanation: row.result?.ai_explanation || {},
    simulation_steps: row.result?.simulation_steps || [],
    status: row.status,
  }))

  return NextResponse.json({ success: true, optimization_results: results })
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { result } = body
  if (!result || !result.id || !result.name) {
    return NextResponse.json({ error: 'Invalid optimization result payload' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.from('optimization_results').upsert({
    id: result.id,
    user_id: user.id,
    name: result.name,
    params: result.params,
    result,
    status: result.status || 'completed',
  })

  if (error) {
    console.error('Optimization result save error:', error)
    return NextResponse.json({ error: 'Failed to save optimization result' }, { status: 500 })
  }

  return NextResponse.json({ success: true, optimization_result: result })
}
