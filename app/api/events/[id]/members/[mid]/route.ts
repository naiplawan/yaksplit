import { createClient } from '@/lib/supabase/server'
import { createEventService } from '@/lib/services/EventService'
import { updateMemberSchema } from '@/lib/validations/event-schemas'
import { NextRequest, NextResponse } from 'next/server'

// PUT /api/events/[id]/members/[mid] - Update member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; mid: string }> }
) {
  try {
    const { mid } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validatedData = updateMemberSchema.parse(body)

    const eventService = createEventService(supabase)
    const member = await eventService.updateMember(mid, validatedData)

    return NextResponse.json({ data: member })
  } catch (error: any) {
    console.error('Error updating member:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update member' },
      { status: 500 }
    )
  }
}

// DELETE /api/events/[id]/members/[mid] - Remove member from event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; mid: string }> }
) {
  try {
    const { mid } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const eventService = createEventService(supabase)
    await eventService.removeMember(mid)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error removing member:', error)

    return NextResponse.json(
      { error: error.message || 'Failed to remove member' },
      { status: 500 }
    )
  }
}
