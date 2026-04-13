import { cn } from '@/lib/utils'

export interface PageContainerProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  maxWidth?: 'full' | 'prose' | 'wide'
}

export function PageContainer({
  children,
  className,
  padding = 'md',
  maxWidth = 'wide',
}: PageContainerProps) {
  const paddingClasses = {
    none: '',
    sm: 'px-3 py-4',
    md: 'px-4 py-5',
    lg: 'px-5 py-6',
  }

  const maxWidthClasses = {
    full: 'max-w-full',
    prose: 'max-w-3xl',
    wide: 'max-w-5xl',
  }

  return (
    <div
      className={cn(
        'mx-auto w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

export default PageContainer
