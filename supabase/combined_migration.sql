-- ============================================
-- NUTRISIHAT MEAL PLANNER - COMPLETE MIGRATION
-- ============================================
-- Copy this entire file and paste into Supabase SQL Editor:
-- https://supabase.com/dashboard/project/oasowmrkydwufexxxwjc/sql/new
-- Then click "Run" to execute
-- ============================================

-- ============================================
-- PART 1: FOODS TABLE (Sabah Traditional Foods)
-- ============================================

CREATE TABLE IF NOT EXISTS foods (
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for foods
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Public read access for authenticated users
CREATE POLICY "Foods are viewable by all authenticated users"
  ON foods FOR SELECT
  TO authenticated
  USING (TRUE);

-- Seed Sabah Traditional Foods
INSERT INTO foods (name, name_ms, description, glycemic_index, is_diabetes_safe, is_uterus_friendly, is_sabah_local, category, health_notes) VALUES

-- PROTEIN - Fish & Seafood
('Spanish Mackerel (Tenggiri)', 'Ikan Tenggiri', 'Lean white fish, perfect for Hinava', 0, true, true, true, 'protein', 'High protein, Omega-3, anti-inflammatory. Excellent for diabetes.'),
('Yellowstripe Scad', 'Ikan Titir Kuning', 'Small lean fish common in Sabah', 0, true, true, true, 'protein', 'Lean protein, low fat.'),
('Mackerel Tuna', 'Ikan Kembung', 'Oily fish rich in Omega-3', 0, true, true, true, 'protein', 'High Omega-3, heart-healthy.'),
('Snakehead Fish', 'Ikan Haruan', 'Traditional healing fish', 0, true, true, true, 'protein', 'Traditional postpartum recovery fish. High protein.'),
('Sea Grapes', 'Latok', 'Seaweed from Bajau community', 0, true, true, true, 'protein', 'Mineral-rich, iodine, antioxidants.'),

-- VEGETABLES - Ulam & Ferns
('Midin Fern', 'Midin/Lambading', 'Stenochlaena palustris - popular Sabah ulam', 0, true, true, true, 'vegetable', 'High polyphenols, flavonoids, anthocyanins. Traditional postpartum food. Anti-inflammatory.'),
('Tapioca Leaves', 'Pucuk Ubi Kayu', 'Murut/Lun Bawang staple', 0, true, true, true, 'vegetable', 'High protein, iron, fiber. Excellent nutrition.'),
('Ulam Raja', 'Ulam Raja', 'Cosmos caudatus - antioxidant powerhouse', 0, true, true, true, 'vegetable', 'Anti-aging, high antioxidants, lutein, beta-carotene.'),
('Winged Bean', 'Kacang Botol', 'High protein legume', 0, true, true, true, 'vegetable', 'Complete protein, fiber-rich.'),
('Bamboo Shoots', 'Rebung', 'Wild bamboo shoots', 0, true, true, true, 'vegetable', 'High fiber.'),
('Banana Inflorescence', 'Jantung Pisang', 'Iron-rich banana flower', 0, true, true, true, 'vegetable', 'Iron-rich, traditional vegetable.'),

-- TRADITIONAL DISHES
('Hinava', 'Hinava', 'Raw fish ceviche with lime, chili, ginger, bambangan', 0, true, true, true, 'protein', 'Perfect diabetes meal - lean protein, no oil, anti-inflammatory spices.'),
('Pinasakan', 'Pinasakan', 'Fish stew with takob-akob and turmeric', 0, true, true, true, 'protein', 'Excellent - lean protein, anti-inflammatory turmeric.'),
('Sagol', 'Sagol', 'Minced fish with turmeric, garlic, ginger', 0, true, true, true, 'protein', 'Minimal oil, anti-inflammatory spices.'),
('Ubi Daun Kayu Stew', 'Pucuk Ubi Masak Lemak', 'Tapioca leaves in coconut milk', 0, true, true, true, 'vegetable', 'High protein, iron, fiber from leaves.'),

-- CARBOHYDRATES (Limit portion)
('Tapioca/Cassava', 'Ubi Kayu', 'Bajau staple (Tompek when fried)', 65, false, true, true, 'carbohydrate', 'Moderate GI. Better than white rice. Bake instead of fry.'),
('Sweet Potato', 'Keledek', 'Orange/purple varieties', 60, false, true, true, 'carbohydrate', 'Moderate GI, high fiber, vitamin A.'),
('Traditional Rice (Brown)', 'Beras Perang', 'Unpolished rice varieties', 55, true, true, true, 'carbohydrate', 'Lower GI than white rice. Higher fiber.'),
('Corn', 'Jagung', 'Rungus tinonggilan (fermented corn drink)', 52, true, true, true, 'carbohydrate', 'Moderate GI, fiber-rich.'),

-- FRUITS
('Guava', 'Jambu Batu', 'Low GI tropical fruit', 12, true, true, false, 'fruit', 'High vitamin C, fiber. Excellent for diabetes.'),
('Bambangan', 'Bambangan', 'Pickled wild mango', 30, true, true, true, 'fruit', 'Digestive aid, pickled condiment.'),
('Papaya (Unripe)', 'Betik Muda', 'For cooking, not ripe', 40, true, false, false, 'fruit', 'Unripe OK for cooking. Ripe = high sugar.'),
('Coconut Flesh', 'Isi Nyiur', 'Fresh coconut meat', 15, true, true, true, 'fruit', 'Healthy fats, fiber. Limit coconut milk/cream.'),

-- CONDIMENTS
('Turmeric', 'Kunyit', 'Anti-inflammatory spice', 0, true, true, false, 'condiment', 'Curcumin - powerful anti-inflammatory.'),
('Ginger', 'Halia', 'Digestive aid', 0, true, true, false, 'condiment', 'Anti-inflammatory, digestive.'),
('Wild Ginger (Tuhau)', 'Tuhau', 'Kadazan-Dusun relish', 0, true, true, true, 'condiment', 'High phenolics, digestive aid.'),
('Takob-Akob', 'Takob-Akob', 'Dried mangosteen skin for souring', 0, true, true, true, 'condiment', 'Traditional souring agent, antioxidant.'),

-- AVOID LIST (for reference and education)
('Glutinous Rice', 'Beras Pulut', 'Sticky rice - high GI', 85, false, false, true, 'carbohydrate', 'AVOID: Very high GI, spikes blood sugar.'),
('Rice Wine', 'Lihing', 'Traditional rice wine', 0, false, false, true, 'condiment', 'AVOID: Alcohol and sugar content.'),
('Tapai', 'Tapai', 'Fermented rice', 75, false, false, true, 'carbohydrate', 'AVOID: High sugar, alcohol from fermentation.');

-- ============================================
-- PART 2: MEAL PLANNER TABLES
-- ============================================

-- Weekly meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  total_budget NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, week_start_date)
);

