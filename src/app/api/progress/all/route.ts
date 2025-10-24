import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";
import { getUserProgress } from "@/lib/supabase/queries";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await getUserProgress(supabase, user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ progress: data });
}
