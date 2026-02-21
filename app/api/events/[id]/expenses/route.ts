import { createClient } from '@/lib/supabase/server'
import { createExpenseService } from '@/lib/services/ExpenseService'
import { createExpenseSchema } from '@/lib/validations/expense-schemas'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/events/[id]/expenses - Get all expenses for an event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const expenseService = createExpenseService(supabase)
    const expenses = await expenseService.getEventExpenses(id)

    return NextResponse.json({ data: expenses })
  } catch (error: any) {
    console.error('Error fetching expenses:', error)

    return NextResponse.json(
      { error: error.message || 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

// POST /api/events/[id]/expenses - Create new expense
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate input and set event_id
    const validatedData = createExpenseSchema.parse({
      ...body,
      event_id: eventId,
    })

    const expenseService = createExpenseService(supabase)
    const expense = await expenseService.createExpense(validatedData, user.id)

    return NextResponse.json({ data: expense }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating expense:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create expense' },
      { status: 500 }
    )
  }
}
