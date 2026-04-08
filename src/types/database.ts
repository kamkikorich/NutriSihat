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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}