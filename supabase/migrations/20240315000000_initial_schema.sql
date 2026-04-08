-- NutriSihat Database Schema
-- Comprehensive health tracking for elderly mothers with diabetes and cancer

-- ==========================================
-- ENABLE EXTENSIONS
-- ==========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- ENUMS
-- ==========================================

CREATE TYPE preferred_name_type AS ENUM ('Mak', 'Ibu', 'Nenek', 'custom');
CREATE TYPE treatment_stage_type AS ENUM ('diagnosis', 'treatment', 'recovery', 'survivor');
CREATE TYPE meal_type_enum AS ENUM ('before_meal', 'after_meal');
CREATE TYPE blood_sugar_status_type AS ENUM ('rendah', 'normal', 'tinggi', 'sangat_tinggi');
CREATE TYPE frequency_type AS ENUM ('daily', 'twice_daily', 'three_times', 'weekly');
CREATE TYPE medicine_status_type AS ENUM ('taken', 'missed', 'skipped');
CREATE TYPE meal_time_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE health_log_type AS ENUM ('weight', 'energy_level', 'appetite', 'symptoms', 'side_effects');
CREATE TYPE treatment_type AS ENUM ('chemotherapy', 'radiation', 'immunotherapy', 'surgery', 'hormone_therapy');
CREATE TYPE tip_category_type AS ENUM ('nutrition', 'side_effects', 'lifestyle', 'emotional_support');
CREATE TYPE severity_type AS ENUM ('mild', 'moderate', 'severe');
CREATE TYPE notification_type AS ENUM ('medicine', 'blood_sugar', 'meal', 'water', 'appointment');

-- ==========================================
-- TABLES
-- ==========================================

-- PROFILES TABLE
-- Extends Supabase auth.users with app-specific data
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  preferred_name preferred_name_type DEFAULT 'Mak',
  custom_name TEXT,
  age INTEGER,
  health_conditions TEXT[] DEFAULT ARRAY['diabetes']::TEXT[],
  cancer_type TEXT, -- e.g., 'breast', 'uterine', 'colon'
  treatment_stage treatment_stage_type DEFAULT 'treatment',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_age CHECK (age IS NULL OR (age >= 1 AND age <= 150))
);

