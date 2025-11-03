import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Course, CourseWithStructure } from "@/types";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;
type CourseRow = Database["public"]["Tables"]["courses"]["Row"];
type CourseProjection = {
  id: CourseRow["id"];
  title: CourseRow["title"];
  price: CourseRow["price"];
  level: CourseRow["level"];
  short_description: CourseRow["short_description"];
  duration: CourseRow["duration"];
  features: CourseRow["features"];
  first_lesson_id: CourseRow["first_lesson_id"];
  created_at?: CourseRow["created_at"];
  structure?: CourseRow["structure"];
};

function normalizeFeatures(recordFeatures: unknown): string[] | undefined {
  if (!recordFeatures) return undefined;
  return Array.isArray(recordFeatures) ? recordFeatures : undefined;
}

function normalizeCourse(record: CourseProjection): Course {
  return {
    id: record.id,
    title: record.title,
    price: record.price ?? 0,
    level: record.level ?? undefined,
    short_description: record.short_description ?? undefined,
    duration: record.duration ?? undefined,
    features: normalizeFeatures(record.features),
    created_at: record.created_at ?? undefined,
    first_lesson_id: record.first_lesson_id ?? undefined,
  };
}

export async function listCourses(
  client: Client,
  options: { orderBy?: string; ascending?: boolean } = {}
): Promise<{ data: Course[]; error: PostgrestError | null }> {
  const { orderBy = "price", ascending = true } = options;

  const { data, error } = await client
    .from("courses")
    .select(
      "id, title, price, level, short_description, duration, features, created_at, first_lesson_id"
    )
    .order(orderBy, { ascending });

  if (error) {
    return { data: [], error };
  }

  const rows = (data ?? []) as CourseProjection[];
  return {
    data: rows.map(normalizeCourse),
    error: null,
  };
}

export async function getCourseWithStructure(
  client: Client,
  courseId: string
): Promise<{ data: CourseWithStructure | null; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("courses")
    .select(
      "id, title, price, structure, level, short_description, duration, features, first_lesson_id"
    )
    .eq("id", courseId)
    .maybeSingle();

  if (error || !data || !data.structure) {
    return { data: null, error };
  }

  const course: CourseWithStructure = {
    ...normalizeCourse(data),
    structure: data.structure,
  };

  return { data: course, error: null };
}

export async function getCourseSummary(
  client: Client,
  courseId: string
): Promise<{
  data: Pick<Course, "id" | "title" | "price" | "duration"> | null;
  error: PostgrestError | null;
}> {
  const { data, error } = await client
    .from("courses")
    .select("id, title, price, duration")
    .eq("id", courseId)
    .maybeSingle();

  if (error || !data) {
    return { data: null, error };
  }

  return {
    data: {
      id: data.id,
      title: data.title,
      price: data.price ?? 0,
      duration: data.duration ?? null,
    },
    error: null,
  };
}

export async function deleteCoursesByUser(
  client: Client,
  userId: string
): Promise<PostgrestError | null> {
  const { error } = await client.from("courses").delete().eq("user_id", userId);
  return error ?? null;
}
