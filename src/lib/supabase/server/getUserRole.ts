// lib/supabase/server/getUserRole.ts
import { createClient } from "./server";

/**
 * Get a user's role from the profiles table.
 *
 * @param userId Optional. If not provided, the current authenticated user is fetched.
 */
export async function getUserRole(
  userId?: string
): Promise<"user" | "admin" | null> {
  const supabase = await createClient();

  let id = userId;

  // If no userId passed → get current authenticated user
  if (!id) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    id = user.id;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return data.role as "user" | "admin";
}
