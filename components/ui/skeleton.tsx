import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Variant of skeleton
   * - text: For text content (rounded)
   * - circle: For avatars/profile pictures
   * - card: For card placeholders
   * - thumbnail: For image placeholders
   */
  variant?: 'text' | 'circle' | 'card' | 'thumbnail'
  /**
   * Width of the skeleton
   */
  width?: string | number
  /**
   * Height of the skeleton
   */
  height?: string | number
  /**
   * Number of lines for text variant
   */
  lines?: number
}

export function Skeleton({
  variant = 'text',
  width,
  height,
  lines = 1,
  className,
  style,
  ...props
}: SkeletonProps) {
  const baseClasses = 'skeleton'

  const variantClasses: Record<string, string> = {
    text: 'skeleton-text h-4 rounded',
    circle: 'skeleton-circle rounded-full',
    card: 'skeleton-card h-24',
    thumbnail: 'skeleton-card h-20 w-20 rounded-lg',
  }

  // Handle text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              variantClasses[variant],
              i === lines - 1 && 'w-3/4',
              className
            )}
            style={style}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
        ...style,
      }}
      {...props}
    />
  )
}

// Pre-built skeleton components for common use cases

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('card-mobile space-y-4', className)}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="text" lines={2} />
      <div className="flex gap-2">
        <Skeleton variant="text" width={80} />
        <Skeleton variant="text" width={80} />
      </div>
    </div>
  )
}

export function SkeletonEventCard({ className }: { className?: string }) {
  return (
    <div className={cn('card-mobile', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="50%" />
        </div>
        <Skeleton variant="circle" width={40} height={40} />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="circle" width={32} height={32} className="border-2 border-white" />
          ))}
        </div>
        <Skeleton variant="text" width={80} height={24} />
      </div>
    </div>
  )
}

export function SkeletonBalanceCard({ className }: { className?: string }) {
  return (
    <div className={cn('card-elevated', className)}>
      <Skeleton variant="text" width={100} className="mb-2" />
      <Skeleton variant="text" width="60%" height={40} className="mb-4" />
      <div className="flex gap-4">
        <div className="flex-1">
          <Skeleton variant="text" width={60} className="mb-1" />
          <Skeleton variant="text" width={80} height={24} />
        </div>
        <div className="flex-1">
          <Skeleton variant="text" width={60} className="mb-1" />
          <Skeleton variant="text" width={80} height={24} />
        </div>
      </div>
    </div>
  )
}

export function SkeletonMemberList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton variant="circle" width={44} height={44} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="50%" />
            <Skeleton variant="text" width="30%" />
          </div>
          <Skeleton variant="text" width={70} height={24} />
        </div>
      ))}
    </div>
  )
}

export function SkeletonExpenseList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-mobile flex items-center gap-3">
          <Skeleton variant="circle" width={44} height={44} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton variant="text" width={80} height={20} />
            <Skeleton variant="text" width={60} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton variant="text" width={120} height={28} />
          <Skeleton variant="text" width={150} />
        </div>
        <Skeleton variant="circle" width={44} height={44} />
      </div>

      {/* Balance card skeleton */}
      <SkeletonBalanceCard />

      {/* Quick stats skeleton */}
      <div className="flex gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="card" className="flex-1 h-24" />
        ))}
      </div>

      {/* Events skeleton */}
      <div className="space-y-3">
        <Skeleton variant="text" width={100} height={24} />
        <SkeletonEventCard />
        <SkeletonEventCard />
      </div>
    </div>
  )
}
