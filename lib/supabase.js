import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to set user role
export const setUserRole = async (userId, role) => {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role }
  })

  if (error) {
    console.error('Error setting user role:', error)
    throw error
  }

  return data
}

// Helper to get current user's role
export const getUserRole = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.user_metadata?.role
}