export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          preferred_name: 'Mak' | 'Ibu' | 'Nenek' | 'custom'
          custom_name: string | null
          age: number | null
          health_conditions: string[]
          cancer_type: string | null
          treatment_stage: 'diagnosis' | 'treatment' | 'recovery' | 'survivor'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          preferred_name?: 'Mak' | 'Ibu' | 'Nenek' | 'custom'
          custom_name?: string | null
          age?: number | null
          health_conditions?: string[]
          cancer_type?: string | null
          treatment_stage?: 'diagnosis' | 'treatment' | 'recovery' | 'survivor'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          preferred_name?: 'Mak' | 'Ibu' | 'Nenek' | 'custom'
          custom_name?: string | null
          age?: number | null
          health_conditions?: string[]
          cancer_type?: string | null
          treatment_stage?: 'diagnosis' | 'treatment' | 'recovery' | 'survivor'
          created_at?: string
          updated_at?: string
        }
      }
      blood_sugar_logs: {
        Row: {
          id: string
          user_id: string
          value: number
          meal_type: 'before_meal' | 'after_meal'
          logged_date: string
          logged_time: string
          notes: string | null
          status: 'rendah' | 'normal' | 'tinggi' | 'sangat_tinggi'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          value: number
          meal_type: 'before_meal' | 'after_meal'
          logged_date: string
          logged_time: string
          notes?: string | null
          status: 'rendah' | 'normal' | 'tinggi' | 'sangat_tinggi'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          value?: number
          meal_type?: 'before_meal' | 'after_meal'
          logged_date?: string
          logged_time?: string
          notes?: string | null
          status?: 'rendah' | 'normal' | 'tinggi' | 'sangat_tinggi'
          created_at?: string
          updated_at?: string
        }
      }
      medicine_reminders: {
        Row: {
          id: string
          user_id: string
          name: string
          dosage: string
          frequency: 'daily' | 'twice_daily' | 'three_times' | 'weekly'
          times: string[]
          notes: string | null
          is_active: boolean
          condition: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          dosage: string
          frequency: 'daily' | 'twice_daily' | 'three_times' | 'weekly'
          times: string[]
          notes?: string | null
          is_active?: boolean
          condition?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          dosage?: string
          frequency?: 'daily' | 'twice_daily' | 'three_times' | 'weekly'
          times?: string[]
          notes?: string | null
          is_active?: boolean
          condition?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medicine_logs: {
        Row: {
          id: string
          user_id: string
          medicine_id: string
          taken_at: string
          status: 'taken' | 'missed' | 'skipped'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          medicine_id: string
          taken_at: string
          status: 'taken' | 'missed' | 'skipped'
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          medicine_id?: string
          taken_at?: string
          status?: 'taken' | 'missed' | 'skipped'
          notes?: string | null
          created_at?: string
        }
      }
      meal_logs: {
        Row: {
          id: string
          user_id: string
          food_id: string
          portion: string
          meal_time: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          logged_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          food_id: string
          portion: string
          meal_time: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          logged_at: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          food_id?: string
          portion?: string
          meal_time?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          logged_at?: string
          notes?: string | null
          created_at?: string
        }
      }
      health_logs: {
        Row: {
          id: string
          user_id: string
          log_type: 'weight' | 'energy_level' | 'appetite' | 'symptoms' | 'side_effects'
          value: number
          unit: string | null
          description: string | null
          logged_at: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          log_type: 'weight' | 'energy_level' | 'appetite' | 'symptoms' | 'side_effects'
          value: number
          unit?: string | null
          description?: string | null
          logged_at: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          log_type?: 'weight' | 'energy_level' | 'appetite' | 'symptoms' | 'side_effects'
          value?: number
          unit?: string | null
          description?: string | null
          logged_at?: string
          notes?: string | null
          created_at?: string
        }
      }
      cancer_treatment_tips: {
        Row: {
          id: string
          cancer_type: string
          treatment_type: 'chemotherapy' | 'radiation' | 'immunotherapy' | 'surgery' | 'hormone_therapy'
          tip_category: 'nutrition' | 'side_effects' | 'lifestyle' | 'emotional_support'
          tip_title: string
          tip_content: string
          foods_to_avoid: string[]
          foods_recommended: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cancer_type: string
          treatment_type: 'chemotherapy' | 'radiation' | 'immunotherapy' | 'surgery' | 'hormone_therapy'
          tip_category: 'nutrition' | 'side_effects' | 'lifestyle' | 'emotional_support'
          tip_title: string
          tip_content: string
          foods_to_avoid?: string[]
          foods_recommended?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          cancer_type?: string
          treatment_type?: 'chemotherapy' | 'radiation' | 'immunotherapy' | 'surgery' | 'hormone_therapy'
          tip_category?: 'nutrition' | 'side_effects' | 'lifestyle' | 'emotional_support'
          tip_title?: string
          tip_content?: string
          foods_to_avoid?: string[]
          foods_recommended?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      side_effect_management: {
        Row: {
          id: string
          side_effect: string
          description: string
          recommended_foods: string[]
          avoid_foods: string[]
          tips: string[]
          severity: 'mild' | 'moderate' | 'severe'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          side_effect: string
          description: string
          recommended_foods: string[]
          avoid_foods: string[]
          tips: string[]
          severity: 'mild' | 'moderate' | 'severe'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          side_effect?: string
          description?: string
          recommended_foods?: string[]
          avoid_foods?: string[]
          tips?: string[]
          severity?: 'mild' | 'moderate' | 'severe'
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'medicine' | 'blood_sugar' | 'meal' | 'water' | 'appointment'
          title: string
          message: string
          scheduled_time: string
          is_sent: boolean
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'medicine' | 'blood_sugar' | 'meal' | 'water' | 'appointment'
          title: string
          message: string
          scheduled_time: string
          is_sent?: boolean
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'medicine' | 'blood_sugar' | 'meal' | 'water' | 'appointment'
          title?: string
          message?: string
          scheduled_time?: string
          is_sent?: boolean
          is_read?: boolean
          created_at?: string
        }
      }
      ai_chat_history: {
        Row: {
          id: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      }
      // Meal Planner Tables
      foods: {
        Row: {
          id: string
          name: string
          name_ms: string | null
          description: string | null
          glycemic_index: number | null
          is_diabetes_safe: boolean
          is_uterus_friendly: boolean
          is_sabah_local: boolean
          category: 'protein' | 'vegetable' | 'carbohydrate' | 'fruit' | 'condiment' | null
          calories_per_100g: number | null
          protein_per_100g: number | null
          fiber_per_100g: number | null
          health_notes: string | null
          alternatives: string | null
          tips: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ms?: string | null
          description?: string | null
          glycemic_index?: number | null
          is_diabetes_safe?: boolean
          is_uterus_friendly?: boolean
          is_sabah_local?: boolean
          category?: 'protein' | 'vegetable' | 'carbohydrate' | 'fruit' | 'condiment' | null
          calories_per_100g?: number | null
          protein_per_100g?: number | null
          fiber_per_100g?: number | null
          health_notes?: string | null
          alternatives?: string | null
          tips?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ms?: string | null
          description?: string | null
          glycemic_index?: number | null
          is_diabetes_safe?: boolean
          is_uterus_friendly?: boolean
          is_sabah_local?: boolean
          category?: 'protein' | 'vegetable' | 'carbohydrate' | 'fruit' | 'condiment' | null
          calories_per_100g?: number | null
          protein_per_100g?: number | null
          fiber_per_100g?: number | null
          health_notes?: string | null
          alternatives?: string | null
          tips?: string | null
          created_at?: string
        }
      }
      meal_plans: {
        Row: {
          id: string
          user_id: string
          week_start_date: string
          week_end_date: string
          total_budget: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start_date: string
          week_end_date: string
          total_budget?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start_date?: string
          week_end_date?: string
          total_budget?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_meals: {
        Row: {
          id: string
          meal_plan_id: string
          day_of_week: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          food_id: string | null
          food_name: string
          food_name_ms: string | null
          portion_size: string | null
          calories: number | null
          glycemic_index: number | null
          is_diabetes_safe: boolean
          is_uterus_friendly: boolean
          is_sabah_local: boolean
          created_at: string
        }
        Insert: {
          id?: string
          meal_plan_id: string
          day_of_week: number
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          food_id?: string | null
          food_name: string
          food_name_ms?: string | null
          portion_size?: string | null
          calories?: number | null
          glycemic_index?: number | null
          is_diabetes_safe?: boolean
          is_uterus_friendly?: boolean
          is_sabah_local?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          meal_plan_id?: string
          day_of_week?: number
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
          food_id?: string | null
          food_name?: string
          food_name_ms?: string | null
          portion_size?: string | null
          calories?: number | null
          glycemic_index?: number | null
          is_diabetes_safe?: boolean
          is_uterus_friendly?: boolean
          is_sabah_local?: boolean
          created_at?: string
        }
      }
      shopping_lists: {
        Row: {
          id: string
          meal_plan_id: string
          item_name: string
          item_name_ms: string | null
          category: string | null
          quantity: string
          estimated_price: number | null
          market_location: string | null
          is_purchased: boolean
          created_at: string
        }
        Insert: {
          id?: string
          meal_plan_id: string
          item_name: string
          item_name_ms?: string | null
          category?: string | null
          quantity: string
          estimated_price?: number | null
          market_location?: string | null
          is_purchased?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          meal_plan_id?: string
          item_name?: string
          item_name_ms?: string | null
          category?: string | null
          quantity?: string
          estimated_price?: number | null
          market_location?: string | null
          is_purchased?: boolean
          created_at?: string
        }
      }
      user_food_preferences: {
        Row: {
          id: string
          user_id: string
          food_id: string
          preference_level: 'love' | 'like' | 'neutral' | 'dislike' | 'avoid'
          is_allergy: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          food_id: string
          preference_level?: 'love' | 'like' | 'neutral' | 'dislike' | 'avoid'
          is_allergy?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          food_id?: string
          preference_level?: 'love' | 'like' | 'neutral' | 'dislike' | 'avoid'
          is_allergy?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_shopping_list: {
        Args: {
          meal_plan_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}