"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { useRouter } from "next/navigation";

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("❌ Hasła nie są takie same.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage("❌ Błąd podczas aktualizacji hasła. Spróbuj ponownie.");
    } else {
      setMessage("✅ Hasło zostało pomyślnie zaktualizowane!");
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-green-50">
      <form
        onSubmit={handleUpdate}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md hover:shadow-lg transition-shadow cursor-pointer"
      >
        <h1 className="text-xl font-semibold text-green-700 mb-4">
          Ustaw nowe hasło
        </h1>

        <input
          type="password"
          placeholder="Nowe hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 
          focus:border-green-500 focus:ring-green-500 hover:border-green-400 cursor-pointer"
        />

        <input
          type="password"
          placeholder="Potwierdź nowe hasło"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 
          focus:border-green-500 focus:ring-green-500 hover:border-green-400 cursor-pointer"
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 
          text-white font-semibold py-3 rounded-lg transition-colors duration-200 cursor-pointer"
        >
          Zaktualizuj hasło
        </button>

        {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
      </form>
    </section>
  );
}
