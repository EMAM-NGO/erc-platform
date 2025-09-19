import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wcykeqpgwlukbzcughvo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeWtlcXBnd2x1a2J6Y3VnaHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NzQxMDAsImV4cCI6MjA2MDA1MDEwMH0.U_VWSfDR7EiCxcA07SGlv9CgJHgbo2O64LnfQ3ie6rA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);