// src/app/error.tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("❌ Wystąpił błąd aplikacji:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h2 className="text-2xl font-semibold text-red-600">
        Coś poszło nie tak
      </h2>
      <p className="text-gray-600 mt-2">
        {error.message || "Nieoczekiwany błąd aplikacji."}
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Spróbuj ponownie
      </button>
    </div>
  );
}
