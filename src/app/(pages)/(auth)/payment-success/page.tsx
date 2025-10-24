import { createClient } from "@/lib/supabase/server/server";
import PaymentSuccessContainer from "@/app/domains/auth/containers/PaymentSuccessContainer";
import { getLatestPaidPurchase, getCourseSummary } from "@/lib/supabase/queries";

export default async function PaymentSuccessPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p className="text-center py-20 text-red-500">User not logged in</p>;
  }

  const { data: purchase, error: purchaseError } = await getLatestPaidPurchase(
    supabase,
    user.id
  );

  if (purchaseError || !purchase) {
    return (
      <p className="text-center py-20 text-red-500">
        No valid purchase found
      </p>
    );
  }

  const { data: course } = await getCourseSummary(
    supabase,
    String(purchase.course)
  );

  return (
    <PaymentSuccessContainer
      purchase={{
        userName: user.email ?? "User",
        courseTitle: course?.title ?? String(purchase.course),
        amount: course ? `${course.price / 100} zl` : "",
        access: course?.duration ?? "Full access",
      }}
    />
  );
}