-- Daily meal entries
CREATE TABLE IF NOT EXISTS daily_meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_id UUID REFERENCES foods(id),
  food_name TEXT NOT NULL,
  food_name_ms TEXT,
  portion_size TEXT,
  calories INTEGER,
  glycemic_index INTEGER,
  is_diabetes_safe BOOLEAN DEFAULT false,
  is_uterus_friendly BOOLEAN DEFAULT false,
  is_sabah_local BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(meal_plan_id, day_of_week, meal_type)
);

-- Shopping list items
CREATE TABLE IF NOT EXISTS shopping_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_name_ms TEXT,
  category TEXT CHECK (category IN ('protein', 'vegetable', 'carbohydrate', 'fruit', 'condiment', 'other')),
  quantity TEXT,
  unit TEXT,
  estimated_price NUMERIC(10, 2),
  is_purchased BOOLEAN DEFAULT false,
  market_location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User food preferences
CREATE TABLE IF NOT EXISTS user_food_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  food_id UUID REFERENCES foods(id),
  preference_level TEXT CHECK (preference_level IN ('love', 'like', 'neutral', 'dislike', 'avoid')),
  is_allergy BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, food_id)
);

-- ============================================
-- PART 3: INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_meal_plans_user ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_meals_plan ON daily_meals(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_plan ON shopping_lists(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences ON user_food_preferences(user_id);

-- ============================================
-- PART 4: ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_food_preferences ENABLE ROW LEVEL SECURITY;

-- Meal Plans Policies
CREATE POLICY "Users can view own meal plans"
  ON meal_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal plans"
  ON meal_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans"
  ON meal_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans"
  ON meal_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Daily Meals Policies
CREATE POLICY "Users can view daily meals from own plans"
  ON daily_meals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = daily_meals.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert daily meals to own plans"
  ON daily_meals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = daily_meals.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update daily meals in own plans"
  ON daily_meals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = daily_meals.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete daily meals from own plans"
  ON daily_meals FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = daily_meals.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

-- Shopping Lists Policies
CREATE POLICY "Users can view shopping lists from own plans"
  ON shopping_lists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = shopping_lists.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert shopping lists to own plans"
  ON shopping_lists FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = shopping_lists.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update shopping lists in own plans"
  ON shopping_lists FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = shopping_lists.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete shopping lists from own plans"
  ON shopping_lists FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp
      WHERE mp.id = shopping_lists.meal_plan_id
      AND mp.user_id = auth.uid()
    )
  );

