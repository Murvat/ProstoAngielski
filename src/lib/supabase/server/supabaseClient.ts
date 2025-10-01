import { createClient } from "@supabase/supabase-js";

// These come from your Supabase project settings
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
