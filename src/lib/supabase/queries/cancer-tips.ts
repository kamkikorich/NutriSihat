import { createClient } from '../server'
import type { Database } from '@/types/database'

export type CancerTip = Database['public']['Tables']['cancer_treatment_tips']['Row']
export type SideEffectManagement = Database['public']['Tables']['side_effect_management']['Row']

export async function getCancerTips(
  cancerType?: string,
  treatmentType?: Database['public']['Tables']['cancer_treatment_tips']['Row']['treatment_type']
) {
  const supabase = await createClient()
  
  let query = supabase
    .from('cancer_treatment_tips')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (cancerType) {
    query = query.eq('cancer_type', cancerType)
  }
  
  if (treatmentType) {
    query = query.eq('treatment_type', treatmentType)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export async function getSideEffectManagement(sideEffect?: string) {
  const supabase = await createClient()
  
  let query = supabase
    .from('side_effect_management')
    .select('*')
    .order('severity', { ascending: true })
  
  if (sideEffect) {
    query = query.eq('side_effect', sideEffect)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data
}

export async function getNutritionTipsByCancerType(cancerType: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('cancer_treatment_tips')
    .select('*')
    .eq('cancer_type', cancerType)
    .eq('tip_category', 'nutrition')
  
  if (error) throw error
  return data
}

export async function searchFoodsForCondition(
  cancerType: string,
  treatmentType: string,
  category: 'recommended' | 'avoid'
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('cancer_treatment_tips')
    .select('*')
    .eq('cancer_type', cancerType)
    .eq('treatment_type', treatmentType)
  
  if (error) throw error
  
  const foods = data.flatMap(tip => 
    category === 'recommended' ? tip.foods_recommended : tip.foods_to_avoid
  )
  
  // Remove duplicates
  return Array.from(new Set(foods))
}