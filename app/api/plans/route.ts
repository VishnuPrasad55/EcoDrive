import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient, getUserFromRequest } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase
    .from('saved_plans')
    .select('id, name, notes, tags, created_at, optimization_id, optimization_results(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Saved plans fetch error:', error)
    return NextResponse.json({ error: 'Failed to load saved plans' }, { status: 500 })
  }

  const saved_plans = (data || []).map((row: any) => ({
    id: row.id,
    name: row.name,
    notes: row.notes,
    tags: row.tags || [],
    created_at: row.created_at,
    user_id: user.id,
    optimization_result: row.optimization_results?.[0] || null,
  }))

  return NextResponse.json({ success: true, saved_plans })
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, optimization_id, notes, tags = [] } = body

  if (!name || !optimization_id) {
    return NextResponse.json({ error: 'Missing plan name or optimization_id' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  const { data, error } = await supabase.from('saved_plans').insert([{
    user_id: user.id,
    name,
    optimization_id,
    notes: notes || null,
    tags,
  }])

  if (error) {
    console.error('Save plan error:', error)
    return NextResponse.json({ error: 'Failed to save plan' }, { status: 500 })
  }

  return NextResponse.json({ success: true, saved_plan: data?.[0] || null })
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const planId = req.nextUrl.searchParams.get('id')
  if (!planId) {
    return NextResponse.json({ error: 'Missing plan id' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()
  const { error } = await supabase.from('saved_plans').delete().eq('id', planId).eq('user_id', user.id)

  if (error) {
    console.error('Delete plan error:', error)
    return NextResponse.json({ error: 'Failed to delete plan' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
