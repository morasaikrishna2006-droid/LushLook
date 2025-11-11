import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = "https://tvnmnbxanorijuotnalo.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2bm1uYnhhbm9yaWp1b3RuYWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1ODUwNDQsImV4cCI6MjA3ODE2MTA0NH0.RrWzHKg5LetnLxt6q_TBkjrbPim-yYKVwLOOBuOjQG0";

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);