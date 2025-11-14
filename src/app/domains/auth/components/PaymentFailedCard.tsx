// src/app/payment/failed/components/PaymentFailedCard.tsx
"use client";

type Props = {
  message: string;
  reason?: string;
};

export default function PaymentFailedCard({ message, reason }: Props) {
  return (
    <div
      className="w-full max-w-lg bg-emerald-50 border border-emerald-200 rounded-xl shadow-md p-8 
      flex flex-col items-center gap-4 text-center hover:shadow-lg transition-shadow"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-emerald-700">
        💚 Nie potrzebujesz już płatności
      </h2>
      <p className="text-gray-700">{message}</p>
      {reason && <p className="text-sm text-emerald-600">{reason}</p>}
    </div>
  );
}
