import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";

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

  if (authError) {
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 });
  }
  return NextResponse.json({ user: user ?? null });
}
