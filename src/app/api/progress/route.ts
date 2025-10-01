// src/app/api/progress/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const lessonId = searchParams.get("lessonId");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("progress")
    .select("completed_exercises")
    .eq("user_id", user.id)
    .eq("course", courseId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) {
    console.error("❌ Failed to fetch progress:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    completed: !!data, // ✅ lesson is done if row exists
    completed_exercises: data?.completed_exercises ?? false,
  });
}


export async function POST(req: Request) {
  const supabase = await createClient();
  const { courseId, lessonId, isExercise } = await req.json();

  // 1. Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Check existing progress
  const { data: existing, error: fetchError } = await supabase
    .from("progress")
    .select("id, completed_exercises")
    .eq("user_id", user.id)
    .eq("course", courseId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 400 });
  }

  // 3A. Exercise page logic
  if (isExercise) {
    if (existing) {
      if (!existing.completed_exercises) {
        const { error: updateError } = await supabase
          .from("progress")
          .update({
            completed_exercises: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 400 });
        }
        return NextResponse.json({ success: true, exercisesUpdated: true });
      }
      return NextResponse.json({ success: true, exercisesAlreadyDone: true });
    }

    // No row yet → insert directly with exercises marked as complete
    const { error: insertError } = await supabase.from("progress").insert({
      user_id: user.id,
      course: courseId,
      lesson_id: lessonId,
      completed_exercises: true,
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, insertedWithExercises: true });
  }

  // 3B. Lesson page logic
  if (!existing) {
    const { error: insertError } = await supabase.from("progress").insert({
      user_id: user.id,
      course: courseId,
      lesson_id: lessonId,
      completed_exercises: false,
      updated_at: new Date().toISOString(),
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }
    return NextResponse.json({ success: true, lessonCompleted: true });
  }

  return NextResponse.json({ success: true, lessonAlreadyDone: true });
}
