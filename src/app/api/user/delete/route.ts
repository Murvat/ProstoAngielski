import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server/server";
import {
  deleteProgressByUser,
  deleteCoursesByUser,
  deletePurchasesByUser,
  deleteSubscriptionsByUser,
} from "@/lib/supabase/queries";

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;

    const [progressError, coursesError, purchasesError, subscriptionsError] =
      await Promise.all([
        deleteProgressByUser(supabase, userId),
        deleteCoursesByUser(supabase, userId),
        deletePurchasesByUser(supabase, userId),
        deleteSubscriptionsByUser(supabase, userId),
      ]);

    const errors = [
      progressError,
      coursesError,
      purchasesError,
      subscriptionsError,
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error("Failed to clean user data:", errors);
      return NextResponse.json(
        { error: "Failed to clean user data" },
        { status: 500 }
      );
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
