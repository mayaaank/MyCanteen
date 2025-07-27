// lib/supabase.js - Create this file
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Simple auth helpers for now
export const authHelpers = {
  async signInWithUserID(userID, password) {
    try {
      // For now, we'll use localStorage as fallback while you set up Supabase tables
      const users = JSON.parse(localStorage.getItem('users')) || []
      const user = users.find(u => u.id === userID && u.password === password)
      
      if (!user) {
        throw new Error('Invalid credentials')
      }

      return { data: { user }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  },

  async getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser')
    return currentUser ? JSON.parse(currentUser) : null
  },

  async signOut() {
    localStorage.removeItem('currentUser')
    return { error: null }
  }
}