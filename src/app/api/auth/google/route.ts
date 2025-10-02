// src/app/auth/google/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXTAUTH_URL}/auth/callback`, 
      queryParams: {
        access_type: "offline", 
        prompt: "consent",
      },
    },
  });
  console.log(process.env.NEXT_PUBLIC_SITE_URL);
  if (error) {
    console.error("Google OAuth error:", error.message);
    return NextResponse.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data.url) {
    return NextResponse.redirect(data.url);
  }

  return NextResponse.redirect(`/login?error=no_oauth_url`);
}
