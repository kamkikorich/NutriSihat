# Meal Planner Page Redesign - Progress Report

**Date:** 2026-04-13  
**Session:** Continued from f8e156bc-05f6-4e60-a6e9-22cab5c7605c  
**Status:** In Progress - Build Error Resolution

---

## Objective

Redesign the Meal Planner page (`src/app/meal-planner/page.tsx`) using the professional component library to match the Dashboard and Food Guide pages.

---

## Changes Made

### 1. Updated Imports

```typescript
// Added Next.js Link component
import Link from 'next/link';

// Added new icons from lucide-react
import { 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  UtensilsCrossed, 
  Heart,        // NEW - for bottom nav
  Calendar,     // NEW - for bottom nav (Jadual)
  Sparkles,     // NEW - for bottom nav (AI)
  Trash2        // NEW - for clearing meals
} from 'lucide-react';

// Added professional components
import { Header } from '@/components/ui/professional/Header';
import { PageContainer } from '@/components/ui/professional/PageContainer';
import { Section } from '@/components/ui/professional/Section';
import { InfoBanner } from '@/components/ui/professional/InfoBanner';
import { Grid } from '@/components/ui/professional/Grid';
```

### 2. Layout Restructure

| Before | After |
|--------|-------|
| Plain div header | `Header` component with title, subtitle, back button |
| No container wrapper | `PageContainer` with `padding="md"` and `maxWidth="wide"` |
| Card-based sections | `Section` components with `background` and `border` props |
| Manual button grid | `Grid` component with `columns="2"` |
| Standalone info card | `InfoBanner` component with variant="info" |

### 3. Professional Components Applied

#### Header Component
```tsx
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
```

#### Week Navigation (Section)
```tsx
<Section background="surface" border="all">
  <div className="flex items-center justify-between">
    <Button variant="outline" size="icon" onClick={...}>
      <ChevronLeft className="h-5 w-5" />
    </Button>
    <div className="text-center">
      <p className="font-semibold text-base">...</p>
      <p className="text-sm text-muted-foreground">...</p>
    </div>
    <Button variant="outline" size="icon" onClick={...}>
      <ChevronRight className="h-5 w-5" />
    </Button>
  </div>
</Section>
```

#### Action Buttons (Grid)
```tsx
<Section>
  <Grid columns="2" gap="md">
    <Button onClick={saveMealPlan} disabled={isSaving} size="lg" className="w-full">
      💾 {isSaving ? 'Menyimpan...' : 'Simpan Pelan'}
    </Button>
    <Dialog>...</Dialog>
  </Grid>
</Section>
```

#### Weekly Calendar (Section)
```tsx
<Section background="surface" border="all">
  <div className="mb-6">
    <h2 className="font-semibold text-base">Jadual Mingguan</h2>
    <p className="text-sm text-muted-foreground">Pilih makanan untuk setiap waktu makan</p>
  </div>
  <Tabs>...</Tabs>
</Section>
```

#### Meal Entry Cards
```tsx
// Changed from <Card> to plain div with Tailwind classes
<div className="border rounded-lg p-4 bg-background">
  <div className="flex items-center justify-between mb-3">
    <h3 className="font-semibold text-base">{mealLabel}</h3>
    {selectedMeal && (
      <Button variant="ghost" size="sm" onClick={...}>
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    )}
  </div>
  {/* Meal content */}
</div>
```

#### Info Banner
```tsx
<InfoBanner
  variant="info"
  title="💡 Tips Perancangan Makanan"
  content={
    <ul className="text-sm space-y-1">
      <li>• Pilih makanan GI rendah (&lt;55) untuk kencing manis</li>
      <li>• Makanan Sabah seperti Hinava, Pinasakan, Midin sangat disyorkan</li>
      <li>• Elak makanan tinggi GI seperti beras pulut dan tapai</li>
      <li>• Lebihkan ulam dan sayur tempatan</li>
    </ul>
  }
/>
```

### 4. Bottom Navigation (Mobile-First)

```tsx
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
```

