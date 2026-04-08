import { createClient } from '../server'
import type { Database } from '@/types/database'

export type MedicineReminder = Database['public']['Tables']['medicine_reminders']['Row']
export type MedicineReminderInsert = Database['public']['Tables']['medicine_reminders']['Insert']
export type MedicineLog = Database['public']['Tables']['medicine_logs']['Row']

export async function getMedicineReminders(userId: string, activeOnly = true) {
  const supabase = await createClient()
  
  let query = supabase
    .from('medicine_reminders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (activeOnly) {
    query = query.eq('is_active', true)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export async function addMedicineReminder(reminder: MedicineReminderInsert) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('medicine_reminders')
    .insert(reminder)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateMedicineReminder(
  userId: string,
  reminderId: string,
  updates: Database['public']['Tables']['medicine_reminders']['Update']
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('medicine_reminders')
    .update(updates)
    .eq('user_id', userId)
    .eq('id', reminderId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function deleteMedicineReminder(userId: string, reminderId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('medicine_reminders')
    .delete()
    .eq('user_id', userId)
    .eq('id', reminderId)
  
  if (error) throw error
}

export async function logMedicineTaken(
  userId: string,
  medicineId: string,
  notes?: string
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('medicine_logs')
    .insert({
      user_id: userId,
      medicine_id: medicineId,
      status: 'taken',
      notes,
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getMedicineLogs(
  userId: string,
  date?: Date
) {
  const supabase = await createClient()
  
  let query = supabase
    .from('medicine_logs')
    .select(`
      *,
      medicine:medicine_reminders(name, dosage)
    `)
    .eq('user_id', userId)
    .order('taken_at', { ascending: false })
  
  if (date) {
    const dateStr = date.toISOString().split('T')[0]
    query = query.gte('taken_at', `${dateStr}T00:00:00`)
    query = query.lt('taken_at', `${dateStr}T23:59:59`)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export async function getPendingMedicines(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('pending_medicine_reminders')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  return data
}