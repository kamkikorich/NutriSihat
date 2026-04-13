-- ============================================-- NUTRISIHAT KKM MEAL PLANNER - NEW MIGRATION-- ============================================-- Replaces Sabah foods with KKM-based meal plans-- ============================================
-- PART 1: CLEAR EXISTING DATA AND RESEED WITH KKM FOODS-- ============================================
-- First, delete existing data (be careful with foreign keys)
DELETE FROM daily_meals;
DELETE FROM shopping_lists;
DELETE FROM user_food_preferences;
DELETE FROM meal_plans;
DELETE FROM foods;

-- Reset the foods table
DROP TABLE IF EXISTS foods CASCADE;

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
  kkm_category TEXT, -- 'suku_karbo', 'separuh_sayur', 'suku_protein', 'susu', 'buah'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for foods
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Public read access for authenticated users
CREATE POLICY "Foods are viewable by all authenticated users"
  ON foods FOR SELECT
  TO authenticated
  USING (TRUE);

-- ============================================-- PART 2: KKM SUKU-SEPARUH FOODS DATABASE-- ============================================
-- Based on KKM Malaysia Guidelines

INSERT INTO foods (name, name_ms, description, glycemic_index, is_diabetes_safe, is_uterus_friendly, category, health_notes, kkm_category) VALUES

-- ============================================-- SUKU KARBONHIDRAT (25% of plate)-- ============================================-- Low GI Carbohydrates (best for diabetes)
('Brown Rice', 'Nasi Perang', 'Whole grain rice, low GI', 55, true, true, 'carbohydrate', 'Low GI, high fiber, better blood sugar control than white rice.', 'suku_karbo'),
('Basmati Rice', 'Nasi Basmati', 'Long grain rice, lower GI', 58, true, true, 'carbohydrate', 'Lower GI than normal rice. Good portion control important.', 'suku_karbo'),
('Quinoa', 'Quinoa', 'Complete protein grain', 53, true, true, 'carbohydrate', 'Complete protein, low GI, high fiber.', 'suku_karbo'),
('Oats', 'Oat', 'Rolled or steel-cut', 55, true, true, 'carbohydrate', 'Beta-glucan fiber helps blood sugar control.', 'suku_karbo'),
('Wholemeal Bread', 'Roti Wholemeal', '100% whole grain bread', 55, true, true, 'carbohydrate', 'High fiber, better than white bread.', 'suku_karbo'),
('Sweet Potato', 'Keledek', 'Orange/purple varieties', 60, true, true, 'carbohydrate', 'Moderate GI, high fiber, vitamin A.', 'suku_karbo'),
('Whole Wheat Pasta', 'Pasta Gandum', '100% whole wheat', 42, true, true, 'carbohydrate', 'Lower GI than regular pasta when al dente.', 'suku_karbo'),
('Barley', 'Barli', 'High fiber grain', 25, true, true, 'carbohydrate', 'Very low GI, excellent for blood sugar.', 'suku_karbo'),
('Chapati (Whole Wheat)', 'Capatti', 'Indian whole wheat flatbread', 52, true, true, 'carbohydrate', 'Whole wheat, better than naan or white bread.', 'suku_karbo'),

-- High GI Carbohydrates (limit/avoid for diabetes)
('White Rice', 'Nasi Putih', 'Regular white rice', 73, false, false, 'carbohydrate', 'HIGH GI - spikes blood sugar. Limit or replace with brown rice.', 'suku_karbo'),
('Glutinous Rice', 'Beras Pulut', 'Sticky rice', 85, false, false, 'carbohydrate', 'AVOID: Very high GI, very bad for diabetes.', 'suku_karbo'),
('White Bread', 'Roti Putih', 'Refined flour bread', 75, false, false, 'carbohydrate', 'High GI, low fiber. Not recommended.', 'suku_karbo'),

