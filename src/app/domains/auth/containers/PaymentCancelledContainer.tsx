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
      <PaymentCancelledCard message="Nie musisz już kończyć płatności – wszystkie kursy i materiały są darmowe i dostępne od ręki." />

      <button
        onClick={handleGoBack}
        className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg 
        transition-colors duration-200 cursor-pointer"
      >
        Wróć do profilu
      </button>
    </section>
  );
}
