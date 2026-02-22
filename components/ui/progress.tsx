import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  variant?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
}

const variantClasses = {
  primary: 'bg-[var(--color-brand-primary-500)]',
  success: 'bg-[var(--color-semantic-success-500)]',
  warning: 'bg-[var(--color-semantic-warning-500)]',
  error: 'bg-[var(--color-semantic-error-500)]',
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
}

export function Progress({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  label,
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('w-full', className)} {...props}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-sm text-[rgb(var(--color-text-secondary))]">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-sm font-medium text-[rgb(var(--color-text))]">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={cn('progress', sizeClasses[size])}>
        <div
          className={cn('progress-bar', variantClasses[variant])}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}
