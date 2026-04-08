import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateBloodSugar } from '@/lib/utils'

// GET /api/blood-sugar - Fetch blood sugar logs
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Tidak dibenarkan. Sila log masuk.' },
        { status: 401 }
      )
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = searchParams.get('limit')

    // Build query
    let query = supabase
      .from('blood_sugar_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('logged_date', { ascending: false })
      .order('logged_time', { ascending: false })

    if (startDate) {
      query = query.gte('logged_date', startDate)
    }

    if (endDate) {
      query = query.lte('logged_date', endDate)
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Ralat mengambil data gula darah' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman' },
      { status: 500 }
    )
  }
}

// POST /api/blood-sugar - Add new blood sugar log
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Tidak dibenarkan. Sila log masuk.' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { value, meal_type, notes } = body

    // Validate value
    const numValue = parseFloat(value)
    if (isNaN(numValue) || numValue < 1 || numValue > 30) {
      return NextResponse.json(
        { error: 'Nilai gula darah tidak sah. Sila masukkan antara 1-30 mmol/L.' },
        { status: 400 }
      )
    }

    // Determine status based on value
    const validation = validateBloodSugar(numValue)

    // Get current date and time
    const now = new Date()
    const loggedDate = now.toISOString().split('T')[0]
    const loggedTime = now.toTimeString().slice(0, 5)

    // Insert log
    const { data, error } = await supabase
      .from('blood_sugar_logs')
      .insert({
        user_id: user.id,
        value: numValue,
        meal_type: meal_type || 'before_meal',
        logged_date: loggedDate,
        logged_time: loggedTime,
        status: validation.status,
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Ralat menyimpan rekod gula darah' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      message: validation.message,
      status: validation.status
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman' },
      { status: 500 }
    )
  }
}