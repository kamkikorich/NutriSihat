'use client'

import { cn } from '@/lib/utils'
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react'

export interface InfoBannerProps {
  title?: string
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  icon?: React.ReactNode
  className?: string
  onDismiss?: () => void
}

export function InfoBanner({
  title,
  children,
  variant = 'info',
  icon,
  className,
  onDismiss,
}: InfoBannerProps) {
  const variantStyles = {
    info: {
      bg: 'bg-info/10',
      border: 'border-info/30',
      text: 'text-info',
      icon: <Info className="h-5 w-5" />,
    },
    success: {
      bg: 'bg-success/10',
      border: 'border-success/30',
      text: 'text-success',
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      text: 'text-warning',
      icon: <AlertCircle className="h-5 w-5" />,
    },
    error: {
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      text: 'text-warning',
      icon: <XCircle className="h-5 w-5" />,
    },
  }

  const style = variantStyles[variant]

  return (
    <div
      className={cn(
        'rounded-xl border-2 p-4 transition-all duration-200',
        style.bg,
        style.border,
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0', style.text)}>
          {icon || style.icon}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className={cn('font-semibold mb-1', style.text)}>
              {title}
            </h3>
          )}
          <div className={cn(
            'text-sm',
            variant === 'info' || variant === 'success' ? 'text-foreground' : 'text-foreground'
          )}>
            {children}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded-lg transition-colors',
              'hover:bg-black/5 active:bg-black/10',
              style.text
            )}
            aria-label="Tutup"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default InfoBanner
