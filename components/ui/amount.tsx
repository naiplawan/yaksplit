import { cn } from '@/lib/utils'
import { formatThaiCurrency, formatCurrency } from '@/lib/utils/format'

interface AmountProps {
  /**
   * The amount value in number
   */
  value: number
  /**
   * Currency code (default: THB)
   */
  currency?: 'THB' | 'USD' | 'EUR' | string
  /**
   * Size variant
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  /**
   * Whether to show sign (+/-)
   */
  showSign?: boolean
  /**
   * Color based on value (positive/negative)
   */
  colorize?: boolean
  /**
   * Whether the amount is settled/paid
   */
  settled?: boolean
  /**
   * Custom className
   */
  className?: string
}

const sizeClasses: Record<string, string> = {
  sm: 'text-sm font-medium',
  md: 'text-base font-semibold',
  lg: 'text-xl font-bold',
  xl: 'text-2xl font-bold',
  '2xl': 'text-3xl font-bold tracking-tight',
}

/**
 * Amount component for displaying currency values consistently
 *
 * @example
 * // Basic usage
 * <Amount value={1250.50} />
 *
 * // With sign and colorization
 * <Amount value={-500} showSign colorize />
 *
 * // Large display
 * <Amount value={12500} size="2xl" />
 */
export function Amount({
  value,
  currency = 'THB',
  size = 'md',
  showSign = false,
  colorize = false,
  settled = false,
  className,
}: AmountProps) {
  const isPositive = value > 0
  const isNegative = value < 0
  const isZero = value === 0

  // Format the amount
  const formattedAmount = currency === 'THB'
    ? formatThaiCurrency(Math.abs(value))
    : formatCurrency(Math.abs(value), currency)

  // Determine color
  const colorClass = colorize
    ? isPositive
      ? 'text-[var(--color-semantic-success-500)]'
      : isNegative
        ? 'text-[var(--color-semantic-error-500)]'
        : 'text-[rgb(var(--color-text-secondary))]'
    : settled
      ? 'text-[var(--color-semantic-success-500)]'
      : 'text-[rgb(var(--color-text))]'

  // Build the display value
  const displayValue = showSign && !isZero
    ? `${isPositive ? '+' : '-'}${formattedAmount}`
    : isNegative
      ? `-${formattedAmount}`
      : formattedAmount

  return (
    <span
      className={cn(
        'amount tabular-nums',
        sizeClasses[size],
        colorClass,
        className
      )}
    >
      {displayValue}
    </span>
  )
}

// Specialized variants

interface AmountBalanceProps {
  owed: number
  owing: number
  size?: 'lg' | 'xl' | '2xl'
  className?: string
}

/**
 * Balance display showing amount owed to you or you owe
 */
export function AmountBalance({ owed, owing, size = 'xl', className }: AmountBalanceProps) {
  const netBalance = owed - owing
  const isOwed = netBalance > 0
  const isOwing = netBalance < 0
  const isSettled = netBalance === 0

  return (
    <div className={cn('text-center', className)}>
      {isSettled ? (
        <>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">
            ยอดคงเหลือ
          </p>
          <Amount value={0} size={size} settled />
          <p className="text-sm text-[var(--color-semantic-success-500)] mt-1">
            ชำระเรียบร้อย
          </p>
        </>
      ) : isOwed ? (
        <>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">
            คุณได้รับ
          </p>
          <Amount value={netBalance} size={size} colorize showSign />
          <p className="text-sm text-[var(--color-semantic-success-500)] mt-1">
            จากคนอื่น
          </p>
        </>
      ) : (
        <>
          <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-1">
            คุณต้องจ่าย
          </p>
          <Amount value={Math.abs(netBalance)} size={size} colorize />
          <p className="text-sm text-[var(--color-semantic-error-500)] mt-1">
            ให้คนอื่น
          </p>
        </>
      )}
    </div>
  )
}

interface AmountProgressProps {
  paid: number
  total: number
  className?: string
}

/**
 * Progress display with amount paid/total
 */
export function AmountProgress({ paid, total, className }: AmountProgressProps) {
  const percentage = total > 0 ? Math.round((paid / total) * 100) : 0
  const remaining = total - paid

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-[rgb(var(--color-text-secondary))]">
          ชำระแล้ว {percentage}%
        </span>
        <span className="font-medium">
          <Amount value={paid} size="sm" /> / <Amount value={total} size="sm" />
        </span>
      </div>
      <div className="progress">
        <div
          className={cn(
            'progress-bar',
            percentage === 100 ? 'progress-bar-success' : 'progress-bar-gradient'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {remaining > 0 && (
        <p className="text-xs text-[rgb(var(--color-text-tertiary))]">
          คงเหลือ <Amount value={remaining} size="sm" />
        </p>
      )}
    </div>
  )
}
