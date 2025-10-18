import { getPurchaseForCourse, getUserSubscriptions } from "@/lib/supabase/queries";
import type { Subscription } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type DatabaseClient = SupabaseClient<unknown, "public", unknown>;

export type AccessCheckResult = {
  hasPaidPurchase: boolean;
  hasActiveSubscription: boolean;
  hasFullAccess: boolean;
};

function isSubscriptionActive(subscription: Subscription): boolean {
  if (subscription.status !== "active") return false;
  if (!subscription.period_end) return false;
  return new Date(subscription.period_end).getTime() > Date.now();
}

export async function resolveCourseAccess(
  client: DatabaseClient,
  userId: string,
  courseId: string
): Promise<AccessCheckResult> {
  const [{ data: purchase }, { data: subscriptions }] = await Promise.all([
    getPurchaseForCourse(client, userId, courseId),
    getUserSubscriptions(client, userId),
  ]);

  const hasPaidPurchase = Boolean(
    purchase && purchase.payment_status === "paid"
  );

  const hasActiveSubscription =
    subscriptions?.some(isSubscriptionActive) ?? false;

  return {
    hasPaidPurchase,
    hasActiveSubscription,
    hasFullAccess: hasPaidPurchase || hasActiveSubscription,
  };
}
