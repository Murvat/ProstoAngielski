import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getUserRole } from "./getUserRole";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  console.log("➡️ Middleware path:", path, "user:", !!user);

  // Public routes
  const isPublic =
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/terms") ||
    path.startsWith("/contact") ||
    path.startsWith("/blog") ||
    path.startsWith("/confirm") ||
    path.startsWith("/privacy") ||
    path.startsWith("/reset") ||
    path.startsWith("/update-password");

  // 1️⃣ Not logged in → redirect to /login
  if ((!user || error) && !isPublic) {
    // ❗ jeśli to jest zupełnie nieistniejąca ścieżka, pozwól Next.js obsłużyć 404
    if (!error && !user && !path.includes(".")) {
      return supabaseResponse; // ⬅️ przepuszczamy → Next.js pokaże not-found.tsx
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    if (!(path.startsWith("/login") || path.startsWith("/signup"))) {
      url.searchParams.set("next", path);
    }
    return NextResponse.redirect(url);
  }


if (user && (path === "/login" || path === "/signup")) {
  // zalogowany → blokuj login/signup
  const url = request.nextUrl.clone();
  url.pathname = "/profile";
  url.search = "";
  return NextResponse.redirect(url);
}
  // 3️⃣ Admin-only protection
  if (user && path.startsWith("/admin")) {
    const role = await getUserRole(user.id);
    if (role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // 🚀 Default → przepuszczamy
  return supabaseResponse;
}
