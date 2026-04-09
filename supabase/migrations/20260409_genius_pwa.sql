-- Genius PWA Migration
-- Creates tables for reminders, nutrition tips, caregivers, and notification logs
-- Created: 2026-04-09

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- NUTRITION TIPS TABLE
-- Daily rotating tips for elderly users
-- ============================================
CREATE TABLE IF NOT EXISTS nutrition_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_text TEXT NOT NULL,
  tip_category TEXT DEFAULT 'general' CHECK (tip_category IN ('general', 'diabetes', 'hypertension', 'heart', 'kidney')),
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_nutrition_tips_category ON nutrition_tips(tip_category);

-- ============================================
-- REMINDERS TABLE
-- User-configurable reminders for meals, medicine, blood sugar
-- ============================================
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('meal', 'medicine', 'blood_sugar', 'water', 'custom')),
  reminder_time TIME NOT NULL,
  title TEXT NOT NULL,
  title_bm TEXT, -- Bahasa Melayu version
  is_active BOOLEAN DEFAULT true,
  days_of_week INTEGER[] DEFAULT ARRAY[0,1,2,3,4,5,6], -- 0=Sunday, 6=Saturday
  medicine_id UUID, -- Reference to specific medicine (optional)
  sound_enabled BOOLEAN DEFAULT true,
  vibration_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for reminders
CREATE INDEX IF NOT EXISTS idx_reminders_user_id ON reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_time ON reminders(reminder_time);
CREATE INDEX IF NOT EXISTS idx_reminders_active ON reminders(is_active);

-- ============================================
-- REMINDER LOGS TABLE
-- Track when reminders are completed/missed
-- ============================================
CREATE TABLE IF NOT EXISTS reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID NOT NULL REFERENCES reminders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'dismissed', 'missed')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for reminder logs
CREATE INDEX IF NOT EXISTS idx_reminder_logs_reminder_id ON reminder_logs(reminder_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_user_id ON reminder_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_reminder_logs_scheduled ON reminder_logs(scheduled_for);

-- ============================================
-- CAREGIVERS TABLE
-- Family members who receive notifications
-- ============================================
CREATE TABLE IF NOT EXISTS caregivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caregiver_email TEXT NOT NULL,
  caregiver_name TEXT,
  caregiver_phone TEXT,
  relationship TEXT CHECK (relationship IN ('anak', 'suami', 'isteri', 'adik_beradik', 'jiran', 'lain')),
  notify_on_missed_reminder BOOLEAN DEFAULT true,
  notify_on_blood_sugar BOOLEAN DEFAULT true,
  notify_on_medicine BOOLEAN DEFAULT true,
  notify_weekly_summary BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, caregiver_email)
);

-- Index for caregivers
CREATE INDEX IF NOT EXISTS idx_caregivers_user_id ON caregivers(user_id);
CREATE INDEX IF NOT EXISTS idx_caregivers_email ON caregivers(caregiver_email);

-- ============================================
-- NOTIFICATION LOGS TABLE
-- Track all sent notifications
-- ============================================
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  channel TEXT DEFAULT 'push' CHECK (channel IN ('push', 'email', 'sms', 'whatsapp')),
  title TEXT,
  body TEXT,
  payload JSONB,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed'))
);

-- Indexes for notification logs
CREATE INDEX IF NOT EXISTS idx_notification_logs_user_id ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_sent ON notification_logs(sent_at DESC);

-- ============================================
-- USER PREFERENCES TABLE
-- Voice, font size, and other accessibility settings
-- ============================================
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  font_size TEXT DEFAULT 'large' CHECK (font_size IN ('normal', 'large', 'extra_large')),
  voice_enabled BOOLEAN DEFAULT true,
  voice_speed REAL DEFAULT 0.8 CHECK (voice_speed >= 0.5 AND voice_speed <= 1.5),
  language TEXT DEFAULT 'ms' CHECK (language IN ('ms', 'en')),
  high_contrast BOOLEAN DEFAULT false,
  reduced_motion BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE nutrition_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Nutrition Tips: Readable by all authenticated users
DROP POLICY IF EXISTS "Tips readable by authenticated users" ON nutrition_tips;
CREATE POLICY "Tips readable by authenticated users" ON nutrition_tips
  FOR SELECT TO authenticated USING (true);

