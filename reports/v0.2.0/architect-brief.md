# Architect Brief: Meal Planning Calendar Feature

## Context
- **Project:** NutriSihat v0.2.0
- **Feature:** Weekly meal planning calendar with Sabah regional foods
- **Users:** Elderly mothers (Mak) with diabetes & uterine health concerns
- **Language:** Bahasa Malaysia
- **Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase

## Requirements (from Research)

### Core Features
1. **Weekly Calendar UI** - 7-day view (Monday-Sunday)
2. **Meal Suggestions** - Auto-suggest based on diabetes-safe & uterus-friendly criteria
3. **Food Filtering** - Filter by status (✅ Boleh, ⚠️ Kurang, ❌ Elak)
4. **Shopping List Generator** - Auto-aggregate ingredients from meal plan
5. **Sabah Foods Focus** - Local ingredients (hinava, midin, linongkot, etc.)
6. **Integration** - Use existing food guide database

### Database Schema (Proposed)

**New Tables:**
```sql
-- Meal plans (weekly)
meal_plans (
  id uuid pk,
  user_id uuid fk,
  week_start_date date,
  created_at timestamp,
  updated_at timestamp
)

-- Daily meal entries
meal_plan_days (
  id uuid pk,
  meal_plan_id uuid fk,
  day_of_week int (0-6),
  breakfast_food_id uuid fk,
  lunch_food_id uuid fk,
  dinner_food_id uuid fk,
  snack_food_id uuid fk,
  notes text
)

-- Shopping list items
shopping_list_items (
  id uuid pk,
  meal_plan_id uuid fk,
  ingredient_name text,
  quantity text,
  unit text,
  checked boolean,
  category text
)
```

### UI Components Needed
1. `WeeklyCalendar` - Main calendar grid
2. `DayCard` - Individual day display
3. `MealSelector` - Modal/popup to select meals
4. `FoodFilter` - Filter controls (diabetes/uterus status)
5. `ShoppingList` - Generated list with checkboxes
6. `MealPlanSummary` - Weekly nutrition overview

### Integration Points
- Existing `foods` table (extend with meal planning fields)
- Existing Supabase auth
- Existing UI components (shadcn/ui)
- Bahasa Malaysia localization

## Design Decisions Needed

1. **Calendar View:** Grid (7 columns) or Vertical List (7 rows)?
   - Recommendation: Vertical list for mobile-first (elderly users)

2. **Meal Selection:** Manual pick or AI auto-suggest?
   - Recommendation: Both - auto-suggest with manual override

3. **Data Persistence:** Save drafts or publish only?
   - Recommendation: Auto-save drafts, "Lock Week" to finalize

4. **Shopping List:** One-time generate or live sync?
   - Recommendation: Live sync (update when meals change)

5. **Portion Control:** Include portion sizes?
   - Recommendation: Yes, with pre-set portions for elderly (small/medium/large)

## Accessibility Requirements
- Large touch targets (48px minimum)
- High contrast colors
- Large text (16px minimum)
- Simple navigation
- Clear visual feedback

## Handoff to @builder
After architecture approval, builder should:
1. Create Supabase migrations for new tables
2. Create TypeScript types/interfaces
3. Build UI components (mobile-first)
4. Implement CRUD operations
5. Add filtering logic
6. Build shopping list generator

## Success Criteria
- User can create 7-day meal plan
- System suggests diabetes-safe Sabah foods
- Shopping list auto-generates correctly
- All UI in Bahasa Malaysia
- Elderly-friendly (large text, simple navigation)
