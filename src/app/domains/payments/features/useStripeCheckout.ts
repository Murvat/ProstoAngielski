// src/app/domains/payment/hooks/useStripeCheckout.ts
"use client";

import { useState } from "react";

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);

  async function checkout(courseId: string) {
    if (!courseId) {
      alert("Please select a course");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course: courseId }),
      });

      if (!res.ok) throw new Error("❌ Failed to create checkout session");

      const { url } = await res.json();
      if (url) {
        window.location.href = url; // redirect to Stripe
      }
    } catch (err) {
      console.error("Stripe checkout error:", err);
      alert("Wystąpił błąd przy rozpoczęciu płatności. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  return { checkout, loading };
}
