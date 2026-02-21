import type { Database } from '@/lib/supabase/types'

// Database table types
export type User = Database['public']['Tables']['users']['Row']
export type Event = Database['public']['Tables']['events']['Row']
export type EventMember = Database['public']['Tables']['event_members']['Row']
export type Expense = Database['public']['Tables']['expenses']['Row']
export type Split = Database['public']['Tables']['splits']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Friendship = Database['public']['Tables']['friendships']['Row']

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type EventInsert = Database['public']['Tables']['events']['Insert']
export type EventMemberInsert = Database['public']['Tables']['event_members']['Insert']
export type ExpenseInsert = Database['public']['Tables']['expenses']['Insert']
export type SplitInsert = Database['public']['Tables']['splits']['Insert']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']
export type FriendshipInsert = Database['public']['Tables']['friendships']['Insert']

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update']
export type EventUpdate = Database['public']['Tables']['events']['Update']
export type EventMemberUpdate = Database['public']['Tables']['event_members']['Update']
export type ExpenseUpdate = Database['public']['Tables']['expenses']['Update']
export type SplitUpdate = Database['public']['Tables']['splits']['Update']

// App-specific types
export type SplitType = 'equal' | 'custom' | 'percentage'

export interface CreateEventInput {
  title: string
  description?: string
  members: CreateMemberInput[]
}

export interface CreateMemberInput {
  nickname: string
  phone?: string
  promptpay_id?: string
}

export interface UpdateEventInput {
  title?: string
  description?: string
  status?: 'active' | 'archived' | 'completed'
  cover_image_url?: string
}

export interface CreateExpenseInput {
  event_id: string
  title: string
  amount: number
  currency?: string
  payer_member_id: string
  receipt_image_url?: string
  expense_date?: string
  split_type: SplitType
  notes?: string
  splits?: CustomSplitInput[]
}

export interface CustomSplitInput {
  member_id: string
  amount_owed: number
}

export interface UpdateExpenseInput {
  title?: string
  amount?: number
  payer_member_id?: string
  receipt_image_url?: string
  expense_date?: string
  split_type?: SplitType
  notes?: string
}

export interface ExpenseWithSplits extends Expense {
  splits: SplitWithMember[]
  payer: EventMember
}

export interface SplitWithMember extends Split {
  member: EventMember
}

export interface EventWithMembers extends Event {
  members: EventMember[]
  creator?: User
}

export interface EventWithExpenses extends EventWithMembers {
  expenses: Expense[]
}

export interface EventStats {
  total_expenses: number
  total_amount: number
  member_count: number
  pending_splits: number
  your_balance: number
}

export interface MemberBalance {
  member_id: string
  member: EventMember
  total_owed: number
  total_paid: number
  balance: number
}

// Payment related types
export interface PaymentStatus {
  status: 'pending' | 'partial' | 'paid' | 'overpaid'
  amount_paid: number
  amount_owed: number
  remaining: number
}

// Share link types
export interface ShareCodeInfo {
  event_id: string
  share_code: string
  expires_at?: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pages: number
}

// Auth types
export interface AuthState {
  user: User | null
  session: string | null
  isLoading: boolean
}

export interface LoginInput {
  phone: string
}

export interface VerifyOtpInput {
  phone: string
  token: string
}

export interface UpdateProfileInput {
  display_name?: string
  promptpay_id?: string
  avatar_url?: string
}
