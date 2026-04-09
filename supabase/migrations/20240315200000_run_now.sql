-- ===========================================
-- COMPLETE DATABASE SETUP FOR NUTRISIHAT
-- Run this entire script in Supabase SQL Editor
-- ===========================================

-- Part 1: Extensions & Enums (Already run ✅)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- (CREATE TYPE statements already executed)

-- Part 2: Tables Creation

-- MEDICINE REMINDERS TABLE
CREATE TABLE IF NOT EXISTS medicine_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency frequency_type NOT NULL,
  times TIME[] NOT NULL,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  condition TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEDICINE LOGS TABLE
CREATE TABLE IF NOT EXISTS medicine_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  medicine_id UUID NOT NULL,
  taken_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status medicine_status_type DEFAULT 'taken',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MEAL LOGS TABLE
CREATE TABLE IF NOT EXISTS meal_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  food_id TEXT NOT NULL,
  portion TEXT NOT NULL,
  meal_time meal_time_type NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HEALTH LOGS TABLE
CREATE TABLE IF NOT EXISTS health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  log_type health_log_type NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit TEXT,
  description TEXT,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CANCER TREATMENT TIPS TABLE
CREATE TABLE IF NOT EXISTS cancer_treatment_tips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- SIDE EFFECT MANAGEMENT TABLE
CREATE TABLE IF NOT EXISTS side_effect_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  is_sent BOOLEAN DEFAULT FALSE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI CHAT HISTORY TABLE
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Part 3: Indexes (for new tables only)
CREATE INDEX IF NOT EXISTS idx_medicine_reminders_user ON medicine_reminders(user_id);
CREATE INDEX IF NOT EXISTS idx_medicine_logs_user_date ON medicine_logs(user_id, taken_at DESC);
CREATE INDEX IF NOT EXISTS idx_meal_logs_user_date ON meal_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_health_logs_user_type ON health_logs(user_id, log_type);
CREATE INDEX IF NOT EXISTS idx_health_logs_user_date ON health_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_cancer_tips_type ON cancer_treatment_tips(cancer_type, treatment_type);
CREATE INDEX IF NOT EXISTS idx_notifications_user_pending ON notifications(user_id, is_sent, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_ai_chat_user ON ai_chat_history(user_id, created_at DESC);