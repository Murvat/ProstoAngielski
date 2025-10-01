"use client";

import CourseSelection from "./CourseSelection";
import { useStripeCheckout } from "../features/useStripeCheckout";

type Props = {
  course: string;
  setCourse: (v: string) => void;
};

export default function CheckoutForm({ course, setCourse }: Props) {
  const { checkout, loading } = useStripeCheckout();

  return (
    <div className="flex-1 space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select your English course
        </label>
        <CourseSelection course={course} setCourse={setCourse} />
      </div>

      <button
        onClick={() => checkout(course)}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? "Ładowanie..." : "Pay with Stripe"}
      </button>

      <p className="text-xs text-gray-500">
        We do not store your payment information.
      </p>
    </div>
  );
}
