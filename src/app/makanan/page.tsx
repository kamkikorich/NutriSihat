// NutriSihat - Makanan (Food Guide) Page
// Professional redesign with KKM theme - Bahasa Malaysia

'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/ui/professional/Header'
import { PageContainer } from '@/components/ui/professional/PageContainer'
import { Section } from '@/components/ui/professional/Section'
import { InfoBanner } from '@/components/ui/professional/InfoBanner'
import { EmptyState } from '@/components/ui/professional/EmptyState'
import { Grid } from '@/components/ui/professional/Grid'
import { Card, CardContent } from '@/components/ui/card'
import {
  UtensilsCrossed,
  Pill,
  Sparkles,
  Home,
  Search,
  Leaf,
  Heart,
  Check,
  X,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react'
import { FOOD_STATUS, DASHBOARD, FOOD_TIPS, HEALTH_CONDITIONS } from '@/lib/constants'
import { FOODS, getFoodsByStatus, FOOD_STATS } from '@/data/foods'
import type { FoodItem, FoodStatus } from '@/types/food'

function MakananContent(): JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get('status') as FoodStatus | null

  const [selectedStatus, setSelectedStatus] = useState<FoodStatus | 'all'>(initialStatus || 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFoodId, setExpandedFoodId] = useState<string | null>(null)

  const filteredFoods = useMemo(() => {
    let foods = FOODS

    if (selectedStatus !== 'all') {
      foods = getFoodsByStatus(selectedStatus)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      foods = foods.filter(
        (food) =>
          food.name.toLowerCase().includes(query) ||
          food.name_english?.toLowerCase().includes(query) ||
          food.description.toLowerCase().includes(query)
      )
    }

    return foods
  }, [selectedStatus, searchQuery])

  const handleStatusChange = (status: FoodStatus | 'all') => {
    setSelectedStatus(status)
    if (status !== 'all') {
      router.push(`/makanan?status=${status}`)
    } else {
      router.push('/makanan')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      {/* Professional Header */}
      <Header
        title="Panduan Makanan"
        subtitle="Pilihan pemakanan sihat untuk Mak"
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

          {/* Health Conditions Info */}
          <Section background="surface" border="all">
            <div className="flex flex-wrap justify-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white shadow-sm border border-primary-100">
                <Leaf className="text-success h-6 w-6" />
                <span className="text-base font-semibold text-primary">
                  {HEALTH_CONDITIONS.diabetes.name}
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white shadow-sm border border-primary-100">
                <Heart className="text-accent h-6 w-6" />
                <span className="text-base font-semibold text-primary">
                  {HEALTH_CONDITIONS.uterus.name}
                </span>
              </div>
            </div>
          </Section>

          {/* Status Filter Buttons */}
          <Section
            title="Pilih Kategori"
            description="Kategori makanan mengikut status kesihatan"
          >
            <Grid columns="responsive" gap="md">
              <Button
                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                size="lg"
                onClick={() => handleStatusChange('all')}
                className="w-full text-base"
              >
                Semua ({FOOD_STATS.total})
              </Button>
              <Button
                variant={selectedStatus === 'safe' ? 'success' : 'outline'}
                size="lg"
                onClick={() => handleStatusChange('safe')}
                className="w-full flex items-center justify-center gap-2 text-base"
              >
                <Check className="h-5 w-5" />
                Boleh ({FOOD_STATS.safe})
              </Button>
              <Button
                variant={selectedStatus === 'limit' ? 'caution' : 'outline'}
                size="lg"
                onClick={() => handleStatusChange('limit')}
                className="w-full flex items-center justify-center gap-2 text-base"
              >
                <AlertTriangle className="h-5 w-5" />
                Kurang ({FOOD_STATS.limit})
              </Button>
              <Button
                variant={selectedStatus === 'avoid' ? 'destructive' : 'outline'}
                size="lg"
                onClick={() => handleStatusChange('avoid')}
                className="w-full flex items-center justify-center gap-2 text-base"
              >
                <X className="h-5 w-5" />
                Elak ({FOOD_STATS.avoid})
              </Button>
            </Grid>
          </Section>

          {/* Search Bar */}
          <Section>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Cari makanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[52px] pl-12 pr-4 text-base rounded-xl border-2 border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>
          </Section>

          {/* Health Tips */}
          {(selectedStatus === 'all' || selectedStatus === 'avoid') && (
            <Section>
              <InfoBanner
                variant="warning"
                title="Tips untuk Mak"
                icon={<AlertTriangle className="h-6 w-6" />}
              >
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-foreground">{FOOD_TIPS.diabetes.title}:</strong>
                    <ul className="mt-1 space-y-1 ml-4">
                      {FOOD_TIPS.diabetes.tips.slice(0, 2).map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-warning flex-shrink-0">•</span>
                          <span className="text-muted-foreground">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </InfoBanner>
            </Section>
          )}

          {/* Foods List */}
          <Section
            title={
              selectedStatus === 'all' ? 'Semua Makanan' :
              selectedStatus === 'safe' ? 'Makanan Selamat ✅' :
              selectedStatus === 'limit' ? 'Makanan Kurang ⚠️' :
              'Makanan Elak ❌'
            }
            description={`${filteredFoods.length} item`}
            background="surface"
            border="all"
          >
            {filteredFoods.length === 0 ? (
              <EmptyState
                icon={<Search className="h-12 w-12" />}
                title="Tiada makanan ditemui"
                description="Cuba kata kunci carian yang lain"
              />
            ) : (
              <div className="space-y-3">
                {filteredFoods.map((food) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    isExpanded={expandedFoodId === food.id}
                    onToggle={() => setExpandedFoodId(expandedFoodId === food.id ? null : food.id)}
                  />
                ))}
              </div>
            )}
          </Section>

        </div>
      </PageContainer>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="w-full px-2">
          <div className="grid grid-cols-4 gap-1 py-2">
            <Link href="/" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors min-h-[56px]">
              <Home size={24} />
              <span className="text-xs sm:text-sm font-semibold">Utama</span>
            </Link>
            <Link href="/makanan" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-primary text-white min-h-[56px]">
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

export default function MakananPage(): JSX.Element {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-primary-50 to-background" />}>
      <MakananContent />
    </Suspense>
  )
}

// Food Card Component
interface FoodCardProps {
  food: FoodItem
  isExpanded: boolean
  onToggle: () => void
}

function FoodCard({ food: f, isExpanded, onToggle }: FoodCardProps): JSX.Element {
  const statusEmoji = f.status === 'safe' ? '✅' : f.status === 'avoid' ? '❌' : '⚠️'
  const statusColor = f.status === 'safe' ? 'bg-success/10' : f.status === 'avoid' ? 'bg-error/10' : 'bg-warning/10'
  const statusBorder = f.status === 'safe' ? 'border-success/30' : f.status === 'avoid' ? 'border-error/30' : 'border-warning/30'

  return (
    <Card
      className={`transition-all cursor-pointer hover:shadow-md ${isExpanded ? 'ring-2 ring-primary' : ''}`}
      onClick={onToggle}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Status Indicator */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border-2 ${statusColor} ${statusBorder}`}>
            <span className="text-2xl">{statusEmoji}</span>
          </div>

          {/* Food Info */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-foreground truncate">
                {f.name}
              </h3>
              {f.is_local_malaysian && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-primary-10 text-primary flex-shrink-0">
                  🇲🇾
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {f.description}
            </p>

            {/* Glycemic Index */}
            {f.glycemic_index && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">GI:</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  f.glycemic_index < 55 ? 'bg-success/20 text-success' :
                  f.glycemic_index < 70 ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'
                }`}>
                  {f.glycemic_index}
                </span>
                <span className="text-xs text-muted-foreground">
                  {f.glycemic_index < 55 ? '(Rendah)' :
                   f.glycemic_index < 70 ? '(Sederhana)' : '(Tinggi)'}
                </span>
              </div>
            )}
          </div>

          {/* Expand Indicator */}
          <ChevronRight
            className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            size={20}
          />
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in">
            {/* Health Notes */}
            {f.health_notes.diabetes && (
              <div className="bg-warning/10 p-3 rounded-lg border border-warning/20">
                <div className="flex items-center gap-2 mb-1">
                  <Leaf size={16} className="text-warning" />
                  <span className="text-sm font-semibold text-foreground">Diabetes:</span>
                </div>
                <p className="text-sm text-muted-foreground">{f.health_notes.diabetes}</p>
              </div>
            )}

            {f.health_notes.uterus && (
              <div className="bg-accent/10 p-3 rounded-lg border border-accent/20">
                <div className="flex items-center gap-2 mb-1">
                  <Heart size={16} className="text-accent" />
                  <span className="text-sm font-semibold text-foreground">Rahim:</span>
                </div>
                <p className="text-sm text-muted-foreground">{f.health_notes.uterus}</p>
              </div>
            )}

            {/* Alternatives */}
            {f.alternatives && f.alternatives.length > 0 && (
              <div>
                <span className="text-sm font-semibold text-foreground">Alternatif:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {f.alternatives.map((alt, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-primary-50 text-primary rounded-full text-sm"
                    >
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {f.tips && f.tips.length > 0 && (
              <div>
                <span className="text-sm font-semibold text-foreground">Tips:</span>
                <ul className="mt-2 space-y-1">
                  {f.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-success flex-shrink-0">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
