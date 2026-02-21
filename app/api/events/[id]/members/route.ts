import { createClient } from '@/lib/supabase/server'
import { createEventService } from '@/lib/services/EventService'
import { addMemberSchema } from '@/lib/validations/event-schemas'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/events/[id]/members - Get event members
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const eventService = createEventService(supabase)
    const event = await eventService.getEvent(id)

    return NextResponse.json({ data: event.members })
  } catch (error: any) {
    console.error('Error fetching members:', error)

    return NextResponse.json(
      { error: error.message || 'Failed to fetch members' },
      { status: 500 }
    )
  }
}

// POST /api/events/[id]/members - Add member to event
export async function POST(
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
    const validatedData = addMemberSchema.parse(body)

    const eventService = createEventService(supabase)
    const member = await eventService.addMember(id, validatedData)

    return NextResponse.json({ data: member }, { status: 201 })
  } catch (error: any) {
    console.error('Error adding member:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to add member' },
      { status: 500 }
    )
  }
}
