import { createClient } from '../server'
import type { Database } from '@/types/database'

export type BloodSugarLog = Database['public']['Tables']['blood_sugar_logs']['Row']
export type BloodSugarInsert = Database['public']['Tables']['blood_sugar_logs']['Insert']

export async function getBloodSugarLogs(
  userId: string,
  options?: {
    startDate?: Date
    endDate?: Date
    limit?: number
  }
) {
  const supabase = await createClient()
  
  let query = supabase
    .from('blood_sugar_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_date', { ascending: false })
    .order('logged_time', { ascending: false })
  
  if (options?.startDate) {
    query = query.gte('logged_date', options.startDate.toISOString().split('T')[0])
  }
  
  if (options?.endDate) {
    query = query.lte('logged_date', options.endDate.toISOString().split('T')[0])
  }
  
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export async function addBloodSugarLog(log: BloodSugarInsert) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('blood_sugar_logs')
    .insert(log)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteBloodSugarLog(userId: string, logId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('blood_sugar_logs')
    .delete()
    .eq('user_id', userId)
    .eq('id', logId)
  
  if (error) throw error
}

export async function getDailyBloodSugarSummary(userId: string, date: Date) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('daily_blood_sugar_summary')
    .select('*')
    .eq('user_id', userId)
    .eq('logged_date', date.toISOString().split('T')[0])
    .single()
  
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getWeeklyBloodSugarStats(userId: string) {
  const supabase = await createClient()
  
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const { data, error } = await supabase
    .from('blood_sugar_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_date', sevenDaysAgo.toISOString().split('T')[0])
    .order('logged_date', { ascending: true })
  
  if (error) throw error
  
  // Calculate stats
  if (!data || data.length === 0) {
    return {
      average: 0,
      min: 0,
      max: 0,
      normalCount: 0,
      highCount: 0,
      readings: [],
    }
  }
  
  const values = data.map(d => parseFloat(d.value.toString()))
  
  return {
    average: values.reduce((a, b) => a + b, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    normalCount: data.filter(d => d.status === 'normal').length,
    highCount: data.filter(d => d.status === 'tinggi' || d.status === 'sangat_tinggi').length,
    readings: data,
  }
}