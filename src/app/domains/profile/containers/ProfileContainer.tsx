import ProfileClient from "./ProfileClient";
import NavbarContainer from "../../navbar/containers/NavbarContainer";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server/server";

export default async function ProfileContainer() {

const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // redirect if not logged in
  if (!user) redirect("/login");

  return (
    <div className="w-full max-w-full lg:max-w-5xl xl:max-w-7xl mx-auto px-4 py-8">
      <NavbarContainer  initialUser={user} />
      <ProfileClient />
    </div>
  );
}
