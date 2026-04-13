'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export interface HeaderProps {
  title: string
  subtitle?: string
  showBack?: boolean
  backHref?: string
  onBack?: () => void
  actions?: React.ReactNode
  className?: string
}

export function Header({
  title,
  subtitle,
  showBack = true,
  backHref,
  onBack,
  actions,
  className,
}: HeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 bg-primary text-white',
        'shadow-md',
        'transition-all duration-200',
        className
      )}
    >
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Back Button */}
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="text-white hover:bg-primary-light/20 active:bg-primary-light/30 min-h-[48px] min-w-[48px]"
            aria-label="Kembali"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-primary-100 truncate mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
