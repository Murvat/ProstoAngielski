import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../client/supabaseClient";
import type { Database } from "@/lib/supabase/types";
import type { MobileLevel, PracticeFlashcard, PracticeTask } from "@/types";

type Client = SupabaseClient<Database>;
type MobileLevelRow = Database["public"]["Tables"]["mobile_levels"]["Row"];

const TASK_TYPE_ORDER: PracticeTask["type"][] = [
  "cloze_test",
  "fill_in_blank",
  "multiple_choice",
  "error_correction",
  "sentence_builder",
];

function isPracticeTask(candidate: unknown): candidate is PracticeTask {
  if (!candidate || typeof candidate !== "object") return false;
  const maybe = candidate as Partial<PracticeTask>;
  return (
    typeof maybe.type === "string" &&
    Array.isArray(maybe.answers)
  );
}

function collectTasksFromValue(
  value: unknown,
  target: PracticeTask[]
): void {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach((item) => {
      if (isPracticeTask(item)) {
        target.push(item);
      }
    });
    return;
  }
  if (value && typeof value === "object") {
    const containers = value as Record<string, unknown>;
    const potentialArrays = ["items", "questions", "data"];
    let appended = false;
    potentialArrays.forEach((key) => {
      const nested = containers[key];
      if (Array.isArray(nested)) {
        nested.forEach((item) => {
          if (isPracticeTask(item)) {
            target.push(item);
            appended = true;
          }
        });
      }
    });
    if (appended) return;
  }
  if (isPracticeTask(value)) {
    target.push(value);
  }
}

function normalizeTasks(raw: unknown): PracticeTask[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter(isPracticeTask);
  }
  if (typeof raw === "object") {
    const taskMap = raw as Record<string, unknown>;
    const ordered: PracticeTask[] = [];
    const handled = new Set<string>();

    TASK_TYPE_ORDER.forEach((typeKey) => {
      const value = taskMap[typeKey];
      if (value) {
        collectTasksFromValue(value, ordered);
        handled.add(typeKey);
      }
    });

    Object.entries(taskMap).forEach(([key, value]) => {
      if (handled.has(key)) return;
      collectTasksFromValue(value, ordered);
    });

    return ordered;
  }
  return [];
}

function normalizeFlashcards(raw: unknown): PracticeFlashcard[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.filter(
      (item): item is PracticeFlashcard =>
        Boolean(
          item &&
            typeof item === "object" &&
            "question" in item &&
            "correct_answer" in item
        )
    );
  }
  return [];
}

const normalizeMobileLevel = (record: MobileLevelRow): MobileLevel => ({
  id: record.id,
  level: record.level,
  tasks: normalizeTasks(record.tasks),
  flashcards: normalizeFlashcards(record.flashcards),
  vocabulary:
    record.vocabulary && typeof record.vocabulary === "object"
      ? record.vocabulary
      : {},
  created_at: record.created_at ?? null,
});

export async function listMobileLevels(
  client: Client,
  options: { orderBy?: keyof MobileLevelRow; ascending?: boolean } = {}
): Promise<{ data: MobileLevel[]; error: PostgrestError | null }> {
  const { orderBy = "created_at", ascending = false } = options;

  const { data, error } = await client
    .from("mobile_levels")
    .select("id, level, tasks, flashcards, vocabulary, created_at")
    .order(orderBy, { ascending });

  if (error) {
    return { data: [], error };
  }

  const rows = (data ?? []) as MobileLevelRow[];
  return { data: rows.map(normalizeMobileLevel), error: null };
}

export async function createMobileLevel(
  client: Client,
  payload: Omit<MobileLevel, "id" | "created_at">
): Promise<PostgrestError | null> {
  const { error } = await client.from("mobile_levels").insert(payload);
  return error ?? null;
}

export async function updateMobileLevel(
  client: Client,
  id: string,
  payload: Partial<Omit<MobileLevel, "id" | "created_at">>
): Promise<PostgrestError | null> {
  const { error } = await client
    .from("mobile_levels")
    .update(payload)
    .eq("id", id);
  return error ?? null;
}

export async function deleteMobileLevel(
  client: Client,
  id: string
): Promise<PostgrestError | null> {
  const { error } = await client.from("mobile_levels").delete().eq("id", id);
  return error ?? null;
}

export async function fetchMobileLevels(): Promise<MobileLevel[]> {
  try {
    const { data, error } = await supabase
      .from("mobile_levels")
      .select("id, level, tasks, flashcards, vocabulary, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const rows = (data ?? []) as MobileLevelRow[];
    return rows.map(normalizeMobileLevel);
  } catch (err) {
    console.error("[Supabase] fetchMobileLevels error:", err);
    return [];
  }
}

export async function fetchMobileLevelByLevel(level: string): Promise<MobileLevel | null> {
  if (!level) return null;
  try {
    const { data, error } = await supabase
      .from("mobile_levels")
      .select("id, level, tasks, flashcards, vocabulary, created_at")
      .ilike("level", level)
      .maybeSingle();

    if (error) throw error;
    return data ? normalizeMobileLevel(data as MobileLevelRow) : null;
  } catch (err) {
    console.error("[Supabase] fetchMobileLevelByLevel error:", err);
    return null;
  }
}
