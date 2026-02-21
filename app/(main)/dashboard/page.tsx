'use client'

import { useEvents } from '@/lib/hooks/useEvents'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import { Plus, Calendar, Users, Banknote } from 'lucide-react'
import Link from 'next/link'
import { formatThaiCurrency } from '@/lib/utils/format'

export default function DashboardPage() {
  const { data: events, isLoading, error } = useEvents()

  const activeEvents = events?.filter((e) => e.status === 'active') || []
  const completedEvents = events?.filter((e) => e.status === 'completed') || []

  // Calculate total stats
  const totalEvents = events?.length || 0
  const totalMembers = events?.reduce((sum, e) => sum + e.members.length, 0) || 0

  if (isLoading) {
    return (
      <Container>
        <div className="py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <div className="py-8">
          <p className="text-destructive">Failed to load events</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage your splits and events</p>
          </div>
          <Button asChild>
            <Link href="/events/new">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeEvents.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completed Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedEvents.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Active Events</h2>
            {activeEvents.length > 0 && (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/events">View All</Link>
              </Button>
            )}
          </div>

          {activeEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">No active events</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create your first event to start splitting bills
                    </p>
                    <Button asChild>
                      <Link href="/events/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {activeEvents.slice(0, 4).map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="truncate">{event.title}</CardTitle>
                      {event.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{event.members.length} members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Banknote className="h-4 w-4" />
                          <span>Share code: {event.share_code}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link href="/events/new">
                <Plus className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">New Event</div>
                  <div className="text-sm text-muted-foreground">
                    Create a new bill split
                  </div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 justify-start" asChild>
              <Link href="/friends">
                <Users className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Friends</div>
                  <div className="text-sm text-muted-foreground">
                    Manage your friends list
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}
