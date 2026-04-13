// KKM Meal Calculator - Calculate meal composition based on Suku-Suku Separuh
// 1/4 karbohidrat, 1/4 protein, 1/2 sayur & buah

import type { FoodItem, SukuSeparuhCategory } from '@/types/food'

export interface MealComposition {
  karbohidrat: {
    calories: number
    percentage: number
    items: FoodItem[]
  }
  protein: {
    calories: number
    percentage: number
    items: FoodItem[]
  }
  sayur: {
    calories: number
    percentage: number
    items: FoodItem[]
  }
  buah: {
    calories: number
    percentage: number
    items: FoodItem[]
  }
  lemak: {
    calories: number
    percentage: number
    items: FoodItem[]
  }
  susu: {
    calories: number
    percentage: number
    items: FoodItem[]
  }
}

export interface MealAnalysis {
  composition: MealComposition
  totalCalories: number
  isBalanced: boolean
  recommendations: string[]
  visualBreakdown: {
    karbohidrat: number
    protein: number
    sayurBuah: number
    lain: number
  }
}

/**
 * Calculate meal composition based on Suku-Suku Separuh guidelines
 * @param foods - Array of food items in the meal
 * @returns Meal analysis with composition, balance status, and recommendations
 */
export function calculateMealComposition(foods: FoodItem[]): MealAnalysis {
  // Initialize composition
  const composition: MealComposition = {
    karbohidrat: { calories: 0, percentage: 0, items: [] },
    protein: { calories: 0, percentage: 0, items: [] },
    sayur: { calories: 0, percentage: 0, items: [] },
    buah: { calories: 0, percentage: 0, items: [] },
    lemak: { calories: 0, percentage: 0, items: [] },
    susu: { calories: 0, percentage: 0, items: [] },
  }

  // Calculate calories per category
  foods.forEach((food) => {
    const calories = food.kkm_classification?.calories_per_serving || 0
    const category = food.suku_separuh_category

    if (!category) {
      return
    }

    switch (category) {
      case 'suku_karbo':
        composition.karbohidrat.calories += calories
        composition.karbohidrat.items.push(food)
        break
      case 'suku_protein':
        composition.protein.calories += calories
        composition.protein.items.push(food)
        break
      case 'separuh_sayur':
        composition.sayur.calories += calories
        composition.sayur.items.push(food)
        break
      case 'separuh_buah':
        composition.buah.calories += calories
        composition.buah.items.push(food)
        break
      case 'lemak':
        composition.lemak.calories += calories
        composition.lemak.items.push(food)
        break
      case 'susu':
        composition.susu.calories += calories
        composition.susu.items.push(food)
        break
    }
  })

  // Calculate total calories
  const totalCalories =
    composition.karbohidrat.calories +
    composition.protein.calories +
    composition.sayur.calories +
    composition.buah.calories +
    composition.lemak.calories +
    composition.susu.calories

  // Calculate percentages
  if (totalCalories > 0) {
    composition.karbohidrat.percentage = Math.round(
      (composition.karbohidrat.calories / totalCalories) * 100
    )
    composition.protein.percentage = Math.round(
      (composition.protein.calories / totalCalories) * 100
    )
    composition.sayur.percentage = Math.round(
      (composition.sayur.calories / totalCalories) * 100
    )
    composition.buah.percentage = Math.round(
      (composition.buah.calories / totalCalories) * 100
    )
    composition.lemak.percentage = Math.round(
      (composition.lemak.calories / totalCalories) * 100
    )
    composition.susu.percentage = Math.round(
      (composition.susu.calories / totalCalories) * 100
    )
  }

  // Calculate visual breakdown for Suku-Suku Separuh plate
  const sayurBuahCalories = composition.sayur.calories + composition.buah.calories
  const lainCalories = composition.lemak.calories + composition.susu.calories

  const visualBreakdown = {
    karbohidrat: totalCalories > 0 ? Math.round((composition.karbohidrat.calories / totalCalories) * 100) : 0,
    protein: totalCalories > 0 ? Math.round((composition.protein.calories / totalCalories) * 100) : 0,
    sayurBuah: totalCalories > 0 ? Math.round((sayurBuahCalories / totalCalories) * 100) : 0,
    lain: totalCalories > 0 ? Math.round((lainCalories / totalCalories) * 100) : 0,
  }

  // Analyze balance and generate recommendations
  const recommendations: string[] = []
  let isBalanced = true

  // Target: 25% karbo, 25% protein, 50% sayur+buah
  const karboTarget = 25
  const proteinTarget = 25
  const sayurBuahTarget = 50

  // Check karbohidrat balance (allow ±10% tolerance)
  if (visualBreakdown.karbohidrat < karboTarget - 10) {
    recommendations.push('Tambah karbohidrat kompleks seperti nasi brown, oat, atau ubi')
    isBalanced = false
  } else if (visualBreakdown.karbohidrat > karboTarget + 10) {
    recommendations.push('Kurangkan karbohidrat, terutama nasi putih atau roti')
    isBalanced = false
  }

  // Check protein balance
  if (visualBreakdown.protein < proteinTarget - 10) {
    recommendations.push('Tambah protein seperti ikan, ayam, telur, atau tauhu')
    isBalanced = false
  } else if (visualBreakdown.protein > proteinTarget + 10) {
    recommendations.push('Kurangkan protein, pilih kaedah masakan sihat (kukus, panggang)')
    isBalanced = false
  }

  // Check sayur & buah balance
  const sayurBuahTotal = visualBreakdown.sayurBuah
  if (sayurBuahTotal < sayurBuahTarget - 15) {
    recommendations.push('Tambah sayur-sayuran dan buah-buahan untuk separuh pinggan')
    isBalanced = false
  } else if (sayurBuahTotal > sayurBuahTarget + 15) {
    recommendations.push('Imbangi dengan karbohidrat dan protein yang mencukupi')
    isBalanced = false
  }

  // Check for unhealthy fats
  if (composition.lemak.calories > totalCalories * 0.15) {
    recommendations.push('Kurangkan makanan berminyak atau bersantan')
    isBalanced = false
  }

  // Add positive reinforcement if balanced
  if (isBalanced && recommendations.length === 0) {
    recommendations.push('Tahniah! Makanan anda mengikut panduan Suku-Suku Separuh')
  }

  return {
    composition,
    totalCalories,
    isBalanced,
    recommendations,
    visualBreakdown,
  }
}

