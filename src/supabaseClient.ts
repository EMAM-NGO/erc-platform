// src/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

// Read the variables from the environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Throw an error if the variables are not set
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in the environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
