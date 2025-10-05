// src/app/payment/cancelled/components/PaymentCancelledCard.tsx
"use client";

type Props = {
  message: string;
};

export default function PaymentCancelledCard({ message }: Props) {
  return (
    <div className="w-full max-w-lg bg-yellow-100 border border-yellow-300 rounded-xl shadow-md p-8 
    flex flex-col items-center gap-4 text-center hover:shadow-lg transition-shadow cursor-pointer">
      <h2 className="text-2xl md:text-3xl font-bold text-yellow-700">
        ⚠️ Płatność anulowana
      </h2>
      <p className="text-gray-700">{message}</p>
    </div>
  );
}
