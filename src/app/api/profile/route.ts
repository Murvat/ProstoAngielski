// src/app/api/profile/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [courses, purchases, progress, subscriptions] = await Promise.all([
    supabase.from("courses").select("*").order("price", { ascending: true }),
    supabase.from("purchases").select("*").eq("user_id", user.id),
    supabase.from("progress").select("*").eq("user_id", user.id),
    supabase.from("subscriptions").select("*").eq("user_id", user.id),
  ]);

  return NextResponse.json({
    user,
    allCourses: courses.data ?? [],
    purchases: purchases.data ?? [],
    progress: progress.data ?? [],
    subscriptions: subscriptions.data ?? [],
  });
}
