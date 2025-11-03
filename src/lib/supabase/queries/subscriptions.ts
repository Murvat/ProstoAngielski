import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import type { Subscription } from "@/types";
import type { Database } from "@/lib/supabase/types";

type Client = SupabaseClient<Database>;
type SubscriptionRow = Database["public"]["Tables"]["subscriptions"]["Row"];

function normalizeSubscription(record: SubscriptionRow): Subscription {
  return {
    id: record.id,
    user_id: record.user_id,
    status: record.status,
    payment_provider: record.payment_provider ?? null,
    payment_id: record.payment_id ?? null,
    started_at: record.started_at ?? null,
    period_end: record.period_end,
    created_at: record.created_at ?? new Date().toISOString(),
    plan: record.plan,
    price_id: record.price_id,
  };
}

export async function getUserSubscriptions(
  client: Client,
  userId: string
): Promise<{ data: Subscription[]; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return { data: [], error };
  }

  const rows = (data ?? []) as SubscriptionRow[];
  return { data: rows.map(normalizeSubscription), error: null };
}

export async function getSubscriptionByUser(
  client: Client,
  userId: string
): Promise<{ data: Subscription | null; error: PostgrestError | null }> {
  const { data, error } = await client
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    return { data: null, error };
  }

  return {
    data: data ? normalizeSubscription(data as SubscriptionRow) : null,
    error: null,
  };
}

type InsertSubscriptionPayload = {
  user_id: string;
  status: Subscription["status"];
  payment_provider?: string | null;
  payment_id?: string | null;
  started_at?: string | null;
  period_end: string;
  plan: Subscription["plan"];
  price_id: string;
};

export async function insertSubscription(
  client: Client,
  payload: InsertSubscriptionPayload
): Promise<PostgrestError | null> {
  const { error } = await client.from("subscriptions").insert({
    ...payload,
    created_at: payload.started_at ?? new Date().toISOString(),
  });
  return error ?? null;
}

export async function deleteSubscriptionsByUser(
  client: Client,
  userId: string
): Promise<PostgrestError | null> {
  const { error } = await client
    .from("subscriptions")
    .delete()
    .eq("user_id", userId);
  return error ?? null;
}
