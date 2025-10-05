"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { useState } from "react";

export const ProfileUserData = ({ id, email }: { id: string; email?: string }) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleDelete() {
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");

      // ✅ Clear local session
      const { error } = await supabase.auth.signOut();
      if (error) console.error("Sign out error:", error);

      // ✅ Redirect smoothly to homepage
      router.push("/");
    } catch (err) {
      alert("Wystąpił błąd podczas usuwania konta.");
      console.error(err);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Dane osobiste</h2>
      <p className="text-gray-700">Email: {email}</p>
      <p className="text-gray-700 mt-2">ID użytkownika: {id}</p>

      <div className="mt-6 border-t pt-4">
        <h3 className="text-red-600 font-semibold mb-2">Usuń konto</h3>
        <p className="text-gray-600 text-sm mb-4">
          Wszystkie dane, kursy i postępy zostaną <strong>trwale usunięte</strong>.
        </p>
        <button
          onClick={() => setConfirmOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Usuń konto
        </button>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm text-center">
            <p className="text-gray-800 mb-6">
              Czy na pewno chcesz usunąć konto? Wszystkie dane zostaną trwale usunięte.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Tak, usuń
              </button>
              <button
                onClick={() => setConfirmOpen(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
