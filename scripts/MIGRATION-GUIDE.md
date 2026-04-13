# Panduan Migrasi Database KKM

Panduan ini menjelaskan 3 kaedah untuk menjalankan migrasi database KKM Suku-Separuh.

## Kaedah 1: Supabase Dashboard (Paling Mudah) ⭐

**Masa:** 2 minit  
**Keperluan:** Akses internet + login Supabase

### Langkah-langkah:

1. **Pergi ke Supabase Dashboard:**
   ```
   https://app.supabase.com/project/PanduanPemakananMama
   ```

2. **Buka SQL Editor:**
   - Klik "SQL Editor" di sidebar kiri
   - Klik butang "New Query"

3. **Salin SQL Migration:**
   - Buka fail `supabase/kkm_meal_planner_migration.sql` dalam VS Code
   - Salin semua isi (Ctrl+A, Ctrl+C)

4. **Tampal dan Jalankan:**
   - Tampal ke dalam SQL Editor (Ctrl+V)
   - Klik butang "Run" atau tekan Ctrl+Enter

5. **Sahkan Keputusan:**
   - Pastikan tiada error
   - Output akan menunjukkan rows affected

---

## Kaedah 2: Node.js Script (Menggunakan Service Role Key)

**Masa:** 1 minit  
**Keperluan:** SUPABASE_SERVICE_ROLE_KEY dalam .env.local

### Setup:

1. **Dapatkan Service Role Key:**
   - Pergi ke Supabase Dashboard → Settings → API
   - Salin "service_role key" (BUKAN anon key)

2. **Tambah ke .env.local:**
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
   ```

3. **Jalankan Script:**
   ```bash
   node scripts/kkm-migration.js
   ```

---

## Kaedah 3: Playwright Automation (Browser Automation)

**Masa:** 3-5 minit  
**Keperluan:** Playwright + Manual login

### Setup:

1. **Install Playwright:**
   ```bash
   npm install -D playwright
   npx playwright install chromium
   ```

2. **Kemaskini Project Reference:**
   - Edit `scripts/playwright-supabase-automation.js`
   - Kemaskini `SUPABASE_PROJECT_REF` dengan project ID anda

3. **Jalankan Automation:**
   ```bash
   node scripts/playwright-supabase-automation.js
   ```

4. **Login Manual:**
   - Browser akan terbuka
   - Login ke Supabase secara manual
   - Playwright akan automasi selebihnya

---

## Apa yang Dilakukan Migrasi Ini?

### Sebelum Migrasi (Sabah Foods):
- Hinava, Pinasakan, Midin Fern, Sea Grapes
- 30 makanan tradisional Sabah

### Selepas Migrasi (KKM Suku-Separuh):
- **suku_karbo:** 12 makanan (Brown Rice, Quinoa, Oats, Barley)
- **sparuh_sayur:** 18 sayur (Bayam, Kangkung, Brokoli, Bendi)
- **suku_protein:** 14 protein (Dada Ayam, Ikan, Tofu, Tempeh)
- **susu:** 6 produk tenusu (Susu Rendah Lemak, Greek Yogurt)
- **buah:** 12 buah (Jambu Batu, Epal, Oren, Pisang)

**Jumlah:** 87 makanan mengikut garis panduan KKM

---

## Verifikasi Selepas Migrasi

### 1. Semak Jumlah Makanan:
```sql
SELECT category, COUNT(*) FROM foods GROUP BY category ORDER BY category;
```

Keputusan yang dijangka:
```
carbohydrate | 12
fruit        | 12
protein      | 20
vegetable    | 18
```

### 2. Semak Kategori KKM:
```sql
SELECT kkm_category, COUNT(*) 
FROM foods 
WHERE kkm_category IS NOT NULL 
GROUP BY kkm_category ORDER BY kkm_category;
```

Keputusan yang dijangka:
```
buah          | 12
separuh_sayur | 18
suku_karbo    | 12
suku_protein  | 14
susu          | 6
```

---

## Penyelesaian Masalah

### Error: "Table foods does not exist"
**Penyelesaian:** Jalankan semula migrasi - ia akan cipta table.

### Error: "Permission denied"
**Penyelesaian:** Pastikan anda menggunakan Service Role Key (bukan anon key).

### Error: "duplicate key value violates unique constraint"
**Penyelesaian:** Normal - migrasi cuba insert data yang sudah wujud.

---

## Pilihan Kaedah

| Kaedah | Kesukaran | Masa | Diperlukan | Syor |
|--------|-----------|------|------------|------|
| Dashboard | Mudah | 2 min | Browser | ⭐ Pilihan 1 |
| Node.js | Sederhana | 1 min | Service Role Key | ⭐ Pilihan 2 |
| Playwright | Kompleks | 5 min | Playwright install | Untuk automation |

---

## Status Semasa

**Database:** Perlu migrasi ⚠️  
**Frontend:** KKM-ready ✅  
**Deploy:** Vercel ✅  

**Tindakan:** Pilih salah satu kaedah di atas dan jalankan migrasi sekarang.
