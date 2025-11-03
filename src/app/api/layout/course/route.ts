import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";
import { getPurchaseForCourse } from "@/lib/supabase/queries";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: purchase, error } = await getPurchaseForCourse(
    supabase,
    user.id,
    courseId
  );

  if (error) {
    console.error("Error checking purchase:", error.message);
    return NextResponse.json({ error: "Failed to verify course" }, { status: 500 });
  }

  if (!purchase || purchase.payment_status !== "paid") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  return NextResponse.json({ user });
}
