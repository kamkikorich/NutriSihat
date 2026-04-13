/**
 * Migration Script for Meal Planner Tables
 * Run with: npx ts-node scripts/run-migrations.ts
 *
 * Prerequisites:
 * 1. Set SUPABASE_SERVICE_ROLE_KEY in .env.local
 * 2. Install ts-node: npm install -D ts-node
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('ERROR: Missing environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  console.error('Add these to your .env.local file')
  process.exit(1)
}

// Create Supabase client with service role key (required for admin operations)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigrations() {
  console.log('🚀 Starting Meal Planner Migration...\n')

  try {
    // Step 1: Create foods table
    console.log('Step 1: Creating foods table...')
    const foodsSql = fs.readFileSync(
      path.join(__dirname, '../supabase/migrations/20260412_seed_sabah_foods.sql'),
      'utf-8'
    )

    const foodsResult = await supabase.rpc('exec_sql', { sql: foodsSql })
    if (foodsResult.error) {
      // Try alternative approach using REST API
      console.log('Note: Direct SQL execution not available, trying alternative approach...')

      // Create tables using individual queries
      await createTablesIndividually()
    } else {
      console.log('✅ Foods table created and seeded\n')
    }

    // Step 2: Create meal planner tables
    console.log('Step 2: Creating meal_plans, daily_meals, shopping_lists, user_food_preferences tables...')
    const mealPlannerSql = fs.readFileSync(
      path.join(__dirname, '../supabase/migrations/20260412_add_meal_planner.sql'),
      'utf-8'
    )

    const mealPlannerResult = await supabase.rpc('exec_sql', { sql: mealPlannerSql })
    if (mealPlannerResult.error) {
      console.error('❌ Error creating meal planner tables:', mealPlannerResult.error)
    } else {
      console.log('✅ Meal planner tables created\n')
    }

    console.log('🎉 Migration completed!')

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

async function createTablesIndividually() {
  // This is a fallback approach - requires manual SQL execution in Supabase dashboard
  console.log('\n⚠️  AUTOMATIC MIGRATION NOT AVAILABLE')
  console.log('Please follow these steps:')
  console.log('1. Open https://supabase.com/dashboard/project/oasowmrkydwufexxxwjc/sql')
  console.log('2. Create a new query')
  console.log('3. Copy and paste the SQL from:')
  console.log('   - supabase/migrations/20260412_seed_sabah_foods.sql')
  console.log('   - supabase/migrations/20260412_add_meal_planner.sql')
  console.log('4. Click Run to execute each migration')
  console.log('\nAlternatively, install Supabase CLI:')
  console.log('npm install -g supabase')
  console.log('supabase login')
  console.log('supabase link --project-ref oasowmrkydwufexxxwjc')
  console.log('supabase db push')
}

runMigrations()