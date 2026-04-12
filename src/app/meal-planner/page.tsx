'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Calendar, Plus, Trash2, ShoppingCart, ChevronLeft, ChevronRight, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface FoodItem {
  id: string;
  name: string;
  name_ms: string | null;
  glycemic_index: number | null;
  is_diabetes_safe: boolean;
  is_uterus_friendly: boolean;
  is_sabah_local: boolean;
  category: string;
  health_notes: string | null;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Ahad' },
  { value: 1, label: 'Isnin' },
  { value: 2, label: 'Selasa' },
  { value: 3, label: 'Rabu' },
  { value: 4, label: 'Khamis' },
  { value: 5, label: 'Jumaat' },
  { value: 6, label: 'Sabtu' },
];

const MEAL_TYPES = {
  breakfast: 'Sarapan',
  lunch: 'Makan Tengahari',
  dinner: 'Makan Malam',
  snack: 'Snek',
};

interface MealEntry {
  id?: string;
  dayOfWeek: number;
  mealType: string;
  foodId: string;
  foodName: string;
  foodNameMs: string;
  glycemicIndex?: number;
  isSabahLocal?: boolean;
}

export default function MealPlannerPage() {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    return new Date(now.setDate(diff));
  });
  
  const [mealPlan, setMealPlan] = useState<Record<string, MealEntry>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [shoppingList, setShoppingList] = useState<any[]>([]);
  const [availableFoods, setAvailableFoods] = useState<Record<string, FoodItem[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
  });

  const supabase = createClient();

  // Load foods from database
  useEffect(() => {
    loadFoods();
  }, []);

  async function loadFoods() {
    try {
      const { data: foods, error } = await supabase
        .from('foods')
        .select('*')
        .eq('is_diabetes_safe', true)
        .order('name');

      if (error) throw error;

      if (foods) {
        // Categorize foods by meal type
        const categorized: Record<string, FoodItem[]> = {
          breakfast: [],
          lunch: [],
          dinner: [],
          snack: [],
        };

        foods.forEach(food => {
          // Simple categorization logic
          if (food.category === 'protein' || food.category === 'vegetable') {
            categorized.lunch.push(food);
            categorized.dinner.push(food);
          }
          if (food.category === 'carbohydrate') {
            categorized.breakfast.push(food);
          }
          if (food.category === 'fruit') {
            categorized.snack.push(food);
            categorized.breakfast.push(food);
          }
          // Add all to all meals for flexibility
          categorized.breakfast.push(food);
          categorized.lunch.push(food);
          categorized.dinner.push(food);
          categorized.snack.push(food);
        });

        // Remove duplicates
        Object.keys(categorized).forEach(key => {
          const uniqueFoods = Array.from(
            new Map(categorized[key].map(item => [item.id, item])).values()
          );
          categorized[key as keyof typeof categorized] = uniqueFoods;
        });

        setAvailableFoods(categorized);
      }
    } catch (error) {
      console.error('Error loading foods:', error);
      toast.error('Gagal memuatkan makanan. Pastikan migration sudah dijalankan.');
    }
  }

  // Load existing meal plan
  useEffect(() => {
    loadMealPlan();
  }, [currentWeekStart]);

  async function loadMealPlan() {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const weekStartStr = currentWeekStart.toISOString().split('T')[0];
      
      const { data: plan } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('week_start_date', weekStartStr)
        .single();

      if (plan) {
        const { data: meals } = await supabase
          .from('daily_meals')
          .select('*')
          .eq('meal_plan_id', plan.id);

        if (meals) {
          const planMap: Record<string, MealEntry> = {};
          meals.forEach(meal => {
            const key = `${meal.day_of_week}-${meal.meal_type}`;
            planMap[key] = {
              dayOfWeek: meal.day_of_week,
              mealType: meal.meal_type,
              foodId: meal.food_id || '',
              foodName: meal.food_name,
              foodNameMs: meal.food_name_ms || '',
              glycemicIndex: meal.glycemic_index || undefined,
              isSabahLocal: meal.is_sabah_local || false,
            };
          });
          setMealPlan(planMap);
        }
      }
    } catch (error) {
      console.error('Error loading meal plan:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function saveMealPlan() {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Sila login dahulu');
        return;
      }

      const weekStartStr = currentWeekStart.toISOString().split('T')[0];
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);

      // Upsert meal plan
      const { data: plan, error: planError } = await supabase
        .from('meal_plans')
        .upsert({
          user_id: user.id,
          week_start_date: weekStartStr,
          week_end_date: weekEnd.toISOString().split('T')[0],
        })
        .select()
        .single();

      if (planError) throw planError;

      // Insert/update daily meals
      const mealsToInsert = Object.values(mealPlan).map(entry => ({
        meal_plan_id: plan.id,
        day_of_week: entry.dayOfWeek,
        meal_type: entry.mealType,
        food_id: entry.foodId || null,
        food_name: entry.foodName,
        food_name_ms: entry.foodNameMs,
        glycemic_index: entry.glycemicIndex || null,
        is_diabetes_safe: (entry.glycemicIndex || 100) < 55,
        is_uterus_friendly: true,
        is_sabah_local: entry.isSabahLocal || false,
      }));

      // Delete existing meals first
      await supabase
        .from('daily_meals')
        .delete()
        .eq('meal_plan_id', plan.id);

      const { error: mealsError } = await supabase
        .from('daily_meals')
        .insert(mealsToInsert);

      if (mealsError) throw mealsError;

      toast.success('✅ Pelan makanan berjaya disimpan!');
      
      // Auto-generate shopping list
      await generateShoppingList(plan.id);
    } catch (error: any) {
      console.error('Error saving meal plan:', error);
      toast.error('❌ Ralat: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function generateShoppingList(planId: string) {
    try {
      const { data: meals } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('meal_plan_id', planId);

      if (!meals) return;

      // Group items by name
      const itemsMap = new Map();
      meals.forEach(meal => {
        const key = meal.food_name.toLowerCase();
        if (!itemsMap.has(key)) {
          itemsMap.set(key, {
            name: meal.food_name,
            nameMs: meal.food_name_ms,
            category: categorizeFood(meal.food_name),
            count: 0,
          });
        }
        itemsMap.get(key).count++;
      });

      const items = Array.from(itemsMap.values()).map(item => ({
        name: item.name,
        nameMs: item.nameMs,
        category: item.category,
        quantity: `${item.count} x`,
      }));

      setShoppingList(items);
    } catch (error) {
      console.error('Error generating shopping list:', error);
    }
  }

  function categorizeFood(foodName: string): string {
    const name = foodName.toLowerCase();
    if (name.includes('ikan') || name.includes('fish') || name.includes('ayam') || name.includes('daging')) {
      return 'protein';
    }
    if (name.includes('sayur') || name.includes('paku') || name.includes('ulam') || name.includes('midin') || name.includes('pucuk')) {
      return 'vegetable';
    }
    if (name.includes('nasi') || name.includes('ubi') || name.includes('keledek') || name.includes('roti')) {
      return 'carbohydrate';
    }
    if (name.includes('buah') || name.includes('pisang') || name.includes('tarap') || name.includes('jambu')) {
      return 'fruit';
    }
    return 'other';
  }

  function handleMealSelect(dayOfWeek: number, mealType: string, food: FoodItem) {
    const key = `${dayOfWeek}-${mealType}`;
    setMealPlan(prev => ({
      ...prev,
      [key]: {
        dayOfWeek,
        mealType,
        foodId: food.id,
        foodName: food.name,
        foodNameMs: food.name_ms || '',
        glycemicIndex: food.glycemic_index || undefined,
        isSabahLocal: food.is_sabah_local,
      },
    }));
  }

  function handleClearMeal(dayOfWeek: number, mealType: string) {
    const key = `${dayOfWeek}-${mealType}`;
    setMealPlan(prev => {
      const newPlan = { ...prev };
      delete newPlan[key];
      return newPlan;
    });
  }

  function getFoodStatus(gi?: number) {
    if (!gi) return null;
    if (gi < 55) return { label: 'Rendah', variant: 'default' as const };
    if (gi < 70) return { label: 'Sederhana', variant: 'outline' as const };
    return { label: 'Tinggi', variant: 'outline' as const };
  }

  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-teal-700 mb-2">
          🗓️ Perancang Makanan Mingguan
        </h1>
        <p className="text-gray-600">
          Rancang makanan sihat untuk Mak dengan makanan tradisional Sabah
        </p>
      </div>

      {/* Week Navigation */}
      <Card className="mb-6">
        <CardContent className="p-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentWeekStart);
              newDate.setDate(newDate.getDate() - 7);
              setCurrentWeekStart(newDate);
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <p className="font-semibold">
              {currentWeekStart.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <p className="text-sm text-gray-500">
              hingga {weekEnd.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentWeekStart);
              newDate.setDate(newDate.getDate() + 7);
              setCurrentWeekStart(newDate);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <Button 
          onClick={saveMealPlan} 
          disabled={isSaving || Object.keys(mealPlan).length === 0}
          className="flex-1"
        >
          💾 {isSaving ? 'Menyimpan...' : 'Simpan Pelan'}
        </Button>
        
        <Dialog open={showShoppingList} onOpenChange={setShowShoppingList}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Senarai Belanja
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>🛒 Senarai Belanja Mingguan</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              {shoppingList.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Tiada item. Simpan pelan makanan dahulu.
                </p>
              ) : (
                shoppingList.map((item, idx) => (
                  <Card key={idx}>
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.nameMs && (
                          <p className="text-sm text-gray-500">{item.nameMs}</p>
                        )}
                        <Badge variant="outline" className="mt-1">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-lg font-semibold">{item.quantity}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weekly Calendar */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Memuatkan pelan makanan...</p>
        </div>
      ) : (
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid grid-cols-7 mb-4">
            {DAYS_OF_WEEK.map(day => (
              <TabsTrigger key={day.value} value={day.value.toString()}>
                {day.label.slice(0, 3)}
              </TabsTrigger>
            ))}
          </TabsList>

          {DAYS_OF_WEEK.map(day => (
            <TabsContent key={day.value} value={day.value.toString()}>
              <Card>
                <CardHeader>
                  <CardTitle>{day.label}</CardTitle>
                  <CardDescription>Jadual makanan harian</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(MEAL_TYPES).map(([mealType, mealLabel]) => {
                    const key = `${day.value}-${mealType}`;
                    const selectedMeal = mealPlan[key];

                    return (
                      <Card key={mealType}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-lg">{mealLabel}</h3>
                            {selectedMeal && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleClearMeal(day.value, mealType)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>

                          {selectedMeal ? (
                            <div className="space-y-2">
                              <p className="text-lg font-medium text-teal-700">
                                {selectedMeal.foodName}
                              </p>
                              {selectedMeal.foodNameMs && (
                                <p className="text-sm text-gray-600">
                                  {selectedMeal.foodNameMs}
                                </p>
                              )}
                              <div className="flex gap-2 flex-wrap">
                                {selectedMeal.glycemicIndex !== undefined && (
                                  <Badge 
                                    variant={
                                      selectedMeal.glycemicIndex < 55 ? 'default' :
                                      selectedMeal.glycemicIndex < 70 ? 'outline' : 'outline'
                                    }
                                  >
                                    GI: {selectedMeal.glycemicIndex} ({getFoodStatus(selectedMeal.glycemicIndex)?.label})
                                  </Badge>
                                )}
                                {selectedMeal.isSabahLocal && (
                                  <Badge variant="outline">🇲🇾 Sabah</Badge>
                                )}
                              </div>
                            </div>
                          ) : (
                            <Select
                              onValueChange={(foodId) => {
                                const food = availableFoods[mealType as keyof typeof availableFoods].find(
                                  f => f.id === foodId
                                );
                                if (food) handleMealSelect(day.value, mealType, food);
                              }}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih makanan" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableFoods[mealType as keyof typeof availableFoods]?.map(food => (
                                  <SelectItem key={food.id} value={food.id}>
                                    {food.name} {food.is_sabah_local && '🇲🇾'}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Info Card */}
      <Card className="mt-6 bg-teal-50">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-teal-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-teal-800">💡 Tips Perancangan Makanan</h3>
            <ul className="text-sm text-teal-700 space-y-1 mt-2">
              <li>• Pilih makanan GI rendah (&lt;55) untuk kencing manis</li>
              <li>• Makanan Sabah seperti Hinava, Pinasakan, Midin sangat disyorkan</li>
              <li>• Elak makanan tinggi GI seperti beras pulut dan tapai</li>
              <li>• Lebihkan ulam dan sayur tempatan</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
