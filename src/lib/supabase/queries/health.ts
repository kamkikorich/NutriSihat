import { createClient } from '../server'
import type { Database } from '@/types/database'

export type HealthLog = Database['public']['Tables']['health_logs']['Row']
export type HealthLogInsert = Database['public']['Tables']['health_logs']['Insert']

export async function getHealthLogs(
  userId: string,
  logType?: Database['public']['Tables']['health_logs']['Row']['log_type'],
  options?: {
    limit?: number
    startDate?: Date
    endDate?: Date
  }
) {
  const supabase = await createClient()
  
  let query = supabase
    .from('health_logs')
    .select('*')
    .eq('user_id', userId)
    .order('logged_at', { ascending: false })
  
  if (logType) {
    query = query.eq('log_type', logType)
  }
  
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

export async function addHealthLog(log: HealthLogInsert) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('health_logs')
    .insert(log)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getWeightHistory(userId: string, days = 30) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('health_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_type', 'weight')
    .gte('logged_at', startDate.toISOString())
    .order('logged_at', { ascending: true })
  
  if (error) throw error
  return data
}

export async function getEnergyLevelHistory(userId: string, days = 7) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('health_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_type', 'energy_level')
    .gte('logged_at', startDate.toISOString())
    .order('logged_at', { ascending: true })
  
  if (error) throw error
  return data
}

export async function getSideEffectHistory(userId: string, days = 14) {
  const supabase = await createClient()
  
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  
  const { data, error } = await supabase
    .from('health_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('log_type', 'side_effects')
    .gte('logged_at', startDate.toISOString())
    .order('logged_at', { ascending: false })
  
  if (error) throw error
  return data
}