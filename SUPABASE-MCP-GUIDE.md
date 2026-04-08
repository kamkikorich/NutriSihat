# Panduan Menggunakan Supabase MCP

## Status Konfigurasi

**Aktif dan Berfungsi**
- Supabase MCP Server: `https://mcp.supabase.com/mcp`
- Project ID: `oasowmrkydwufexxxwjc`
- Project Name: `PanduanPemakananMama`
- Access Token: Telah dikonfigurasi dalam `.env.local`

---

## Langkah-Langkah yang Telah Dibuat

### 1. Token Akses Dibuat
- Token Name: `NutriSihat CLI Token`
- Expiry: Never
- Disimpan dalam: `.env.local` sebagai `SUPABASE_ACCESS_TOKEN`

### 2. Projek Dilink
```bash
npx supabase init          # ✅ Dijalankan
npx supabase link          # ✅ Berjaya
npx supabase migration repair --status applied 20240315000000  # ✅ Berjaya
```

### 3. Struktur Fail
```
D:\PanduanPemakananMama\
├── supabase/
│   ├── config.toml       # Konfigurasi lokal
│   └── migrations/
│       ├── 20240315000000_initial_schema.sql
│       └── (run_now.sql telah diubah nama)
└── .env.local            # Mengandungi SUPABASE_ACCESS_TOKEN
```

---

## Cara Menggunakan Supabase MCP

### Melalui CLI (Command Line)

**1. Cek status projek**
```bash
npx supabase projects list
```

**2. Lihat maklumat projek**
```bash
npx supabase inspect
```

**3. Jalankan SQL migration**
```bash
npx supabase db push
```

**4. Tarik schema dari remote**
```bash
npx supabase db pull
```

### Melalui Dashboard Browser

**URL**: https://supabase.com/dashboard/project/oasowmrkydwufexxxwjc

**Modul yang tersedia:**
- Table Editor - Edit data directly
- SQL Editor - Run queries
- Database - Schema visualizer
- Authentication - User management
- Storage - File uploads
- Edge Functions - Serverless functions

### Melalui Koding (Next.js)

**Server-side client:**
```typescript
import { createServerClient } from '@/lib/supabase/server'
const supabase = createServerClient()
```

**Browser-side client:**
```typescript
import { createBrowserClient } from '@/lib/supabase/browser'
const supabase = createBrowserClient()
```

**Contoh query:**
```typescript
// Ambil profil pengguna
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single()

// Log gula darah
const { error } = await supabase
  .from('blood_sugar_logs')
  .insert({
    user_id: userId,
    value: 5.5,
    meal_type: 'before_meal'
  })
```

---

## Prasyarat untuk Local Development

**Docker Desktop diperlukan** untuk menjalankan Supabase secara lokal:
- Download: https://docs.docker.com/desktop
- Selepas install, jalankan: `npx supabase start`

**Tanpa Docker:**
- Gunakan remote database sahaja
- Semua development melalui hosted Supabase

---

## Database Schema (Ringkasan)

**11 Tables:**
1. `profiles` - Profil pengguna
2. `blood_sugar_logs` - Log gula darah
3. `medicine_reminders` - Jadual ubat
4. `medicine_logs` - Log pengambilan ubat
5. `meal_logs` - Log makanan
6. `health_logs` - Log kesihatan (berat, tenaga, gejala)
7. `cancer_treatment_tips` - Tips rawatan kanser
8. `side_effect_management` - Panduan kesan sampingan
9. `notifications` - Notifikasi
10. `ai_chat_history` - Sejarah sembang AI

**Views:**
- `daily_blood_sugar_summary` - Ringkasan harian gula darah
- `pending_medicine_reminders` - Peringatan ubat tertunggak

---

## Peringatan Penting

1. **Jangan commit `.env.local`** - Mengandungi API keys
2. **Docker diperlukan** untuk local development (boleh skip jika guna remote)
3. **RLS (Row Level Security)** aktif pada semua table user data
4. **Bahasa Malaysia** untuk UI - elderly-friendly

---

## Next Steps (Phase 2)

### Priority 1: Authentication Setup
- [ ] Enable Supabase Auth in dashboard
- [ ] Configure providers (email/password, Google)
- [ ] Build login/register pages
- [ ] Create auth context provider

### Priority 2: Dashboard & Profile
- [ ] Build main layout with navigation
- [ ] Profile creation flow
- [ ] Quick stats cards

### Priority 3: Feature Modules
- [ ] Blood sugar tracker
- [ ] Medicine reminders
- [ ] Nutrition tips module
- [ ] Meal logging
- [ ] Health metrics

---

## Troubleshooting

**Error: "Docker Desktop is a prerequisite"**
- Solution: Install Docker Desktop atau guna remote database sahaja

**Error: "Access token not provided"**
- Solution: Token sudah diset dalam `.env.local`
- Atau set secara manual:
  ```bash
  set SUPABASE_ACCESS_TOKEN=sbp_xxx...
  ```

**Error: "Migration history mismatch"**
- Solution: `npx supabase migration repair --status applied <timestamp>`

---

## Kontak & Sokongan

- **Supabase Docs**: https://supabase.com/docs
- **CLI Reference**: https://supabase.com/docs/reference/cli
- **Dashboard**: https://supabase.com/dashboard

---

*Dokumen ini dikemas kini pada: 2026-04-08*