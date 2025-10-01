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
      <PaymentCancelledCard message="You cancelled the checkout process. No money was taken from your account." />

      <button
        onClick={handleGoBack}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Back to Payment
      </button>
    </section>
  );
}
