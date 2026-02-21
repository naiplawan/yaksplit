import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
  CustomSplitInput,
  ExpenseWithSplits,
  SplitType,
} from '@/types'
import type { Database } from '@/lib/supabase/types'

type TableName = Database['public']['Tables']

export class ExpenseService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Create a new expense with splits
   */
  async createExpense(input: CreateExpenseInput, userId: string) {
    // Verify user is a member of the event
    const { data: memberCheck } = await this.supabase
      .from('event_members')
      .select('id')
      .eq('event_id', input.event_id)
      .eq('user_id', userId)
      .single()

    if (!memberCheck) {
      throw new Error('You are not a member of this event')
    }

    // Create expense
    const supabaseAny = this.supabase as any
    const { data: expense, error: expenseError } = await supabaseAny
      .from('expenses')
      .insert({
        event_id: input.event_id,
        title: input.title,
        amount: input.amount,
        currency: input.currency || 'THB',
        payer_member_id: input.payer_member_id,
        receipt_image_url: input.receipt_image_url || null,
        expense_date: input.expense_date || new Date().toISOString(),
        split_type: input.split_type,
        notes: input.notes,
      })
      .select()
      .single()

    if (expenseError) throw expenseError

    // Create splits based on split type
    await this.createSplitsForExpense(expense.id, input.event_id, input.split_type, input.splits)

    return await this.getExpense(expense.id)
  }

  /**
   * Get expense with splits
   */
  async getExpense(expenseId: string): Promise<ExpenseWithSplits> {
    const { data, error } = await this.supabase
      .from('expenses')
      .select(`
        *,
        splits(
          *,
          member:event_members(*)
        ),
        payer:event_members(*)
      `)
      .eq('id', expenseId)
      .single()

    if (error) throw error

    return data as ExpenseWithSplits
  }

  /**
   * Get all expenses for an event
   */
  async getEventExpenses(eventId: string): Promise<ExpenseWithSplits[]> {
    const { data, error } = await this.supabase
      .from('expenses')
      .select(`
        *,
        splits(
          *,
          member:event_members(*)
        ),
        payer:event_members(*)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data as ExpenseWithSplits[]
  }

  /**
   * Update expense
   */
  async updateExpense(expenseId: string, input: UpdateExpenseInput, userId: string) {
    // Verify user can update this expense
    const { data: expense } = await this.supabase
      .from('expenses')
      .select('event_id')
      .eq('id', expenseId)
      .single()

    if (!expense) {
      throw new Error('Expense not found')
    }

    const expenseData = expense as { event_id: string }

    // Update expense
    const supabaseAny = this.supabase as any
    const { data: updated, error: updateError } = await supabaseAny
      .from('expenses')
      .update(input)
      .eq('id', expenseId)
      .select()
      .single()

    if (updateError) throw updateError

    // Recalculate splits if amount or split_type changed
    if (input.amount !== undefined || input.split_type !== undefined) {
      await this.recalculateSplits(expenseId, expenseData.event_id)
    }

    return await this.getExpense(expenseId)
  }

  /**
   * Delete expense
   */
  async deleteExpense(expenseId: string, userId: string) {
    const { error } = await this.supabase
      .from('expenses')
      .delete()
      .eq('id', expenseId)

    if (error) throw error

    return { success: true }
  }

  /**
   * Mark split as paid
   */
  async markSplitPaid(splitId: string, amount: number) {
    const supabaseAny = this.supabase as any

    // Get current split
    const { data: split } = await this.supabase
      .from('splits')
      .select('*')
      .eq('id', splitId)
      .single()

    if (!split) {
      throw new Error('Split not found')
    }

    const splitData = split as { amount_paid: number; amount_owed: number }
    const newAmountPaid = Number(splitData.amount_paid) + amount
    const amountOwed = Number(splitData.amount_owed)

    let status: 'pending' | 'partial' | 'paid' = 'pending'
    if (newAmountPaid >= amountOwed) {
      status = 'paid'
    } else if (newAmountPaid > 0) {
      status = 'partial'
    }

    const { data, error } = await supabaseAny
      .from('splits')
      .update({
        amount_paid: newAmountPaid,
        status,
      })
      .eq('id', splitId)
      .select()
      .single()

    if (error) throw error

    return data
  }

  /**
   * Get all pending payments for a member
   */
  async getPendingPayments(memberId: string) {
    const { data, error } = await this.supabase
      .from('splits')
      .select(`
        *,
        expense:expenses(*, payer:event_members(*))
      `)
      .eq('member_id', memberId)
      .in('status', ['pending', 'partial'])
      .order('created_at', { ascending: false })

    if (error) throw error

    return data
  }

  /**
   * Create splits for an expense based on split type
   */
  private async createSplitsForExpense(
    expenseId: string,
    eventId: string,
    splitType: SplitType,
    customSplits?: CustomSplitInput[]
  ) {
    // Get all members of the event
    const { data: members } = await this.supabase
      .from('event_members')
      .select('*')
      .eq('event_id', eventId)

    const membersArray = members as Array<{ id: string }> | null

    if (!membersArray || membersArray.length === 0) {
      throw new Error('No members found for this event')
    }

    // Get expense amount
    const { data: expense } = await this.supabase
      .from('expenses')
      .select('amount')
      .eq('id', expenseId)
      .single()

    if (!expense) {
      throw new Error('Expense not found')
    }

    const totalAmount = Number((expense as { amount: number }).amount)

    let splits: Array<{ expense_id: string; member_id: string; amount_owed: number }> = []

    switch (splitType) {
      case 'equal':
        // Divide equally among all members
        const equalAmount = totalAmount / membersArray.length
        splits = membersArray.map((member) => ({
          expense_id: expenseId,
          member_id: member.id,
          amount_owed: Math.round(equalAmount * 100) / 100, // Round to 2 decimal places
        }))
        break

      case 'custom':
        // Use custom amounts provided
        if (!customSplits || customSplits.length === 0) {
          throw new Error('Custom splits require amount for each member')
        }
        splits = customSplits.map((split) => ({
          expense_id: expenseId,
          member_id: split.member_id,
          amount_owed: split.amount_owed,
        }))
        break

      case 'percentage':
        // Calculate based on percentage (assume custom splits contain percentages)
        if (!customSplits || customSplits.length === 0) {
          throw new Error('Percentage splits require percentage for each member')
        }
        splits = customSplits.map((split) => ({
          expense_id: expenseId,
          member_id: split.member_id,
          amount_owed: (totalAmount * split.amount_owed) / 100,
        }))
        break
    }

    // Insert splits
    const supabaseAny = this.supabase as any
    const { error } = await supabaseAny.from('splits').insert(splits)

    if (error) throw error
  }

  /**
   * Recalculate splits for an expense
   */
  private async recalculateSplits(expenseId: string, eventId: string) {
    // Get expense
    const { data: expense } = await this.supabase
      .from('expenses')
      .select('*')
      .eq('id', expenseId)
      .single()

    if (!expense) {
      throw new Error('Expense not found')
    }

    const expenseData = expense as { split_type: SplitType }

    // Delete existing splits
    const supabaseAny = this.supabase as any
    await supabaseAny.from('splits').delete().eq('expense_id', expenseId)

    // Recreate splits
    await this.createSplitsForExpense(
      expenseId,
      eventId,
      expenseData.split_type,
      undefined // We'd need to pass stored custom splits here
    )
  }

  /**
   * Record a payment
   */
  async recordPayment(
    splitId: string,
    amount: number,
    paymentMethod: 'promptpay' | 'cash' | 'transfer' | 'other',
    referenceId?: string
  ) {
    const supabaseAny = this.supabase as any

    // Get split info
    const { data: split } = await this.supabase
      .from('splits')
      .select('member_id, expense_id')
      .eq('id', splitId)
      .single()

    if (!split) {
      throw new Error('Split not found')
    }

    const splitData = split as { member_id: string; expense_id: string }

    // Get expense to find payer
    const { data: expense } = await this.supabase
      .from('expenses')
      .select('payer_member_id')
      .eq('id', splitData.expense_id)
      .single()

    if (!expense) {
      throw new Error('Expense not found')
    }

    const expenseData = expense as { payer_member_id: string }

    // Create payment record
    const { data: payment, error: paymentError } = await supabaseAny
      .from('payments')
      .insert({
        split_id: splitId,
        from_member_id: splitData.member_id,
        to_member_id: expenseData.payer_member_id,
        amount,
        payment_method: paymentMethod,
        reference_id: referenceId || null,
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    // Update split status
    await this.markSplitPaid(splitId, amount)

    return payment
  }

  /**
   * Verify a payment
   */
  async verifyPayment(paymentId: string, verified: boolean) {
    const supabaseAny = this.supabase as any
    const { data, error } = await supabaseAny
      .from('payments')
      .update({ verified })
      .eq('id', paymentId)
      .select()
      .single()

    if (error) throw error

    return data
  }
}

// Factory function
export function createExpenseService(supabase: SupabaseClient<Database>) {
  return new ExpenseService(supabase)
}
