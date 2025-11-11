import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Using a test stub client.')

  // Lightweight stub used during tests or when env vars are absent.
  // Provides the minimal API surface consumed by the app's AuthContext.
  supabase = {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: (_cb) => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ data: null }),
      signInWithPassword: async () => ({ data: null }),
      signInWithOAuth: async () => ({ data: null }),
      resetPasswordForEmail: async () => ({ data: null }),
      signOut: async () => ({}),
      updateUser: async () => ({ data: null }),
    },
  }
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }