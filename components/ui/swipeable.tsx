'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SwipeAction {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  className?: string
  bgColor?: string
}

interface SwipeableRowProps {
  children: React.ReactNode
  leftActions?: SwipeAction[]
  rightActions?: SwipeAction[]
  className?: string
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

/**
 * Swipeable row component for mobile lists
 * Allows swiping left or right to reveal actions
 */
export function SwipeableRow({
  children,
  leftActions = [],
  rightActions = [],
  className,
}: SwipeableRowProps) {
  const [offset, setOffset] = React.useState(0)
  const [startX, setStartX] = React.useState(0)
  const [isDragging, setIsDragging] = React.useState(false)
  const rowRef = React.useRef<HTMLDivElement>(null)

  const ACTION_WIDTH = 80

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    const currentX = e.touches[0].clientX
    const diff = currentX - startX

    // Limit the swipe distance
    const maxOffset = rightActions.length * ACTION_WIDTH
    const minOffset = -leftActions.length * ACTION_WIDTH

    setOffset(Math.max(minOffset, Math.min(maxOffset, diff)))
  }

  const handleTouchEnd = () => {
    setIsDragging(false)

    // Determine which action to trigger based on offset
    const threshold = ACTION_WIDTH / 2

    if (offset > threshold && rightActions.length > 0) {
      // Trigger rightmost action
      rightActions[rightActions.length - 1].onClick()
    } else if (offset < -threshold && leftActions.length > 0) {
      // Trigger leftmost action
      leftActions[0].onClick()
    }

    // Reset position
    setOffset(0)
  }

  // Don't render swipeable if no actions
  if (leftActions.length === 0 && rightActions.length === 0) {
    return <>{children}</>
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Left actions (revealed when swiping right) */}
      {leftActions.length > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 flex"
          style={{
            transform: `translateX(${offset < 0 ? offset + leftActions.length * ACTION_WIDTH : 0}px)`,
          }}
        >
          {leftActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={cn(
                'flex items-center justify-center text-white font-medium text-sm',
                action.bgColor || 'bg-[var(--color-semantic-error-500)]',
                'w-20'
              )}
            >
              <div className="flex flex-col items-center gap-1">
                {action.icon}
                <span>{action.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Right actions (revealed when swiping left) */}
      {rightActions.length > 0 && (
        <div
          className="absolute right-0 top-0 bottom-0 flex"
          style={{
            transform: `translateX(${offset > 0 ? offset - rightActions.length * ACTION_WIDTH : 0}px)`,
          }}
        >
          {rightActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={cn(
                'flex items-center justify-center text-white font-medium text-sm',
                action.bgColor || 'bg-[var(--color-semantic-success-500)]',
                'w-20'
              )}
            >
              <div className="flex flex-col items-center gap-1">
                {action.icon}
                <span>{action.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div
        ref={rowRef}
        className="relative bg-[var(--surface-card)] transition-transform"
        style={{
          transform: `translateX(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 200ms ease-out',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>
    </div>
  )
}

// Pre-built action configurations
export const swipeActions = {
  delete: {
    label: 'ลบ',
    bgColor: 'bg-[var(--color-semantic-error-500)]',
  },
  archive: {
    label: 'เก็บ',
    bgColor: 'bg-[var(--color-semantic-warning-500)]',
  },
  complete: {
    label: 'เสร็จ',
    bgColor: 'bg-[var(--color-semantic-success-500)]',
  },
  share: {
    label: 'แชร์',
    bgColor: 'bg-[var(--color-brand-primary-500)]',
  },
  edit: {
    label: 'แก้ไข',
    bgColor: 'bg-[var(--color-brand-accent-500)]',
  },
}