-- Reminders: Users manage their own
DROP POLICY IF EXISTS "Users view own reminders" ON reminders;
CREATE POLICY "Users view own reminders" ON reminders
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own reminders" ON reminders;
CREATE POLICY "Users create own reminders" ON reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own reminders" ON reminders;
CREATE POLICY "Users update own reminders" ON reminders
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own reminders" ON reminders;
CREATE POLICY "Users delete own reminders" ON reminders
  FOR DELETE USING (auth.uid() = user_id);

-- Reminder Logs: Users view/manage their own
DROP POLICY IF EXISTS "Users view own reminder logs" ON reminder_logs;
CREATE POLICY "Users view own reminder logs" ON reminder_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own reminder logs" ON reminder_logs;
CREATE POLICY "Users create own reminder logs" ON reminder_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own reminder logs" ON reminder_logs;
CREATE POLICY "Users update own reminder logs" ON reminder_logs
  FOR UPDATE USING (auth.uid() = user_id);

-- Caregivers: Users manage their own caregivers
DROP POLICY IF EXISTS "Users view own caregivers" ON caregivers;
CREATE POLICY "Users view own caregivers" ON caregivers
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own caregivers" ON caregivers;
CREATE POLICY "Users create own caregivers" ON caregivers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own caregivers" ON caregivers;
CREATE POLICY "Users update own caregivers" ON caregivers
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own caregivers" ON caregivers;
CREATE POLICY "Users delete own caregivers" ON caregivers
  FOR DELETE USING (auth.uid() = user_id);

-- Notification Logs: Users view their own
DROP POLICY IF EXISTS "Users view own notifications" ON notification_logs;
CREATE POLICY "Users view own notifications" ON notification_logs
  FOR SELECT USING (auth.uid() = user_id);

-- User Preferences: Users manage their own
DROP POLICY IF EXISTS "Users view own preferences" ON user_preferences;
CREATE POLICY "Users view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create own preferences" ON user_preferences;
CREATE POLICY "Users create own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own preferences" ON user_preferences;
CREATE POLICY "Users update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- SEED DATA: DEFAULT NUTRITION TIPS
-- ============================================

INSERT INTO nutrition_tips (tip_text, tip_category, title) VALUES
-- General Tips
('Minum air sekurang-kurangnya 8 gelas sehari untuk kesihatan buah pinggang.', 'general', 'Kepentingan Air'),
('Jangan skip sarapan. Sarapan memberi tenaga untuk memulakan hari.', 'general', 'Jangan Skip Sarapan'),
('Tidur 7-8 jam setiap malam untuk kesihatan optimum.', 'general', 'Tidur Yang Cukup'),
('Senaman ringan 30 minit sehari membantu kesihatan jantung.', 'general', 'Senaman Harian'),
('Makan sayur-sayuran hijau setiap hari untuk fiber dan vitamin.', 'general', 'Sayur Hijau'),

-- Diabetes Tips
('Kurangkan nasi putih. Gantikan dengan nasi perang atau oats.', 'diabetes', 'Pilihan Karbohidrat'),
('Periksa gula darah sebelum dan 2 jam selepas makan untuk ketahui kesan makanan.', 'diabetes', 'Pantau Gula Darah'),
('Gunakan pinggang kecil untuk kendalikan porsi makanan.', 'diabetes', 'Saiz Pinggang'),
('Elakkan minuman manis. Minum air kosong atau teh tanpa gula.', 'diabetes', 'Elak Minuman Manis'),
('Makan perlahan-lahan. Badan perlukan 20 minit untuk rasa kenyang.', 'diabetes', 'Makan Perlahan'),

-- Hypertension Tips
('Kurangkan garam dalam masakan. Gunakan herba dan rempah untuk perisa.', 'hypertension', 'Kurangkan Garam'),
('Elakkan makanan dalam tin dan makanan segera - tinggi sodium.', 'hypertension', 'Elak Makanan Tinggi Sodium'),
('Makan pisang dan ubi kayu - kaya dengan potassium untuk tekanan darah.', 'hypertension', 'Makanan Potassium'),
('Ukur tekanan darah setiap hari pada waktu yang sama.', 'hypertension', 'Ukur Tekanan Darah'),
('Senaman kardio ringan membantu menurunkan tekanan darah.', 'hypertension', 'Senaman Untuk Jantung'),

