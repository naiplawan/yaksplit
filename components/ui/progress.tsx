import { cn } from '@/lib/utils'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current progress value (0-100)
   */
  value: number
  /**
   * Maximum value (default: 100)
   */
  max?: number
  /**
   * Color variant
   */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'gradient'
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Whether to show percentage label
   */
  showLabel?: boolean
  /**
   * Custom label to display
   */
  label?: string
}

const variantClasses = {
  primary: 'bg-[var(--color-brand-primary-500)]',
  success: 'bg-[var(--color-semantic-success-500)]',
  warning: 'bg-[var(--color-semantic-warning-500)]',
  error: 'bg-[var(--color-semantic-error-500)]',
  gradient: 'bg-gradient-to-r from-[var(--color-brand-primary-500)] to-[var(--color-brand-accent-400)]',
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
}

/**
 * Progress bar component for showing completion status
 */
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

// Circular progress indicator
interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  variant?: 'primary' | 'success' | 'warning' | 'error'
  showValue?: boolean
}

export function CircularProgress({
  value,
  max = 100,
  size = 48,
  strokeWidth = 4,
  variant = 'primary',
  showValue = true,
  className,
  ...props
}: CircularProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  const colorMap = {
    primary: 'stroke-[var(--color-brand-primary-500)]',
    success: 'stroke-[var(--color-semantic-success-500)]',
    warning: 'stroke-[var(--color-semantic-warning-500)]',
    error: 'stroke-[var(--color-semantic-error-500)]',
  }

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        {/* Background circle */}
        <circle
          className="stroke-[rgb(var(--color-border-light))]"
          fill="none"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        {/* Progress circle */}
        <circle
          className={cn(colorMap[variant], 'transition-all duration-300')}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showValue && (
        <span className="absolute text-sm font-semibold text-[rgb(var(--color-text))]">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}
