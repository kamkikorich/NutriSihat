# NutriSihat Setup Guide

Saya telah setup database dan AI integration untuk projek NutriSihat. Berikut adalah langkah-langkah untuk melengkapkan setup.

## 📋 Langkah-Langkah Setup

### 1. Setup Database di Supabase

**PENTING:** Anda perlu run migration SQL secara manual di Supabase Dashboard.

1. Buka: https://supabase.com/dashboard/project/oasowmrkydwufexxxwjc/sql
2. Copy semua kandungan dari file: `supabase/migrations/20240315000000_initial_schema.sql`
3. Paste dalam SQL Editor
4. Click "Run"

Migration akan:
- Create semua tables (profiles, blood_sugar_logs, medicine_reminders, dll.)
- Setup Row Level Security (RLS)
- Create indexes untuk performance
- Insert seed data untuk cancer treatment tips

### 2. Environment Variables

Semua environment variables telah diset dalam `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://oasowmrkydwufexxxwjc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hc293bXJreWR3dWZleHh4d2pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NTg0MTEsImV4cCI6MjA5MTIzNDQxMX0.5dmEesrAuWDLcQDsmq2KN0o8Uc9JS_df8HCxVySFc8o
OLLAMA_API_URL=https://ollama.com/api
OLLAMA_API_KEY=2d722e0edfd34594986d83ae0c49348c._2FPQyPsn9vM4fR4V_Rk0Mz_
OLLAMA_MODEL=llama3
```

### 3. Struktur Database

#### Tables Created:

1. **profiles** - User profiles dengan health conditions
2. **blood_sugar_logs** - Daily blood sugar tracking
3. **medicine_reminders** - Medicine schedules
4. **medicine_logs** - Medicine intake history
5. **meal_logs** - Food intake tracking
6. **health_logs** - Weight, energy, symptoms tracking
7. **cancer_treatment_tips** - Nutrition tips for cancer patients
8. **side_effect_management** - Side effect management guides
9. **notifications** - Push notifications
10. **ai_chat_history** - AI conversations

### 4. File Structure

```
src/
├── lib/
│   ├── supabase/
│   │   ├── server.ts          # Server client
│   │   ├── browser.ts         # Browser client
│   │   └── queries/
│   │       ├── profiles.ts
│   │       ├── blood-sugar.ts
│   │       ├── medicine.ts
│   │       ├── food.ts
│   │       ├── health.ts
│   │       └── cancer-tips.ts
│   └── ai/
│       └── ollama-service.ts  # AI integration
├── types/
│   ├── food.ts                # Food types
│   └── database.ts            # Database types
└── app/
    └── api/
        ├── ai/
        │   ├── chat/route.ts
        │   └── health-advice/route.ts
        └── food/
            └── analyze/route.ts
```

### 5. API Endpoints

#### AI Chat
- **POST** `/api/ai/chat`
- Body: `{ messages: ChatMessage[], userId?: string }`
- Response: `{ success: boolean, message: string }`

#### Health Advice
- **POST** `/api/ai/health-advice`
- Body: `{ conditions: string[], cancerType?: string, treatmentType?: string }`
- Response: `{ success: boolean, advice: HealthAdvice }`

#### Food Analysis
- **POST** `/api/food/analyze`
- Body: `{ foodName: string, conditions: string[] }`
- Response: `{ success: boolean, analysis: string }`

### 6. Next Steps

1. **Run database migration** (Supabase Dashboard SQL Editor)
2. **Test AI integration** dengan endpoint di atas
3. **Create authentication pages** (login, signup)
4. **Build UI components** untuk tracking
5. **Implement realtime subscriptions** untuk live updates

### 7. Features Implemented

✅ Database schema dengan RLS policies  
✅ TypeScript types untuk semua tables  
✅ Supabase client setup (server & browser)  
✅ Query functions untuk semua operations  
✅ AI service integration dengan Ollama  
✅ API routes untuk AI interactions  
✅ Food analysis endpoint  
✅ Health advice endpoint  

### 8. Features Pending

⏳ User authentication UI  
⏳ Blood sugar tracking UI  
⏳ Medicine reminder UI  
⏳ Meal logging UI  
⏳ Cancer nutrition module UI  
⏳ Push notifications  
⏳ Data visualization (charts)  
⏳ PWA offline support  

## 🔧 Testing

### Test AI Chat

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "id": "1",
        "role": "user",
        "content": "Boleh saya makan nasi lemak?",
        "timestamp": "2024-01-01T00:00:00Z"
      }
    ]
  }'
```

### Test Food Analysis

```bash
curl -X POST http://localhost:3000/api/food/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "foodName": "teh tarik",
    "conditions": ["diabetes"]
  }'
```

## 📞 Support

Jika ada masalah, sila:
1. Check Supabase logs di dashboard
2. Check Next.js console untuk errors
3. Pastikan semua environment variables diset dengan betul

---

**Dibuat dengan ❤️ untuk Mama**