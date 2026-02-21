import type { SupabaseClient } from '@supabase/supabase-js'
import type { User, UpdateProfileInput } from '@/types'
import type { Database } from '@/lib/supabase/types'

type TableName = Database['public']['Tables']

export class UserService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Get current user from auth
   */
  async getCurrentUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Get user profile from database
    const { data: profile } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return profile as User | null
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return null

    return data as User
  }

  /**
   * Create or update user profile
   */
  async upsertUser(userId: string, userData: { phone?: string; display_name?: string }) {
    const { data: existing } = await this.supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (existing) {
      // Update
      const supabaseAny = this.supabase as any
      const { data, error } = await supabaseAny
        .from('users')
        .update(userData)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return data as User
    } else {
      // Insert
      const supabaseAny = this.supabase as any
      const { data, error } = await supabaseAny
        .from('users')
        .insert({
          id: userId,
          ...userData,
        })
        .select()
        .single()

      if (error) throw error

      return data as User
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, input: UpdateProfileInput): Promise<User> {
    const supabaseAny = this.supabase as any
    const { data, error } = await supabaseAny
      .from('users')
      .update(input)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error

    return data as User
  }

  /**
   * Send OTP to phone number
   */
  async sendOtp(phone: string) {
    // Clean phone number
    const cleanPhone = phone.replace(/-/g, '').replace(/\s/g, '')

    // For Supabase Auth with phone, we need to use the auth API
    const { data, error } = await this.supabase.auth.signInWithOtp({
      phone: `+66${cleanPhone.substring(1)}`, // Convert 0xxx to +66xxx
    })

    if (error) throw error

    return data
  }

  /**
   * Verify OTP and create session
   */
  async verifyOtp(phone: string, token: string) {
    const cleanPhone = phone.replace(/-/g, '').replace(/\s/g, '')

    const { data, error } = await this.supabase.auth.verifyOtp({
      phone: `+66${cleanPhone.substring(1)}`,
      token,
      type: 'sms',
    })

    if (error) throw error

    // Create/update user profile
    if (data.user) {
      await this.upsertUser(data.user.id, {
        phone: cleanPhone,
      })
    }

    return data
  }

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut()

    if (error) throw error

    return { success: true }
  }

  /**
   * Get user's friends
   */
  async getFriends(userId: string) {
    const { data, error } = await this.supabase
      .from('friendships')
      .select(`
        *,
        friend:users!friendships_friend_id_fkey(*)
      `)
      .eq('user_id', userId)

    if (error) throw error

    return data
  }

  /**
   * Add friend
   */
  async addFriend(userId: string, friendId: string, nickname?: string) {
    const supabaseAny = this.supabase as any
    const { data, error } = await supabaseAny
      .from('friendships')
      .insert({
        user_id: userId,
        friend_id: friendId,
        nickname,
      })
      .select()
      .single()

    if (error) throw error

    return data
  }

  /**
   * Remove friend
   */
  async removeFriend(userId: string, friendId: string) {
    const { error } = await this.supabase
      .from('friendships')
      .delete()
      .eq('user_id', userId)
      .eq('friend_id', friendId)

    if (error) throw error

    return { success: true }
  }

  /**
   * Search users by phone
   */
  async searchByPhone(phone: string): Promise<User | null> {
    const cleanPhone = phone.replace(/-/g, '').replace(/\s/g, '')

    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('phone', cleanPhone)
      .single()

    if (error) return null

    return data as User
  }
}

// Factory function
export function createUserService(supabase: SupabaseClient<Database>) {
  return new UserService(supabase)
}
