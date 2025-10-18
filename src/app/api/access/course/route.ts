import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";
import { resolveCourseAccess } from "@/lib/access/courseAccess";

export async function GET(req: NextRequest) {
  const courseId = new URL(req.url).searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ hasAccess: false }, { status: 401 });
  }

  try {
    const result = await resolveCourseAccess(supabase, user.id, courseId);

    return NextResponse.json({
      hasAccess: result.hasFullAccess,
      hasPaidPurchase: result.hasPaidPurchase,
      hasActiveSubscription: result.hasActiveSubscription,
    });
  } catch (error) {
    console.error("[access/course] failed to resolve access:", error);
    return NextResponse.json(
      { error: "Unable to resolve course access" },
      { status: 500 }
    );
  }
}
