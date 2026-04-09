// Daily Nutrition Tip Utilities for NutriSihat
// Rotating tip engine with category support

// ============================================
// TYPES
// ============================================

export type TipCategory = 'general' | 'diabetes' | 'hypertension' | 'heart' | 'kidney';

export interface NutritionTip {
  id: string;
  tipText: string;
  title?: string;
  tipCategory: TipCategory;
  createdAt: string;
}

export interface DailyTipResult {
  tip: NutritionTip;
  dayOfYear: number;
  date: Date;
}

// ============================================
// TIP ROTATION ENGINE
// ============================================

/**
 * Get the day of year (1-365/366)
 */
export function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

/**
 * Get the tip index for a specific date
 * Rotates through available tips daily
 */
export function getTipIndex(tipCount: number, date: Date = new Date()): number {
  if (tipCount === 0) return -1;
  const dayOfYear = getDayOfYear(date);
  return dayOfYear % tipCount;
}

/**
 * Get the daily tip from a list of tips
 */
export function getDailyTip(
  tips: NutritionTip[],
  date: Date = new Date()
): DailyTipResult | null {
  if (tips.length === 0) {
    return null;
  }

  const index = getTipIndex(tips.length, date);
  const tip = tips[index];

  return {
    tip,
    dayOfYear: getDayOfYear(date),
    date,
  };
}

/**
 * Get daily tip for a specific category
 */
export function getDailyTipByCategory(
  tips: NutritionTip[],
  category: TipCategory,
  date: Date = new Date()
): NutritionTip | null {
  const categoryTips = tips.filter((t) => t.tipCategory === category);

  if (categoryTips.length === 0) {
    return null;
  }

  const index = getTipIndex(categoryTips.length, date);
  return categoryTips[index];
}

/**
 * Get tips for the next N days (for planning/preloading)
 */
export function getTipsForNextDays(
  tips: NutritionTip[],
  days: number
): Array<{ date: Date; tip: NutritionTip }> {
  const result: Array<{ date: Date; tip: NutritionTip }> = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const tipResult = getDailyTip(tips, date);
    if (tipResult) {
      result.push({ date, tip: tipResult.tip });
    }
  }

  return result;
}

// ============================================
// CATEGORY UTILITIES
// ============================================

export const TIP_CATEGORY_LABELS: Record<TipCategory, { en: string; bm: string; icon: string }> = {
  general: { en: 'General Health', bm: 'Kesihatan Umum', icon: '💪' },
  diabetes: { en: 'Diabetes', bm: 'Kencing Manis', icon: '🩸' },
  hypertension: { en: 'Hypertension', bm: 'Darah Tinggi', icon: '❤️' },
  heart: { en: 'Heart Health', bm: 'Jantung', icon: '💓' },
  kidney: { en: 'Kidney Health', bm: 'Buah Pinggang', icon: '🫘' },
};

/**
 * Get category label in preferred language
 */
export function getCategoryLabel(
  category: TipCategory,
  lang: 'en' | 'bm' = 'bm'
): string {
  const labels = TIP_CATEGORY_LABELS[category];
  return lang === 'bm' ? labels.bm : labels.en;
}

// ============================================
// FALLBACK TIPS (when API fails)
// ============================================

