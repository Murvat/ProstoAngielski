import { createClient } from "@/lib/supabase/server/server";
import PaymentSuccessContainer from "@/app/domains/auth/containers/PaymentSuccessContainer";

export default async function PaymentSuccessPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <PaymentSuccessContainer
      purchase={{
        userName: user?.email ?? "Drogi kursancie",
        courseTitle: "Wszystkie kursy i ćwiczenia",
        access: "Lekcje, ćwiczenia, materiały PDF i MurAi",
      }}
    />
  );
}
