import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

/**
 * Admin client with service role key.
 * Use this for server-side operations that bypass RLS policies.
 * NEVER expose this client to the browser.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

let adminInstance: ReturnType<typeof createAdminClient> | null = null

export function getSupabaseAdmin() {
  if (!adminInstance) {
    adminInstance = createAdminClient()
  }
  return adminInstance
}
