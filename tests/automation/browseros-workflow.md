# NutriSihat BrowserOS Automation Workflow

## Overview
Workflow pengujian automasi untuk aplikasi NutriSihat yang di-deploy di Vercel.

## Target
- URL: https://nutrisihat.vercel.app
- Focus: KKM Suku-Separuh Meal Planner

## Test Sequence

### 1. Landing Page Verification
```
Navigate: https://nutrisihat.vercel.app
Verify:
  - Title: "NutriSihat | Panduan Pemakanan untuk Kesihatan Mak"
  - Dashboard cards visible
  - Navigation links work
Screenshot: landing-page.png
```

### 2. Meal Planner Test
```
Navigate: https://nutrisihat.vercel.app/meal-planner
Verify:
  - Page title: "Perancang Makanan"
  - 7 day tabs visible (Ahad-Sabtu)
  - Meal slots for: Sarapan, Makan Tengahari, Makan Malam, Snek
  - KKM Tips visible
Test Actions:
  - Click Isnin tab
  - Click Selasa tab
  - Click Rabu tab
Screenshot: meal-planner.png
```

### 3. Food Guide Test
```
Navigate: https://nutrisihat.vercel.app/makanan
Verify:
  - Page title: "Panduan Makanan"
  - Food categories visible
  - KKM classifications present
Screenshot: food-guide.png
```

### 4. Blood Sugar Tracker Test
```
Navigate: https://nutrisihat.vercel.app/gula-darah
Verify:
  - Input fields for readings
  - History table or chart
Screenshot: blood-sugar.png
```

### 5. KKM Content Verification
```
Navigate: https://nutrisihat.vercel.app/meal-planner
Verify Text Content:
  - "suku" or "Suku"
  - "separuh" or "Separuh"
  - "karbohidrat"
  - "protein"
  - "sayur"
Expected: KKM Suku-Separuh concepts should be visible
```

## Expected Results

| Test | Expected | Status |
|------|----------|--------|
| Landing Page | Load < 3s | ⏳ |
| Meal Planner | 7 tabs + meal slots | ⏳ |
| Food Guide | Categories + food cards | ⏳ |
| Blood Sugar | Input form visible | ⏳ |
| KKM Content | Suku-Separuh terms visible | ⏳ |

## BrowserOS MCP Commands Reference

### Navigate
```json
{
  "tool": "mcp__browseros__navigate_page",
  "arguments": {
    "page": 7,
    "action": "url",
    "url": "https://nutrisihat.vercel.app"
  }
}
```

### Take Snapshot
```json
{
  "tool": "mcp__browseros__take_snapshot",
  "arguments": {
    "page": 7
  }
}
```

### Click Element
```json
{
  "tool": "mcp__browseros__click",
  "arguments": {
    "page": 7,
    "element": 394
  }
}
```

### Get Page Content
```json
{
  "tool": "mcp__browseros__get_page_content",
  "arguments": {
    "page": 7
  }
}
```

### Screenshot
```json
{
  "tool": "mcp__browseros__save_screenshot",
  "arguments": {
    "page": 7,
    "path": "test-results/screenshot.png",
    "fullPage": true
  }
}
```

## Automation Notes

Current findings from manual check:
- ✅ Meal Planner page loads with weekly tabs
- ✅ 7 days of week tabs visible (Aha, Isn, Sel, Rab, Kha, Jum, Sab)
- ⚠️ Tips still reference "Sabah" foods (Hinava, Pinasakan, Midin)
- ⚠️ Database migration to KKM foods needs to be run manually in Supabase
