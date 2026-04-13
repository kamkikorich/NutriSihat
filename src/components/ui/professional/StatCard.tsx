'use client'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  icon?: React.ReactNode
  color?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  className?: string
  onClick?: () => void
}

export function StatCard({
  title,
  value,
  unit,
  trend,
  trendValue,
  icon,
  color = 'primary',
  className,
  onClick,
}: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary-50 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  }

  const trendIcons = {
    up: <TrendingUp className="h-4 w-4 text-success" />,
    down: <TrendingDown className="h-4 w-4 text-warning" />,
    neutral: <Minus className="h-4 w-4 text-muted-foreground" />,
  }

  return (
    <Card
      className={cn(
        'transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-lg active:scale-[0.98]',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">
                {value}
              </span>
              {unit && (
                <span className="text-xs text-muted-foreground">{unit}</span>
              )}
            </div>
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                {trendIcons[trend]}
                <span className={cn(
                  'text-xs font-medium',
                  trend === 'up' ? 'text-success' : trend === 'down' ? 'text-warning' : 'text-muted-foreground'
                )}>
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn(
              'p-3 rounded-xl',
              colorClasses[color]
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard
