import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Progress } from "@/types";

type Client = SupabaseClient<any, "public", any>;

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

  return { data: (data as Progress[]) ?? [], error };
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

  return { data: (data as Progress) ?? null, error };
}

export async function insertProgress(
  client: Client,
  payload: Omit<Progress, "id">
): Promise<PostgrestError | null> {
  const { error } = await client.from("progress").insert(payload);
  return error ?? null;
}

export async function updateProgressById(
  client: Client,
  id: string,
  updates: Partial<Progress>
): Promise<PostgrestError | null> {
  const { error } = await client.from("progress").update(updates).eq("id", id);
  return error ?? null;
}

export async function upsertProgress(
  client: Client,
  payload: Omit<Progress, "id">
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
