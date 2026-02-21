'use client'

import { useEvents } from '@/lib/hooks/useEvents'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/layout/Container'
import { Plus, Users, Calendar, Copy, MoreVertical } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function EventsPage() {
  const { data: events, isLoading, error } = useEvents()

  const activeEvents = events?.filter((e) => e.status === 'active') || []
  const completedEvents = events?.filter((e) => e.status === 'completed') || []

  return (
    <Container>
      <div className="py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">Manage your bill splits</p>
          </div>
          <Button asChild>
            <Link href="/events/new">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-destructive">Failed to load events</p>
            </CardContent>
          </Card>
        ) : events?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">No events yet</h3>
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
          <>
            {/* Active Events */}
            {activeEvents.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Active Events</h2>
                <div className="grid gap-4">
                  {activeEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Events */}
            {completedEvents.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Completed Events</h2>
                <div className="grid gap-4">
                  {completedEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  )
}

function EventCard({ event }: { event: any }) {
  const copyShareCode = () => {
    const url = `${window.location.origin}/share/${event.share_code}`
    navigator.clipboard.writeText(url)
  }

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="truncate">{event.title}</CardTitle>
              <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                {event.status}
              </Badge>
            </div>
            {event.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {event.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={copyShareCode}>
                <Copy className="mr-2 h-4 w-4" />
                Copy share link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{event.members.length} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.created_at).toLocaleDateString('th-TH')}</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/events/${event.id}`}>View</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
