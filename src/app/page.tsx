// NutriSihat - Main Dashboard Page
// First screen for elderly user - simple, large buttons, Bahasa Malaysia

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardInteractive, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FoodStatusBadge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icons';
import { 
  Home, 
  UtensilsCrossed, 
  Pill, 
  MessageCircle, 
  Activity,
  ChevronRight,
  Heart,
  ShieldCheck,
  Sparkles,
  Leaf,
  Droplet
} from 'lucide-react';
import { 
  GREETINGS, 
  DASHBOARD, 
  FOOD_STATUS,
  APP_NAME,
  NAV_ITEMS,
  HEALTH_CONDITIONS 
} from '@/lib/constants';
import { getGreetingBM, getCurrentMealBM } from '@/lib/utils';
import { FOOD_STATS, getFoodsByStatus } from '@/data/foods';

export default function HomePage(): JSX.Element {
  const greeting = getGreetingBM(); // Get greeting based on time
  const currentMeal = getCurrentMealBM(); // Get current meal time
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="text-accent" size={32} />
              <h1 className="text-2xl font-bold">{APP_NAME}</h1>
            </div>
            <p className="text-lg hidden sm:block">Panduan Kesihatan Mak</p>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <section className="text-center py-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShieldCheck className="text-success" size={40} />
            <h2 className="text-3xl font-bold text-primary">
              {greeting}, Mak! 👋
            </h2>
          </div>
          <p className="text-xl text-primary-light max-w-2xl mx-auto">
            {GREETINGS.how_are_you} Berikut adalah panduan kesihatan untuk hari ini.
          </p>
        </section>
        
        {/* Health Conditions Info */}
        <section className="flex flex-wrap justify-center gap-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white shadow-md border-2 border-primary-100">
            <Droplet className="text-warning" size={28} />
            <span className="text-lg font-semibold text-primary">
              {HEALTH_CONDITIONS.diabetes.name}
            </span>
          </div>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white shadow-md border-2 border-primary-100">
            <Leaf className="text-success" size={28} />
            <span className="text-lg font-semibold text-primary">
              {HEALTH_CONDITIONS.uterus.name}
            </span>
          </div>
        </section>
        
        {/* Quick Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Safe Foods Card */}
          <Link href="/makanan?status=safe" className="block">
            <CardInteractive className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
                <div className="flex-grow">
                  <CardTitle className="text-xl mb-1">
                    {DASHBOARD.cards.safe_foods.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {FOOD_STATS.safe} makanan selamat untuk Mak
                  </CardDescription>
                </div>
                <ChevronRight className="text-success" size={32} />
              </div>
            </CardInteractive>
          </Link>
          
          {/* Avoid Foods Card */}
          <Link href="/makanan?status=avoid" className="block">
            <CardInteractive className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center">
                  <span className="text-3xl">❌</span>
                </div>
                <div className="flex-grow">
                  <CardTitle className="text-xl mb-1 text-warning-dark">
                    {DASHBOARD.cards.avoid_foods.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {FOOD_STATS.avoid} makanan perlu elak
                  </CardDescription>
                </div>
                <ChevronRight className="text-warning" size={32} />
              </div>
            </CardInteractive>
          </Link>
        </section>
        
        {/* Main Action Buttons - Large and Clear */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
          {/* Makanan Button */}
          <Link href="/makanan" className="block">
            <Button 
              variant="default" 
              size="xl"
              className="w-full flex flex-col items-center gap-3 py-6"
            >
              <UtensilsCrossed size={40} />
              <span className="text-xl font-bold">Panduan Makanan</span>
              <span className="text-base opacity-80">Lihat senarai makanan</span>
            </Button>
          </Link>
          
          {/* Ubat Button */}
          <Link href="/ubat" className="block">
            <Button 
              variant="accent" 
              size="xl"
              className="w-full flex flex-col items-center gap-3 py-6"
            >
              <Pill size={40} />
              <span className="text-xl font-bold">Ubat</span>
              <span className="text-base opacity-80">Peringatan ubat</span>
            </Button>
          </Link>
          
          {/* Gula Darah Button */}
          <Link href="/gula-darah" className="block">
            <Button 
              variant="secondary" 
              size="xl"
              className="w-full flex flex-col items-center gap-3 py-6"
            >
              <Activity size={40} />
              <span className="text-xl font-bold">Gula Darah</span>
              <span className="text-base opacity-80">Log harian</span>
            </Button>
          </Link>
          
          {/* AI Button */}
          <Link href="/ai" className="block">
            <Button 
              variant="success" 
              size="xl"
              className="w-full flex flex-col items-center gap-3 py-6"
            >
              <Sparkles size={40} />
              <span className="text-xl font-bold">Tanya AI</span>
              <span className="text-base opacity-80">Nasihat kesihatan</span>
            </Button>
          </Link>
        </section>
        
        {/* Current Meal Recommendation */}
        <section className="py-6">
          <Card className="p-6 bg-gradient-to-r from-primary to-primary-light text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-accent/30 flex items-center justify-center">
                  <UtensilsCrossed size={32} className="text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Waktu {currentMeal}</h3>
                  <p className="text-base opacity-90">
                    Pilih makanan yang selamat untuk kesihatan Mak
                  </p>
                </div>
              </div>
              <Link href="/makanan">
                <Button variant="accent" size="lg" className="flex items-center gap-2">
                  Lihat Makanan
                  <ChevronRight size={24} />
                </Button>
              </Link>
            </div>
          </Card>
        </section>
        
        {/* Sample Safe Foods Preview */}
        <section className="py-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary">
              Makanan Selamat Hari Ini
            </h2>
            <Link href="/makanan?status=safe">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                Lihat Semua
                <ChevronRight size={20} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {getFoodsByStatus('safe').slice(0, 6).map((food) => (
              <CardInteractive key={food.id} className="p-4 overflow-hidden">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                    <span className="text-2xl">🥬</span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="text-lg font-semibold text-primary truncate">{food.name}</h3>
                    <p className="text-sm text-primary-light line-clamp-2">{food.description}</p>
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
        <section className="py-6">
          <Card className="p-6 border-2 border-warning bg-warning/5">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <span className="text-3xl">⚠️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-warning-dark mb-2">
                  Peringatan Penting
                </h3>
                <p className="text-lg text-primary">
                  Mak, elakkan makanan manis dan nasi putih hari ini. 
                  Pilih sayur hijau, buah-buahan, dan protein untuk kesihatan yang lebih baik.
                </p>
              </div>
            </div>
          </Card>
        </section>
        
        {/* Footer Quote */}
        <section className="text-center py-8">
          <p className="text-xl text-primary-light italic">
            &ldquo;Jaga kesihatan Mak, jaga kesihatan keluarga.&rdquo;
          </p>
        </section>
      </div>
      
      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 bg-white border-t-2 border-primary-100 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <Link href="/" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-primary text-white">
              <Home size={28} />
              <span className="text-base font-semibold">Utama</span>
            </Link>
            <Link href="/makanan" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-10 transition-colors">
              <UtensilsCrossed size={28} />
              <span className="text-base font-semibold">Makanan</span>
            </Link>
            <Link href="/ubat" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-10 transition-colors">
              <Pill size={28} />
              <span className="text-base font-semibold">Ubat</span>
            </Link>
            <Link href="/ai" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-10 transition-colors">
              <Sparkles size={28} />
              <span className="text-base font-semibold">Tanya AI</span>
            </Link>
          </div>
        </div>
      </nav>
    </main>
  );
}