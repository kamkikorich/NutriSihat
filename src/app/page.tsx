// NutriSihat - Main Dashboard Page
// Professional redesign with KKM theme - Bahasa Malaysia

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/professional/Header'
import { PageContainer } from '@/components/ui/professional/PageContainer'
import { Section } from '@/components/ui/professional/Section'
import { StatCard } from '@/components/ui/professional/StatCard'
import { InfoBanner } from '@/components/ui/professional/InfoBanner'
import { EmptyState } from '@/components/ui/professional/EmptyState'
import { Grid } from '@/components/ui/professional/Grid'
import { Card, CardContent } from '@/components/ui/card'
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
  AlertTriangle
} from 'lucide-react'
import { GREETINGS, DASHBOARD, HEALTH_CONDITIONS, APP_NAME } from '@/lib/constants'
import { getGreetingBM, getCurrentMealBM } from '@/lib/utils'
import { FOOD_STATS, getFoodsByStatus } from '@/data/foods'

export default function HomePage(): JSX.Element {
  const greeting = getGreetingBM()
  const currentMeal = getCurrentMealBM()
  const safeFoods = getFoodsByStatus('safe').slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      {/* Professional Header */}
      <Header
        title={APP_NAME}
        subtitle="Panduan Kesihatan Mak"
        showBack={false}
        actions={
          <div className="flex items-center gap-2 text-sm opacity-90">
            <Heart className="h-5 w-5" />
          </div>
        }
      />

      <PageContainer padding="md" maxWidth="wide">
        <div className="space-y-6 py-6">

          {/* Welcome Section */}
          <Section className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="text-success h-8 w-8" />
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                {greeting}, Mak! 👋
              </h2>
            </div>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              {GREETINGS.how_are_you} Berikut adalah panduan kesihatan untuk hari ini.
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

          {/* Quick Stats - Using StatCard */}
          <Grid columns="responsive" gap="md">
            <Link href="/makanan?status=safe" className="block">
              <StatCard
                title="Makanan Selamat"
                value={FOOD_STATS.safe}
                icon={<CheckCircle2 className="h-5 w-5" />}
                color="success"
                className="cursor-pointer hover:shadow-lg transition-shadow"
              />
            </Link>
            <Link href="/makanan?status=avoid" className="block">
              <StatCard
                title="Makanan Elak"
                value={FOOD_STATS.avoid}
                icon={<AlertTriangle className="h-5 w-5" />}
                color="warning"
                className="cursor-pointer hover:shadow-lg transition-shadow"
              />
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

          {/* Current Meal Recommendation */}
          <Section background="primary" padding="lg">
            <Card className="bg-gradient-to-r from-primary to-primary-light text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0">
                      <UtensilsCrossed size={32} className="text-accent" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-bold">Waktu {currentMeal}</h3>
                      <p className="text-sm opacity-90">
                        Pilih makanan selamat untuk Mak
                      </p>
                    </div>
                  </div>
                  <Link href="/makanan" className="w-full sm:w-auto">
                    <Button variant="accent" size="lg" className="w-full flex items-center justify-center gap-2">
                      Lihat Makanan
                      <ChevronRight size={20} />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
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
              </div>
            ) : (
              <EmptyState
                icon={<UtensilsCrossed className="h-12 w-12" />}
                title="Tiada makanan"
                description="Senarai makanan sedang dikemas kini"
              />
            )}
          </Section>

          {/* Important Alert - Using InfoBanner */}
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

      {/* Bottom Navigation - Mobile-first fixed */}
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
