// src/app/domains/profile/containers/ProfileContainer.tsx

import { createClient } from "@/lib/supabase/server/server";
import { redirect } from "next/navigation";
import ProfileClient from "../components/ProfileClient";
import NavbarContainer from "../../navbar/containers/NavbarContainer";

export default async function ProfileContainer() {
  const supabase = await createClient();

  // 1. Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch courses
  const { data: allCourses, error: coursesError } = await supabase
    .from("courses")
    .select("*")
    .order("price", { ascending: true });

  // 3. Fetch purchases
  const { data: purchases, error: purchasesError } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", user.id);

  // 4. Fetch progress
  const { data: progress, error: progressError } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id);

  // 5. Handle errors (log + safe fallback)
  if (coursesError) console.error("❌ Error fetching courses:", coursesError.message);
  if (purchasesError) console.error("❌ Error fetching purchases:", purchasesError.message);
  if (progressError) console.error("❌ Error fetching progress:", progressError.message);

  // 6. Always pass safe arrays
  return (
    <div className="w-full max-w-full lg:max-w-5xl xl:max-w-7xl mx-auto px-4 py-8">
      <NavbarContainer initialUser={user}/>
      <ProfileClient
        user={user}
        allCourses={allCourses ?? []}
        purchases={purchases ?? []}
        progress={progress ?? []}
      />
    </div>
  );
}
