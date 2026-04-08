import { createClient } from '../server'
import type { Database } from '@/types/database'

export type MealLog = Database['public']['Tables']['meal_logs']['Row']
export type MealLogInsert = Database['public']['Tables']['meal_logs']['Insert']

export async function getMealLogs(
  userId: string,
  options?: {
    startDate?: Date
    endDate?: Date
    limit?: number
  }
) {
  const supabase = await createClient()
  
  let query = supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
  
  if (options?.startDate) {
    query = query.gte('logged_at', options.startDate.toISOString())
  }
  
  if (options?.endDate) {
    query = query.lte('logged_at', options.endDate.toISOString())
  }
  
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export async function addMealLog(log: MealLogInsert) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('meal_logs')
    .insert(log)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteMealLog(userId: string, logId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('meal_logs')
    .delete()
    .eq('user_id', userId)
    .eq('id', logId)
  
  if (error) throw error
}

export async function getMealsByDate(userId: string, date: Date) {
  const supabase = await createClient()
  
  const dateStr = date.toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('meal_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', `${dateStr}T00:00:00`)
    .lt('logged_at', `${dateStr}T23:59:59`)
  
  if (error) throw error
  return data
}

export async function getTodayMeals(userId: string) {
  return getMealsByDate(userId, new Date())
}