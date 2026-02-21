'use client'

import { useEvents } from '@/lib/hooks/useEvents'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import {
  Plus,
  Calendar,
  Users,
  Copy,
  MoreVertical,
  Sparkles,
  CheckCircle,
} from 'lucide-react'
import Link from 'next/link'
import { formatThaiCurrency } from '@/lib/utils/format'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default function EventsPage() {
  const { data: events, isLoading, error } = useEvents()
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active')

  const activeEvents = events?.filter((e) => e.status === 'active') || []
  const completedEvents = events?.filter((e) => e.status === 'completed') || []
  const filteredEvents =
    (filter === 'all' ? events : filter === 'active' ? activeEvents : completedEvents) || []

  return (
    <Container>
      <div className="py-4 safe-area-pt space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">
              Events
            </h1>
            <p className="text-sm text-[rgb(var(--color-text-secondary))]">
              {activeEvents.length} active event{activeEvents.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Filter Tabs - Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto snap-x-mobile pb-2 scrollbar-hide">
          <FilterTab
            active={filter === 'active'}
            count={activeEvents.length}
            onClick={() => setFilter('active')}
          >
            Active
          </FilterTab>
          <FilterTab
            active={filter === 'completed'}
            count={completedEvents.length}
            onClick={() => setFilter('completed')}
          >
            Completed
          </FilterTab>
          <FilterTab
            active={filter === 'all'}
            count={events?.length || 0}
            onClick={() => setFilter('all')}
          >
            All Events
          </FilterTab>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-[rgb(var(--color-border))]"></div>
              <div className="h-4 w-32 rounded-full bg-[rgb(var(--color-border))]"></div>
            </div>
          </div>
        ) : error ? (
          <div className="card-mobile p-8 text-center">
            <p className="text-[rgb(var(--color-text-secondary))] mb-4">
              Unable to load events
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        ) : filteredEvents?.length === 0 ? (
          <EmptyState
            icon={<Sparkles className="h-12 w-12" />}
            title={filter === 'completed' ? 'No completed events' : 'No events yet'}
            description={
              filter === 'active'
                ? 'Create your first event to start splitting bills with friends'
                : 'Events will appear here once you create them'
            }
            action={{
              label: 'Create Event',
              href: '/events/new',
            }}
          />
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

// Filter Tab Component
function FilterTab({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean
  count: number
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
        touch-feedback min-h-[var(--touch-target)]
        ${
          active
            ? 'bg-[rgb(var(--color-primary))] text-white shadow-lg shadow-[rgb(var(--color-primary))]/30'
            : 'bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-border-light))]'
        }
      `}
    >
      {children}
      <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-white/20">
        {count}
      </span>
    </button>
  )
}

// Mobile Event Card Component
function EventCard({ event }: { event: any }) {
  const memberCount = event.members?.length || 0
  const shareCode = event.share_code || '----'

  const copyShareLink = () => {
    const url = `${window.location.origin}/share/${event.share_code}`
    navigator.clipboard.writeText(url)
  }

  const isCompleted = event.status === 'completed'

  return (
    <Link href={`/events/${event.id}`} className="block touch-feedback">
      <div className="card-mobile p-4 transition-all duration-200 active:scale-[0.99]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[rgb(var(--color-text))] text-base truncate pr-2">
                {event.title}
              </h3>
              {isCompleted && (
                <span className="flex-shrink-0 px-2 py-0.5 rounded-full bg-[rgb(var(--color-success))]/20 text-[rgb(var(--color-success))] text-xs font-medium">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Done
                </span>
              )}
            </div>
            {event.description && (
              <p className="text-sm text-[rgb(var(--color-text-secondary))] truncate">
                {event.description}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <Link
              href={`/events/${event.id}`}
              onClick={(e) => e.stopPropagation()}
              className="h-10 w-10 rounded-full bg-[rgb(var(--color-bg-alt))] flex items-center justify-center border border-[rgb(var(--color-border-light))] active:scale-95 transition-transform"
            >
              <Users className="h-5 w-5 text-[rgb(var(--color-text-secondary))]" />
            </Link>
          </div>
        </div>

        {/* Event Meta */}
        <div className="flex items-center gap-3 text-sm text-[rgb(var(--color-text-tertiary))] mb-3">
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

        {/* Quick Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-[rgb(var(--color-border-light))]">
          <Link
            href={`/events/${event.id}/pay`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 btn-primary py-2.5 text-sm text-center"
          >
            Pay Share
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="h-11 px-4 rounded-xl bg-[rgb(var(--color-bg-alt))] text-[rgb(var(--color-text-secondary))] font-medium text-sm touch-feedback active:scale-95 transition-all"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Event Actions</SheetTitle>
              </SheetHeader>
              <div className="space-y-2 mt-4">
                <Link
                  href={`/events/${event.id}`}
                  className="block w-full p-4 rounded-xl bg-[rgb(var(--color-bg-alt))] text-left touch-feedback active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                    <div>
                      <div className="font-medium text-[rgb(var(--color-text))]">View Details</div>
                      <div className="text-sm text-[rgb(var(--color-text-secondary))]">See members and expenses</div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={copyShareLink}
                  className="block w-full p-4 rounded-xl bg-[rgb(var(--color-bg-alt))] text-left touch-feedback active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Copy className="h-5 w-5 text-[rgb(var(--color-accent))]" />
                    <div>
                      <div className="font-medium text-[rgb(var(--color-text))]">Copy Share Link</div>
                      <div className="text-sm text-[rgb(var(--color-text-secondary))]">Send to friends</div>
                    </div>
                  </div>
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
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
