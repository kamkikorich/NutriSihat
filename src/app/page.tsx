// NutriSihat - Main Dashboard Page (Server Component)
// Paparan data sebenar dari Supabase: gula darah & ubat hari ini

import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/professional/Header'
import { PageContainer } from '@/components/ui/professional/PageContainer'
import { Section } from '@/components/ui/professional/Section'
import { InfoBanner } from '@/components/ui/professional/InfoBanner'
import { EmptyState } from '@/components/ui/professional/EmptyState'
import { Grid } from '@/components/ui/professional/Grid'
import { Card, CardContent } from '@/components/ui/card'
import { DashboardGreeting } from '@/components/dashboard/DashboardGreeting'
import {
  UtensilsCrossed,
  Pill,
  Sparkles,
  Activity,
  ChevronRight,
  Heart,
  ShieldCheck,
  Leaf,
  Droplet,
  CheckCircle2,
  AlertTriangle,
  UserCircle,
  TrendingUp,
  Check,
} from 'lucide-react'
import { GREETINGS, DASHBOARD, HEALTH_CONDITIONS, APP_NAME } from '@/lib/constants'
import { FOOD_STATS, getFoodsByStatus } from '@/data/foods'

// Tentukan status warna gula darah
function getBloodSugarBadge(value: number) {
  if (value < 3.9) return { label: 'Rendah', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' }
  if (value < 5.6) return { label: '✅ Normal', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' }
  if (value < 7.0) return { label: '⚠️ Tinggi', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' }
  return { label: '❌ Sangat Tinggi', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' }
}

export default async function HomePage() {
  const supabase = await createClient()
  const safeFoods = getFoodsByStatus('safe').slice(0, 3)

  // Dapatkan user & profil
  const { data: { user } } = await supabase.auth.getUser()

  let profile: { custom_name?: string; preferred_name?: string } | null = null
  let latestBloodSugar: { value: number; status: string; logged_time: string; meal_type: string } | null = null
  let todayMedicineStats = { total: 0, taken: 0 }
  const today = new Date().toISOString().split('T')[0]

  if (user) {
    // Ambil profil
    const { data: profileData } = await supabase
      .from('profiles')
      .select('custom_name, preferred_name')
      .eq('user_id', user.id)
      .single()
    profile = profileData

    // Ambil bacaan gula darah terkini (hari ini atau semalam)
    const { data: bsData } = await supabase
      .from('blood_sugar_logs')
      .select('value, status, logged_time, meal_type, logged_date')
      .eq('user_id', user.id)
      .order('logged_date', { ascending: false })
      .order('logged_time', { ascending: false })
      .limit(1)
      .maybeSingle()
    latestBloodSugar = bsData

    // Ambil ubat hari ini
    const { data: medicines } = await supabase
      .from('medicine_reminders')
      .select('id, is_active, taken_today')
      .eq('user_id', user.id)
      .eq('is_active', true)
    if (medicines) {
      todayMedicineStats.total = medicines.length
      todayMedicineStats.taken = medicines.filter((m: { taken_today: boolean }) => m.taken_today).length
    }
  }

  const displayName = profile?.custom_name || profile?.preferred_name || 'Mak'
  const bloodSugarBadge = latestBloodSugar ? getBloodSugarBadge(latestBloodSugar.value) : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      {/* Professional Header */}
      <Header
        title={APP_NAME}
        subtitle="Panduan Kesihatan Mak"
        showBack={false}
        actions={
          <Link href="/profile" className="flex items-center gap-1 text-white opacity-90 hover:opacity-100 transition-opacity">
            <UserCircle className="h-6 w-6" />
          </Link>
        }
      />

      <PageContainer padding="md" maxWidth="wide">
        <div className="space-y-6 py-6">

          {/* Welcome Section — Client Component untuk sapaan dinamik */}
          <Section className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="text-success h-8 w-8" />
              <DashboardGreeting displayName={displayName} />
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
              {GREETINGS.how_are_you}
            </p>
          </Section>

          {/* Health Conditions */}
          <Section background="surface" border="all">
            <div className="flex flex-wrap justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white shadow-sm border border-primary-100">
                <Droplet className="text-warning h-6 w-6" />
                <span className="text-base font-semibold text-primary">
                  {HEALTH_CONDITIONS.diabetes.name}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white shadow-sm border border-primary-100">
                <Leaf className="text-success h-6 w-6" />
                <span className="text-base font-semibold text-primary">
                  {HEALTH_CONDITIONS.uterus.name}
                </span>
              </div>
            </div>
          </Section>

          {/* === DATA SEBENAR: Gula Darah & Ubat === */}
          <Grid columns="responsive" gap="md">
            {/* Kad Gula Darah Terkini */}
            <Link href="/gula-darah" className="block">
              <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary-100 h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="text-primary h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-semibold text-muted-foreground">Gula Darah Terkini</span>
                    </div>
                    {latestBloodSugar ? (
                      <>
                        <p className="text-3xl font-bold text-primary">
                          {latestBloodSugar.value}
                          <span className="text-base font-normal text-muted-foreground ml-1">mmol/L</span>
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-sm font-semibold border ${bloodSugarBadge?.bg} ${bloodSugarBadge?.text} ${bloodSugarBadge?.border}`}>
                            {bloodSugarBadge?.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {latestBloodSugar.meal_type === 'before_meal' ? 'Sebelum Makan' : 'Selepas Makan'} • {latestBloodSugar.logged_time}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-muted-foreground">—</p>
                        <p className="text-sm text-muted-foreground mt-1">Tiada rekod lagi</p>
                        <p className="text-sm font-semibold text-primary mt-2">+ Tambah Rekod</p>
                      </>
                    )}
                  </div>
                  <ChevronRight className="text-muted-foreground h-5 w-5 flex-shrink-0 mt-1" />
                </div>
              </Card>
            </Link>

            {/* Kad Ubat Hari Ini */}
            <Link href="/ubat" className="block">
              <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer border-2 border-primary-100 h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="text-accent h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-semibold text-muted-foreground">Ubat Hari Ini</span>
                    </div>
                    {todayMedicineStats.total > 0 ? (
                      <>
                        <p className="text-3xl font-bold text-primary">
                          {todayMedicineStats.taken}
                          <span className="text-base font-normal text-muted-foreground">/{todayMedicineStats.total}</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">ubat sudah diambil</p>
                        {todayMedicineStats.taken === todayMedicineStats.total ? (
                          <div className="mt-2 flex items-center gap-1">
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-600">Semua sudah diambil ✅</span>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-semibold text-orange-600">
                              {todayMedicineStats.total - todayMedicineStats.taken} lagi belum diambil
                            </span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-2xl font-bold text-muted-foreground">—</p>
                        <p className="text-sm text-muted-foreground mt-1">Tiada ubat aktif</p>
                        <p className="text-sm font-semibold text-primary mt-2">+ Tambah Ubat</p>
                      </>
                    )}
                  </div>
                  <ChevronRight className="text-muted-foreground h-5 w-5 flex-shrink-0 mt-1" />
                </div>
              </Card>
            </Link>
          </Grid>

          {/* Quick Stats — Makanan */}
          <Grid columns="responsive" gap="md">
            <Link href="/makanan?status=safe" className="block">
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 border-green-100 bg-green-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="text-green-600 h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-700">{FOOD_STATS.safe}</p>
                      <p className="text-sm font-medium text-green-600">Makanan Selamat</p>
                    </div>
                  </div>
                  <ChevronRight className="text-green-400 h-5 w-5" />
                </div>
              </Card>
            </Link>
            <Link href="/makanan?status=avoid" className="block">
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer border-2 border-orange-100 bg-orange-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <AlertTriangle className="text-orange-600 h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-700">{FOOD_STATS.avoid}</p>
                      <p className="text-sm font-medium text-orange-600">Makanan Elak</p>
                    </div>
                  </div>
                  <ChevronRight className="text-orange-400 h-5 w-5" />
                </div>
              </Card>
            </Link>
          </Grid>

          {/* Main Action Buttons */}
          <Section>
            <Grid columns="responsive" gap="md">
              <Link href="/makanan" className="block">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full flex flex-col items-center gap-2 py-4 h-auto"
                >
                  <UtensilsCrossed size={32} />
                  <span className="text-lg font-bold">Makanan</span>
                  <span className="text-sm opacity-80">Panduan</span>
                </Button>
              </Link>

              <Link href="/ubat" className="block">
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full flex flex-col items-center gap-2 py-4 h-auto"
                >
                  <Pill size={32} />
                  <span className="text-lg font-bold">Ubat</span>
                  <span className="text-sm opacity-80">Peringatan</span>
                </Button>
              </Link>

              <Link href="/gula-darah" className="block">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full flex flex-col items-center gap-2 py-4 h-auto"
                >
                  <Activity size={32} />
                  <span className="text-lg font-bold">Gula</span>
                  <span className="text-sm opacity-80">Log</span>
                </Button>
              </Link>

              <Link href="/ai" className="block">
                <Button
                  variant="success"
                  size="lg"
                  className="w-full flex flex-col items-center gap-2 py-4 h-auto"
                >
                  <Sparkles size={32} />
                  <span className="text-lg font-bold">AI</span>
                  <span className="text-sm opacity-80">Nasihat</span>
                </Button>
              </Link>
            </Grid>
          </Section>

          {/* Sample Safe Foods Preview */}
          <Section
            title="Makanan Selamat"
            description="Pilihan makanan yang selamat untuk Mak"
            background="surface"
            border="all"
          >
            {safeFoods.length > 0 ? (
              <div className="space-y-3">
                {safeFoods.map((food) => (
                  <Link key={food.id} href={`/makanan#${food.id}`} className="block">
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                            <span className="text-2xl">🥗</span>
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="text-lg font-semibold text-primary truncate">
                              {food.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {food.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <Button variant="ghost" size="sm">
                              <ChevronRight className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                <Link href="/makanan?status=safe" className="block">
                  <Button variant="outline" size="lg" className="w-full mt-2">
                    Lihat Semua Makanan Selamat →
                  </Button>
                </Link>
              </div>
            ) : (
              <EmptyState
                icon={<UtensilsCrossed className="h-12 w-12" />}
                title="Tiada makanan"
                description="Senarai makanan sedang dikemas kini"
              />
            )}
          </Section>

          {/* Important Alert */}
          <Section>
            <InfoBanner
              variant="warning"
              title="Peringatan Penting"
              icon={<AlertTriangle className="h-6 w-6" />}
            >
              <p className="text-sm">
                Mak, elakkan makanan manis dan nasi putih hari ini.
                Pilih sayur hijau, buah-buahan, dan protein.
              </p>
            </InfoBanner>
          </Section>

          {/* Footer Quote */}
          <Section className="text-center py-4">
            <p className="text-base text-muted-foreground italic">
              &ldquo;Jaga kesihatan Mak, jaga kesihatan keluarga.&rdquo;
            </p>
          </Section>

        </div>
      </PageContainer>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="w-full px-2">
          <div className="grid grid-cols-4 gap-1 py-2">
            <Link href="/" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-primary text-white min-h-[56px]">
              <Heart size={24} />
              <span className="text-xs sm:text-sm font-semibold">Utama</span>
            </Link>
            <Link href="/makanan" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors min-h-[56px]">
              <UtensilsCrossed size={24} />
              <span className="text-xs sm:text-sm font-semibold">Makanan</span>
            </Link>
            <Link href="/ubat" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors min-h-[56px]">
              <Pill size={24} />
              <span className="text-xs sm:text-sm font-semibold">Ubat</span>
            </Link>
            <Link href="/ai" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors min-h-[56px]">
              <Sparkles size={24} />
              <span className="text-xs sm:text-sm font-semibold">AI</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}