-- Heart Health Tips
('Makan ikan 2-3 kali seminggu untuk omega-3.', 'heart', 'Ikan Untuk Jantung'),
('Elakkan makanan goreng. Pilih makanan kukus atau rebus.', 'heart', 'Elak Gorengan'),
('Makan oat setiap pagi untuk kurangkan kolesterol.', 'heart', 'Sarapan Oat'),

-- Kidney Health Tips
('Hadkan protein jika doktor mencadangkan. Terlalu banyak protein bebankan buah pinggang.', 'kidney', 'Hadkan Protein'),
('Elakkan NSAID (painkiller) kerana boleh rosakkan buah pinggang.', 'kidney', 'Elak Painkiller'),
('Kawal gula darah dan tekanan darah untuk melindungi buah pinggang.', 'kidney', 'Kawal Gula & Tekanan');

-- ============================================
-- SEED DATA: DEFAULT REMINDERS FOR NEW USERS
-- Note: These are templates. Actual reminders are created per-user.
-- ============================================

-- Create a function to add default reminders for new users
CREATE OR REPLACE FUNCTION add_default_reminders_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO reminders (user_id, reminder_type, reminder_time, title, title_bm, days_of_week)
  VALUES
    (NEW.id, 'meal', '07:00', 'Breakfast', 'Sarapan', ARRAY[0,1,2,3,4,5,6]),
    (NEW.id, 'blood_sugar', '07:30', 'Morning Blood Sugar Check', 'Gula Darah Pagi', ARRAY[0,1,2,3,4,5,6]),
    (NEW.id, 'meal', '12:00', 'Lunch', 'Makan Tengahari', ARRAY[0,1,2,3,4,5,6]),
    (NEW.id, 'water', '15:00', 'Afternoon Water Reminder', 'Minum Air Petang', ARRAY[0,1,2,3,4,5,6]),
    (NEW.id, 'meal', '19:00', 'Dinner', 'Makan Malam', ARRAY[0,1,2,3,4,5,6]),
    (NEW.id, 'blood_sugar', '19:30', 'Evening Blood Sugar Check', 'Gula Darah Malam', ARRAY[0,1,2,3,4,5,6]);

  INSERT INTO user_preferences (user_id) VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION add_default_reminders_for_user();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to get today's tip
CREATE OR REPLACE FUNCTION get_daily_tip(p_date DATE DEFAULT CURRENT_DATE)
RETURNS nutrition_tips AS $$
DECLARE
  tip_count INTEGER;
  tip_index INTEGER;
  result nutrition_tips;
BEGIN
  SELECT COUNT(*) INTO tip_count FROM nutrition_tips;

  IF tip_count = 0 THEN
    RETURN NULL;
  END IF;

  tip_index := (EXTRACT(DOY FROM p_date)::INTEGER % tip_count) + 1;

  SELECT * INTO result
  FROM nutrition_tips
  ORDER BY created_at
  LIMIT 1 OFFSET (tip_index - 1);

  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get due reminders (for cron job)
CREATE OR REPLACE FUNCTION get_due_reminders(p_time TIME DEFAULT CURRENT_TIME)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  reminder_type TEXT,
  title TEXT,
  title_bm TEXT,
  reminder_time TIME,
  days_of_week INTEGER[]
) AS $$
DECLARE
  current_day INTEGER := EXTRACT(DOW FROM CURRENT_DATE);
BEGIN
  RETURN QUERY
  SELECT r.id, r.user_id, r.reminder_type, r.title, r.title_bm, r.reminder_time, r.days_of_week
  FROM reminders r
  WHERE r.is_active = true
    AND r.reminder_time = p_time
    AND current_day = ANY(r.days_of_week)
    AND NOT EXISTS (
      SELECT 1 FROM reminder_logs rl
      WHERE rl.reminder_id = r.id
        AND rl.scheduled_for::DATE = CURRENT_DATE
        AND rl.status IN ('completed', 'dismissed')
    );
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_nutrition_tips_updated_at
  BEFORE UPDATE ON nutrition_tips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();