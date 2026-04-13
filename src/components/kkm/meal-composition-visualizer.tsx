'use client'

import { useMemo } from 'react'
import { calculateMealComposition, getMealRecommendations, type MealAnalysis } from '@/lib/kkm/meal-calculator'
import type { FoodItem } from '@/types/food'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface MealCompositionVisualizerProps {
  foods: FoodItem[]
  title?: string
  description?: string
}

export function MealCompositionVisualizer({
  foods,
  title = 'Analisis Makanan',
  description = 'Panduan Suku-Suku Separuh KKM',
}: MealCompositionVisualizerProps) {
  const analysis: MealAnalysis = useMemo(() => calculateMealComposition(foods), [foods])
  const recommendations = useMemo(() => getMealRecommendations(analysis), [analysis])

  const targetComposition = {
    karbohidrat: 25,
    protein: 25,
    sayurBuah: 50,
  }

  const getProgressColor = (value: number, target: number, tolerance: number = 10) => {
    const diff = Math.abs(value - target)
    if (diff <= tolerance) return 'bg-success'
    if (diff <= tolerance * 2) return 'bg-warning'
    return 'bg-error'
  }

  const getStatusBadge = () => {
    if (analysis.isBalanced) {
      return (
        <Badge variant="default" className="bg-success">
          ✅ Seimbang
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-warning">
        ⚠️ Perlu Penyesuaian
      </Badge>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Visual Plate Diagram */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48 rounded-full border-4 border-border overflow-hidden bg-muted">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Karbohidrat - Top Left Quarter */}
              <path
                d="M 50 50 L 50 0 A 50 50 0 0 0 0 50 Z"
                className={getProgressColor(analysis.visualBreakdown.karbohidrat, targetComposition.karbohidrat)}
                style={{
                  fill: analysis.visualBreakdown.karbohidrat < 15 ? '#EF4444' : analysis.visualBreakdown.karbohidrat > 35 ? '#F59E0B' : '#22C55E',
                }}
              />
              {/* Protein - Top Right Quarter */}
              <path
                d="M 50 50 L 50 0 A 50 50 0 0 1 100 50 Z"
                className={getProgressColor(analysis.visualBreakdown.protein, targetComposition.protein)}
                style={{
                  fill: analysis.visualBreakdown.protein < 15 ? '#EF4444' : analysis.visualBreakdown.protein > 35 ? '#F59E0B' : '#3B82F6',
                }}
              />
              {/* Sayur & Buah - Bottom Half */}
              <path
                d="M 50 50 L 0 50 A 50 50 0 0 0 100 50 Z"
                className={getProgressColor(analysis.visualBreakdown.sayurBuah, targetComposition.sayurBuah)}
                style={{
                  fill: analysis.visualBreakdown.sayurBuah < 35 ? '#EF4444' : analysis.visualBreakdown.sayurBuah > 65 ? '#F59E0B' : '#10B981',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs font-medium text-muted-foreground">Jumlah</div>
                <div className="text-lg font-bold">{analysis.totalCalories}</div>
                <div className="text-xs text-muted-foreground">kcal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Composition Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Komposisi Makanan</h4>

          {/* Karbohidrat */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-success" />
                🍚 Karbohidrat
              </span>
              <span className="font-medium">
                {analysis.visualBreakdown.karbohidrat}% (Target: 25%)
              </span>
            </div>
            <Progress
              value={analysis.visualBreakdown.karbohidrat}
              className={`h-2 ${getProgressColor(analysis.visualBreakdown.karbohidrat, 25)}`}
            />
            {analysis.composition.karbohidrat.items.length > 0 && (
              <div className="text-xs text-muted-foreground ml-5">
                {analysis.composition.karbohidrat.items.map((item) => item.name).join(', ')}
              </div>
            )}
          </div>

          {/* Protein */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500" />
                🍖 Protein
              </span>
              <span className="font-medium">
                {analysis.visualBreakdown.protein}% (Target: 25%)
              </span>
            </div>
            <Progress
              value={analysis.visualBreakdown.protein}
              className={`h-2 ${getProgressColor(analysis.visualBreakdown.protein, 25)}`}
            />
            {analysis.composition.protein.items.length > 0 && (
              <div className="text-xs text-muted-foreground ml-5">
                {analysis.composition.protein.items.map((item) => item.name).join(', ')}
              </div>
            )}
          </div>

          {/* Sayur & Buah */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                🥬 Sayur & Buah
              </span>
              <span className="font-medium">
                {analysis.visualBreakdown.sayurBuah}% (Target: 50%)
              </span>
            </div>
            <Progress
              value={analysis.visualBreakdown.sayurBuah}
              className={`h-2 ${getProgressColor(analysis.visualBreakdown.sayurBuah, 50)}`}
            />
            <div className="text-xs text-muted-foreground ml-5 flex gap-4">
              {analysis.composition.sayur.items.length > 0 && (
                <span>Sayur: {analysis.composition.sayur.items.map((item) => item.name).join(', ')}</span>
              )}
              {analysis.composition.buah.items.length > 0 && (
                <span>Buah: {analysis.composition.buah.items.map((item) => item.name).join(', ')}</span>
              )}
            </div>
          </div>

          {/* Lain-lain (if present) */}
          {analysis.visualBreakdown.lain > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-muted-foreground" />
                  🥛 Lain-lain
                </span>
                <span className="font-medium">{analysis.visualBreakdown.lain}%</span>
              </div>
              <Progress value={analysis.visualBreakdown.lain} className="h-2 bg-muted" />
              {analysis.composition.lemak.items.length > 0 && (
                <div className="text-xs text-muted-foreground ml-5">
                  Lemak: {analysis.composition.lemak.items.map((item) => item.name).join(', ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Cadangan</h4>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="text-sm p-3 rounded-lg bg-muted/50 border border-border"
                >
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Food Items List */}
        {foods.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">Makanan dalam Hidangan</h4>
            <div className="flex flex-wrap gap-2">
              {foods.map((food) => (
                <Badge key={food.id} variant="outline" className="text-xs">
                  {food.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MealCompositionVisualizer
