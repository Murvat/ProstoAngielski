import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";
import { supabase as supabaseAdmin } from "@/lib/supabase/server/supabaseClient"; // service role client

// DELETE /api/user/delete
export async function DELETE() {
  try {
    const supabase = await createClient();
    // ✅ Get current session user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    // ✅ Delete related data with service role to bypass RLS
    await supabaseAdmin.from("progress").delete().eq("user_id", userId);
    await supabaseAdmin.from("courses").delete().eq("user_id", userId);
    await supabaseAdmin.from("purchases").delete().eq("user_id", userId);
    await supabaseAdmin.from("subscriptions").delete().eq("user_id", userId);

    // ✅ Delete user from Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
