// Reminder Trigger API Route
// Called by Vercel Cron to check and send due reminders
// Also handles completing, dismissing, and snoozing reminders

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Create Supabase admin client for cron jobs
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/reminders/trigger - Cron job endpoint
// Called every minute to check for due reminders
export async function POST(request: Request) {
  try {
    // Verify this is called by Vercel Cron (security check)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:mm
    const currentDay = now.getDay();

    // Get all due reminders
    const { data: dueReminders, error: fetchError } = await supabaseAdmin
      .rpc('get_due_reminders', { p_time: currentTime });

    if (fetchError) {
      console.error('Error fetching due reminders:', fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!dueReminders || dueReminders.length === 0) {
      return NextResponse.json({ message: 'No reminders due', count: 0 });
    }

    // Process each due reminder
    const results = [];

    for (const reminder of dueReminders) {
      // Create reminder log
      const { data: log, error: logError } = await supabaseAdmin
        .from('reminder_logs')
        .insert({
          reminder_id: reminder.id,
          user_id: reminder.user_id,
          scheduled_for: now.toISOString(),
          status: 'pending',
        })
        .select()
        .single();

      if (logError) {
        console.error('Error creating reminder log:', logError);
        continue;
      }

      // Get user's push subscription (from database)
      const { data: subscription } = await supabaseAdmin
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', reminder.user_id)
        .single();

      if (subscription) {
        // Send push notification
        const notificationPayload = {
          title: getReminderTitle(reminder),
          body: getReminderBody(reminder),
          tag: `reminder-${reminder.id}`,
          data: {
            reminderId: reminder.id,
            reminderLogId: log.id,
            type: reminder.reminder_type,
            url: getReminderUrl(reminder),
          },
        };

        // Store notification for sending
        await supabaseAdmin.from('notification_queue').insert({
          user_id: reminder.user_id,
          notification: notificationPayload,
          subscription: subscription.subscription,
          status: 'pending',
        });

        results.push({
          reminderId: reminder.id,
          userId: reminder.user_id,
          logId: log.id,
          status: 'queued',
        });
      } else {
        results.push({
          reminderId: reminder.id,
          userId: reminder.user_id,
          logId: log.id,
          status: 'no_subscription',
        });
      }
    }

    return NextResponse.json({
      message: 'Reminders processed',
      count: results.length,
      results,
    });
  } catch (error) {
    console.error('Error in trigger:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reminders/complete - Mark reminder as completed
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { reminderLogId, notes } = body;

    if (!reminderLogId) {
      return NextResponse.json(
        { error: 'Reminder log ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('reminder_logs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        notes,
      })
      .eq('id', reminderLogId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error completing reminder:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions
function getReminderTitle(reminder: { reminder_type: string; title_bm: string }): string {
  const icons: Record<string, string> = {
    meal: '🍽️',
    medicine: '💊',
    blood_sugar: '🩸',
    water: '💧',
    custom: '⏰',
  };

  const icon = icons[reminder.reminder_type] || '⏰';
  return `${icon} ${reminder.title_bm}`;
}

function getReminderBody(reminder: { title_bm: string }): string {
  return `Masa untuk ${reminder.title_bm.toLowerCase()}!`;
}

function getReminderUrl(reminder: { reminder_type: string }): string {
  const urls: Record<string, string> = {
    blood_sugar: '/gula-darah?action=log',
    medicine: '/ubat?action=log',
    meal: '/makanan',
    water: '/dashboard',
    custom: '/dashboard',
  };

  return urls[reminder.reminder_type] || '/dashboard';
}