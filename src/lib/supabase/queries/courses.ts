import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Course, CourseStructure, CourseWithStructure } from "@/types";

type Client = SupabaseClient<any, "public", any>;

type CourseRow = {
  id: string;
  title: string;
  price: number | null;
  level?: string | null;
  short_description?: string | null;
  duration?: string | null;
  features?: string[] | null;
  created_at?: string | null;
  first_lesson_id?: string | null;
};

type CourseWithStructureRow = CourseRow & {
  structure?: CourseStructure | null;
};

function normalizeFeatures(recordFeatures: unknown): string[] | undefined {
  if (!recordFeatures) return undefined;
  return Array.isArray(recordFeatures) ? recordFeatures : undefined;
}

function normalizeCourse(record: CourseRow): Course {
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

  if (error || !data) {
    return { data: [], error };
  }

  return {
    data: (data as CourseRow[]).map(normalizeCourse),
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

  const row = data as CourseWithStructureRow | null;

  if (error || !row?.structure) {
    return { data: null, error };
  }

  const course: CourseWithStructure = {
    ...normalizeCourse(row),
    structure: row.structure,
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

  const row = data as CourseRow | null;

  if (error || !row) {
    return { data: null, error };
  }

  return {
    data: {
      id: row.id,
      title: row.title,
      price: row.price ?? 0,
      duration: row.duration ?? null,
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
