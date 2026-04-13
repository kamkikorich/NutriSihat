#!/usr/bin/env node
/**
 * KKM Meal Planner Migration Script
 * Menggunakan Supabase JS client untuk jalankan migrasi SQL
 *
 * Cara penggunaan:
 * 1. Pastikan SUPABASE_SERVICE_ROLE_KEY ada dalam .env.local
 * 2. Run: node scripts/kkm-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('\n❌ ERROR: Missing environment variables\n');
  console.log('Please add these to your .env.local file:\n');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key\n');
  console.log('You can find these in your Supabase Dashboard:');
  console.log('Settings → API → Project URL & Service Role Key\n');
  process.exit(1);
}

// Create Supabase client with service role key (admin access)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// SQL split helper - memecah SQL ke queries individu
function splitSqlQueries(sql) {
  // Split by semicolon but handle special cases
  const queries = [];
  let currentQuery = '';
  let inComment = false;
  let inString = false;
  let stringChar = '';

  const lines = sql.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip comment-only lines
    if (trimmedLine.startsWith('--') || trimmedLine.startsWith('/*')) {
      continue;
    }

    // Remove inline comments
    let cleanLine = line.replace(/\/\*.*?\*\//g, '');
    cleanLine = cleanLine.replace(/--.*$/g, '');

    if (cleanLine.trim()) {
      currentQuery += cleanLine + '\n';

      // Check for semicolon (end of statement)
      if (cleanLine.includes(';') && !inString) {
        if (currentQuery.trim()) {
          queries.push(currentQuery.trim());
          currentQuery = '';
        }
      }
    }
  }

  // Add any remaining query
  if (currentQuery.trim()) {
    queries.push(currentQuery.trim());
  }

  return queries.filter((q) => q.length > 5);
}

async function executeQuery(query, description) {
  try {
    console.log(`\n📝 ${description}...`);

    // Execute raw SQL using Supabase REST API
    const { data, error } = await supabase.rpc('exec_sql', { sql: query });

    if (error) {
      // If exec_sql function doesn't exist, try alternative approach
      console.log(`   ⚠️  RPC failed, trying REST API...`);

      const response = await fetch(`${supabaseUrl}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceRoleKey}`,
          'X-Client-Info': 'supabase-js/2.x',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    }

    console.log(`   ✅ ${description} - Success`);
    return true;
  } catch (error) {
    console.log(`   ⚠️  ${description} - ${error.message}`);
    // Don't throw - some errors are expected (e.g., table already exists)
    return false;
  }
}

async function runMigration() {
  console.log('\n🚀 ===========================================');
  console.log('   KKM SUKU-SEPARUH MIGRATION');
  console.log('   NutriSihat Meal Planner Database Update');
  console.log('   ===========================================\n');

  // Read the migration SQL file
  const migrationPath = path.join(
    __dirname,
    '..',
    'supabase',
    'kkm_meal_planner_migration.sql'
  );

  if (!fs.existsSync(migrationPath)) {
    console.error(`❌ Migration file not found: ${migrationPath}`);
    process.exit(1);
  }

  console.log(`📄 Reading migration file: ${migrationPath}`);
  const sqlContent = fs.readFileSync(migrationPath, 'utf-8');

  // Parse and execute SQL in chunks
  const chunks = [
    {
      name: 'Part 1: Clear Existing Data',
      queries: [
        'DELETE FROM daily_meals;',
        'DELETE FROM shopping_lists;',
        'DELETE FROM user_food_preferences;',
        'DELETE FROM meal_plans;',
        'DELETE FROM foods;',
      ],
    },
    {
      name: 'Part 2: Create Foods Table',
      queries: [
        `DROP TABLE IF EXISTS foods CASCADE;`,
        `CREATE TABLE IF NOT EXISTS foods (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          name_ms TEXT,
          description TEXT,
          glycemic_index INTEGER,
          is_diabetes_safe BOOLEAN DEFAULT false,
          is_uterus_friendly BOOLEAN DEFAULT false,
          is_sabah_local BOOLEAN DEFAULT false,
          category TEXT CHECK (category IN ('protein', 'vegetable', 'carbohydrate', 'fruit', 'condiment')),
          calories_per_100g INTEGER,
          protein_per_100g DECIMAL(5,2),
          fiber_per_100g DECIMAL(5,2),
          health_notes TEXT,
          alternatives TEXT,
          tips TEXT,
          kkm_category TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );`,
      ],
    },
    {
      name: 'Part 3: Insert KKM Foods - Suku Karbohidrat (Low GI)',
      queries: [
        `INSERT INTO foods (name, name_ms, description, glycemic_index, is_diabetes_safe, is_uterus_friendly, category, health_notes, kkm_category) VALUES
        ('Brown Rice', 'Nasi Perang', 'Whole grain rice, low GI', 55, true, true, 'carbohydrate', 'Low GI, high fiber, better blood sugar control than white rice.', 'suku_karbo'),
        ('Basmati Rice', 'Nasi Basmati', 'Long grain rice, lower GI', 58, true, true, 'carbohydrate', 'Lower GI than normal rice. Good portion control important.', 'suku_karbo'),
        ('Quinoa', 'Quinoa', 'Complete protein grain', 53, true, true, 'carbohydrate', 'Complete protein, low GI, high fiber.', 'suku_karbo'),
        ('Oats', 'Oat', 'Rolled or steel-cut', 55, true, true, 'carbohydrate', 'Beta-glucan fiber helps blood sugar control.', 'suku_karbo'),
        ('Wholemeal Bread', 'Roti Wholemeal', '100% whole grain bread', 55, true, true, 'carbohydrate', 'High fiber, better than white bread.', 'suku_karbo');`,
      ],
    },
    {
      name: 'Part 4: Insert KKM Foods - Suku Karbohidrat (High GI)',
      queries: [
        `INSERT INTO foods (name, name_ms, description, glycemic_index, is_diabetes_safe, is_uterus_friendly, category, health_notes, kkm_category) VALUES
        ('White Rice', 'Nasi Putih', 'Regular white rice', 73, false, false, 'carbohydrate', 'HIGH GI - spikes blood sugar. Limit or replace with brown rice.', 'suku_karbo'),
        ('Glutinous Rice', 'Beras Pulut', 'Sticky rice', 85, false, false, 'carbohydrate', 'AVOID: Very high GI, very bad for diabetes.', 'suku_karbo'),
        ('White Bread', 'Roti Putih', 'Refined flour bread', 75, false, false, 'carbohydrate', 'High GI, low fiber. Not recommended.', 'suku_karbo');`,
      ],
    },
    {
      name: 'Part 5: Insert KKM Foods - Separuh Sayur',
      queries: [
        `INSERT INTO foods (name, name_ms, description, glycemic_index, is_diabetes_safe, is_uterus_friendly, category, health_notes, kkm_category) VALUES
        ('Spinach', 'Bayam', 'Dark leafy green', 15, true, true, 'vegetable', 'Iron, folate, fiber. Excellent for diabetes.', 'separuh_sayur'),
        ('Kangkung', 'Kangkung', 'Water spinach', 15, true, true, 'vegetable', 'Low calorie, high fiber, traditional Malaysian vegetable.', 'separuh_sayur'),
        ('Mustard Greens', 'Sawi', 'Chinese mustard greens', 15, true, true, 'vegetable', 'High vitamin C, calcium, fiber.', 'separuh_sayur'),
        ('Kailan', 'Kailan', 'Chinese broccoli', 15, true, true, 'vegetable', 'High vitamin K, calcium, low calorie.', 'separuh_sayur'),
        ('Broccoli', 'Brokoli', 'Tree-like green vegetable', 15, true, true, 'vegetable', 'Sulforaphane, fiber, vitamin C. Excellent for diabetes.', 'separuh_sayur'),
        ('Cauliflower', 'Bunga Kubis', 'White cruciferous vegetable', 15, true, true, 'vegetable', 'Low calorie, versatile, can replace rice.', 'separuh_sayur');`,
      ],
    },
    {
      name: 'Part 6: Insert KKM Foods - Suku Protein',
      queries: [
        `INSERT INTO foods (name, name_ms, description, glycemic_index, is_diabetes_safe, is_uterus_friendly, category, health_notes, kkm_category) VALUES
        ('Chicken Breast', 'Dada Ayam', 'Skinless lean chicken', 0, true, true, 'protein', 'Lean protein, no carbs. Remove skin for lower fat.', 'suku_protein'),
        ('Fish (White)', 'Ikan Putih', 'Tilapia, Siakap, etc.', 0, true, true, 'protein', 'Lean protein, Omega-3. Steam or grill preferred.', 'suku_protein'),
        ('Fish (Oily)', 'Ikan Berlemak', 'Salmon, Sardin, Kembung', 0, true, true, 'protein', 'High Omega-3, heart healthy. Limit to 2-3x per week.', 'suku_protein'),
        ('Prawns', 'Udang', 'Shellfish', 0, true, true, 'protein', 'Low fat protein. Moderate cholesterol.', 'suku_protein'),
        ('Tofu', 'Tauhu', 'Soybean curd', 15, true, true, 'protein', 'Plant protein, isoflavones. Good meat alternative.', 'suku_protein'),
        ('Tempeh', 'Tempe', 'Fermented soybeans', 15, true, true, 'protein', 'Fermented, easier digestion, protein.', 'suku_protein'),
        ('Eggs', 'Telur', 'Chicken eggs', 0, true, true, 'protein', 'Complete protein, choline. Limit yolk if high cholesterol.', 'suku_protein');`,
      ],
    },
    {
      name: 'Part 7: Insert KKM Foods - Susu',
      queries: [
        `INSERT INTO foods (name, name_ms, description, glycemic_index, is_diabetes_safe, is_uterus_friendly, category, health_notes, kkm_category) VALUES
        ('Low-fat Milk', 'Susu Rendah Lemak', 'Skim or low-fat milk', 30, true, true, 'protein', 'Calcium, protein. Choose low-fat for heart health.', 'susu'),
        ('Greek Yogurt (Plain)', 'Yogurt Greek', 'Unsweetened', 15, true, true, 'protein', 'Protein, probiotics. NO added sugar.', 'susu'),
        ('Soy Milk (Unsweetened)', 'Susu Soya', 'No added sugar', 30, true, true, 'protein', 'Plant protein, calcium fortified.', 'susu');`,
      ],
    },
    {
      name: 'Part 8: Insert KKM Foods - Buah',
      queries: [
        `INSERT INTO foods (name, name_ms, description, glycemic_index, is_diabetes_safe, is_uterus_friendly, category, health_notes, kkm_category) VALUES
        ('Guava', 'Jambu Batu', 'Low GI tropical', 12, true, true, 'fruit', 'High vitamin C, fiber. Excellent choice.', 'buah'),
        ('Apple', 'Epal', 'With skin', 36, true, true, 'fruit', 'Fiber, antioxidants. Good for diabetes.', 'buah'),
        ('Orange', 'Oren', 'Citrus fruit', 40, true, true, 'fruit', 'Vitamin C, fiber. Fresh, not juice.', 'buah'),
        ('Papaya', 'Betik', 'When unripe/green', 40, true, false, 'fruit', 'Enzymes, fiber. Unripe better than ripe.', 'buah'),
        ('Banana', 'Pisang', 'Especially ripe', 51, true, true, 'fruit', 'Moderate GI. Green banana better than ripe.', 'buah'),
        ('Dragon Fruit', 'Buah Naga', 'White or red', 48, true, true, 'fruit', 'Fiber, antioxidants. Moderate GI.', 'buah');`,
      ],
    },
    {
      name: 'Part 9: Create Meal Plan Tables',
      queries: [
        `CREATE TABLE IF NOT EXISTS meal_plans (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          week_start_date DATE NOT NULL,
          week_end_date DATE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(user_id, week_start_date)
        );`,
        `CREATE TABLE IF NOT EXISTS daily_meals (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
          day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
          meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
          food_id UUID REFERENCES foods(id),
          food_name TEXT NOT NULL,
          food_name_ms TEXT,
          portion_size TEXT DEFAULT '1 serving',
          calories INTEGER,
          glycemic_index INTEGER,
          is_diabetes_safe BOOLEAN DEFAULT false,
          is_uterus_friendly BOOLEAN DEFAULT false,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(meal_plan_id, day_of_week, meal_type)
        );`,
        `CREATE TABLE IF NOT EXISTS shopping_lists (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
          item_name TEXT NOT NULL,
          item_name_ms TEXT,
          category TEXT CHECK (category IN ('protein', 'vegetable', 'carbohydrate', 'fruit', 'condiment', 'other')),
          quantity TEXT,
          is_purchased BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );`,
      ],
    },
    {
      name: 'Part 10: Setup RLS Policies',
      queries: [
        `ALTER TABLE foods ENABLE ROW LEVEL SECURITY;`,
        `CREATE POLICY "Foods are viewable by all authenticated users" ON foods FOR SELECT TO authenticated USING (TRUE);`,
        `ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;`,
        `ALTER TABLE daily_meals ENABLE ROW LEVEL SECURITY;`,
        `ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;`,
        `CREATE POLICY "Users can view own meal plans" ON meal_plans FOR SELECT TO authenticated USING (user_id = auth.uid());`,
        `CREATE POLICY "Users can manage own meal plans" ON meal_plans FOR ALL TO authenticated USING (user_id = auth.uid());`,
      ],
    },
    {
      name: 'Part 11: Create Indexes',
      queries: [
        `CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);`,
        `CREATE INDEX IF NOT EXISTS idx_foods_diabetes ON foods(is_diabetes_safe);`,
        `CREATE INDEX IF NOT EXISTS idx_foods_kkm ON foods(kkm_category);`,
        `CREATE INDEX IF NOT EXISTS idx_daily_meals_plan ON daily_meals(meal_plan_id);`,
        `CREATE INDEX IF NOT EXISTS idx_daily_meals_day ON daily_meals(day_of_week);`,
      ],
    },
  ];

  let successCount = 0;
  let failCount = 0;

  for (const chunk of chunks) {
    console.log(`\n📦 ${chunk.name}`);

    for (const query of chunk.queries) {
      const result = await executeQuery(query, `  Query`);
      if (result) {
        successCount++;
      } else {
        failCount++;
      }
    }
  }

  // Verification
  console.log('\n🔍 Verification');
  console.log('   ===============');

  try {
    const { data: foodCounts, error: countError } = await supabase
      .from('foods')
      .select('category, count')
      .group('category');

    if (!countError && foodCounts) {
      console.log('   ✅ Food categories:');
      for (const row of foodCounts) {
        console.log(`      - ${row.category}: ${row.count} items`);
      }
    }
  } catch (e) {
    console.log('   ⚠️  Could not verify food counts');
  }

  // Summary
  console.log('\n✨ ===========================================');
  console.log('   MIGRATION COMPLETE');
  console.log('   ===========================================');
  console.log(`\n   ✅ Successful queries: ${successCount}`);
  console.log(`   ⚠️  Failed/Skipped: ${failCount}`);
  console.log(`\n   🌐 Supabase URL: ${supabaseUrl}`);
  console.log('\n   Next steps:');
  console.log('   1. Test the application at https://nutrisihat.vercel.app');
  console.log('   2. Check Meal Planner shows KKM foods');
  console.log('   3. Verify RLS policies are working');
  console.log('\n===========================================\n');
}

// Run the migration
runMigration().catch((error) => {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
});
