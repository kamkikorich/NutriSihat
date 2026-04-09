// NutriSihat - Makanan (Food Guide) Page
// Mobile-first - Panduan Pemakanan for elderly users

'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardInteractive, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FoodStatusBadge } from '@/components/ui/badge';
import {
  Home,
  UtensilsCrossed,
  Pill,
  Sparkles,
  ChevronRight,
  Search,
  Leaf,
  Heart,
  ArrowLeft,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { FOOD_STATUS, DASHBOARD, BUTTONS, EMPTY_STATES, FOOD_TIPS, HEALTH_CONDITIONS } from '@/lib/constants';
import { FOODS, getFoodsByStatus, FOOD_STATS } from '@/data/foods';
import type { FoodItem, FoodStatus } from '@/types/food';

function MakananContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') as FoodStatus | null;
  
  const [selectedStatus, setSelectedStatus] = useState<FoodStatus | 'all'>(initialStatus || 'all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFoods = useMemo(() => {
    let foods = FOODS;
    
    if (selectedStatus !== 'all') {
      foods = getFoodsByStatus(selectedStatus);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      foods = foods.filter(
        (food) =>
          food.name.toLowerCase().includes(query) ||
          food.name_english?.toLowerCase().includes(query) ||
          food.description.toLowerCase().includes(query)
      );
    }
    
    return foods;
  }, [selectedStatus, searchQuery]);
  
  const handleStatusChange = (status: FoodStatus | 'all') => {
    setSelectedStatus(status);
    if (status !== 'all') {
      router.push(`/makanan?status=${status}`);
    } else {
      router.push('/makanan');
    }
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-background main-content">
      {/* Header - Mobile-first */}
      <header className="page-header">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 touch-target">
              <ArrowLeft size={24} />
              <span className="text-base font-semibold hidden sm:inline">Kembali</span>
            </Link>
            <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
              <UtensilsCrossed size={24} />
              <span className="hidden sm:inline">Panduan Makanan</span>
              <span className="sm:hidden">Makanan</span>
            </h1>
            <div className="w-10" />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="w-full px-4 py-4 space-y-4 sm:px-6 sm:py-6 sm:space-y-6 animate-fade-in">
        {/* Health Conditions Info */}
        <section className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-white shadow-md border-2 border-primary-100">
            <Leaf className="text-success flex-shrink-0" size={20} />
            <span className="text-sm sm:text-lg font-semibold text-primary">
              {HEALTH_CONDITIONS.diabetes.name}
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-2 sm:px-6 sm:py-3 rounded-xl bg-white shadow-md border-2 border-primary-100">
            <Heart className="text-accent flex-shrink-0" size={20} />
            <span className="text-sm sm:text-lg font-semibold text-primary">
              {HEALTH_CONDITIONS.uterus.name}
            </span>
          </div>
        </section>
        
        {/* Status Filter Buttons - Mobile-first grid */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-2xl font-bold text-primary px-1">Pilih Kategori</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              size="lg"
              onClick={() => handleStatusChange('all')}
              className="w-full text-base sm:text-lg"
            >
              Semua ({FOOD_STATS.total})
            </Button>
            <Button
              variant={selectedStatus === 'safe' ? 'success' : 'outline'}
              size="lg"
              onClick={() => handleStatusChange('safe')}
              className="w-full flex items-center justify-center gap-1 sm:gap-2 text-base sm:text-lg"
            >
              <Check size={18} />
              Boleh ({FOOD_STATS.safe})
            </Button>
            <Button
              variant={selectedStatus === 'limit' ? 'caution' : 'outline'}
              size="lg"
              onClick={() => handleStatusChange('limit')}
              className="w-full flex items-center justify-center gap-1 sm:gap-2 text-base sm:text-lg"
            >
              <AlertTriangle size={18} />
              Kurang ({FOOD_STATS.limit})
            </Button>
            <Button
              variant={selectedStatus === 'avoid' ? 'destructive' : 'outline'}
              size="lg"
              onClick={() => handleStatusChange('avoid')}
              className="w-full flex items-center justify-center gap-1 sm:gap-2 text-base sm:text-lg"
            >
              <X size={18} />
              Elak ({FOOD_STATS.avoid})
            </Button>
          </div>
        </section>
        
        {/* Search Bar - Mobile-first */}
        <section className="relative">
          <div className="flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-light flex-shrink-0" size={20} />
              <input
                type="text"
                placeholder="Cari makanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[52px] sm:min-h-[56px] pl-12 pr-4 text-base sm:text-lg rounded-xl border-2 border-primary-100 bg-white text-primary placeholder:text-primary-light focus:border-primary focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
        </section>
        
        {/* Health Tips */}
        {(selectedStatus === 'all' || selectedStatus === 'avoid') && (
          <section className="space-y-3">
            <Card className="p-4 sm:p-6 bg-gradient-to-r from-warning/10 to-warning/5 border-2 border-warning">
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-base sm:text-xl text-warning-dark flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Tips untuk Mak
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  <div className="text-base">
                    <strong className="text-primary">{FOOD_TIPS.diabetes.title}:</strong>
                    <ul className="mt-1 space-y-1">
                      {FOOD_TIPS.diabetes.tips.slice(0, 2).map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-warning flex-shrink-0">•</span>
                          <span className="text-primary text-sm sm:text-base">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
        
        {/* Foods List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg sm:text-2xl font-bold text-primary">
              {selectedStatus === 'all' ? 'Semua Makanan' : 
               selectedStatus === 'safe' ? 'Makanan Selamat ✅' :
               selectedStatus === 'limit' ? 'Makanan Kurang ⚠️' :
               'Makanan Elak ❌'}
            </h2>
            <span className="text-sm sm:text-base text-primary-light">
              {filteredFoods.length} item
            </span>
          </div>
          
          {filteredFoods.length === 0 ? (
            <Card className="p-6 sm:p-8 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">
                {EMPTY_STATES.foods.title}
              </h3>
              <p className="text-base sm:text-lg text-primary-light">
                {EMPTY_STATES.foods.description}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </section>
      </div>
      
      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="w-full px-2 sm:px-4">
          <div className="grid grid-cols-4 gap-1 py-2">
            <Link href="/" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-primary hover:bg-primary/10 transition-colors min-h-[56px]">
              <Home size={24} />
              <span className="text-sm sm:text-base font-semibold">Utama</span>
            </Link>
            <Link href="/makanan" className="flex flex-col items-center justify-center gap-1 py-2 rounded-xl bg-primary text-white min-h-[56px]">
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

export default function MakananPage(): JSX.Element {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-primary-50 to-background main-content" />}>
      <MakananContent />
    </Suspense>
  );
}

// Food Card Component - Mobile-first
function FoodCard({ food: f }: { food: FoodItem }): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  
  const statusEmoji = f.status === 'safe' ? '✅' : f.status === 'avoid' ? '❌' : '⚠️';
  const statusColor = f.status === 'safe' ? 'bg-green-50' : f.status === 'avoid' ? 'bg-red-50' : 'bg-orange-50';
  
  return (
    <CardInteractive 
      className="p-3 sm:p-4"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Status Indicator */}
        <div className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center ${statusColor}`}>
          <span className="text-2xl sm:text-3xl">{statusEmoji}</span>
        </div>
        
        {/* Food Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-1 sm:gap-2 mb-1">
            <h3 className="text-base sm:text-lg font-bold text-primary truncate">{f.name}</h3>
            {f.is_local_malaysian && (
              <span className="text-xs sm:text-sm bg-primary-10 text-primary-dark px-1.5 py-0.5 rounded-full flex-shrink-0">
                🇲🇾
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base text-primary-light line-clamp-2">{f.description}</p>
          
          {/* Glycemic Index */}
          {f.glycemic_index && (
            <div className="mt-1 flex items-center gap-1 sm:gap-2">
              <span className="text-sm font-semibold text-primary">GI:</span>
              <span className={`text-sm font-bold ${
                f.glycemic_index < 55 ? 'text-green-600' :
                f.glycemic_index < 70 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {f.glycemic_index}
              </span>
              <span className="text-xs text-primary-light">
                {f.glycemic_index < 55 ? '(Rendah)' :
                 f.glycemic_index < 70 ? '(Medium)' : '(Tinggi)'}
              </span>
            </div>
          )}
        </div>
        
        {/* Expand Indicator */}
        <ChevronRight 
          className={`flex-shrink-0 transition-transform ${expanded ? 'rotate-90' : ''}`} 
          size={20} 
        />
      </div>
      
      {/* Expanded Details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-primary-100 space-y-2 animate-fade-in">
          {/* Health Notes */}
          {f.health_notes.diabetes && (
            <div className="bg-warning/5 p-2 sm:p-3 rounded-lg">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <Leaf size={16} className="text-warning flex-shrink-0" />
                <span className="text-sm sm:text-base font-semibold text-warning-dark">Diabetes:</span>
              </div>
              <p className="text-sm sm:text-base text-primary">{f.health_notes.diabetes}</p>
            </div>
          )}
          
          {f.health_notes.uterus && (
            <div className="bg-accent/5 p-2 sm:p-3 rounded-lg">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <Heart size={16} className="text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base font-semibold text-accent-dark">Rahim:</span>
              </div>
              <p className="text-sm sm:text-base text-primary">{f.health_notes.uterus}</p>
            </div>
          )}
          
          {/* Alternatives */}
          {f.alternatives && f.alternatives.length > 0 && (
            <div>
              <span className="text-sm sm:text-base font-semibold text-primary">Alternatif:</span>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-1">
                {f.alternatives.map((alt, i) => (
                  <span key={i} className="px-2 py-1 bg-primary-5 rounded-full text-sm sm:text-base text-primary">
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Tips */}
          {f.tips && f.tips.length > 0 && (
            <div>
              <span className="text-sm sm:text-base font-semibold text-primary">Tips:</span>
              <ul className="mt-1 space-y-1">
                {f.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-primary">
                    <span className="text-success flex-shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </CardInteractive>
  );
}