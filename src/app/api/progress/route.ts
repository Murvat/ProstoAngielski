import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";
import {
  getProgressEntry,
  insertProgress,
  updateProgressById,
} from "@/lib/supabase/queries";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");
  const lessonId = searchParams.get("lessonId");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!courseId || !lessonId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const { data, error } = await getProgressEntry(supabase, {
    userId: user.id,
    courseId,
    lessonId,
  });

  if (error) {
    console.error("Failed to fetch progress:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    completed: Boolean(data),
    completed_exercises: data?.completed_exercises ?? false,
  });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { courseId, lessonId, isExercise } = await req.json();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!courseId || !lessonId) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  const { data: existing, error: fetchError } = await getProgressEntry(
    supabase,
    {
      userId: user.id,
      courseId,
      lessonId,
    }
  );

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 400 });
  }

  const timestamp = new Date().toISOString();

  if (isExercise) {
    if (existing) {
      if (!existing.completed_exercises) {
        const updateError = await updateProgressById(supabase, existing.id, {
          completed_exercises: true,
          updated_at: timestamp,
        });
        if (updateError) {
          return NextResponse.json(
            { error: updateError.message },
            { status: 400 }
          );
        }
        return NextResponse.json({ success: true, exercisesUpdated: true });
      }
      return NextResponse.json({ success: true, exercisesAlreadyDone: true });
    }

    const insertError = await insertProgress(supabase, {
      user_id: user.id,
      course: courseId,
      lesson_id: lessonId,
      completed_exercises: true,
      updated_at: timestamp,
    });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, insertedWithExercises: true });
  }

  if (!existing) {
    const insertError = await insertProgress(supabase, {
      user_id: user.id,
      course: courseId,
      lesson_id: lessonId,
      completed_exercises: false,
      updated_at: timestamp,
    });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, lessonCompleted: true });
  }

  return NextResponse.json({ success: true, lessonAlreadyDone: true });
}
