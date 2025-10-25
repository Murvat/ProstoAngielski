import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Progress } from "@/types";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;
type ProgressRow = Database["public"]["Tables"]["progress"]["Row"];
type ProgressInsert = Database["public"]["Tables"]["progress"]["Insert"];
type ProgressUpdate = Database["public"]["Tables"]["progress"]["Update"];

type ProgressKey = {
  userId: string;
  courseId: string;
  lessonId: string;
};

export async function getUserProgress(
  client: Client,
  userId: string
): Promise<{ data: Progress[]; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return { data: [], error };
  }

  const rows = (data ?? []) as ProgressRow[];
  return {
    data: rows.map(normalizeProgress),
    error: null,
  };
}

export async function getProgressEntry(
  client: Client,
  { userId, courseId, lessonId }: ProgressKey
): Promise<{ data: Progress | null; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("progress")
    .select("*")
    .eq("user_id", userId)
    .eq("course", courseId)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  return {
    data: data ? normalizeProgress(data as ProgressRow) : null,
    error: null,
  };
}

export async function insertProgress(
  client: Client,
  payload: ProgressInsert
): Promise<PostgrestError | null> {
  const { error } = await client.from("progress").insert(payload);
  return error ?? null;
}

export async function updateProgressById(
  client: Client,
  id: string,
  updates: ProgressUpdate
): Promise<PostgrestError | null> {
  const { error } = await client.from("progress").update(updates).eq("id", id);
  return error ?? null;
}

export async function upsertProgress(
  client: Client,
  payload: ProgressInsert
): Promise<PostgrestError | null> {
  const { error } = await client
    .from("progress")
    .upsert(payload, { onConflict: "user_id,course,lesson_id" });
  return error ?? null;
}

export async function deleteProgressByUser(
  client: Client,
  userId: string
): Promise<PostgrestError | null> {
  const { error } = await client.from("progress").delete().eq("user_id", userId);
  return error ?? null;
}

function normalizeProgress(row: ProgressRow): Progress {
  return {
    id: row.id,
    user_id: row.user_id,
    course: row.course,
    lesson_id: row.lesson_id,
    completed_exercises: row.completed_exercises,
    updated_at: row.updated_at,
    regenerate_count: row.regenerate_count ?? null,
  };
}
