# NutriSihat - Product Requirements Document

## Overview

**App Name:** NutriSihat (Panduan Pemakanan untuk Kesihatan Mak)

**Purpose:** A health and nutrition guide application designed for elderly mothers with diabetes and uterine health concerns. The app provides food recommendations, medication reminders, blood sugar logging, and AI-powered health advice.

---

## Target Users

- **Primary User:** Elderly mothers (Mak) aged 50-70 with:
  - Diabetes (Kencing Manis)
  - Uterine health concerns (Kesihatan Rahim)
- **Secondary Users:** Family members who help manage the mother's health

---

## Features

### 1. Dashboard (Home Page)
- Personalized greeting based on time of day (Selamat Pagi/Petang/Malam, Mak!)
- Health condition badges showing diabetes and uterus health status
- Quick stats cards:
  - Safe foods count (22 makanan selamat)
  - Foods to avoid count (8 makanan perlu elak)
- Main action buttons (large, elderly-friendly):
  - Panduan Makanan (Food Guide)
  - Ubat (Medication)
  - Gula Darah (Blood Sugar)
  - Tanya AI (Ask AI)
- Current meal time recommendation
- Safe foods preview grid
- Important health warnings

### 2. Food Guide (Panduan Makanan)
- Filter by status: Safe (Boleh), Limit (Kurang), Avoid (Elak)
- Search functionality for foods
- Food cards showing:
  - Food name (Malay and English)
  - Description
  - Glycemic Index (GI)
  - Health notes for diabetes and uterus
  - Alternatives
  - Tips
- Malaysian local foods marked with flag

### 3. Medication (Ubat)
- Medication reminders
- Schedule tracking
- Dosage information

### 4. Blood Sugar Log (Gula Darah)
- Daily blood sugar entry
- Historical data tracking
- Charts and trends

### 5. AI Assistant (Tanya AI)
- Health advice chatbot
- Nutrition recommendations
- Answers to health questions

---

## UI/UX Requirements

### Design Principles
- **Large text and buttons** for elderly users
- **High contrast** colors
- **Simple navigation** with bottom nav bar
- **Bahasa Malaysia** language throughout
- **Emoji indicators** for food status (✅ ❌ ⚠️)

### Color Scheme
- Primary: Green/Teal (#0D9488)
- Success: Green
- Warning: Orange
- Danger: Red
- Background: Light gradient

### Accessibility
- Minimum touch target: 48px
- Font size: 16px minimum
- Clear visual hierarchy
- High contrast text

---

## Technical Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI)
- **Database:** Supabase (PostgreSQL)
- **PWA Support:** next-pwa

---

## User Flows

### Flow 1: Check Safe Foods
1. Open app → See dashboard
2. Tap "Panduan Makanan" or safe foods card
3. Browse safe foods list
4. Tap food card for details
5. See health notes and alternatives

### Flow 2: Check Foods to Avoid
1. Open app → See dashboard
2. Tap avoid foods card
3. See list of foods to avoid
4. Read why each food should be avoided

### Flow 3: Log Blood Sugar
1. Open app → Tap "Gula Darah"
2. Enter blood sugar reading
3. Save to history
4. View trends

---

## Success Metrics

- Easy navigation for elderly users
- Clear food status indicators
- Accurate health information
- Fast page loads
- Mobile-responsive design