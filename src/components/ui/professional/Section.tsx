import { cn } from '@/lib/utils'

export interface SectionProps {
  children: React.ReactNode
  title?: string
  description?: string
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  background?: 'default' | 'muted' | 'surface' | 'primary' | 'gradient'
  border?: 'none' | 'top' | 'bottom' | 'all'
}

export function Section({
  children,
  title,
  description,
  className,
  padding = 'md',
  background = 'default',
  border = 'none',
}: SectionProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5 md:p-6',
  }

  const backgroundClasses = {
    default: 'bg-transparent',
    muted: 'bg-muted/50',
    surface: 'bg-surface',
    primary: 'bg-primary text-white',
    gradient: 'bg-gradient-to-br from-primary-50 to-primary-100',
  }

  const borderClasses = {
    none: '',
    top: 'border-t-2 border-border',
    bottom: 'border-b-2 border-border',
    all: 'border-2 border-border rounded-xl',
  }

  return (
    <section
      className={cn(
        'w-full transition-all duration-200',
        paddingClasses[padding],
        backgroundClasses[background],
        borderClasses[border],
        className
      )}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className={cn(
              'text-xl font-semibold',
              background === 'primary' ? 'text-white' : 'text-foreground'
            )}>
              {title}
            </h2>
          )}
          {description && (
            <p className={cn(
              'text-sm mt-1',
              background === 'primary' ? 'text-primary-100' : 'text-muted-foreground'
            )}>
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

export default Section
