import { NextRequest, NextResponse } from 'next/server'
import { runOptimization } from '@/lib/ai-optimizer'
import { INDIAN_REGIONS } from '@/lib/mock-data'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { params } = body

    if (!params || !params.region) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    const region = INDIAN_REGIONS.find((r) => r.id === params.region.id) || INDIAN_REGIONS[2]
    const result = await runOptimization({ ...params, region }, region)

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Optimization error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'EcoDrive AI Optimization API',
    version: '1.0.0',
    endpoints: {
      POST: 'Run optimization with params',
    },
  })
}
