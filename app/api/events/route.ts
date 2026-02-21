import { createClient } from '@/lib/supabase/server'
import { createEventService } from '@/lib/services/EventService'
import { createEventSchema } from '@/lib/validations/event-schemas'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/events - Get all events for current user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventService = createEventService(supabase)
    const events = await eventService.getUserEvents(user.id)

    return NextResponse.json({ data: events })
  } catch (error: any) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validatedData = createEventSchema.parse(body)

    const eventService = createEventService(supabase)
    const event = await eventService.createEvent(validatedData, user.id)

    return NextResponse.json({ data: event }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating event:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create event' },
      { status: 500 }
    )
  }
}
