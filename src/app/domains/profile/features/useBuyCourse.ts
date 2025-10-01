// src/app/domains/profile/hooks/useBuyCourse.ts
"use client";

import { useState } from "react";

export function useBuyCourse() {
  const [loading, setLoading] = useState<string | null>(null);

  async function buyCourse(courseId: string) {
    setLoading(`buy-${courseId}`);
    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course: courseId }),
      });

      if (!res.ok) throw new Error("❌ Failed to create checkout session");

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (error) {
      console.error("❌ Purchase error:", error);
      alert("Wystąpił błąd podczas rozpoczynania płatności. Spróbuj ponownie.");
    } finally {
      setLoading(null);
    }
  }

  return { buyCourse, loading };
}
