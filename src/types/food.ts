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
  | 'sup'
  | 'carbohydrate'
  | 'vegetable'
  | 'condiment'
  | 'fruit';

export type HealthCondition = 'diabetes' | 'uterus' | 'both';

export type SukuSeparuhCategory = 'suku_karbo' | 'suku_protein' | 'separuh_sayur' | 'separuh_buah' | 'lemak' | 'susu';

export type KKMFoodCategory = 'karbohidrat' | 'protein' | 'sayur' | 'buah' | 'lemak' | 'susu' | 'suku_karbo' | 'suku_protein' | 'separuh_sayur';

export interface KKMClassification {
  category: KKMFoodCategory;
  serving_size: string;
  calories_per_serving: number;
  rni_percentage?: {
    vitamin_a?: number;
    vitamin_c?: number;
    vitamin_d?: number;
    vitamin_e?: number;
    vitamin_b12?: number;
    iron?: number;
    calcium?: number;
    potassium?: number;
    zinc?: number;
    magnesium?: number;
  };
}

export interface FoodItem {
  id: string;
  name: string;
  name_english?: string;
  name_ms?: string; // Malay name
  description: string;
  category: FoodCategory;
  status: FoodStatus;
  glycemic_index?: number; // GI value
  health_notes: {
    diabetes?: string;
    uterus?: string;
    general?: string;
  };
  alternatives?: string[];
  tips?: string[];
  image_url?: string;
  is_local_malaysian: boolean;

  // KKM Guidelines classification
  kkm_classification?: KKMClassification;
  suku_separuh_category?: SukuSeparuhCategory;

  // KKM Suku-Separuh specific fields
  kkm_category?: 'suku_karbo' | 'suku_protein' | 'separuh_sayur' | 'susu' | 'buah';

  // Health flags
  is_diabetes_safe?: boolean;
  is_uterus_friendly?: boolean;

  // Nutritional information
  calories_per_100g?: number;
  protein_per_100g?: number;
  fiber_per_100g?: number;

  // Additional metadata
  health_notes_text?: string; // Flattened version for simpler access
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

// ============================================================================
// KKM Suku-Separuh Meal Plan Types
// ============================================================================

export interface PortionGuideline {
  category: KKMFoodCategory;
  portion_description: string;
  examples: string[];
  daily_servings: {
    adult: string;
    child: string;
    diabetic: string;
  };
}

export interface DailyMeal {
  id: string;
  meal_plan_id: string;
  day_of_week: number; // 0-6 (Sunday = 0)
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_id: string;
  food_name: string;
  food_name_ms?: string;
  portion_size: string;
  calories?: number;
  glycemic_index?: number;
  is_diabetes_safe: boolean;
  notes?: string;
}

export interface MealPlan {
  id: string;
  user_id: string;
  week_start_date: string; // ISO date string
  week_end_date: string; // ISO date string
  created_at: string;
  updated_at: string;
}

// Extended Meal Plan with daily meals included
export interface MealPlanWithMeals extends MealPlan {
  meals: DailyMeal[];
}

// Meal plan summary for dashboard display
export interface MealPlanSummary {
  id: string;
  week_start_date: string;
  week_end_date: string;
  total_meals: number;
  diabetes_safe_meals: number;
  days_with_meals: number; // Count of days that have at least one meal
}
