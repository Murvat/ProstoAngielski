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
          Wybierz swój kurs angielskiego
        </label>
        <CourseSelection course={course} setCourse={setCourse} />
      </div>

      <button
        onClick={() => checkout(course)}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 
        text-white font-medium py-3 rounded-lg transition-colors duration-200 
        cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Ładowanie..." : "Zapłać przez Stripe"}
      </button>

      <p className="text-xs text-gray-500">
        Nie przechowujemy Twoich danych płatniczych.
      </p>
    </div>
  );
}
