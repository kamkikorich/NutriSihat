import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/medicine - Fetch medicine reminders
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
    const activeOnly = searchParams.get('activeOnly') !== 'false'

    // Fetch medicine reminders
    let query = supabase
      .from('medicine_reminders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (activeOnly) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Ralat mengambil data ubat' },
        { status: 500 }
      )
    }

    // Get today's logs
    const today = new Date().toISOString().split('T')[0]
    const { data: logs } = await supabase
      .from('medicine_logs')
      .select('*')
      .eq('user_id', user.id)
      .gte('taken_at', `${today}T00:00:00`)
      .lt('taken_at', `${today}T23:59:59`)

    // Mark which medicines have been taken today
    type MedicineLog = { id: string; user_id: string; medicine_id: string; taken_at: string; status: string; notes: string | null; created_at: string }
    const takenMedicineIds = new Set(logs?.map((log: MedicineLog) => log.medicine_id) || [])
    const medicinesWithStatus = data?.map(med => ({
      ...med,
      taken_today: takenMedicineIds.has(med.id)
    })) || []

    return NextResponse.json({ success: true, data: medicinesWithStatus })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman' },
      { status: 500 }
    )
  }
}

// POST /api/medicine - Add new medicine reminder
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
    const { name, dosage, frequency, times, notes, condition } = body

    // Validate required fields
    if (!name || !dosage || !frequency || !times || times.length === 0) {
      return NextResponse.json(
        { error: 'Sila isi semua ruangan yang diperlukan' },
        { status: 400 }
      )
    }

    // Insert reminder
    const { data, error } = await supabase
      .from('medicine_reminders')
      .insert({
        user_id: user.id,
        name,
        dosage,
        frequency,
        times,
        notes: notes || null,
        condition: condition || null,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Ralat menyimpan peringatan ubat' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Peringatan ubat berjaya ditambah'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman' },
      { status: 500 }
    )
  }
}