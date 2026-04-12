-- Seed Sabah Traditional Foods for NutriSihat
-- Run this AFTER 20260412_add_meal_planner.sql

-- Insert Sabah foods into existing foods table (if exists)
-- Or create simple foods table if not exists

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

-- Enable RLS
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Foods are viewable by all authenticated users"
  ON foods FOR SELECT
  TO authenticated
  USING (TRUE);

-- Insert Sabah Traditional Foods
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
('Bamboo Shoots', 'Rebung', 'Wild bamboo shoots', 0, true, true, true, 'vegetable', 'High fiber (45.96% of wild veg collected).'),
('Banana Inflorescence', 'Jantung Pisang', 'Iron-rich banana flower', 0, true, true, true, 'vegetable', 'Iron-rich, traditional vegetable.'),

-- TRADITIONAL DISHES
('Hinava', 'Hinava', 'Raw fish ceviche with lime, chili, ginger, bambangan', 0, true, true, true, 'protein', 'Perfect diabetes meal - lean protein, no oil, anti-inflammatory spices.'),
('Pinasakan', 'Pinasakan', 'Fish stew with takob-akob and turmeric', 0, true, true, true, 'protein', 'Excellent - lean protein, anti-inflammatory turmeric.'),
('Sagol', 'Sagol', 'Minced fish with turmeric, garlic, ginger', 0, true, true, true, 'protein', 'Minimal oil, anti-inflammatory spices.'),
('Ubi Daun Kayu Stew', 'Pucuk Ubi Masak Lemak', 'Tapioca leaves in coconut milk', 0, true, true, true, 'vegetable', 'High protein, iron, fiber from leaves.'),

-- CARBOHYDRATES (Limit)
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

-- AVOID LIST (for reference)
('Glutinous Rice', 'Beras Pulut', 'Sticky rice - high GI', 85, false, false, true, 'carbohydrate', 'AVOID: Very high GI, spikes blood sugar.'),
('Rice Wine', 'Lihing', 'Traditional rice wine', 0, false, false, true, 'condiment', 'AVOID: Alcohol and sugar content.'),
('Tapai', 'Tapai', 'Fermented rice', 75, false, false, true, 'carbohydrate', 'AVOID: High sugar, alcohol from fermentation.');

-- Create index for meal planner queries
CREATE INDEX idx_foods_diabetes_safe ON foods(is_diabetes_safe) WHERE is_diabetes_safe = true;
CREATE INDEX idx_foods_sabah_local ON foods(is_sabah_local) WHERE is_sabah_local = true;
CREATE INDEX idx_foods_category ON foods(category);

COMMENT ON TABLE foods IS 'Food database with Sabah traditional foods, diabetes-safe indicators, and health notes';
