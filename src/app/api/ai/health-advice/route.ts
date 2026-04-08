import { NextRequest, NextResponse } from 'next/server'
import { getPersonalizedAdvice } from '@/lib/ai/ollama-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { conditions, cancerType, treatmentType } = body

    if (!conditions || !Array.isArray(conditions)) {
      return NextResponse.json(
        { error: 'Conditions array is required' },
        { status: 400 }
      )
    }

    const advice = await getPersonalizedAdvice(conditions, cancerType, treatmentType)

    return NextResponse.json({
      success: true,
      advice,
    })
  } catch (error) {
    console.error('AI Health Advice API Error:', error)
    return NextResponse.json(
      { error: 'Failed to get health advice' },
      { status: 500 }
    )
  }
}