import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Purchase } from "@/types";

type Client = SupabaseClient<any, "public", any>;

function normalizePurchase(record: Record<string, any>): Purchase {
  return {
    id: record.id,
    user_id: record.user_id,
    course: record.course,
    payment_status: record.payment_status,
    paid_at: record.paid_at ?? null,
    payment_provider: record.payment_provider ?? null,
    payment_id: record.payment_id ?? null,
    created_at: record.created_at ?? new Date().toISOString(),
    price_id: record.price_id ?? null,
  };
}

export async function getUserPurchases(
  client: Client,
  userId: string
): Promise<{ data: Purchase[]; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("purchases")
    .select("*")
    .eq("user_id", userId);

  if (error || !data) {
    return { data: [], error };
  }

  return { data: data.map(normalizePurchase), error: null };
}

export async function getLatestPaidPurchase(
  client: Client,
  userId: string
): Promise<{ data: Purchase | null; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .eq("payment_status", "paid")
    .order("paid_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { data: null, error };
  }

  return { data: normalizePurchase(data), error: null };
}

export async function hasPaidPurchase(
  client: Client,
  userId: string
): Promise<{ data: boolean; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("purchases")
    .select("id")
    .eq("user_id", userId)
    .eq("payment_status", "paid")
    .limit(1)
    .maybeSingle();

  if (error) {
    return { data: false, error };
  }

  return { data: !!data, error: null };
}

export async function getPurchaseForCourse(
  client: Client,
  userId: string,
  courseId: string
): Promise<{ data: Purchase | null; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .eq("course", courseId)
    .maybeSingle();

  if (error || !data) {
    return { data: null, error };
  }

  return { data: normalizePurchase(data), error: null };
}

type InsertPurchasePayload = {
  user_id: string;
  course: string;
  payment_status: "unpaid" | "paid" | "failed";
  paid_at?: string | null;
  payment_provider?: string | null;
  payment_id?: string | null;
  price_id?: string | null;
};

export async function insertPurchase(
  client: Client,
  payload: InsertPurchasePayload
): Promise<PostgrestError | null> {
  const { error } = await client.from("purchases").insert({
    ...payload,
    created_at: payload.paid_at ?? new Date().toISOString(),
  });
  return error ?? null;
}

export async function deletePurchasesByUser(
  client: Client,
  userId: string
): Promise<PostgrestError | null> {
  const { error } = await client.from("purchases").delete().eq("user_id", userId);
  return error ?? null;
}
