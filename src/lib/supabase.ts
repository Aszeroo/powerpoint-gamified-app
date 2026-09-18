import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if the environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and ANON key must be set in .env file')
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)