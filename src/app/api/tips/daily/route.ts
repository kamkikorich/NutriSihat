// Daily Nutrition Tip API Route
// Returns today's rotating tip

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getDailyTip, formatTipForDisplay, FALLBACK_TIPS } from '@/lib/daily-tip';

// GET /api/tips/daily - Get today's tip
export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all tips from database
    const { data: tips, error } = await supabase
      .from('nutrition_tips')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching tips:', error);
      // Fall back to hardcoded tips
      const result = getDailyTip(FALLBACK_TIPS);
      if (result) {
        return NextResponse.json({
          tip: formatTipForDisplay(result.tip),
          dayOfYear: result.dayOfYear,
          fallback: true,
        });
      }
    }

    // Get today's tip
    const result = tips && tips.length > 0 ? getDailyTip(tips) : getDailyTip(FALLBACK_TIPS);

    if (!result) {
      return NextResponse.json(
        { error: 'No tips available' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      tip: formatTipForDisplay(result.tip),
      dayOfYear: result.dayOfYear,
      fallback: !tips || tips.length === 0,
    });
  } catch (error) {
    console.error('Error in GET /api/tips/daily:', error);

    // Return fallback tip on error
    const result = getDailyTip(FALLBACK_TIPS);
    if (result) {
      return NextResponse.json({
        tip: formatTipForDisplay(result.tip),
        dayOfYear: result.dayOfYear,
        fallback: true,
      });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}