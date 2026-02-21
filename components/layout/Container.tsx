import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
  size?: 'mobile' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Container({
  children,
  className,
  size = 'lg',
}: ContainerProps) {
  return (
    <div className={cn('w-full mx-auto px-4 sm:px-6', className)}>
      {children}
    </div>
  )
}
