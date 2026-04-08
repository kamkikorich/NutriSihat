// NutriSihat - Food Types
// TypeScript types for food data

export type FoodStatus = 'safe' | 'avoid' | 'limit';

export type FoodCategory = 
  | 'nasi'
  | 'minuman'
  | 'roti'
  | 'kuih'
  | 'sayur'
  | 'buah'
  | 'protein'
  | 'lauk'
  | 'snack'
  | 'sup';

export type HealthCondition = 'diabetes' | 'uterus' | 'both';

export interface FoodItem {
  id: string;
  name: string;
  name_english?: string;
  description: string;
  category: FoodCategory;
  status: FoodStatus;
  glycemic_index?: number;
  health_notes: {
    diabetes?: string;
    uterus?: string;
    general?: string;
  };
  alternatives?: string[];
  tips?: string[];
  image_url?: string;
  is_local_malaysian: boolean;
}

export interface FoodCategoryInfo {
  id: FoodCategory;
  name: string;
  name_english: string;
  description: string;
  icon: string;
}

export interface BloodSugarReading {
  id: string;
  value: number;
  meal_type: 'before_meal' | 'after_meal';
  date: string;
  time: string;
  notes?: string;
  status: 'rendah' | 'normal' | 'tinggi' | 'sangat_tinggi';
}

export interface MedicineReminder {
  id: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice_daily' | 'three_times' | 'weekly';
  times: string[];
  notes?: string;
  is_active: boolean;
  condition?: HealthCondition;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  preferred_name: 'Mak' | 'Ibu' | 'Nenek' | 'custom';
  custom_name?: string;
  conditions: HealthCondition[];
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  safe_foods_count: number;
  avoid_foods_count: number;
  limit_foods_count: number;
  today_blood_sugar_readings: number;
  last_blood_sugar_value?: number;
  pending_medicines: number;
  taken_medicines: number;
}