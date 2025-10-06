import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";

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

    // ✅ Delete related data (optional: add your own tables)
    await supabase.from("progress").delete().eq("user_id", userId);
    await supabase.from("courses").delete().eq("user_id", userId);
    await supabase.from("purchases").delete().eq("user_id", userId);
    await supabase.from("subscriptions").delete().eq("user_id", userId);

    // ✅ Delete user from Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Delete user error:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
