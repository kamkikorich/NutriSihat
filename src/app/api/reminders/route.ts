// Reminders API Route
// CRUD operations for user reminders

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// GET /api/reminders - Get all reminders for the current user
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: reminders, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('reminder_time', { ascending: true });

    if (error) {
      console.error('Error fetching reminders:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reminders });
  } catch (error) {
    console.error('Error in GET /api/reminders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reminders - Create a new reminder
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      type,
      time,
      title,
      titleBm,
      daysOfWeek,
      medicineId,
      soundEnabled,
      vibrationEnabled,
    } = body;

    // Validate required fields
    if (!type || !time || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: reminder, error } = await supabase
      .from('reminders')
      .insert({
        user_id: session.user.id,
        reminder_type: type,
        reminder_time: time,
        title,
        title_bm: titleBm || title,
        days_of_week: daysOfWeek || [0, 1, 2, 3, 4, 5, 6],
        medicine_id: medicineId,
        sound_enabled: soundEnabled ?? true,
        vibration_enabled: vibrationEnabled ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating reminder:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reminder }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/reminders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/reminders - Update a reminder
export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      );
    }

    // Build update object
    const updateData: Record<string, unknown> = {};

    if (updates.type) updateData.reminder_type = updates.type;
    if (updates.time) updateData.reminder_time = updates.time;
    if (updates.title) updateData.title = updates.title;
    if (updates.titleBm) updateData.title_bm = updates.titleBm;
    if (updates.daysOfWeek) updateData.days_of_week = updates.daysOfWeek;
    if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
    if (updates.soundEnabled !== undefined)
      updateData.sound_enabled = updates.soundEnabled;
    if (updates.vibrationEnabled !== undefined)
      updateData.vibration_enabled = updates.vibrationEnabled;

    const { data: reminder, error } = await supabase
      .from('reminders')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating reminder:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!reminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 });
    }

    return NextResponse.json({ reminder });
  } catch (error) {
    console.error('Error in PUT /api/reminders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/reminders - Delete a reminder
export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Reminder ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error deleting reminder:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/reminders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}