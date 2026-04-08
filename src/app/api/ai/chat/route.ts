import { NextRequest, NextResponse } from 'next/server'
import { getAIService } from '@/lib/ai/ollama-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, userId } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const aiService = getAIService()
    const response = await aiService.chat(messages, userId)

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'Failed to get AI response' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: response.message,
    })
  } catch (error) {
    console.error('AI Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}