// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xykomxyyxgcztgmhqzvm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5a29teHl5eGdjenRnbWhxenZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNzYzNTIsImV4cCI6MjA1MzY1MjM1Mn0.Y4ppR54pKENtJyGrrKg5Q6sF0CqbzW1UV875HZ0sJ7c";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);