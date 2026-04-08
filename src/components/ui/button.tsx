// NutriSihat - Button Component
// Large, touch-friendly button for elderly users

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  // Base styles - large and touch-friendly for elderly
  'inline-flex items-center justify-center whitespace-nowrap rounded-xl text-xl font-bold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white hover:bg-primary-dark active:scale-[0.98] shadow-lg',
        destructive:
          'bg-warning text-white hover:bg-warning-dark active:scale-[0.98] shadow-lg',
        outline:
          'border-3 border-primary bg-white text-primary hover:bg-primary-50 active:scale-[0.98] shadow-md',
        secondary:
          'bg-primary-light text-white hover:bg-primary active:scale-[0.98] shadow-lg',
        ghost:
          'text-primary hover:bg-primary-50 active:scale-[0.98]',
        link:
          'text-primary underline-offset-4 hover:underline',
        success:
          'bg-success text-white hover:bg-success-dark active:scale-[0.98] shadow-lg',
        accent:
          'bg-accent text-primary-dark hover:bg-accent-dark active:scale-[0.98] shadow-lg',
        caution:
          'bg-caution text-primary-dark hover:bg-caution-dark active:scale-[0.98] shadow-lg',
      },
      size: {
        default: 'min-h-[56px] px-8 py-4',
        sm: 'min-h-[48px] px-6 py-3 text-lg',
        lg: 'min-h-[64px] px-10 py-5 text-2xl',
        xl: 'min-h-[72px] px-12 py-6 text-2xl',
        icon: 'min-h-[56px] min-w-[56px] px-4',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };