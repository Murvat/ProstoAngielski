import { createClient } from "@/lib/supabase/server/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lesson_id = searchParams.get("lesson_id");
  const course = searchParams.get("course"); // ✅ add course param

  if (!lesson_id || !course) {
    return Response.json(
      { error: "Missing lesson_id or course" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // ✅ Get logged-in user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Query progress for this user + course + lesson
  const { data, error } = await supabase
    .from("progress")
    .select("regenerate_count")
    .eq("user_id", user.id)
    .eq("course", course)
    .eq("lesson_id", lesson_id)
    .maybeSingle();

  if (error) {
    console.error("Supabase error:", error);
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  // ✅ Return count or default to 0
  return Response.json(data || { regenerate_count: 0 });
}
