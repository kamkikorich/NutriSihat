import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/medicine/[id]/log - Log medicine as taken
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

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
    const { notes } = body

    // Verify medicine belongs to user
    const { data: medicine, error: medError } = await supabase
      .from('medicine_reminders')
      .select('id, name')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (medError || !medicine) {
      return NextResponse.json(
        { error: 'Ubat tidak dijumpai' },
        { status: 404 }
      )
    }

    // Log as taken
    const { data, error } = await supabase
      .from('medicine_logs')
      .insert({
        user_id: user.id,
        medicine_id: id,
        status: 'taken',
        notes: notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Ralat merekod ubat' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      message: `${medicine.name} direkod sebagai telah diambil`
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman' },
      { status: 500 }
    )
  }
}