import { Suspense } from "react";
import UpdatePasswordForm from "@/app/domains/auth/containers/UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-16 pt-28">
          <div className="rounded-xl border border-green-100 bg-white px-6 py-4 text-sm text-green-700 shadow-sm">
            Ladujemy formularz resetu hasla...
          </div>
        </section>
      }
    >
      <UpdatePasswordForm />
    </Suspense>
  );
}
