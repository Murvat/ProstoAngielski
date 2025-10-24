import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { ExerciseData, LessonContent } from "@/types";

type Client = SupabaseClient<any, "public", any>;

export async function getLessonContentByOrder(
  client: Client,
  courseId: string,
  orderIndex: number
): Promise<{ data: LessonContent | null; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("lessons")
    .select("id, title, content_md, pdf_path, heading")
    .eq("course_id", courseId)
    .eq("order_index", orderIndex)
    .maybeSingle();

  if (error || !data) {
    return { data: null, error };
  }

  return {
    data: {
      id: data.id,
      title: data.title,
      content_md: data.content_md ?? "",
      pdf_path: data.pdf_path ?? null,
      heading: data.heading ?? null,
    },
    error: null,
  };
}

export async function getLessonHeading(
  client: Client,
  courseId: string,
  orderIndex: number
): Promise<{ data: string | null; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("lessons")
    .select("heading")
    .eq("course_id", courseId)
    .eq("order_index", orderIndex)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  return { data: data?.heading ?? null, error: null };
}

export async function getLessonExercises(
  client: Client,
  courseId: string,
  orderIndex: number
): Promise<{ data: ExerciseData | null; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("lessons")
    .select("exercises")
    .eq("course_id", courseId)
    .eq("order_index", orderIndex)
    .maybeSingle();

  if (error || !data) {
    return { data: null, error };
  }

  const raw = data.exercises || {};
  const exercises: ExerciseData = {
    fillGaps: raw.fillGaps ?? [],
    chooseDefinition: raw.chooseDefinition ?? [],
    translate: raw.translate ?? [],
  };

  return { data: exercises, error: null };
}
