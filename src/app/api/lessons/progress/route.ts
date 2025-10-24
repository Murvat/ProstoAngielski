import { createClient } from "@/lib/supabase/server/server";
import { getProgressEntry } from "@/lib/supabase/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get("lesson_id");
  const courseId = searchParams.get("course");

  if (!lessonId || !courseId) {
    return Response.json(
      { error: "Missing lesson_id or course" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getProgressEntry(supabase, {
    userId: user.id,
    courseId,
    lessonId,
  });

  if (error) {
    console.error("Supabase error:", error);
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  const regenerateCount = data?.regenerate_count ?? 0;

  return Response.json({ regenerate_count: regenerateCount });
}
