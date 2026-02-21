import { createClient } from '@/lib/supabase/server'
import { createExpenseService } from '@/lib/services/ExpenseService'
import { updateSplitSchema, createPaymentSchema } from '@/lib/validations/expense-schemas'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/splits/[id] - Get split by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: split, error } = await supabase
      .from('splits')
      .select(`
        *,
        expense:expenses(*),
        member:event_members(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json({ data: split })
  } catch (error: any) {
    console.error('Error fetching split:', error)

    if (error.code === 'PGRST116') {
      return NextResponse.json({ error: 'Split not found' }, { status: 404 })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch split' },
      { status: 500 }
    )
  }
}

// PUT /api/splits/[id] - Update split (mark as paid)
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
    const validatedData = updateSplitSchema.parse(body)

    const { data: split, error } = await supabase
      .from('splits')
      .select('*, member:event_members(*)')
      .eq('id', id)
      .single()

    if (error || !split) {
      return NextResponse.json({ error: 'Split not found' }, { status: 404 })
    }

    // Verify user owns this split
    if ((split as any).member?.user_id !== user.id) {
      return NextResponse.json(
        { error: 'You can only update your own splits' },
        { status: 403 }
      )
    }

    const expenseService = createExpenseService(supabase)

    if (validatedData.amount_paid !== undefined) {
      const paymentAmount = validatedData.amount_paid - (split as any).amount_paid
      await expenseService.markSplitPaid(id, paymentAmount)
    } else if (validatedData.status === 'paid') {
      const remaining = (split as any).amount_owed - (split as any).amount_paid
      await expenseService.markSplitPaid(id, remaining)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating split:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update split' },
      { status: 500 }
    )
  }
}

// POST /api/splits/[id]/payment - Record a payment
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
    const validatedData = createPaymentSchema.parse({
      ...body,
      split_id: id,
    })

    const expenseService = createExpenseService(supabase)
    const payment = await expenseService.recordPayment(
      id,
      validatedData.amount,
      validatedData.payment_method,
      validatedData.reference_id
    )

    return NextResponse.json({ data: payment }, { status: 201 })
  } catch (error: any) {
    console.error('Error recording payment:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'Failed to record payment' },
      { status: 500 }
    )
  }
}
