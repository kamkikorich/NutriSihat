// NutriSihat - Badge Component
// Status badges for food categories (Safe/Avoid/Limit)

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-2 rounded-full px-5 py-2 text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-primary-100 text-primary',
        safe: 'bg-green-50 text-green-700 border-2 border-green-500',
        avoid: 'bg-red-50 text-red-700 border-2 border-red-500',
        limit: 'bg-orange-50 text-orange-700 border-2 border-orange-500',
        secondary: 'bg-primary-50 text-primary-dark',
        outline: 'border-2 border-primary text-primary bg-white',
        accent: 'bg-amber-50 text-amber-700',
      },
      size: {
        default: 'px-5 py-2 text-lg',
        sm: 'px-4 py-1.5 text-base',
        lg: 'px-6 py-3 text-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

// Food Status Badge with Emoji
interface FoodStatusBadgeProps {
  status: 'safe' | 'avoid' | 'limit';
  showEmoji?: boolean;
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const FOOD_STATUS_CONFIG = {
  safe: {
    emoji: '✅',
    label: 'Boleh Makan',
    variant: 'safe' as const,
  },
  avoid: {
    emoji: '❌',
    label: 'Perlu Elak',
    variant: 'avoid' as const,
  },
  limit: {
    emoji: '⚠️',
    label: 'Boleh Kurang',
    variant: 'limit' as const,
  },
};

function FoodStatusBadge({ status, showEmoji = true, size = 'default', className }: FoodStatusBadgeProps) {
  const config = FOOD_STATUS_CONFIG[status];
  
  return (
    <Badge variant={config.variant} size={size} className={className}>
      {showEmoji && <span className="text-xl">{config.emoji}</span>}
      <span>{config.label}</span>
    </Badge>
  );
}

export { Badge, badgeVariants, FoodStatusBadge, FOOD_STATUS_CONFIG };