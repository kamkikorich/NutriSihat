import { NextRequest, NextResponse } from 'next/server'
import { getFoodAnalysis } from '@/lib/ai/ollama-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { foodName, conditions } = body

    if (!foodName || !conditions) {
      return NextResponse.json(
        { error: 'Food name and conditions are required' },
        { status: 400 }
      )
    }

    const analysis = await getFoodAnalysis(foodName, conditions)

    return NextResponse.json({
      success: true,
      analysis,
    })
  } catch (error) {
    console.error('Food Analysis API Error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze food' },
      { status: 500 }
    )
  }
}