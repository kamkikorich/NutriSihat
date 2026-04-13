import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // Mobile-first breakpoints (min-width, not max-width)
    screens: {
      'sm': '480px',   // Small phones landscape
      'md': '768px',   // Tablets
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large
    },
    extend: {
      colors: {
        // NutriSihat Color Palette - Professional KKM/MOH-inspired with High Contrast for Elderly
        primary: {
          // Professional Green - Inspired by KKM/MOH branding
          5: '#E8F5E9',   // Light green tint
          10: '#C8E6C9',
          50: '#A5D6A7',
          100: '#81C784',
          200: '#66BB6A',
          300: '#4CAF50', // Primary green
          400: '#43A047',
          500: '#388E3C', // Deep green - DEFAULT
          600: '#2E7D32',
          700: '#1B5E20',
          800: '#0F4D1A',
          900: '#053B0F',
          DEFAULT: '#388E3C',
          light: '#4CAF50',
          dark: '#1B5E20',
        },
        accent: {
          // Amber - Warm highlights and calls-to-action
          5: '#FFF8E1',
          10: '#FFECB3',
          50: '#FFE082',
          100: '#FFD54F',
          200: '#FFCA28',
          300: '#FFB300', // Primary amber
          400: '#FFA000',
          500: '#FF8F00',
          600: '#F57F17',
          700: '#E65100',
          DEFAULT: '#FFB300',
          light: '#FFD54F',
          dark: '#FF8F00',
        },
        success: {
          // Green - Safe foods, positive actions
          5: '#F0FFF4',
          10: '#DCFCE7',
          50: '#BBF7D0',
          100: '#86EFAC',
          200: '#4ADE80',
          300: '#22C55E',
          400: '#16A34A',
          500: '#15803D',
          DEFAULT: '#22C55E',
          light: '#4ADE80',
          dark: '#16A34A',
        },
        warning: {
          // Red - Avoid foods, critical alerts
          5: '#FEF2F2',
          10: '#FEE2E2',
          50: '#FECACA',
          100: '#FCA5A5',
          200: '#F87171',
          300: '#EF4444',
          400: '#DC2626',
          500: '#B91C1C',
          DEFAULT: '#EF4444',
          light: '#F87171',
          dark: '#DC2626',
        },
        caution: {
          // Orange - Limit foods, warnings
          5: '#FFF7ED',
          10: '#FFEDD5',
          50: '#FED7AA',
          100: '#FDBA74',
          200: '#FB923C',
          300: '#F97316',
          400: '#EA580C',
          500: '#C2410C',
          DEFAULT: '#FB923C',
          light: '#FDBA74',
          dark: '#EA580C',
        },
        info: {
          // Blue - Informational messages
          5: '#EFF6FF',
          10: '#DBEAFE',
          50: '#BFDBFE',
          100: '#93C5FD',
          200: '#60A5FA',
          300: '#3B82F6',
          400: '#2563EB',
          500: '#1D4ED8',
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          dark: '#2563EB',
        },
        // Semantic colors for professional UI
        background: '#F8FAFC',
        foreground: '#0F172A',
        surface: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          DEFAULT: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          light: '#F3F4F6',
          dark: '#D1D5DB',
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
      },
      fontSize: {
        // Professional typography scale with elderly-friendly minimums
        'xs': ['0.75rem', { lineHeight: '1.5' }],   // 12px - Secondary info
        'sm': ['0.875rem', { lineHeight: '1.5' }],  // 14px - Minimum body
        'base': ['1rem', { lineHeight: '1.6' }],    // 16px - Default body
        'lg': ['1.125rem', { lineHeight: '1.6' }],  // 18px - Large body
        'xl': ['1.25rem', { lineHeight: '1.5' }],   // 20px - Headings
        '2xl': ['1.5rem', { lineHeight: '1.4' }],   // 24px - H2
        '3xl': ['1.875rem', { lineHeight: '1.3' }], // 28px - H1
        '4xl': ['2.25rem', { lineHeight: '1.2' }],  // 36px - Hero
        '5xl': ['3rem', { lineHeight: '1.1' }],     // 48px - Display
      },
      fontFamily: {
        // Professional font stack
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Touch-friendly button sizes
        'button': '48px',  // Minimum touch target
        'button-sm': '44px',
        'button-lg': '56px',
        'button-xl': '64px',
        'touch': '48px',  // Minimum touch target size
      },
      minHeight: {
        'touch': '48px',  // Minimum touch target height
        'touch-lg': '56px',
        'touch-xl': '64px',
      },
      minWidth: {
        'touch': '48px',  // Minimum touch target width
      },
      borderRadius: {
        'lg': 'var(--radius)',
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)',
      },
      borderWidth: {
        '2': '2px',
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