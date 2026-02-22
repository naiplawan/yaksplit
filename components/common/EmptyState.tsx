import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
  onAction?: () => void
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="card-mobile p-8 text-center">
      <div className="h-20 w-20 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center mx-auto mb-4">
        <div className="text-[rgb(var(--color-text-tertiary))]">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-2">
        {title}
      </h3>
      <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-6">
        {description}
      </p>
      {action && (
        onAction ? (
          <Button onClick={onAction} className="w-full">
            {action.label}
          </Button>
        ) : (
          <Link href={action.href}>
            <Button className="w-full">
              {action.label}
            </Button>
          </Link>
        )
      )}
    </div>
  )
}
