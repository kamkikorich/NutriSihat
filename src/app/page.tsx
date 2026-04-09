// NutriSihat - Main Dashboard Page
// Mobile-first design for elderly users - Bahasa Malaysia

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardInteractive, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FoodStatusBadge } from '@/components/ui/badge';
import { 
  Home, 
  UtensilsCrossed, 
  Pill, 
  Sparkles, 
  Activity,
  ChevronRight,
  Heart,
  ShieldCheck,
  Leaf,
  Droplet
} from 'lucide-react';
import { GREETINGS, DASHBOARD, FOOD_STATUS, APP_NAME, HEALTH_CONDITIONS } from '@/lib/constants';
import { getGreetingBM, getCurrentMealBM } from '@/lib/utils';
import { FOOD_STATS, getFoodsByStatus } from '@/data/foods';

export default function HomePage(): JSX.Element {
  const greeting = getGreetingBM();
  const currentMeal = getCurrentMealBM();
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-background main-content">
      {/* Header - Mobile-first sticky */}
      <header className="page-header">
        <div className="w-full px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Heart className="text-accent flex-shrink-0" size={28} />
              <h1 className="text-lg sm:text-2xl font-bold truncate">{APP_NAME}</h1>
            </div>
            <p className="text-sm sm:text-lg hidden sm:block truncate">Panduan Kesihatan Mak</p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="w-full px-4 py-6 space-y-6 animate-fade-in sm:px-6 sm:py-8 sm:space-y-8">
        {/* Welcome Section */}
        <section className="text-center py-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck className="text-success flex-shrink-0" size={32} />
            <h2 className="text-xl sm:text-3xl font-bold text-primary">
              {greeting}, Mak! 👋
            </h2>
          </div>
          <p className="text-base sm:text-xl text-primary-light max-w-2xl mx-auto px-2">
            {GREETINGS.how_are_you} Berikut adalah panduan kesihatan untuk hari ini.
          </p>
        </section>
        
        {/* Health Conditions Info */}
        <section className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white shadow-md border-2 border-primary-100">
            <Droplet className="text-warning flex-shrink-0" size={24} />
            <span className="text-base sm:text-lg font-semibold text-primary">
              {HEALTH_CONDITIONS.diabetes.name}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-xl bg-white shadow-md border-2 border-primary-100">
            <Leaf className="text-success flex-shrink-0" size={24} />
            <span className="text-base sm:text-lg font-semibold text-primary">
              {HEALTH_CONDITIONS.uterus.name}
            </span>
          </div>
        </section>
        
        {/* Quick Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Link href="/makanan?status=safe" className="block">
            <CardInteractive className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl">✅</span>
                </div>
                <div className="flex-grow min-w-0">
                  <CardTitle className="text-base sm:text-xl mb-1">
                    {DASHBOARD.cards.safe_foods.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    {FOOD_STATS.safe} makanan selamat
                  </CardDescription>
                </div>
                <ChevronRight className="text-success flex-shrink-0" size={28} />
              </div>
            </CardInteractive>
          </Link>
          
          <Link href="/makanan?status=avoid" className="block">
            <CardInteractive className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-warning/20 flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl">❌</span>
                </div>
                <div className="flex-grow min-w-0">
                  <CardTitle className="text-base sm:text-xl mb-1 text-warning-dark">
                    {DASHBOARD.cards.avoid_foods.title}
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    {FOOD_STATS.avoid} makanan elak
                  </CardDescription>
                </div>
                <ChevronRight className="text-warning flex-shrink-0" size={28} />
              </div>
            </CardInteractive>
          </Link>
        </section>
        
        {/* Main Action Buttons - Mobile-first grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 py-4 sm:py-6">
          <Link href="/makanan" className="block">
            <Button 
              variant="default" 
              size="lg"
              className="w-full flex flex-col items-center gap-2 py-4 sm:py-6"
            >
              <UtensilsCrossed size={32} className="sm:w-10 sm:h-10" />
              <span className="text-base sm:text-xl font-bold">Makanan</span>
              <span className="text-sm sm:text-base opacity-80 hidden sm:block">Panduan</span>
            </Button>
          </Link>
          
          <Link href="/ubat" className="block">
            <Button 
              variant="accent" 
              size="lg"
              className="w-full flex flex-col items-center gap-2 py-4 sm:py-6"
            >
              <Pill size={32} className="sm:w-10 sm:h-10" />
              <span className="text-base sm:text-xl font-bold">Ubat</span>
              <span className="text-sm sm:text-base opacity-80 hidden sm:block">Peringatan</span>
            </Button>
          </Link>
          
          <Link href="/gula-darah" className="block">
            <Button 
              variant="secondary" 
              size="lg"
              className="w-full flex flex-col items-center gap-2 py-4 sm:py-6"
            >
              <Activity size={32} className="sm:w-10 sm:h-10" />
              <span className="text-base sm:text-xl font-bold">Gula</span>
              <span className="text-sm sm:text-base opacity-80 hidden sm:block">Log</span>
            </Button>
          </Link>
          
          <Link href="/ai" className="block">
            <Button 
              variant="success" 
              size="lg"
              className="w-full flex flex-col items-center gap-2 py-4 sm:py-6"
            >
              <Sparkles size={32} className="sm:w-10 sm:h-10" />
              <span className="text-base sm:text-xl font-bold">AI</span>
              <span className="text-sm sm:text-base opacity-80 hidden sm:block">Nasihat</span>
            </Button>
          </Link>
        </section>
        
        {/* Current Meal Recommendation */}
        <section className="py-4">
          <Card className="p-4 sm:p-6 bg-gradient-to-r from-primary to-primary-light text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-accent/30 flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed size={28} className="text-accent" />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg sm:text-xl font-bold">Waktu {currentMeal}</h3>
                  <p className="text-sm sm:text-base opacity-90">
                    Pilih makanan selamat untuk Mak
                  </p>
                </div>
              </div>
              <Link href="/makanan" className="w-full sm:w-auto">
                <Button variant="accent" size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
                  Lihat Makanan
                  <ChevronRight size={20} />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
        
        {/* Sample Safe Foods Preview */}
        <section className="py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
            <h2 className="text-lg sm:text-2xl font-bold text-primary">
              Makanan Selamat
            </h2>
            <Link href="/makanan?status=safe">
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-sm">
                Semua
                <ChevronRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {getFoodsByStatus('safe').slice(0, 3).map((food) => (
              <CardInteractive key={food.id} className="p-3 sm:p-4 overflow-hidden">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">🥗</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-primary truncate">{food.name}</h3>
                    <p className="text-sm text-primary-light line-clamp-1">{food.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <FoodStatusBadge status="safe" size="sm" showEmoji={false} />
                  </div>
                </div>
              </CardInteractive>
            ))}
          </div>
        </section>
        
        {/* Important Alert */}
        <section className="py-4">
          <Card className="p-4 sm:p-6 border-2 border-warning bg-warning/5">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <span className="text-2xl sm:text-3xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-bold text-warning-dark mb-2">
                  Peringatan Penting
                </h3>
                <p className="text-base sm:text-lg text-primary">
                  Mak, elakkan makanan manis dan nasi putih hari ini. 
                  Pilih sayur hijau, buah-buahan, dan protein.
                </p>
              </div>
            </div>
          </Card>
        </section>
        
        {/* Footer Quote */}
        <section className="text-center py-4 sm:py-8">
          <p className="text-base sm:text-xl text-primary-light italic px-4">
            {`"Jaga kesihatan Mak, jaga kesihatan keluarga."`}
          </p>
        </section>
      </div>
      
      {/* Bottom Navigation - Mobile-first fixed */}
      <nav className="bottom-nav">
        <div className="w-full px-2 sm:px-4">
          <div className="grid grid-cols-4 gap-1 py-2">
            <Link href="/" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-primary text-white min-h-[56px]">
              <Home size={24} />
              <span className="text-sm sm:text-base font-semibold">Utama</span>
            </Link>
            <Link href="/makanan" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors min-h-[56px]">
              <UtensilsCrossed size={24} />
              <span className="text-sm sm:text-base font-semibold">Makanan</span>
            </Link>
            <Link href="/ubat" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors min-h-[56px]">
              <Pill size={24} />
              <span className="text-sm sm:text-base font-semibold">Ubat</span>
            </Link>
            <Link href="/ai" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors min-h-[56px]">
              <Sparkles size={24} />
              <span className="text-sm sm:text-base font-semibold">AI</span>
            </Link>
          </div>
        </div>
      </nav>
    </main>
  );
}