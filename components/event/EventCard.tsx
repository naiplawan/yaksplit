'use client'

import Link from 'next/link'
import {
  Calendar,
  Users,
  CheckCircle,
  ChevronRight,
  Banknote,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Amount } from '@/components/ui/amount'
import { formatRelativeTime } from '@/lib/utils/format'

interface EventCardProps {
  event: {
    id: string
    title: string
    description?: string | null
    status: string
    share_code?: string | null
    created_at: string
    members?: Array<{
      id: string
      nickname: string
    }>
  }
  showActions?: boolean
  /** Show compact version for lists */
  compact?: boolean
  /** Mock total amount (in real app, this comes from expenses) */
  mockTotal?: number
  /** Mock paid amount (in real app, this comes from expenses) */
  mockPaid?: number
}

/**
 * Enhanced EventCard with progress bar and member avatars
 * Inspired by Splitwise's clean card design
 */
export function EventCard({
  event,
  showActions = true,
  compact = false,
  mockTotal = 0,
  mockPaid = 0,
}: EventCardProps) {
  const memberCount = event.members?.length || 0
  const shareCode = event.share_code || '----'
  const isCompleted = event.status === 'completed'

  // Calculate progress
  const progressPercentage = mockTotal > 0 ? Math.round((mockPaid / mockTotal) * 100) : 0
  const remaining = mockTotal - mockPaid

  // Get first 3 members for avatar stack
  const displayMembers = event.members?.slice(0, 3) || []
  const remainingMembers = Math.max(0, memberCount - 3)

  if (compact) {
    return (
      <Link href={`/events/${event.id}`} className="block touch-feedback">
        <div className="card-interactive p-3 flex items-center gap-3">
          {/* Status indicator */}
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isCompleted
                ? 'bg-[var(--color-semantic-success-500)]/10'
                : 'bg-[var(--color-brand-primary-500)]/10'
            }`}
          >
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-[var(--color-semantic-success-500)]" />
            ) : (
              <Banknote className="h-5 w-5 text-[var(--color-brand-primary-500)]" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[rgb(var(--color-text))] truncate">
              {event.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-text-secondary))]">
              <span>{memberCount} คน</span>
              {mockTotal > 0 && (
                <>
                  <span>·</span>
                  <Amount value={mockTotal} size="sm" />
                </>
              )}
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="h-5 w-5 text-[rgb(var(--color-text-tertiary))] flex-shrink-0" />
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/events/${event.id}`} className="block touch-feedback">
      <div className="card-interactive p-4 transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[rgb(var(--color-text))] text-base truncate">
                {event.title}
              </h3>
              {isCompleted && (
                <span className="flex-shrink-0 badge-success px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  เสร็จ
                </span>
              )}
            </div>
            {event.description && (
              <p className="text-sm text-[rgb(var(--color-text-secondary))] truncate">
                {event.description}
              </p>
            )}
          </div>

          {/* Share code badge */}
          <code className="ml-2 px-2 py-1 rounded-lg bg-[var(--color-brand-primary-500)]/10 text-[var(--color-brand-primary-600)] font-mono text-xs flex-shrink-0">
            {shareCode}
          </code>
        </div>

        {/* Progress bar (if amounts available) */}
        {mockTotal > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[rgb(var(--color-text-secondary))]">
                ชำระแล้ว {progressPercentage}%
              </span>
              <div className="flex items-center gap-1 text-xs">
                <Amount value={mockPaid} size="sm" />
                <span className="text-[rgb(var(--color-text-tertiary))]">/</span>
                <Amount value={mockTotal} size="sm" />
              </div>
            </div>
            <Progress
              value={progressPercentage}
              variant={isCompleted ? 'success' : 'gradient'}
              size="sm"
            />
            {remaining > 0 && !isCompleted && (
              <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1.5">
                คงเหลือ <Amount value={remaining} size="sm" />
              </p>
            )}
          </div>
        )}

        {/* Footer with members and meta */}
        <div className="flex items-center justify-between">
          {/* Member avatars stack */}
          <div className="flex items-center gap-2">
            {memberCount > 0 ? (
              <div className="flex -space-x-2">
                {displayMembers.map((member, index) => (
                  <Avatar
                    key={member.id}
                    className="h-7 w-7 border-2 border-[var(--surface-card)]"
                  >
                    <AvatarFallback
                      className="text-xs font-medium"
                      style={{
                        backgroundColor: `hsl(${(index * 137.5) % 360}, 60%, 70%)`,
                        color: `hsl(${(index * 137.5) % 360}, 60%, 30%)`,
                      }}
                    >
                      {member.nickname.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {remainingMembers > 0 && (
                  <div className="h-7 w-7 rounded-full bg-[rgb(var(--color-bg-alt))] border-2 border-[var(--surface-card)] flex items-center justify-center">
                    <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
                      +{remainingMembers}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 text-sm text-[rgb(var(--color-text-tertiary))]">
                <Users className="h-4 w-4" />
                <span>ยังไม่มีสมาชิก</span>
              </div>
            )}
          </div>

          {/* Meta info */}
          <div className="flex items-center gap-3 text-xs text-[rgb(var(--color-text-tertiary))]">
            <div className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span>{memberCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatRelativeTime(event.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {showActions && !isCompleted && (
          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-[rgb(var(--color-border-light))]">
            <Link
              href={`/events/${event.id}/pay`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 h-11 rounded-xl bg-gradient-to-r from-[var(--color-brand-primary-500)] to-[var(--color-brand-accent-400)] text-white text-sm font-semibold text-center flex items-center justify-center touch-feedback active:scale-95 transition-all shadow-md"
            >
              จ่ายส่วนของฉัน
            </Link>
            <Link
              href={`/events/${event.id}`}
              onClick={(e) => e.stopPropagation()}
              className="h-11 px-4 rounded-xl bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text-secondary))] font-medium text-sm touch-feedback active:scale-95 transition-all border border-[rgb(var(--color-border-light))]"
            >
              รายละเอียด
            </Link>
          </div>
        )}
      </div>
    </Link>
  )
}

/**
 * Skeleton for EventCard loading state
 */
export function EventCardSkeleton() {
  return (
    <div className="card-mobile p-4 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-[rgb(var(--color-border))] rounded w-3/4" />
          <div className="h-4 bg-[rgb(var(--color-border))] rounded w-1/2" />
        </div>
        <div className="h-6 bg-[rgb(var(--color-border))] rounded w-16" />
      </div>
      <div className="h-2 bg-[rgb(var(--color-border))] rounded-full mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-7 w-7 rounded-full bg-[rgb(var(--color-border))] border-2 border-[var(--surface-card)]"
            />
          ))}
        </div>
        <div className="h-4 bg-[rgb(var(--color-border))] rounded w-24" />
      </div>
    </div>
  )
}
