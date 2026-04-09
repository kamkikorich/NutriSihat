'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BigButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
  variant?: ButtonProps['variant'];
}

export const BigButton = forwardRef<HTMLButtonElement, BigButtonProps>(
  ({ className, icon, children, size = 'lg', variant = 'default', ...props }, ref) => {
    const sizeClasses = {
      md: 'h-20 px-6 text-lg gap-3',
      lg: 'h-24 px-8 text-xl gap-4',
      xl: 'h-28 px-10 text-2xl gap-5',
    };

    const iconSizes = {
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
      xl: 'h-12 w-12',
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          'w-full flex-col items-center justify-center rounded-2xl font-bold transition-all duration-200 active:scale-95',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3">
          {icon && <span className={iconSizes[size]}>{icon}</span>}
          {children}
        </div>
      </Button>
    );
  }
);

BigButton.displayName = 'BigButton';