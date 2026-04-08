// NutriSihat - Utility Functions
// Helper for merging Tailwind CSS classes and Bahasa Malaysia helpers

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge
 * This handles class conflicts and ensures the correct classes are applied
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format date in Bahasa Malaysia
 * @param date - Date to format
 * @returns Formatted date string in BM
 */
export function formatDateBM(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return date.toLocaleDateString('ms-MY', options);
}

/**
 * Format time in Bahasa Malaysia
 * @param date - Date to format
 * @returns Formatted time string in BM
 */
export function formatTimeBM(date: Date): string {
  return date.toLocaleTimeString('ms-MY', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format relative time (e.g., "5 minit yang lalu")
 * @param date - Date to format
 * @returns Relative time string in BM
 */
export function formatRelativeTimeBM(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return 'Baru sahaja';
  if (diffMins < 60) return `${diffMins} minit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays < 7) return `${diffDays} hari yang lalu`;
  return formatDateBM(date);
}

/**
 * Check if current time is within meal time range
 * @returns Meal type in Bahasa Malaysia
 */
export function getCurrentMealBM(): string {
  const now = new Date();
  const hour = now.getHours();
  
  if (hour >= 5 && hour < 11) return 'Sarapan';
  if (hour >= 11 && hour < 15) return 'Tengahari';
  if (hour >= 15 && hour < 19) return 'Petang';
  return 'Malam';
}

/**
 * Get greeting based on current time in Bahasa Malaysia
 * @returns Greeting string
 */
export function getGreetingBM(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'Selamat Pagi';
  if (hour >= 12 && hour < 15) return 'Selamat Tengahari';
  if (hour >= 15 && hour < 19) return 'Selamat Petang';
  return 'Selamat Malam';
}

/**
 * Blood sugar validation for diabetes
 * @param value - Blood sugar value in mmol/L
 * @returns Validation result with status and message
 */
export function validateBloodSugar(value: number): {
  isValid: boolean;
  status: 'rendah' | 'normal' | 'tinggi' | 'sangat_tinggi';
  message: string;
} {
  if (value < 3.0) {
    return {
      isValid: false,
      status: 'rendah',
      message: 'Gula darah terlalu rendah! Sila makan sesuatu dan berjumpa doktor.',
    };
  }
  if (value >= 3.0 && value < 5.6) {
    return {
      isValid: true,
      status: 'normal',
      message: 'Gula darah normal. Teruskan pemakanan yang sihat!',
    };
  }
  if (value >= 5.6 && value < 7.0) {
    return {
      isValid: true,
      status: 'tinggi',
      message: 'Gula darah sedikit tinggi. Kurangkan makanan manis.',
    };
  }
  return {
    isValid: false,
    status: 'sangat_tinggi',
    message: 'Gula darah sangat tinggi! Sila berjumpa doktor dengan segera.',
  };
}

/**
 * Get blood sugar status color
 * @param status - Blood sugar status
 * @returns CSS color class
 */
export function getBloodSugarColor(status: 'rendah' | 'normal' | 'tinggi' | 'sangat_tinggi'): string {
  const colors = {
    rendah: 'text-blue-600',
    normal: 'text-green-600',
    tinggi: 'text-orange-600',
    sangat_tinggi: 'text-red-600',
  };
  return colors[status];
}

/**
 * Simple slug generator for food IDs
 * @param name - Food name
 * @returns Slug string
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}