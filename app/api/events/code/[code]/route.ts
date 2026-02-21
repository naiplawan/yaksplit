import { createClient } from '@/lib/supabase/server'
import { createEventService } from '@/lib/services/EventService'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/events/code/[code] - Get event by share code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const supabase = await createClient()

    const eventService = createEventService(supabase)
    const event = await eventService.getEventByShareCode(code)

    return NextResponse.json({ data: event })
  } catch (error: any) {
    console.error('Error fetching event by code:', error)

    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch event' },
      { status: 500 }
    )
  }
}
