'use client'

import { useEvents } from '@/lib/hooks/useEvents'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import {
  Plus,
  Calendar,
  Users,
  Banknote,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { formatThaiCurrency } from '@/lib/utils/format'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function DashboardPage() {
  const { data: events, isLoading, error } = useEvents()

  const activeEvents = events?.filter((e) => e.status === 'active') || []
  const totalMembers = events?.reduce((sum, e) => sum + (e.members?.length || 0), 0) || 0
  const totalAmount = activeEvents.reduce((sum, e) => sum, 0) || 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[rgb(var(--color-border))]"></div>
          <div className="h-4 w-32 rounded-full bg-[rgb(var(--color-border))]"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <p className="text-[rgb(var(--color-text-secondary))] text-center mb-4">
            Unable to load events
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-4 safe-area-pt space-y-6">
        {/* Header with FAB */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">
              Dashboard
            </h1>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {activeEvents.length} active event{activeEvents.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Quick Stats - Horizontal scroll on mobile */}
        <div className="flex gap-3 overflow-x-auto snap-x-mobile pb-2 scrollbar-hide">
          <div className="flex-shrink-0 w-32 card-mobile p-4 text-center">
            <Users className="h-6 w-6 text-[rgb(var(--color-primary))] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[rgb(var(--color-text))]">
              {totalMembers}
            </div>
            <div className="text-xs text-[rgb(var(--color-text-secondary))]">
              Members
            </div>
          </div>
          <div className="flex-shrink-0 w-32 card-mobile p-4 text-center">
            <Calendar className="h-6 w-6 text-[rgb(var(--color-accent))] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[rgb(var(--color-text))]">
              {activeEvents.length}
            </div>
            <div className="text-xs text-[rgb(var(--color-text-secondary))]">
              Events
            </div>
          </div>
          <div className="flex-shrink-0 w-32 card-mobile p-4 text-center">
            <Banknote className="h-6 w-6 text-[rgb(var(--color-secondary))] mx-auto mb-2" />
            <div className="text-2xl font-bold text-[rgb(var(--color-text))]">
              {formatThaiCurrency(totalAmount)}
            </div>
            <div className="text-xs text-[rgb(var(--color-text-secondary))]">
              Total
            </div>
          </div>
        </div>

        {/* Active Events Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
              Active Events
            </h2>
            {activeEvents.length > 0 && (
              <Link href="/events">
                <button className="text-sm text-[rgb(var(--color-primary))] font-medium">
                  See all
                  <ChevronRight className="h-4 w-4 inline" />
                </button>
              </Link>
            )}
          </div>

          {activeEvents.length === 0 ? (
            <EmptyState
              icon={<Sparkles className="h-12 w-12" />}
              title="No events yet"
              description="Create your first event to start splitting bills with friends"
              action={{
                label: 'Create Event',
                href: '/events/new',
              }}
            />
          ) : (
            <div className="space-y-3">
              {activeEvents.slice(0, 5).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              icon={<Plus className="h-6 w-6" />}
              title="New Event"
              description="Create a new bill split"
              href="/events/new"
              color="primary"
            />
            <QuickActionCard
              icon={<Users className="h-6 w-6" />}
              title="Friends"
              description="Manage friends"
              href="/friends"
              color="accent"
            />
          </div>
        </section>
      </div>
    </Container>
  )
}

// Mobile Event Card Component
function EventCard({ event }: { event: any }) {
  const memberCount = event.members?.length || 0
  const shareCode = event.share_code || '----'

  return (
    <Link href={`/events/${event.id}`} className="block touch-feedback">
      <div className="card-mobile p-4 transition-all duration-200 active:scale-[0.99]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[rgb(var(--color-text))] text-base truncate pr-2">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-sm text-[rgb(var(--color-text-secondary))] truncate">
                {event.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center border border-[rgb(var(--color-border-light))]">
              <Users className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
            </div>
          </div>
        </div>

        {/* Event Meta */}
        <div className="flex items-center gap-3 text-sm text-[rgb(var(--color-text-tertiary)]">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{memberCount} people</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(event.created_at).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="ml-auto">
            <code className="px-2 py-1 rounded-lg bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-primary))] font-mono text-xs">
              {shareCode}
            </code>
          </div>
        </div>
      </div>
    </Link>
  )
}

// Quick Action Card
function QuickActionCard({
  icon,
  title,
  description,
  href,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  color?: 'primary' | 'accent' | 'secondary'
}) {
  const colors = {
    primary: 'bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]',
    accent: 'bg-[rgb(var(--color-accent))]/10 text-[rgb(var(--color-accent))]',
    secondary: 'bg-[rgb(var(--color-secondary))]/10 text-[rgb(var(--color-secondary))]',
  }

  const colorKey = color || 'secondary'

  return (
    <Link href={href} className="block touch-feedback">
      <div className="card-mobile p-4 text-center transition-all duration-200 active:scale-[0.99]">
        <div className={`h-12 w-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${colors[colorKey]}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-[rgb(var(--color-text))] mb-1">
          {title}
        </h3>
        <p className="text-sm text-[rgb(var(--color-text-secondary))]">
          {description}
        </p>
      </div>
    </Link>
  )
}

// Empty State Component
function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    href: string
  }
}) {
  return (
    <div className="card-mobile p-8 text-center">
      <div className="h-20 w-20 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center mx-auto mb-4">
        <div className="text-[rgb(var(--color-text-tertiary)]">
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
        <Link href={action.href}>
          <button className="btn-primary w-full">
            {action.label}
          </button>
        </Link>
      )}
    </div>
  )
}
