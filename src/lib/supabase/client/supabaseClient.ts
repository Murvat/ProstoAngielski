// src/features/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey,
    {
        auth: {
      persistSession: true,       // 👈 keeps session in localStorage
      autoRefreshToken: true,     // 👈 refreshes token automatically
      detectSessionInUrl: true,   // 👈 required for OAuth redirect flows
        }
    });