-- BLOOD SUGAR LOGS TABLE
-- Daily blood sugar tracking
CREATE TABLE blood_sugar_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  value DECIMAL(5,2) NOT NULL, -- Blood sugar reading in mmol/L
  meal_type meal_type_enum NOT NULL,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  logged_time TIME NOT NULL DEFAULT CURRENT_TIME,
  notes TEXT,
  status blood_sugar_status_type GENERATED ALWAYS AS (
    CASE
      WHEN value < 3.0 THEN 'rendah'
      WHEN value BETWEEN 3.0 AND 5.6 THEN 'normal'
      WHEN value BETWEEN 5.7 AND 7.0 THEN 'tinggi'
      ELSE 'sangat_tinggi'
    END
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for quick queries
CREATE INDEX idx_blood_sugar_logs_user_date ON blood_sugar_logs(user_id, logged_date DESC);
CREATE INDEX idx_blood_sugar_logs_user_status ON blood_sugar_logs(user_id, status);

-- MEDICINE REMINDERS TABLE
-- Medicine schedules
CREATE TABLE medicine_reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency frequency_type NOT NULL,
  times TIME[] NOT NULL, -- Array of times to take medicine
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  condition TEXT, -- Associated health condition
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_medicine_reminders_user ON medicine_reminders(user_id);
CREATE INDEX idx_medicine_reminders_active ON medicine_reminders(user_id, is_active);

-- MEDICINE LOGS TABLE
-- Track medicine intake
CREATE TABLE medicine_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  medicine_id UUID REFERENCES medicine_reminders(id) ON DELETE CASCADE NOT NULL,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status medicine_status_type DEFAULT 'taken',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_medicine_logs_user_date ON medicine_logs(user_id, taken_at DESC);
CREATE INDEX idx_medicine_logs_medicine ON medicine_logs(medicine_id);

-- MEAL LOGS TABLE
-- Track food intake
CREATE TABLE meal_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  food_id TEXT NOT NULL, -- Reference to food in foods.ts
  portion TEXT NOT NULL, -- e.g., "1 cup", "2 pieces"
  meal_time meal_time_type NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_meal_logs_user_date ON meal_logs(user_id, logged_at DESC);

-- HEALTH LOGS TABLE
-- Track weight, energy, appetite, symptoms, side effects
CREATE TABLE health_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  log_type health_log_type NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit TEXT, -- e.g., "kg", "out of 10"
  description TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_health_logs_user_type ON health_logs(user_id, log_type);
CREATE INDEX idx_health_logs_user_date ON health_logs(user_id, logged_at DESC);

-- CANCER TREATMENT TIPS TABLE
-- Nutrition and lifestyle tips for cancer patients
CREATE TABLE cancer_treatment_tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cancer_type TEXT NOT NULL,
  treatment_type treatment_type NOT NULL,
  tip_category tip_category_type NOT NULL,
  tip_title TEXT NOT NULL,
  tip_content TEXT NOT NULL,
  foods_to_avoid TEXT[] DEFAULT ARRAY[]::TEXT[],
  foods_recommended TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cancer_tips_type ON cancer_treatment_tips(cancer_type, treatment_type);

-- SIDE EFFECT MANAGEMENT TABLE
-- Manage chemotherapy/radiation side effects
CREATE TABLE side_effect_management (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  side_effect TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  recommended_foods TEXT[] DEFAULT ARRAY[]::TEXT[],
  avoid_foods TEXT[] DEFAULT ARRAY[]::TEXT[],
  tips TEXT[] DEFAULT ARRAY[]::TEXT[],
  severity severity_type DEFAULT 'moderate',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
-- Push notifications for reminders
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_pending ON notifications(user_id, is_sent, scheduled_time);

-- AI CHAT HISTORY TABLE
-- Store AI conversations
CREATE TABLE ai_chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(user_id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_chat_user ON ai_chat_history(user_id, created_at DESC);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_sugar_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicine_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Blood Sugar Logs: Users can only see their own logs
CREATE POLICY "Users can view own blood sugar logs"
  ON blood_sugar_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own blood sugar logs"
  ON blood_sugar_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own blood sugar logs"
  ON blood_sugar_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own blood sugar logs"
  ON blood_sugar_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Medicine Reminders: Users can only see their own reminders
CREATE POLICY "Users can view own medicine reminders"
  ON medicine_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medicine reminders"
  ON medicine_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own medicine reminders"
  ON medicine_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own medicine reminders"
  ON medicine_reminders FOR DELETE
  USING (auth.uid() = user_id);

-- Medicine Logs: Users can only see their own logs
CREATE POLICY "Users can view own medicine logs"
  ON medicine_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own medicine logs"
  ON medicine_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Meal Logs: Users can only see their own logs
CREATE POLICY "Users can view own meal logs"
  ON meal_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meal logs"
  ON meal_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal logs"
  ON meal_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Health Logs: Users can only see their own logs
CREATE POLICY "Users can view own health logs"
  ON health_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health logs"
  ON health_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- AI Chat History: Users can only see their own history
CREATE POLICY "Users can view own chat history"
  ON ai_chat_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat history"
  ON ai_chat_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat history"
  ON ai_chat_history FOR DELETE
  USING (auth.uid() = user_id);

-- Cancer Treatment Tips: Public read access (all users can view)
CREATE POLICY "Cancer tips are viewable by all authenticated users"
  ON cancer_treatment_tips FOR SELECT
  TO authenticated
  USING (TRUE);

-- Side Effect Management: Public read access (all users can view)
CREATE POLICY "Side effects are viewable by all authenticated users"
  ON side_effect_management FOR SELECT
  TO authenticated
  USING (TRUE);

-- ==========================================
-- FUNCTIONS AND TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blood_sugar_logs_updated_at
  BEFORE UPDATE ON blood_sugar_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medicine_reminders_updated_at
  BEFORE UPDATE ON medicine_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cancer_treatment_tips_updated_at
  BEFORE UPDATE ON cancer_treatment_tips
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_side_effect_management_updated_at
  BEFORE UPDATE ON side_effect_management
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SEED DATA
-- ==========================================

-- Insert cancer treatment tips
INSERT INTO cancer_treatment_tips (cancer_type, treatment_type, tip_category, tip_title, tip_content, foods_to_avoid, foods_recommended) VALUES
-- Breast Cancer - Chemotherapy
('breast', 'chemotherapy', 'nutrition', 'Nutrisi Semasa Chemotherapy', 
 'Makan makanan tinggi protein untuk membantu badan pulih. Elak makanan mentah dan pastri. Minum banyak air.',
 ARRAY['makanan mentah', 'sushi', 'makanan tidak dimasak dengan baik', 'tenusu tidak dipasteurisasi'],
 ARRAY['brokoli', 'ikan salmon', 'telur', 'oatmeal', 'buah segar']),
 
('breast', 'chemotherapy', 'side_effects', 'Mengurus Mual dan Muntah', 
 'Makan makanan kecil kerap. Elak makanan berminyak dan pedas. Minum teh halia atau makan biskut masin.',
 ARRAY['makanan berminyak', 'makanan pedas', 'makanan kuat bau'],
 ARRAY['biskut masin', 'teh halia', 'nasi plain', 'sup ayam', 'buah segar']),

-- Uterine/Cervical Cancer - Radiation
('uterine', 'radiation', 'nutrition', 'Nutrisi Semasa Rawatan Radiasi',
 'Fokus pada makanan tinggi fiber dan protein. Kurangkan makanan yang menyebabkan gas. Minum sekurang-kurangnya 8 gelas air.',
 ARRAY['makanan menyebabkan gas', 'kacang', 'brokoli berlebihan', 'minuman berkarbonat'],
 ARRAY['ikan', 'ayam tanpa kulit', 'telur', 'nasi', 'sup sayur']),

('uterine', 'radiation', 'side_effects', 'Mengurus Kesan Sampingan Radiasi Pelvis',
 'Jaga kebersihan kawasan rawatan. Gunakan sabun lembut. Kurangkan makanan pedas dan berasid.',
 ARRAY['makanan pedas', 'buah sitrus', 'makanan berasid', 'kafein'],
 ARRAY['oatmeal', 'sup', 'protein lean', 'sayur rebus', 'buah-buahan lembut']),

-- General Cancer Tips
('general', 'chemotherapy', 'lifestyle', 'Tips Gaya Hidup Semasa Rawatan',
 'Rehat yang cukup. Senaman ringan seperti berjalan. Jangan skip makan. Dapatkan sokongan keluarga.',
 ARRAY[]::TEXT[],
 ARRAY['senaman ringan', 'rehat', 'tidur berkualiti']),

('general', 'immunotherapy', 'nutrition', 'Nutrisi untuk Immunotherapy',
 'Fokus pada makanan yang menyokong sistem imun. Makan buah-buahan beri, sayur hijau, dan protein berkualiti.',
 ARRAY['makanan processed', 'gula berlebihan', 'alkohol'],
 ARRAY['blueberry', 'strawberry', 'brokoli', 'bayam', 'ikan salmon', 'telur', 'yogurt plain']);

-- Insert side effect management tips
INSERT INTO side_effect_management (side_effect, description, recommended_foods, avoid_foods, tips, severity) VALUES
('nausea', 'Rasa mual dan muntah semasa rawatan', 
 ARRAY['biskut masin', 'teh halia', 'nasi plain', 'sup ayam', 'buah segar', 'oatmeal'],
 ARRAY['makanan berminyak', 'makanan pedas', 'makanan kuat bau', 'tenusu tinggi lemak'],
 ARRAY['Makan makanan kecil kerap', 'Jangan berbaring selepas makan', 'Minum air di antara makanan', 'Cuba teh halia'],
 'moderate'),

('appetite_loss', 'Kehilangan selera makan',
 ARRAY['makanan tinggi kalori', 'sup', 'smoothie', 'telur', 'yogurt', 'kekacang'],
 ARRAY['makanan berat', 'makanan berminyak'],
 ARRAY['Makan makanan kecil kerap', 'Pilih makanan kegemaran', 'Makan dengan keluarga', 'Cuba sup atau smoothie'],
 'moderate'),

('fatigue', 'Rasa penat dan lemah',
 ARRAY['protein lean', 'bijirin whole', 'buah', 'sayur', 'kacang', 'telur'],
 ARRAY['gula berlebihan', 'makanan processed'],
 ARRAY['Rehat bila perlu', 'Senaman ringan', 'Tidur yang cukup', 'Makan makanan berkhasiat'],
 'mild'),

('mouth_sores', 'Luka dalam mulut',
 ARRAY['sup', 'yogurt', 'kekacang', 'oatmeal', 'buah lembut', 'nasi'],
 ARRAY['makanan pedas', 'buah sitrus', 'makanan masin', 'makanan keras'],
 ARRAY['Guna straw untuk minum', 'Makan makanan sejuk atau suam', 'Elak makanan pedas', 'Bilas mulut dengan air masin'],
 'severe'),

('taste_changes', 'Perubahan rasa makanan',
 ARRAY['makanan berperisa', 'herba', 'remeh', 'buah', 'sayur'],
 ARRAY['makanan tawar', 'makanan tidak berperisa'],
 ARRAY['Cuba perisa semula jadi', 'Makan makanan sejuk', 'Tambah remeh dan herba', 'Cuba makanan baru'],
 'mild');

-- ==========================================
-- VIEWS
-- ==========================================

-- View for daily blood sugar summary
CREATE VIEW daily_blood_sugar_summary AS
SELECT 
  user_id,
  logged_date,
  COUNT(*) as total_readings,
  AVG(value) as avg_value,
  MIN(value) as min_value,
  MAX(value) as max_value,
  COUNT(CASE WHEN status = 'normal' THEN 1 END) as normal_count,
  COUNT(CASE WHEN status = 'tinggi' THEN 1 END) as high_count,
  COUNT(CASE WHEN status = 'sangat_tinggi' THEN 1 END) as very_high_count,
  COUNT(CASE WHEN status = 'rendah' THEN 1 END) as low_count
FROM blood_sugar_logs
GROUP BY user_id, logged_date;

-- View for pending medicine reminders
CREATE VIEW pending_medicine_reminders AS
SELECT 
  mr.id,
  mr.user_id,
  mr.name,
  mr.dosage,
  mr.frequency,
  mr.times,
  mr.notes,
  mr.condition
FROM medicine_reminders mr
WHERE mr.is_active = TRUE
  AND NOT EXISTS (
    SELECT 1 FROM medicine_logs ml 
    WHERE ml.medicine_id = mr.id 
    AND DATE(ml.taken_at) = CURRENT_DATE
  );

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

-- Additional indexes for common queries
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_blood_sugar_logs_date ON blood_sugar_logs(logged_date);
CREATE INDEX idx_medicine_logs_date ON medicine_logs(taken_at);
CREATE INDEX idx_meal_logs_date ON meal_logs(logged_at);

-- ==========================================
-- GRANT PERMISSIONS
-- ==========================================

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON cancer_treatment_tips TO authenticated;
GRANT SELECT ON side_effect_management TO authenticated;

-- ==========================================
-- COMMENTS
-- ==========================================

COMMENT ON TABLE profiles IS 'User profiles with health conditions';
COMMENT ON TABLE blood_sugar_logs IS 'Daily blood sugar readings';
COMMENT ON TABLE medicine_reminders IS 'Medicine schedules and reminders';
COMMENT ON TABLE medicine_logs IS 'Track medicine intake history';
COMMENT ON TABLE meal_logs IS 'Food intake tracking';
COMMENT ON TABLE health_logs IS 'General health metrics (weight, energy, etc.)';
COMMENT ON TABLE cancer_treatment_tips IS 'Nutrition tips for cancer patients';
COMMENT ON TABLE side_effect_management IS 'Side effect management guides';
COMMENT ON TABLE notifications IS 'Push notification schedules';
COMMENT ON TABLE ai_chat_history IS 'AI assistant conversation history';