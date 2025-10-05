// src/app/payment/cancelled/containers/PaymentCancelledContainer.tsx
"use client";

import { useRouter } from "next/navigation";
import PaymentCancelledCard from "../components/PaymentCancelledCard";

export default function PaymentCancelledContainer() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/profile");
  };

  return (
    <section className="max-w-2xl mx-auto py-12 md:py-20 px-6 flex flex-col items-center gap-8 text-center">
      <PaymentCancelledCard message="Anulowałeś proces płatności. Żadne środki nie zostały pobrane z Twojego konta." />

      <button
        onClick={handleGoBack}
        className="bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white font-medium py-3 px-6 rounded-lg 
        transition-colors duration-200 cursor-pointer"
      >
        Wróć do płatności
      </button>
    </section>
  );
}
