'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ShoppingCart, ChevronLeft, ChevronRight, UtensilsCrossed, Heart, Calendar, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Header } from '@/components/ui/professional/Header';
import { PageContainer } from '@/components/ui/professional/PageContainer';
import { Section } from '@/components/ui/professional/Section';
import { InfoBanner } from '@/components/ui/professional/InfoBanner';
import { Grid } from '@/components/ui/professional/Grid';

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
  const loadFoods = useCallback(async () => {
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
  }, [supabase]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  // Load existing meal plan
  const loadMealPlan = useCallback(async () => {
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
  }, [currentWeekStart, supabase]);

  useEffect(() => {
    loadMealPlan();
  }, [loadMealPlan]);

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
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      {/* Professional Header */}
      <Header
        title="Perancang Makanan"
        subtitle="Jadual makanan mingguan untuk Mak"
        showBack={true}
        backHref="/"
        actions={
          <div className="flex items-center gap-2 text-sm opacity-90">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
        }
      />

      <PageContainer padding="md" maxWidth="wide">
        <div className="space-y-6 py-6">

          {/* Week Navigation Card */}
          <Section background="surface" border="all">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const newDate = new Date(currentWeekStart);
                  newDate.setDate(newDate.getDate() - 7);
                  setCurrentWeekStart(newDate);
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="text-center">
                <p className="font-semibold text-base">
                  {currentWeekStart.toLocaleDateString('ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="text-sm text-muted-foreground">
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
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </Section>

          {/* Action Buttons */}
          <Section>
            <Grid columns={2} gap="md">
              <Button
                onClick={saveMealPlan}
                disabled={isSaving || Object.keys(mealPlan).length === 0}
                size="lg"
                className="w-full"
              >
                💾 {isSaving ? 'Menyimpan...' : 'Simpan Pelan'}
              </Button>

              <Dialog open={showShoppingList} onOpenChange={setShowShoppingList}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="lg" className="w-full flex items-center justify-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Senarai Belanja
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>🛒 Senarai Belanja Mingguan</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 mt-4">
                    {shoppingList.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Tiada item. Simpan pelan makanan dahulu.
                      </p>
                    ) : (
                      shoppingList.map((item, idx) => (
                        <Card key={idx}>
                          <CardContent className="p-3 flex items-center justify-between">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.nameMs && (
                                <p className="text-sm text-muted-foreground">{item.nameMs}</p>
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
            </Grid>
          </Section>

      {/* Weekly Calendar */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Memuatkan pelan makanan...</p>
        </div>
      ) : (
        <Section background="surface" border="all">
          <div className="mb-6">
            <h2 className="font-semibold text-base">Jadual Mingguan</h2>
            <p className="text-sm text-muted-foreground">Pilih makanan untuk setiap waktu makan</p>
          </div>

          <Tabs defaultValue="0" className="w-full">
            <TabsList className="grid grid-cols-7 mb-6">
              {DAYS_OF_WEEK.map(day => (
                <TabsTrigger key={day.value} value={day.value.toString()}>
                  {day.label.slice(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>

            {DAYS_OF_WEEK.map(day => (
              <TabsContent key={day.value} value={day.value.toString()}>
                <div className="space-y-4">
                  {Object.entries(MEAL_TYPES).map(([mealType, mealLabel]) => {
                    const key = `${day.value}-${mealType}`;
                    const selectedMeal = mealPlan[key];

                    return (
                      <div key={mealType} className="border rounded-lg p-4 bg-background">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-base">{mealLabel}</h3>
                          {selectedMeal && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleClearMeal(day.value, mealType)}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>

                        {selectedMeal ? (
                          <div className="space-y-2">
                            <p className="font-medium text-base text-primary-700">
                              {selectedMeal.foodName}
                            </p>
                            {selectedMeal.foodNameMs && (
                              <p className="text-sm text-muted-foreground">
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
                                  className="text-xs"
                                >
                                  GI: {selectedMeal.glycemicIndex} ({getFoodStatus(selectedMeal.glycemicIndex)?.label})
                                </Badge>
                              )}
                              {selectedMeal.isSabahLocal && (
                                <Badge variant="secondary" className="text-xs">🇲🇾 Sabah</Badge>
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
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </Section>
      )}

      {/* Info Banner */}
      <InfoBanner
        variant="info"
        title="💡 Tips Perancangan Makanan"
      >
        <ul className="text-sm space-y-1">
          <li>• Pilih makanan GI rendah (&lt;55) untuk kencing manis</li>
          <li>• Makanan Sabah seperti Hinava, Pinasakan, Midin sangat disyorkan</li>
          <li>• Elak makanan tinggi GI seperti beras pulut dan tapai</li>
          <li>• Lebihkan ulam dan sayur tempatan</li>
        </ul>
      </InfoBanner>

      {/* Bottom Navigation - Mobile-first fixed */}
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="w-full px-2">
        <div className="grid grid-cols-4 gap-1 py-2">
          <Link href="/" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors min-h-[56px]">
            <Heart size={24} />
            <span className="text-xs sm:text-sm font-semibold">Utama</span>
          </Link>
          <Link href="/makanan" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors min-h-[56px]">
            <UtensilsCrossed size={24} />
            <span className="text-xs sm:text-sm font-semibold">Makanan</span>
          </Link>
          <Link href="/meal-planner" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-primary text-white min-h-[56px]">
            <Calendar size={24} />
            <span className="text-xs sm:text-sm font-semibold">Jadual</span>
          </Link>
          <Link href="/ai" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors min-h-[56px]">
            <Sparkles size={24} />
            <span className="text-xs sm:text-sm font-semibold">AI</span>
          </Link>
        </div>
      </div>
    </nav>
      </div>
    </PageContainer>
  </div>
  );
}
