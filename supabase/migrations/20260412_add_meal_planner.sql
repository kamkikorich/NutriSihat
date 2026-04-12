-- Meal Planner Schema for NutriSihat
-- Focus: Sabah regional foods, diabetes-safe, uterus-friendly

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
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  food_id UUID REFERENCES foods(id),
  food_name TEXT NOT NULL,
  food_name_ms TEXT, -- Bahasa Malaysia name
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

-- Shopping list items (auto-generated from meal plans)
CREATE TABLE IF NOT EXISTS shopping_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_name_ms TEXT, -- Bahasa Malaysia name
  category TEXT CHECK (category IN ('protein', 'vegetable', 'carbohydrate', 'fruit', 'condiment', 'other')),
  quantity TEXT,
  unit TEXT,
  estimated_price NUMERIC(10, 2),
  is_purchased BOOLEAN DEFAULT false,
  market_location TEXT, -- e.g., 'Gaya Street Market', 'KK Market'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sabah food preferences per user
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_meal_plans_user ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_meals_plan ON daily_meals(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_plan ON shopping_lists(meal_plan_id);
CREATE INDEX IF NOT EXISTS idx_user_preferences ON user_food_preferences(user_id);

-- Enable RLS
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_food_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

CREATE POLICY "Users can view own shopping lists"
  ON shopping_lists FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp 
      WHERE mp.id = shopping_lists.meal_plan_id 
      AND mp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own shopping lists"
  ON shopping_lists FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM meal_plans mp 
      WHERE mp.id = shopping_lists.meal_plan_id 
      AND mp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own food preferences"
  ON user_food_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own food preferences"
  ON user_food_preferences FOR ALL
  USING (auth.uid() = user_id);

-- Function to auto-generate shopping list from meal plan
CREATE OR REPLACE FUNCTION generate_shopping_list(plan_id UUID)
RETURNS VOID AS $$
DECLARE
  meal_record RECORD;
  existing_item RECORD;
BEGIN
  -- Loop through all daily meals in the plan
  FOR meal_record IN 
    SELECT * FROM daily_meals 
    WHERE meal_plan_id = plan_id
    ORDER BY day_of_week, meal_type
  LOOP
    -- Insert or update shopping list item
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