export const FALLBACK_TIPS: NutritionTip[] = [
  {
    id: 'fallback-1',
    tipText: 'Minum air sekurang-kurangnya 8 gelas sehari untuk kesihatan buah pinggang.',
    tipCategory: 'general',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fallback-2',
    tipText: 'Jangan skip sarapan. Sarapan memberi tenaga untuk memulakan hari.',
    tipCategory: 'general',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fallback-3',
    tipText: 'Kurangkan nasi putih. Gantikan dengan nasi perang atau oats.',
    tipCategory: 'diabetes',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fallback-4',
    tipText: 'Kurangkan garam dalam masakan. Gunakan herba dan rempah untuk perisa.',
    tipCategory: 'hypertension',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fallback-5',
    tipText: 'Senaman ringan 30 minit sehari membantu kesihatan jantung.',
    tipCategory: 'general',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fallback-6',
    tipText: 'Periksa gula darah sebelum dan 2 jam selepas makan untuk ketahui kesan makanan.',
    tipCategory: 'diabetes',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fallback-7',
    tipText: 'Makan ikan 2-3 kali seminggu untuk omega-3 yang baik untuk jantung.',
    tipCategory: 'heart',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Get daily tip with fallback
 */
export function getDailyTipWithFallback(
  tips: NutritionTip[] | null | undefined,
  date: Date = new Date()
): DailyTipResult {
  const tipsToUse = tips && tips.length > 0 ? tips : FALLBACK_TIPS;
  const result = getDailyTip(tipsToUse, date);

  if (!result) {
    // This should never happen with FALLBACK_TIPS
    return {
      tip: FALLBACK_TIPS[0],
      dayOfYear: getDayOfYear(date),
      date,
    };
  }

  return result;
}

// ============================================
// TIME-BASED TIP SUGGESTIONS
// ============================================

/**
 * Get context-aware tip based on time of day
 */
export function getTimeBasedTipContext(): {
  period: 'morning' | 'afternoon' | 'evening';
  suggestedCategories: TipCategory[];
} {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return {
      period: 'morning',
      suggestedCategories: ['diabetes', 'general'], // Morning blood sugar tips
    };
  }

  if (hour >= 12 && hour < 18) {
    return {
      period: 'afternoon',
      suggestedCategories: ['general', 'hypertension'], // General wellness, blood pressure
    };
  }

  return {
    period: 'evening',
    suggestedCategories: ['heart', 'general'], // Heart health, sleep tips
  };
}

// ============================================
// TIP FORMATTING
// ============================================

/**
 * Format tip for display
 */
export function formatTipForDisplay(tip: NutritionTip): {
  title: string;
  body: string;
  category: string;
  icon: string;
} {
  const categoryLabels = TIP_CATEGORY_LABELS[tip.tipCategory];

  return {
    title: tip.title || `Tip ${categoryLabels.bm}`,
    body: tip.tipText,
    category: categoryLabels.bm,
    icon: categoryLabels.icon,
  };
}

/**
 * Format tip for speech
 */
export function formatTipForSpeech(tip: NutritionTip): string {
  return `Tip hari ini untuk kesihatan ${TIP_CATEGORY_LABELS[tip.tipCategory].bm.toLowerCase()}: ${tip.tipText}`;
}

// ============================================
// TIP HISTORY (for tracking viewed tips)
// ============================================

export interface TipViewHistory {
  tipId: string;
  viewedAt: string;
}

const TIP_HISTORY_KEY = 'nutrisihat_tip_history';
const MAX_HISTORY = 30;

/**
 * Save tip view to history
 */
export function saveTipView(tipId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getTipHistory();
    const newEntry: TipViewHistory = {
      tipId,
      viewedAt: new Date().toISOString(),
    };

    // Add new entry at the beginning
    history.unshift(newEntry);

    // Keep only last MAX_HISTORY entries
    const trimmedHistory = history.slice(0, MAX_HISTORY);

    localStorage.setItem(TIP_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Failed to save tip history:', error);
  }
}

/**
 * Get tip view history
 */
export function getTipHistory(): TipViewHistory[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(TIP_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Check if tip was viewed today
 */
export function wasTipViewedToday(tipId: string): boolean {
  const history = getTipHistory();
  const today = new Date().toDateString();

  return history.some(
    (entry) => entry.tipId === tipId && new Date(entry.viewedAt).toDateString() === today
  );
}

/**
 * Get last viewed tip
 */
export function getLastViewedTip(): TipViewHistory | null {
  const history = getTipHistory();
  return history.length > 0 ? history[0] : null;
}