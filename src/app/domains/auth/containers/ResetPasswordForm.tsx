"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client/supabaseClient";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
    });

    if (error)
      setMessage(
        "✅ Jeśli konto z tym adresem e-mail istnieje, wysłaliśmy link do resetu hasła."
      );
    else
      setMessage(
        "✅ Jeśli konto z tym adresem e-mail istnieje, wysłaliśmy link do resetu hasła."
      );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-green-50">
      <form
        onSubmit={handleReset}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md hover:shadow-lg transition-shadow cursor-pointer"
      >
        <h1 className="text-xl font-semibold text-green-700 mb-4">
          Zresetuj hasło
        </h1>

        <input
          type="email"
          placeholder="Twój adres e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 
          focus:border-green-500 focus:ring-green-500 hover:border-green-400 cursor-pointer"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 
          text-white font-semibold py-3 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Wyślij link do resetu
        </button>

        {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
      </form>
    </section>
  );
}
