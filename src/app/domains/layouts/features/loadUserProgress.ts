// src/app/domains/shared/loadUserWithProgress.ts
import { createClient } from "@/lib/supabase/server/server";
import { redirect } from "next/navigation";

export async function loadUserWithProgress() {
  const supabase = await createClient();

  // 1. Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 2. Progress
  const { data: progress, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id);

  if (error) console.error("❌ Error fetching progress:", error.message);

  return { user, progress: progress ?? [] };
}
