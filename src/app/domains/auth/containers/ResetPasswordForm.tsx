"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client/supabaseClient";

type Status = "idle" | "loading" | "success" | "error";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const redirectTo = useMemo(() => {
    const candidateOrigins: Array<string | undefined> = [];

    if (typeof window !== "undefined") {
      candidateOrigins.push(window.location.origin);
    }

    candidateOrigins.push(process.env.NEXT_PUBLIC_SITE_URL);

    for (const origin of candidateOrigins) {
      if (!origin) continue;

      try {
        const url = new URL("/auth/update-password", origin);
        return url.toString();
      } catch (error) {
        console.error("Invalid redirect origin supplied for password reset:", origin, error);
      }
    }

    return undefined;
  }, []);

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");
    setMessage(null);

    const options = redirectTo ? { redirectTo } : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), options);

    if (error) {
      console.error("Reset password error:", error);
      setStatus("error");
      setMessage("❌ Nie udalo sie wyslac wiadomosci. Sprobuj ponownie za chwile.");
      return;
    }

    setStatus("success");
    setMessage("✅ Jesli konto z tym adresem istnieje, wyslalismy link do ustawienia nowego hasla.");
  }

  return (
    <section className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-16 pt-28">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-green-100">
        <h1 className="text-2xl font-bold text-green-700 mb-2 text-center">Odzyskaj dostep do konta</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Podaj adres e-mail, z ktorego korzystasz na platformie. Wyslemy link do ustawienia nowego hasla.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          {!redirectTo && (
            <p className="rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
              Brakuje adresu przekierowania. Ustaw zmienna NEXT_PUBLIC_SITE_URL (np. http://localhost:3000)
              i dodaj ja w Supabase Auth Redirect URLs, aby link dzialal poprawnie.
            </p>
          )}
          <div className="space-y-2">
            <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
              Adres e-mail
            </label>
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="twojmail@domena.pl"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Wysylamy link..." : "Wyslij link resetujacy"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-sm text-center ${
              status === "success" ? "text-green-600" : "text-red-600"
            }`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Pamietasz haslo?{" "}
          <Link href="/login" className="font-semibold text-green-700 hover:text-green-800">
            Wroc do logowania
          </Link>
        </div>
      </div>
    </section>
  );
}
