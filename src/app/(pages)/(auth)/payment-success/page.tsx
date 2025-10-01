// src/app/payment/success/page.tsx
import { createClient } from "@/lib/supabase/server/server"; 
import PaymentSuccessContainer from "@/app/domains/auth/containers/PaymentSuccessContainer";  

export default async function PaymentSuccessPage() {
    const supabase = await createClient();
  // 1. Get logged-in user from cookies/session
    const { data: { user } } = await supabase.auth.getUser();
    
console.log(user)
  if (!user) {
    return <p className="text-center py-20 text-red-500">User not logged in</p>;
  }

  // 2. Get the latest paid purchase for this user
  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .select("course, paid_at")
    .eq("user_id", user.id)
    .eq("payment_status", "paid")
    .order("paid_at", { ascending: false })
    .limit(1)
    .single();

  if (purchaseError || !purchase) {
    return <p className="text-center py-20 text-red-500">No valid purchase found</p>;
  }

  // 3. Get course info
  const { data: course } = await supabase
    .from("courses")
    .select("title, price, duration")
    .eq("id", purchase.course)
    .single();

  // 4. Pass resolved props into container
  return (
    <PaymentSuccessContainer
      purchase={{
        userName: user.email ?? "User",
        courseTitle: course?.title ?? purchase.course,
        amount: course ? `${course.price / 100} zł` : "",
        access: course?.duration ?? "Full access",
      }}
    />
  );
}
