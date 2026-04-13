import { cn } from '@/lib/utils'

export interface GridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 'responsive'
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Grid({
  children,
  columns = 'responsive',
  gap = 'md',
  className,
}: GridProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-5',
  }

  return (
    <div
      className={cn(
        'grid',
        columnClasses[columns],
        gapClasses[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

export default Grid