-- User Food Preferences Policies
CREATE POLICY "Users can view own food preferences"
  ON user_food_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own food preferences"
  ON user_food_preferences FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- PART 5: UTILITY FUNCTIONS
-- ============================================

-- Function to auto-generate shopping list from meal plan
CREATE OR REPLACE FUNCTION generate_shopping_list(plan_id UUID)
RETURNS VOID AS $$
DECLARE
  meal_record RECORD;
BEGIN
  FOR meal_record IN
    SELECT * FROM daily_meals
    WHERE meal_plan_id = plan_id
    ORDER BY day_of_week, meal_type
  LOOP
    INSERT INTO shopping_lists (meal_plan_id, item_name, item_name_ms, category, quantity, unit, notes)
    VALUES (
      plan_id,
      meal_record.food_name,
      meal_record.food_name_ms,
      CASE
        WHEN meal_record.food_name ILIKE '%ikan%' OR meal_record.food_name ILIKE '%fish%' OR meal_record.food_name ILIKE '%ayam%' OR meal_record.food_name ILIKE '%daging%' THEN 'protein'
        WHEN meal_record.food_name ILIKE '%sayur%' OR meal_record.food_name ILIKE '%paku%' OR meal_record.food_name ILIKE '%ulam%' OR meal_record.food_name ILIKE '%midin%' OR meal_record.food_name ILIKE '%pucuk%' THEN 'vegetable'
        WHEN meal_record.food_name ILIKE '%nasi%' OR meal_record.food_name ILIKE '%ubi%' OR meal_record.food_name ILIKE '%keledek%' OR meal_record.food_name ILIKE '%roti%' THEN 'carbohydrate'
        WHEN meal_record.food_name ILIKE '%buah%' OR meal_record.food_name ILIKE '%pisang%' OR meal_record.food_name ILIKE '%tarap%' THEN 'fruit'
        WHEN meal_record.food_name ILIKE '%kicap%' OR meal_record.food_name ILIKE '%belacan%' OR meal_record.food_name ILIKE '%garam%' OR meal_record.food_name ILIKE '%kunyit%' THEN 'condiment'
        ELSE 'other'
      END,
      '1 portion',
      'serving',
      meal_record.notes
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_shopping_list IS 'Auto-generate shopping list from meal plan with Sabah food categorization';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- After running this migration:
-- 1. Verify tables exist in Table Editor
-- 2. Test meal-planner page at https://nutrisihat.vercel.app/meal-planner
-- ============================================