-- ============================================-- SEPARUH SAYURAN (50% of plate) - Non-starchy vegetables-- ============================================-- Leafy Greens
('Spinach', 'Bayam', 'Dark leafy green', 15, true, true, 'vegetable', 'Iron, folate, fiber. Excellent for diabetes.', 'separuh_sayur'),
('Kangkung', 'Kangkung', 'Water spinach', 15, true, true, 'vegetable', 'Low calorie, high fiber, traditional Malaysian vegetable.', 'separuh_sayur'),
('Mustard Greens', 'Sawi', 'Chinese mustard greens', 15, true, true, 'vegetable', 'High vitamin C, calcium, fiber.', 'separuh_sayur'),
('Kailan', 'Kailan', 'Chinese broccoli', 15, true, true, 'vegetable', 'High vitamin K, calcium, low calorie.', 'separuh_sayur'),

-- Cruciferous Vegetables
('Broccoli', 'Brokoli', 'Tree-like green vegetable', 15, true, true, 'vegetable', 'Sulforaphane, fiber, vitamin C. Excellent for diabetes.', 'separuh_sayur'),
('Cauliflower', 'Bunga Kubis', 'White cruciferous vegetable', 15, true, true, 'vegetable', 'Low calorie, versatile, can replace rice.', 'separuh_sayur'),
('Cabbage', 'Kobis', 'Round leafy vegetable', 15, true, true, 'vegetable', 'Vitamin C, fiber, anti-inflammatory.', 'separuh_sayur'),
('Brussels Sprouts', 'Kubis Brussels', 'Mini cabbage', 15, true, true, 'vegetable', 'High fiber, vitamin C, K.', 'separuh_sayur'),

-- Other Non-starchy Vegetables
('Cucumber', 'Timun', 'Water-rich vegetable', 15, true, true, 'vegetable', 'Hydrating, low calorie, cooling.', 'separuh_sayur'),
('Tomato', 'Tomato', 'Fruit used as vegetable', 38, true, true, 'vegetable', 'Lycopene, vitamin C, low calorie.', 'separuh_sayur'),
('Bell Peppers', 'Lada Benggala', 'Colorful sweet peppers', 15, true, true, 'vegetable', 'Vitamin C, antioxidants.', 'separuh_sayur'),
('Okra', 'Bendi', 'Lady fingers', 15, true, true, 'vegetable', 'Soluble fiber helps blood sugar control.', 'separuh_sayur'),
('Eggplant', 'Terung', 'Purple vegetable', 15, true, true, 'vegetable', 'Fiber, antioxidants, low calorie.', 'separuh_sayur'),
('Green Beans', 'Kacang Buncis', 'String beans', 15, true, true, 'vegetable', 'Fiber, folate, low calorie.', 'separuh_sayur'),
('Long Beans', 'Kacang Panjang', 'Asian long beans', 15, true, true, 'vegetable', 'Traditional Malaysian vegetable, high fiber.', 'separuh_sayur'),
('Winged Bean', 'Kacang Botol', 'Four-angled bean', 15, true, true, 'vegetable', 'High protein, fiber, traditional.', 'separuh_sayur'),
('Bitter Gourd', 'Peria', 'Bitter melon', 15, true, true, 'vegetable', 'May help blood sugar control. Traditional remedy.', 'separuh_sayur'),

-- Root Vegetables (starchy - count as carbs)
('Carrot', 'Lobak Merah', 'Orange root vegetable', 47, true, true, 'vegetable', 'Beta-carotene. Moderate amount OK.', 'separuh_sayur'),

