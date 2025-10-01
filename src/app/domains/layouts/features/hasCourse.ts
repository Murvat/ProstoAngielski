// src/app/domains/shared/assertUserHasCourse.ts
import { createClient } from "@/lib/supabase/server/server";
import { redirect } from "next/navigation";

export async function assertUserHasCourse(courseId: string) {
  const supabase = await createClient();

  // 1. Ensure user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Ensure purchase exists
  const { data: purchase, error } = await supabase
    .from("purchases")
    .select("payment_status")
    .eq("user_id", user.id)
    .eq("course", courseId) // 👈 use course, not course_id
    .maybeSingle();

  if (error) {
    console.error("❌ Error checking purchase:", error.message);
  }

  if (!purchase || purchase.payment_status !== "paid") {
    redirect("/profile");
  }

  return { user };
}
