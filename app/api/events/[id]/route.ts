import { createClient } from '@/lib/supabase/server'
import { createEventService } from '@/lib/services/EventService'
import { updateEventSchema } from '@/lib/validations/event-schemas'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/events/[id] - Get event by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const eventService = createEventService(supabase)
    const event = await eventService.getEvent(id)

    return NextResponse.json({ data: event })
  } catch (error: any) {
    console.error('Error fetching event:', error)

    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

// PUT /api/events/[id] - Update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validatedData = updateEventSchema.parse(body)

    const eventService = createEventService(supabase)
    const event = await eventService.updateEvent(id, validatedData)

    return NextResponse.json({ data: event })
  } catch (error: any) {
    console.error('Error updating event:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update event' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id] - Delete event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventService = createEventService(supabase)
    await eventService.deleteEvent(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting event:', error)

    return NextResponse.json(
      { error: error.message || 'Failed to delete event' },
      { status: 500 }
    )
  }
}
