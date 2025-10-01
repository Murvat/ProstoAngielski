// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Session exchange error:", error.message);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=no_user`);
  }

  // 🔑 Check purchases instead of courses
  const { data: purchases, error: purchasesError } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .eq("payment_status", "paid")
    .limit(1);

  if (purchasesError) {
    console.error("Error fetching purchases:", purchasesError.message);
    return NextResponse.redirect(`${origin}/login?error=db_error`);
  }

  if (!purchases || purchases.length === 0) {
    // No paid purchases → redirect to payment
    return NextResponse.redirect(`${origin}/payment`);
  }

  // At least one paid purchase → redirect to profile
  return NextResponse.redirect(`${origin}/profile`);
}
