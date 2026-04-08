import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DELETE /api/blood-sugar/[id] - Delete a blood sugar log
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

    // Delete log (ensure it belongs to the user)
    const { error } = await supabase
      .from('blood_sugar_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Ralat memadam rekod gula darah' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Rekod berjaya dipadam'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Ralat pelayan dalaman' },
      { status: 500 }
    )
  }
}