-- ============================================-- SUKU PROTEIN (25% of plate)-- ============================================-- Lean Proteins
('Chicken Breast', 'Dada Ayam', 'Skinless lean chicken', 0, true, true, 'protein', 'Lean protein, no carbs. Remove skin for lower fat.', 'suku_protein'),
('Fish (White)', 'Ikan Putih', 'Tilapia, Siakap, etc.', 0, true, true, 'protein', 'Lean protein, Omega-3. Steam or grill preferred.', 'suku_protein'),
('Fish (Oily)', 'Ikan Berlemak', 'Salmon, Sardin, Kembung', 0, true, true, 'protein', 'High Omega-3, heart healthy. Limit to 2-3x per week.', 'suku_protein'),
('Prawns', 'Udang', 'Shellfish', 0, true, true, 'protein', 'Low fat protein. Moderate cholesterol.', 'suku_protein'),
('Squid', 'Sotong', 'Calamari', 0, true, true, 'protein', 'Low fat, high protein. Avoid fried.', 'suku_protein'),
('Tofu', 'Tauhu', 'Soybean curd', 15, true, true, 'protein', 'Plant protein, isoflavones. Good meat alternative.', 'suku_protein'),
('Tempeh', 'Tempe', 'Fermented soybeans', 15, true, true, 'protein', 'Fermented, easier digestion, protein.', 'suku_protein'),
('Eggs', 'Telur', 'Chicken eggs', 0, true, true, 'protein', 'Complete protein, choline. Limit yolk if high cholesterol.', 'suku_protein'),

-- Legumes (protein + carbs)
('Lentils', 'Kacang Dhal', 'Split pulses', 32, true, true, 'protein', 'Low GI, high fiber, iron. Excellent for diabetes.', 'suku_protein'),
('Chickpeas', 'Kacang Kuda', 'Garbanzo beans', 28, true, true, 'protein', 'Low GI, fiber, protein.', 'suku_protein'),
('Black Beans', 'Kacang Hitam', 'Turtle beans', 30, true, true, 'protein', 'Low GI, high fiber, antioxidants.', 'suku_protein'),

-- ============================================-- SUSU (1 serving)-- ============================================-- Dairy/Calcium
('Low-fat Milk', 'Susu Rendah Lemak', 'Skim or low-fat milk', 30, true, true, 'protein', 'Calcium, protein. Choose low-fat for heart health.', 'susu'),
('Greek Yogurt (Plain)', 'Yogurt Greek', 'Unsweetened', 15, true, true, 'protein', 'Protein, probiotics. NO added sugar.', 'susu'),
('Cheese (Low-fat)', 'Keju', 'Reduced fat cheese', 0, true, true, 'protein', 'Calcium, protein. Portion control.', 'susu'),

-- Plant-based alternatives
('Soy Milk (Unsweetened)', 'Susu Soya', 'No added sugar', 30, true, true, 'protein', 'Plant protein, calcium fortified.', 'susu'),
('Almond Milk (Unsweetened)', 'Susu Almond', 'No added sugar', 30, true, true, 'protein', 'Low calorie, calcium fortified.', 'susu'),

-- ============================================-- BUAH (1 serving - separate from meal)-- ============================================-- Low GI Fruits (best for diabetes)
('Guava', 'Jambu Batu', 'Low GI tropical', 12, true, true, 'fruit', 'High vitamin C, fiber. Excellent choice.', 'buah'),
('Apple', 'Epal', 'With skin', 36, true, true, 'fruit', 'Fiber, antioxidants. Good for diabetes.', 'buah'),
('Pear', 'Pir', 'With skin', 38, true, true, 'fruit', 'Fiber, low GI.', 'buah'),
('Orange', 'Oren', 'Citrus fruit', 40, true, true, 'fruit', 'Vitamin C, fiber. Fresh, not juice.', 'buah'),
('Grapes', 'Anggur', 'Especially red/purple', 46, true, true, 'fruit', 'Resveratrol, antioxidants. Moderate portion.', 'buah'),
('Kiwi', 'Kiwi', 'Green or gold', 50, true, true, 'fruit', 'Vitamin C, fiber, low GI.', 'buah'),
('Papaya', 'Betik', 'When unripe/green', 40, true, false, 'fruit', 'Enzymes, fiber. Unripe better than ripe.', 'buah'),
('Watermelon', 'Tembikai', 'High water content', 72, false, false, 'fruit', 'HIGH GI - avoid or very small portion.', 'buah'),
('Banana', 'Pisang', 'Especially ripe', 51, true, true, 'fruit', 'Moderate GI. Green banana better than ripe.', 'buah'),
('Dragon Fruit', 'Buah Naga', 'White or red', 48, true, true, 'fruit', 'Fiber, antioxidants. Moderate GI.', 'buah'),
('Star Fruit', 'Belimbing', 'Low calorie', 45, true, true, 'fruit', 'Low calorie, vitamin C.', 'buah'),
('Pomelo', 'Limau Bali', 'Citrus family', 45, true, true, 'fruit', 'Low GI, vitamin C.', 'buah'),

