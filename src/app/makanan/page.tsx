// NutriSihat - Makanan (Food Guide) Page
// Panduan Pemakanan - Safe and Avoid foods for Diabetes and Uterine health

'use client';

import { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardInteractive, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { FoodStatusBadge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icons';
import {
  Home,
  UtensilsCrossed,
  Pill,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Leaf,
  Heart,
  ArrowLeft,
  Activity,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import {
  FOOD_STATUS,
  DASHBOARD,
  BUTTONS,
  EMPTY_STATES,
  FOOD_TIPS,
  HEALTH_CONDITIONS,
} from '@/lib/constants';
import {
  FOODS,
  FOOD_CATEGORIES,
  getFoodsByStatus,
  FOOD_STATS,
} from '@/data/foods';
import type { FoodItem, FoodStatus } from '@/types/food';

function MakananContent(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') as FoodStatus | null;
  
  // State for filtering
  const [selectedStatus, setSelectedStatus] = useState<FoodStatus | 'all'>(initialStatus || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter foods based on status and search
  const filteredFoods = useMemo(() => {
    let foods = FOODS;
    
    // Filter by status
    if (selectedStatus !== 'all') {
      foods = getFoodsByStatus(selectedStatus);
    }
    
    // Filter by search query
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
  
  // Handle status change
  const handleStatusChange = (status: FoodStatus | 'all') => {
    setSelectedStatus(status);
    if (status !== 'all') {
      router.push(`/makanan?status=${status}`);
    } else {
      router.push('/makanan');
    }
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-primary-50 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary text-white shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft size={28} />
              <span className="text-lg font-semibold">Kembali</span>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <UtensilsCrossed size={28} />
              Panduan Makanan
            </h1>
            <div className="w-20" /> {/* Spacer for balance */}
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="container mx-auto px-6 py-8 space-y-8 animate-fade-in">
        {/* Health Conditions Info */}
        <section className="flex flex-wrap justify-center gap-4">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white shadow-md border-2 border-primary-100">
            <Leaf className="text-success" size={24} />
            <span className="text-lg font-semibold text-primary">
              {HEALTH_CONDITIONS.diabetes.name}
            </span>
          </div>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-white shadow-md border-2 border-primary-100">
            <Heart className="text-accent" size={24} />
            <span className="text-lg font-semibold text-primary">
              {HEALTH_CONDITIONS.uterus.name}
            </span>
          </div>
        </section>
        
        {/* Status Filter Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-primary">Pilih Kategori</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button
              variant={selectedStatus === 'all' ? 'default' : 'outline'}
              size="lg"
              onClick={() => handleStatusChange('all')}
              className="w-full"
            >
              Semua ({FOOD_STATS.total})
            </Button>
            <Button
              variant={selectedStatus === 'safe' ? 'success' : 'outline'}
              size="lg"
              onClick={() => handleStatusChange('safe')}
              className="w-full flex items-center gap-2"
            >
              <Check size={20} />
              Boleh ({FOOD_STATS.safe})
            </Button>
            <Button
              variant={selectedStatus === 'limit' ? 'caution' : 'outline'}
              size="lg"
              onClick={() => handleStatusChange('limit')}
              className="w-full flex items-center gap-2"
            >
              <AlertTriangle size={20} />
              Kurang ({FOOD_STATS.limit})
            </Button>
            <Button
              variant={selectedStatus === 'avoid' ? 'destructive' : 'outline'}
              size="lg"
              onClick={() => handleStatusChange('avoid')}
              className="w-full flex items-center gap-2"
            >
              <X size={20} />
              Elak ({FOOD_STATS.avoid})
            </Button>
          </div>
        </section>
        
        {/* Search Bar */}
        <section className="relative">
          <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-light" size={24} />
              <input
                type="text"
                placeholder="Cari makanan (contoh: Nasi Lemak, Teh Tarik)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full min-h-[56px] pl-14 pr-6 rounded-xl border-2 border-primary-100 bg-white text-lg text-primary placeholder:text-primary-light focus:border-primary focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>
        </section>
        
        {/* Health Tips */}
        {(selectedStatus === 'all' || selectedStatus === 'avoid') && (
          <section className="space-y-4">
            <Card className="p-6 bg-gradient-to-r from-warning/10 to-warning/5 border-2 border-warning">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl text-warning-dark flex items-center gap-2">
                  <AlertTriangle size={24} />
                  Tips untuk Mak
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-3">
                  <div className="text-lg">
                    <strong className="text-primary">{FOOD_TIPS.diabetes.title}:</strong>
                    <ul className="mt-2 space-y-1">
                      {FOOD_TIPS.diabetes.tips.slice(0, 3).map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-warning">•</span>
                          <span className="text-primary">{tip}</span>
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
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">
              {selectedStatus === 'all' ? 'Semua Makanan' : 
               selectedStatus === 'safe' ? 'Makanan Selamat ✅' :
               selectedStatus === 'limit' ? 'Makanan Boleh Kurang ⚠️' :
               'Makanan Perlu Elak ❌'}
            </h2>
            <span className="text-lg text-primary-light">
              {filteredFoods.length} makanan
            </span>
          </div>
          
          {filteredFoods.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-primary mb-2">
                {EMPTY_STATES.foods.title}
              </h3>
              <p className="text-lg text-primary-light">
                {EMPTY_STATES.foods.description}
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          )}
        </section>
      </div>
      
      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-50 bg-white border-t-2 border-primary-100 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 gap-2 py-3">
            <Link href="/" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-5 transition-colors">
              <Home size={28} />
              <span className="text-base font-semibold">Utama</span>
            </Link>
            <Link href="/makanan" className="flex flex-col items-center gap-1 py-2 rounded-xl bg-primary text-white">
              <UtensilsCrossed size={28} />
              <span className="text-base font-semibold">Makanan</span>
            </Link>
            <Link href="/ubat" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-5 transition-colors">
              <Pill size={28} />
              <span className="text-base font-semibold">Ubat</span>
            </Link>
            <Link href="/ai" className="flex flex-col items-center gap-1 py-2 rounded-xl text-primary hover:bg-primary-5 transition-colors">
              <Sparkles size={28} />
              <span className="text-base font-semibold">Tanya AI</span>
            </Link>
          </div>
        </div>
      </nav>
    </main>
  );
}

export default function MakananPage(): JSX.Element {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-primary-50 to-background" />}>
      <MakananContent />
    </Suspense>
  );
}

// Food Card Component
function FoodCard({ food: f }: { food: FoodItem }): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  
  const statusEmoji = f.status === 'safe' ? '✅' : f.status === 'avoid' ? '❌' : '⚠️';
  
  return (
    <CardInteractive 
      className="p-5"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-4">
        {/* Status Indicator */}
        <div className={`flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center ${
          f.status === 'safe' ? 'bg-green-50' : 
          f.status === 'avoid' ? 'bg-red-50' : 'bg-orange-50'
        }`}>
          <span className="text-3xl">{statusEmoji}</span>
        </div>
        
        {/* Food Info */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-primary truncate">{f.name}</h3>
            {f.is_local_malaysian && (
              <span className="text-sm bg-primary-10 text-primary-dark px-2 py-0.5 rounded-full">
                🇲🇾
              </span>
            )}
          </div>
          <p className="text-base text-primary-light line-clamp-2">{f.description}</p>
          
          {/* Glycemic Index */}
          {f.glycemic_index && (
            <div className="mt-2 flex items-center gap-2">
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
          size={24} 
        />
      </div>
      
      {/* Expanded Details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-primary-100 space-y-3 animate-fade-in">
          {/* Health Notes */}
          {f.health_notes.diabetes && (
            <div className="bg-warning/5 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Leaf size={20} className="text-warning" />
                <span className="font-semibold text-warning-dark">Untuk Diabetes:</span>
              </div>
              <p className="text-base text-primary">{f.health_notes.diabetes}</p>
            </div>
          )}
          
          {f.health_notes.uterus && (
            <div className="bg-accent/5 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Heart size={20} className="text-accent" />
                <span className="font-semibold text-accent-dark">Untuk Kesihatan Rahim:</span>
              </div>
              <p className="text-base text-primary">{f.health_notes.uterus}</p>
            </div>
          )}
          
          {/* Alternatives */}
          {f.alternatives && f.alternatives.length > 0 && (
            <div>
              <span className="font-semibold text-primary">Alternatif:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {f.alternatives.map((alt, i) => (
                  <span key={i} className="px-3 py-1 bg-primary-5 rounded-full text-base text-primary">
                    {alt}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Tips */}
          {f.tips && f.tips.length > 0 && (
            <div>
              <span className="font-semibold text-primary">Tips:</span>
              <ul className="mt-1 space-y-1">
                {f.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-base text-primary">
                    <span className="text-success">•</span>
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