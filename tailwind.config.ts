import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // NutriSihat Color Palette - High Contrast for Elderly
        primary: {
          DEFAULT: '#1E3A5F', // Dark Blue - Main color
          5: '#F0F4F8',
          10: '#E8F0F8',
          50: '#D1E2F0',
          100: '#A3C5E0',
          200: '#75A8D0',
          300: '#478BC0',
          400: '#2E5077',
          500: '#1E3A5F',
          600: '#162F4C',
          700: '#0F2440',
          800: '#081933',
          900: '#020E26',
          light: '#2E5077',
          dark: '#0F2440',
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber/Yellow - Accent color
          5: '#FFFBEB',
          10: '#FEF3C7',
          50: '#FDE68A',
          100: '#FCD34D',
          200: '#FBBF24',
          300: '#F59E0B',
          400: '#D97706',
          500: '#B45309',
          600: '#92400E',
          700: '#78350F',
          light: '#FBBF24',
          dark: '#D97706',
        },
        success: {
          DEFAULT: '#22C55E', // Green - Safe foods
          5: '#F0FFF4',
          10: '#DCFCE7',
          50: '#BBF7D0',
          100: '#86EFAC',
          200: '#4ADE80',
          300: '#22C55E',
          400: '#16A34A',
          500: '#15803D',
          600: '#166534',
          700: '#14532D',
          light: '#4ADE80',
          dark: '#16A34A',
        },
        warning: {
          DEFAULT: '#EF4444', // Red - Avoid foods
          5: '#FEF2F2',
          10: '#FEE2E2',
          50: '#FECACA',
          100: '#FCA5A5',
          200: '#F87171',
          300: '#EF4444',
          400: '#DC2626',
          500: '#B91C1C',
          600: '#991B1B',
          700: '#7F1D1D',
          light: '#F87171',
          dark: '#DC2626',
        },
        caution: {
          DEFAULT: '#FB923C', // Orange - Limit foods
          5: '#FFF7ED',
          10: '#FFEDD5',
          50: '#FED7AA',
          100: '#FDBA74',
          200: '#FB923C',
          300: '#F97316',
          400: '#EA580C',
          500: '#C2410C',
          600: '#9A3412',
          700: '#7C2D12',
          light: '#FDBA74',
          dark: '#EA580C',
        },
        background: '#F8FAFC',
        foreground: '#1E3A5F',
      },
      fontSize: {
        // Large fonts for elderly users - minimum 16px/18px
        'xs': ['14px', { lineHeight: '1.5' }],
        'sm': ['16px', { lineHeight: '1.5' }],
        'base': ['18px', { lineHeight: '1.6' }], // Minimum 18px
        'lg': ['20px', { lineHeight: '1.6' }],
        'xl': ['24px', { lineHeight: '1.5' }],
        '2xl': ['28px', { lineHeight: '1.4' }],
        '3xl': ['32px', { lineHeight: '1.3' }],
        '4xl': ['40px', { lineHeight: '1.2' }],
        '5xl': ['48px', { lineHeight: '1.1' }],
      },
      spacing: {
        // Larger spacing for touch-friendly buttons
        'button': '48px', // Minimum button height for touch
        'button-lg': '56px',
        'button-xl': '64px',
      },
      borderRadius: {
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        '3': '3px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-in-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;