-- ============================================-- PART 3: SAMPLE MEAL PLANS-- ============================================
-- These can be used as templates

-- Note: In application code, create meal plans using these food combinations
-- Example Day 1:
-- Breakfast: Oats + Greek yogurt + apple
-- Lunch: Brown rice + chicken breast + stir-fried vegetables
-- Dinner: Quinoa + grilled fish + steamed broccoli
-- Snack: Guava

-- Example Day 2:
-- Breakfast: Wholemeal bread + egg + tomato
-- Lunch: Sweet potato + tempeh + kangkung
-- Dinner: Barley + lentils + mixed vegetables
-- Snack: Orange

-- ============================================-- PART 4: TABLE CONFIGURATION-- ============================================
-- Ensure tables exist for meal planning

-- Weekly meal plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
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
  portion_size TEXT DEFAULT '1 serving',
  calories INTEGER,
  glycemic_index INTEGER,
  is_diabetes_safe BOOLEAN DEFAULT false,
  is_uterus_friendly BOOLEAN DEFAULT false,
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
  is_purchased BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================-- PART 5: INDEXES AND RLS POLICIES-- ============================================

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_foods_category ON foods(category);
CREATE INDEX IF NOT EXISTS idx_foods_diabetes ON foods(is_diabetes_safe);
CREATE INDEX IF NOT EXISTS idx_foods_kkm ON foods(kkm_category);
CREATE INDEX IF NOT EXISTS idx_daily_meals_plan ON daily_meals(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_daily_meals_day ON daily_meals(day_of_week);

-- Enable RLS on all tables
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

-- Users can only access their own meal plans
CREATE POLICY "Users can view own meal plans"
  ON meal_plans FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own meal plans"
  ON meal_plans FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own meal plans"
  ON meal_plans FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own meal plans"
  ON meal_plans FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Daily meals policies (through meal_plan ownership)
CREATE POLICY "Users can view daily meals for own plans"
  ON daily_meals FOR SELECT
  TO authenticated
  USING (
    meal_plan_id IN (
      SELECT id FROM meal_plans WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage daily meals for own plans"
  ON daily_meals FOR ALL
  TO authenticated
  USING (
    meal_plan_id IN (
      SELECT id FROM meal_plans WHERE user_id = auth.uid()
    )
  );

-- Shopping list policies
CREATE POLICY "Users can view own shopping lists"
  ON shopping_lists FOR SELECT
  TO authenticated
  USING (
    meal_plan_id IN (
      SELECT id FROM meal_plans WHERE user_id = auth.uid()
    )
  );

-- ============================================-- VERIFICATION QUERY-- ============================================
-- Run this to verify data was inserted:
-- SELECT category, COUNT(*) FROM foods GROUP BY category ORDER BY category;
-- Should show:
-- carbohydrate: 12
-- condiment: 0
-- fruit: 12
-- protein: 14
-- vegetable: 18

-- Verify KKM categories:
-- SELECT kkm_category, COUNT(*) FROM foods WHERE kkm_category IS NOT NULL GROUP BY kkm_category;

-- ============================================-- END OF MIGRATION-- ============================================
