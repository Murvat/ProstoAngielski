// src/app/payment/success/containers/PaymentSuccessContainer.tsx
"use client";

import { useRouter } from "next/navigation";
import PaymentSuccessCard from "../components/PaymentSuccessCard";

type PaymentSuccessProps = {
  purchase: {
    userName: string;
    courseTitle: string;
    amount: string;
    access: string;
  };
};

export default function PaymentSuccessContainer({ purchase }: PaymentSuccessProps) {
  const router = useRouter();

  return (
    <section className="max-w-2xl mx-auto py-12 md:py-20 px-6 flex flex-col items-center gap-8 text-center">
      <PaymentSuccessCard
        userName={purchase.userName}
        course={purchase.courseTitle}
        amount={purchase.amount}
        access={purchase.access}
      />

      <button
        onClick={() => router.push("/profile")}
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        Zacznij!
      </button>
    </section>
  );
}
