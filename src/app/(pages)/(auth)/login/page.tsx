import { Suspense } from "react";
import LoginContainer from "@/app/domains/auth/containers/LoginContainer";

export default function Page() {
  return (
    <Suspense
      fallback={
        <section className="min-h-screen flex items-center justify-center bg-green-50 px-4 py-16">
          <div className="rounded-xl border border-green-100 bg-white px-6 py-4 text-sm text-green-700 shadow-sm">
            Ladujemy formularz logowania...
          </div>
        </section>
      }
    >
      <LoginContainer />
    </Suspense>
  );
}