/**
 * Get recommended food adjustments to achieve Suku-Suku Separuh balance
 * @param analysis - Current meal analysis
 * @returns Array of recommended food additions or reductions
 */
export function getMealRecommendations(analysis: MealAnalysis): string[] {
  const recommendations: string[] = []

  if (analysis.isBalanced) {
    return ['✅ Makanan anda seimbang mengikut panduan Suku-Suku Separuh']
  }

  // Karbohidrat recommendations
  if (analysis.visualBreakdown.karbohidrat < 15) {
    recommendations.push('➕ Tambah: Nasi brown (1/4 pinggan), oat, atau ubi keledek')
  } else if (analysis.visualBreakdown.karbohidrat > 35) {
    recommendations.push('➖ Kurangkan: Nasi putih, roti, atau mi')
  }

  // Protein recommendations
  if (analysis.visualBreakdown.protein < 15) {
    recommendations.push('➕ Tambah: Ikan bakar, ayam panggang, telur rebus, atau tauhu')
  } else if (analysis.visualBreakdown.protein > 35) {
    recommendations.push('➖ Kurangkan: Daging merah atau makanan bergoreng')
  }

  // Sayur & buah recommendations
  const sayurBuahTotal = analysis.visualBreakdown.sayurBuah
  if (sayurBuahTotal < 35) {
    recommendations.push('➕ Tambah: Sayur hijau (brokoli, kobis) dan buah segar')
  } else if (sayurBuahTotal > 65) {
    recommendations.push('➖ Imbangi dengan karbohidrat dan protein')
  }

  // Lemak recommendations
  if (analysis.composition.lemak.percentage > 15) {
    recommendations.push('➖ Elak: Makanan bergoreng, bersantan, atau berlemak tinggi')
  }

  return recommendations
}

/**
 * Format meal composition for display
 * @param analysis - Meal analysis result
 * @returns Formatted string for display
 */
export function formatMealAnalysis(analysis: MealAnalysis): string {
  const lines: string[] = []

  lines.push(`📊 Analisis Makanan`)
  lines.push(`================`)
  lines.push(``)
  lines.push(`Jumlah Kalori: ${analysis.totalCalories} kcal`)
  lines.push(``)
  lines.push(`Komposisi:`)
  lines.push(`  🍚 Karbohidrat: ${analysis.visualBreakdown.karbohidrat}% (${analysis.composition.karbohidrat.calories} kcal)`)
  lines.push(`  🍖 Protein: ${analysis.visualBreakdown.protein}% (${analysis.composition.protein.calories} kcal)`)
  lines.push(`  🥬 Sayur & Buah: ${analysis.visualBreakdown.sayurBuah}% (${analysis.composition.sayur.calories + analysis.composition.buah.calories} kcal)`)
  if (analysis.visualBreakdown.lain > 0) {
    lines.push(`  🥛 Lain-lain: ${analysis.visualBreakdown.lain}% (${analysis.composition.lemak.calories + analysis.composition.susu.calories} kcal)`)
  }
  lines.push(``)
  lines.push(`Status: ${analysis.isBalanced ? '✅ Seimbang' : '⚠️ Perlu Penyesuaian'}`)
  lines.push(``)

  if (analysis.recommendations.length > 0) {
    lines.push(`Cadangan:`)
    analysis.recommendations.forEach((rec) => {
      lines.push(`  • ${rec}`)
    })
  }

  return lines.join('\n')
}
