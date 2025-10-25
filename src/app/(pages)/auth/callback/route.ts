import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";
import { hasPaidPurchase } from "@/lib/supabase/queries";

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

  const { data: hasPurchase, error: purchaseError } = await hasPaidPurchase(
    supabase,
    user.id
  );

  if (purchaseError) {
    console.error("Error fetching purchases:", purchaseError.message);
    return NextResponse.redirect(`${origin}/login?error=db_error`);
  }

  const redirectPath = hasPurchase ? "/profile" : "/profile";
  return NextResponse.redirect(`${origin}${redirectPath}`);
}
