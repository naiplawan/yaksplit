import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  CreateEventInput,
  UpdateEventInput,
  EventWithMembers,
  EventWithExpenses,
  EventStats,
  MemberBalance,
} from '@/types'
import type { AddMemberInput, UpdateMemberInput } from '@/lib/validations/event-schemas'
import type { Database } from '@/lib/supabase/types'

type TableName = Database['public']['Tables']

export class EventService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Create a new event with members
   */
  async createEvent(input: CreateEventInput, userId: string) {
    // Generate share code
    const shareCode = await this.generateUniqueShareCode()

    // Create event
    const insertData = {
      creator_id: userId,
      title: input.title,
      description: input.description || null,
      share_code: shareCode,
    }

    const { data: event, error: eventError } = await this.supabase
      .from('events')
      .insert(insertData as any)
      .select()
      .single()

    if (eventError) throw eventError

    const eventData = event as { id: string }

    // Add creator as a member automatically (trigger will do this, but let's ensure it)
    // Then add additional members
    if (input.members && input.members.length > 0) {
      const membersToAdd = input.members.map((member) => ({
        event_id: eventData.id,
        user_id: null, // For non-registered users
        nickname: member.nickname,
        promptpay_id: member.promptpay_id || null,
        role: 'member' as const,
      }))

      const { error: membersError } = await this.supabase
        .from('event_members')
        .insert(membersToAdd as any)

      if (membersError) throw membersError
    }

    return await this.getEvent(eventData.id)
  }

  /**
   * Get event by ID with members
   */
  async getEvent(eventId: string): Promise<EventWithMembers> {
    const { data, error } = await this.supabase
      .from('events')
      .select(`
        *,
        members:event_members(*),
        creator:users(id, display_name, avatar_url)
      `)
      .eq('id', eventId)
      .single()

    if (error) throw error

    return data as EventWithMembers
  }

  /**
   * Get event by share code
   */
  async getEventByShareCode(code: string): Promise<EventWithMembers> {
    const { data, error } = await this.supabase
      .from('events')
      .select(`
        *,
        members:event_members(*),
        creator:users(id, display_name, avatar_url)
      `)
      .eq('share_code', code.toUpperCase())
      .single()

    if (error) throw error

    return data as EventWithMembers
  }

  /**
   * Get all events for a user
   */
  async getUserEvents(userId: string): Promise<EventWithMembers[]> {
    const { data, error } = await this.supabase
      .from('event_members')
      .select(`
        event_id,
        events(
          *,
          creator:users(id, display_name, avatar_url),
          members:event_members(*)
        )
      `)
      .eq('user_id', userId)

    if (error) throw error

    return data.map((item: any) => item.events as EventWithMembers).filter(Boolean)
  }

  /**
   * Update event
   */
  async updateEvent(eventId: string, input: UpdateEventInput) {
    const supabaseAny = this.supabase as any
    const { data, error } = await supabaseAny
      .from('events')
      .update(input)
      .eq('id', eventId)
      .select()
      .single()

    if (error) throw error

    return data
  }

  /**
   * Delete event
   */
  async deleteEvent(eventId: string) {
    const { error } = await this.supabase.from('events').delete().eq('id', eventId)

    if (error) throw error

    return { success: true }
  }

  /**
   * Add member to event
   */
  async addMember(eventId: string, member: AddMemberInput) {
    const supabaseAny = this.supabase as any
    const { data, error } = await supabaseAny
      .from('event_members')
      .insert({
        event_id: eventId,
        user_id: null,
        nickname: member.nickname,
        promptpay_id: member.promptpay_id || null,
        role: member.role || 'member',
      })
      .select()
      .single()

    if (error) throw error

    return data
  }

  /**
   * Update event member
   */
  async updateMember(memberId: string, input: UpdateMemberInput) {
    const supabaseAny = this.supabase as any
    const { data, error } = await supabaseAny
      .from('event_members')
      .update(input)
      .eq('id', memberId)
      .select()
      .single()

    if (error) throw error

    return data
  }

  /**
   * Remove member from event
   */
  async removeMember(memberId: string) {
    const { error } = await this.supabase
      .from('event_members')
      .delete()
      .eq('id', memberId)

    if (error) throw error

    return { success: true }
  }

  /**
   * Get event statistics
   */
  async getEventStats(eventId: string): Promise<EventStats> {
    // Get member count
    const { count: memberCount } = await this.supabase
      .from('event_members')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)

    // Get expenses
    const { data: expenses } = await this.supabase
      .from('expenses')
      .select('amount')
      .eq('event_id', eventId)

    const expensesArray = expenses as Array<{ amount: number; id: string }> | null
    const totalExpenses = expensesArray?.length || 0
    const totalAmount = expensesArray?.reduce((sum, e) => sum + Number(e.amount), 0) || 0

    // Get pending splits
    const { count: pendingSplits } = await this.supabase
      .from('splits')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')
      .in('expense_id', expensesArray?.map((e) => e.id) || [])

    return {
      total_expenses: totalExpenses,
      total_amount: totalAmount,
      member_count: memberCount || 0,
      pending_splits: pendingSplits || 0,
      your_balance: 0, // Calculated based on user context
    }
  }

  /**
   * Get member balances for an event
   */
  async getMemberBalances(eventId: string): Promise<MemberBalance[]> {
    // Get all members
    const { data: members } = await this.supabase
      .from('event_members')
      .select('*')
      .eq('event_id', eventId)

    if (!members) return []

    // Get all expenses for the event
    const { data: expenses } = await this.supabase
      .from('expenses')
      .select('id')
      .eq('event_id', eventId)

    const expenseIds = (expenses as Array<{ id: string }>)?.map((e) => e.id) || []

    // Get all splits for these expenses
    const { data: splits } = await this.supabase
      .from('splits')
      .select('*')
      .in('expense_id', expenseIds)

    // Calculate balances
    const membersArray = members as Array<{ id: string; nickname: string; promptpay_id: string | null }>
    const balances = membersArray.map((member) => {
      const memberSplits = (splits as Array<any>)?.filter((s) => s.member_id === member.id) || []

      const totalOwed = memberSplits.reduce((sum, s) => sum + Number(s.amount_owed), 0)
      const totalPaid = memberSplits.reduce((sum, s) => sum + Number(s.amount_paid), 0)
      const balance = totalOwed - totalPaid

      return {
        member_id: member.id,
        member,
        total_owed: totalOwed,
        total_paid: totalPaid,
        balance,
      }
    })

    return balances as MemberBalance[]
  }

  /**
   * Generate unique share code
   */
  private async generateUniqueShareCode(): Promise<string> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    let attempts = 0
    const maxAttempts = 10

    do {
      code = ''
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      attempts++

      // Check if code exists
      const { data } = await this.supabase
        .from('events')
        .select('share_code')
        .eq('share_code', code)
        .single()

      if (!data) break

      if (attempts >= maxAttempts) {
        throw new Error('Failed to generate unique share code')
      }
    } while (true)

    return code
  }
}

// Factory function
export function createEventService(supabase: SupabaseClient<Database>) {
  return new EventService(supabase)
}
