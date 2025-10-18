import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";
import {
  listCourses,
  getUserPurchases,
  getUserProgress,
  getUserSubscriptions,
} from "@/lib/supabase/queries";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    coursesResult,
    purchasesResult,
    progressResult,
    subscriptionsResult,
  ] = await Promise.all([
    listCourses(supabase),
    getUserPurchases(supabase, user.id),
    getUserProgress(supabase, user.id),
    getUserSubscriptions(supabase, user.id),
  ]);

  const maybeLogError = (label: string, error: unknown) => {
    if (!error) return;
    console.error(`[profile] ${label} error:`, error);
  };

  maybeLogError("courses", coursesResult.error);
  maybeLogError("purchases", purchasesResult.error);
  maybeLogError("progress", progressResult.error);
  maybeLogError("subscriptions", subscriptionsResult.error);

  return NextResponse.json({
    user,
    allCourses: coursesResult.data,
    purchases: purchasesResult.data,
    progress: progressResult.data,
    subscriptions: subscriptionsResult.data,
  });
}
