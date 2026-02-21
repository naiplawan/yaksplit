export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone: string | null
          promptpay_id: string | null
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone?: string | null
          promptpay_id?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string | null
          promptpay_id?: string | null
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          creator_id: string | null
          title: string
          description: string | null
          cover_image_url: string | null
          status: 'active' | 'archived' | 'completed'
          share_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id?: string | null
          title: string
          description?: string | null
          cover_image_url?: string | null
          status?: 'active' | 'archived' | 'completed'
          share_code?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string | null
          title?: string
          description?: string | null
          cover_image_url?: string | null
          status?: 'active' | 'archived' | 'completed'
          share_code?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      event_members: {
        Row: {
          id: string
          event_id: string
          user_id: string | null
          nickname: string
          promptpay_id: string | null
          role: 'creator' | 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          event_id: string
          user_id?: string | null
          nickname: string
          promptpay_id?: string | null
          role?: 'creator' | 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          user_id?: string | null
          nickname?: string
          promptpay_id?: string | null
          role?: 'creator' | 'admin' | 'member'
          joined_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          event_id: string
          title: string
          amount: number
          currency: string
          payer_member_id: string | null
          receipt_image_url: string | null
          expense_date: string
          split_type: 'equal' | 'custom' | 'percentage'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          title: string
          amount: number
          currency?: string
          payer_member_id?: string | null
          receipt_image_url?: string | null
          expense_date?: string
          split_type?: 'equal' | 'custom' | 'percentage'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          title?: string
          amount?: number
          currency?: string
          payer_member_id?: string | null
          receipt_image_url?: string | null
          expense_date?: string
          split_type?: 'equal' | 'custom' | 'percentage'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      splits: {
        Row: {
          id: string
          expense_id: string
          member_id: string
          amount_owed: number
          amount_paid: number
          status: 'pending' | 'partial' | 'paid'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          expense_id: string
          member_id: string
          amount_owed: number
          amount_paid?: number
          status?: 'pending' | 'partial' | 'paid'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          expense_id?: string
          member_id?: string
          amount_owed?: number
          amount_paid?: number
          status?: 'pending' | 'partial' | 'paid'
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          split_id: string
          from_member_id: string | null
          to_member_id: string | null
          amount: number
          payment_method: 'promptpay' | 'cash' | 'transfer' | 'other' | null
          reference_id: string | null
          paid_at: string
          verified: boolean
        }
        Insert: {
          id?: string
          split_id: string
          from_member_id?: string | null
          to_member_id?: string | null
          amount: number
          payment_method?: 'promptpay' | 'cash' | 'transfer' | 'other' | null
          reference_id?: string | null
          paid_at?: string
          verified?: boolean
        }
        Update: {
          id?: string
          split_id?: string
          from_member_id?: string | null
          to_member_id?: string | null
          amount?: number
          payment_method?: 'promptpay' | 'cash' | 'transfer' | 'other' | null
          reference_id?: string | null
          paid_at?: string
          verified?: boolean
        }
      }
      friendships: {
        Row: {
          id: string
          user_id: string
          friend_id: string
          nickname: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          friend_id: string
          nickname?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          friend_id?: string
          nickname?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
