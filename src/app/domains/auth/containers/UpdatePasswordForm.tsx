"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client/supabaseClient";

type Status = "idle" | "loading" | "success" | "error";

const MIN_PASSWORD_LENGTH = 8;

export default function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [checkingLink, setCheckingLink] = useState(true);

  useEffect(() => {
    let active = true;

    async function prepareSession() {
      setCheckingLink(true);
      setMessage(null);
      setStatus("idle");

      try {
        let sessionTouched = false;
        const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
        if (hash) {
          const hashParams = new URLSearchParams(hash);
          const hashError = hashParams.get("error");
          const hashDescription = hashParams.get("error_description");
          if (hashError) {
            const decodedDescription =
              hashDescription?.replace(/\+/g, " ") ?? "Link resetujacy jest nieprawidlowy lub wygasl.";
            const errorText = decodeURIComponent(decodedDescription);
            setStatus("error");
            setMessage(`❌ ${errorText}`);
            setCheckingLink(false);
            return;
          }
        }

        const rawCode = searchParams.get("code") ?? searchParams.get("token");
        const recoveryEmail = searchParams.get("email");

        if (rawCode) {
          sessionTouched = true;
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(rawCode);
          if (exchangeError) {
            if (recoveryEmail) {
              const { error: otpError } = await supabase.auth.verifyOtp({
                email: recoveryEmail,
                token: rawCode,
                type: "recovery",
              });
              if (otpError) {
                throw otpError;
              }
            } else {
              throw exchangeError;
            }
          }
        } else if (hash) {
          const hashParams = new URLSearchParams(hash);
          const accessToken = hashParams.get("access_token");
          const refreshToken = hashParams.get("refresh_token");

          if (accessToken && refreshToken) {
            sessionTouched = true;
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (error) throw error;
          }
        }

        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          if (!sessionTouched && !data?.user) {
            throw new Error("missing-session");
          }
          throw error ?? new Error("missing-user");
        }

        if (!active) return;
      } catch (error) {
        console.error("Password recovery verification failed:", error);
        if (!active) return;
        setStatus("error");
        setMessage("❌ Link resetujacy wygasl lub jest nieprawidlowy. Popros o nowy link.");
      } finally {
        if (active) {
          setCheckingLink(false);
        }
      }
    }

    prepareSession();
    return () => {
      active = false;
    };
  }, [searchParamsKey]);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (checkingLink) {
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setStatus("error");
      setMessage(`❌ Haslo musi miec co najmniej ${MIN_PASSWORD_LENGTH} znakow.`);
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("❌ Hasla musza byc identyczne.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      console.error("Update password error:", error);
      setStatus("error");
      setMessage("❌ Nie udalo sie zapisac nowego hasla. Sprobuj ponownie.");
      return;
    }

    setStatus("success");
    setMessage("✅ Haslo zostalo zmienione. Za chwile przekierujemy Cie do logowania.");
    setTimeout(() => router.push("/login"), 2000);
  }

  return (
    <section className="min-h-screen bg-green-50 flex items-center justify-center px-4 py-16 pt-28">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg ring-1 ring-green-100">
        <h1 className="text-2xl font-bold text-green-700 mb-2 text-center">Ustaw nowe haslo</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Wpisz nowe haslo i potwierdz je, aby zakonczyc resetowanie.
        </p>

        <form onSubmit={handleUpdate} className="space-y-4">
          {checkingLink && (
            <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Sprawdzamy poprawnosc linku resetujacego...
            </p>
          )}

          <div className="space-y-2">
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
              Nowe haslo
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              minLength={MIN_PASSWORD_LENGTH}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder={`Minimum ${MIN_PASSWORD_LENGTH} znakow`}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Powtorz haslo
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              minLength={MIN_PASSWORD_LENGTH}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              placeholder="Wpisz ponownie haslo"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm shadow-sm transition focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || checkingLink}
            className="w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Zapisywanie..." : "Zapisz nowe haslo"}
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
          Masz pytania?{" "}
          <Link href="/contact" className="font-semibold text-green-700 hover:text-green-800">
            Napisz do nas
          </Link>
        </div>
      </div>
    </section>
  );
}
