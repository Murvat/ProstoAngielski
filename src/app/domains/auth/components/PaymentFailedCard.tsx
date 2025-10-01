// src/app/payment/failed/components/PaymentFailedCard.tsx
"use client";

type Props = {
  message: string;
  reason?: string;
};

export default function PaymentFailedCard({ message, reason }: Props) {
  return (
    <div className="w-full max-w-lg bg-red-100 border border-red-300 rounded-xl shadow-md p-8 flex flex-col items-center gap-4 text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-red-700">❌ Payment Failed</h2>
      <p className="text-gray-700">{message}</p>
      {reason && <p className="text-sm text-red-500">{reason}</p>}
    </div>
  );
}
