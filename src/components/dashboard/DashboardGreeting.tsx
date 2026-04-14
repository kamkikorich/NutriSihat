// NutriSihat - Dashboard Stats Client Component
// Sarapan dinamik berdasarkan waktu (client-side)

'use client';

import { useEffect, useState } from 'react';
import { getGreetingBM, getCurrentMealBM } from '@/lib/utils';

interface DashboardGreetingProps {
  displayName: string;
}

export function DashboardGreeting({ displayName }: DashboardGreetingProps) {
  const [greeting, setGreeting] = useState('Selamat Datang');
  const [meal, setMeal] = useState('');

  useEffect(() => {
    setGreeting(getGreetingBM());
    setMeal(getCurrentMealBM());
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary">
        {greeting}, {displayName}! 👋
      </h2>
      {meal && (
        <p className="text-base sm:text-lg text-muted-foreground mt-1">
          Masa {meal} — Pilih makanan yang sihat untuk Mak!
        </p>
      )}
    </div>
  );
}