**Navigation Structure:**
| Link | Icon | Label | Status |
|------|------|-------|--------|
| `/` | Heart | Utama | Default |
| `/makanan` | UtensilsCrossed | Makanan | Default |
| `/meal-planner` | Calendar | Jadual | **Active** (bg-primary) |
| `/ai` | Sparkles | AI | Default |

---

## Current Issue: Build Error

### Error Message
```
Error: Unexpected token `div`. Expected jsx identifier
   ,-[D:\PanduanPemakananMama\src\app\meal-planner\page.tsx:355:1]
355 |   weekEnd.setDate(weekEnd.getDate() + 6);
356 | 
357 |   return (
358 |     <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
     :     ^^^
```

### Diagnosis
The syntax appears correct at first glance, but the error suggests:
1. Possible missing closing brace `}` earlier in the component
2. Possible unclosed JSX tag or bracket
3. Possible invisible character or encoding issue

### Next Steps to Resolve
1. Check all function closures before line 357
2. Verify all JSX tags are properly closed
3. Consider rewriting the file from scratch if issue persists
4. Use a TSX validator to pinpoint the exact syntax issue

---

## Design Patterns Applied

### Consistent with Dashboard Page
- ✅ Professional Header component
- ✅ PageContainer wrapper
- ✅ Section components with surface backgrounds
- ✅ Grid for 2-column layouts
- ✅ InfoBanner for informational content
- ✅ Mobile-first bottom navigation
- ✅ Touch targets minimum 56px height
- ✅ KKM green theme colors (primary-700)

### Typography Standards
- Section titles: `text-base font-semibold`
- Section descriptions: `text-sm text-muted-foreground`
- Card titles: `text-base font-medium`
- Body text: `text-sm`

### Color Usage
- Primary actions: `bg-primary` (KKM green #388E3C)
- Secondary actions: `variant="outline"`
- Active nav: `bg-primary text-white`
- Inactive nav: `text-primary hover:bg-primary/10`

---

## Remaining Tasks

### Immediate
- [ ] **Resolve build error** - Critical blocker
- [ ] Test page renders correctly
- [ ] Verify bottom navigation works
- [ ] Test shopping list dialog

### FASA 2 - Other Pages
- [ ] Redesign Blood Sugar page (`src/app/gula-darah/page.tsx`)
- [ ] Redesign Medicine page (`src/app/ubat/page.tsx`)
- [ ] Redesign AI Advice page (`src/app/ai/page.tsx`)

### FASA 3 - CI/CD
- [ ] Create GitHub Actions workflows
- [ ] Set up environment management

### FASA 4 - Supabase Automation
- [ ] Create Edge Functions
- [ ] Add database triggers
- [ ] Configure pg_cron jobs
- [ ] Playwright Chrome integration

### FASA 5 - Monitoring
- [ ] Health check endpoint
- [ ] Error tracking integration

---

## Files Modified

| File | Status | Notes |
|------|--------|-------|
| `src/app/meal-planner/page.tsx` | ⚠️ In Progress | Imports added, layout restructured, build error pending |

## Files to Create (Future)

```
.github/workflows/
├── ci.yml
├── deploy-preview.yml
├── deploy-production.yml
├── supabase-migration.yml
└── security-scan.yml

supabase/functions/
├── _shared/
├── process-daily-meals/
├── generate-shopping-list/
├── send-reminder-push/
└── sync-health-data/
```

---

## Lessons Learned

1. **Import Management**: Always verify all components and icons are imported before restructuring
2. **Incremental Changes**: Make smaller, testable changes rather than large restructures
3. **Build Early**: Test build after each major change to catch errors early
4. **Component Dependencies**: Keep track of which components are used where (Card still needed for shopping list dialog)

---

## References

- Dashboard page: `src/app/page.tsx` (completed)
- Food Guide page: `src/app/makanan/page.tsx` (completed)
- Professional components: `src/components/ui/professional/`
- Transformation plan: `.claude/plans/glimmering-swimming-liskov.md`

---

**Next Session:** Resolve build error, then continue with remaining pages.
