// src/app/payment/failed/containers/PaymentFailedContainer.tsx
"use client";

import { useRouter } from "next/navigation";
import PaymentFailedCard from "../components/PaymentFailedCard";

export default function PaymentFailedContainer() {
  const router = useRouter();

  const handleRetry = () => {
    router.push("/profile");
  };

  return (
    <section className="max-w-2xl mx-auto py-12 md:py-20 px-6 flex flex-col items-center gap-8 text-center">
      <PaymentFailedCard
        message="Coś poszło nie tak i nie udało się przetworzyć płatności."
        reason="Twoja karta została odrzucona lub sesja wygasła."
      />

      <button
        onClick={handleRetry}
        className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-medium py-3 px-6 rounded-lg 
        transition-colors duration-200 cursor-pointer"
      >
        Spróbuj ponownie
      </button>
    </section>
  );
}
