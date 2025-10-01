// src/app/not-found.tsx
"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-lg mt-4 text-gray-600">
        Ups! Strona, której szukasz, nie istnieje.
      </p>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Wróć na stronę główną
      </Link>
    </div>
  );
}
