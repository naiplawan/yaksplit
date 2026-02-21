import { createClient } from '@/lib/supabase/server'
import { createExpenseService } from '@/lib/services/ExpenseService'
import { updateExpenseSchema } from '@/lib/validations/expense-schemas'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/expenses/[id] - Get expense by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const expenseService = createExpenseService(supabase)
    const expense = await expenseService.getExpense(id)

    return NextResponse.json({ data: expense })
  } catch (error: any) {
    console.error('Error fetching expense:', error)

    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch expense' },
      { status: 500 }
    )
  }
}

// PUT /api/expenses/[id] - Update expense
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
    const validatedData = updateExpenseSchema.parse(body)

    const expenseService = createExpenseService(supabase)
    const expense = await expenseService.updateExpense(id, validatedData, user.id)

    return NextResponse.json({ data: expense })
  } catch (error: any) {
    console.error('Error updating expense:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update expense' },
      { status: 500 }
    )
  }
}

// DELETE /api/expenses/[id] - Delete expense
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

    const expenseService = createExpenseService(supabase)
    await expenseService.deleteExpense(id, user.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting expense:', error)

    return NextResponse.json(
      { error: error.message || 'Failed to delete expense' },
      { status: 500 }
    )
  }
}
