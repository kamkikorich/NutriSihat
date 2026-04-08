import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DELETE /api/medicine/[id] - Delete a medicine reminder
export async function DELETE(
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

    // Delete reminder (ensure it belongs to the user)
    const { error } = await supabase
      .from('medicine_reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Ralat memadam peringatan ubat' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Peringatan ubat berjaya dipadam'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman' },
      { status: 500 }
    )
  }
}

// PATCH /api/medicine/[id] - Update a medicine reminder
export async function PATCH(
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

    // Update reminder
    const { data, error } = await supabase
      .from('medicine_reminders')
      .update(body)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Ralat mengemas kini peringatan ubat' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
      message: 'Peringatan ubat berjaya dikemas kini'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman' },
      { status: 500 }
    )
  }
}