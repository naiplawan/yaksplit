import { cn } from '@/lib/utils'

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Orientation of the divider
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Whether to show text label in the middle
   */
  label?: string
  /**
   * Spacing variant
   */
  spacing?: 'sm' | 'md' | 'lg'
}

const spacingClasses = {
  horizontal: {
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
  },
  vertical: {
    sm: 'mx-2',
    md: 'mx-4',
    lg: 'mx-6',
  },
}

/**
 * Divider component for separating content sections
 */
export function Divider({
  orientation = 'horizontal',
  label,
  spacing = 'md',
  className,
  ...props
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'w-px bg-[rgb(var(--color-border-light))]',
          spacingClasses.vertical[spacing],
          className
        )}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    )
  }

  if (label) {
    return (
      <div
        className={cn('divider-text', spacingClasses.horizontal[spacing], className)}
        role="separator"
        {...props}
      >
        {label}
      </div>
    )
  }

  return (
    <hr
      className={cn(
        'divider',
        spacingClasses.horizontal[spacing],
        className
      )}
      role="separator"
      aria-orientation="horizontal"
      {...props}
    />
  )
}

// Section divider with optional title
interface SectionDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  action?: React.ReactNode
}

export function SectionDivider({ title, action, className, ...props }: SectionDividerProps) {
  return (
    <div className={cn('flex items-center justify-between py-2', className)} {...props}>
      <h3 className="text-sm font-semibold text-[rgb(var(--color-text))]">
        {title}
      </h3>
      {action}
    </div>
  )
}
