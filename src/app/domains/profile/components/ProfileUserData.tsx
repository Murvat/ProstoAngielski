"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client/supabaseClient";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Trash2, X } from "lucide-react";

export const ProfileUserData = ({ id, email }: { id: string; email?: string }) => {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    try {
      setDeleting(true);
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
    } finally {
      setDeleting(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto bg-white/80 backdrop-blur-md border border-gray-100 shadow-md rounded-2xl p-6"
    >
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Dane osobiste
      </h2>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="text-green-600 w-5 h-5" />
          <p className="text-gray-800 font-medium">
            <span className="text-gray-500 mr-2">ID użytkownika:</span> {id}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="text-green-600 w-5 h-5" />
          <p className="text-gray-800 font-medium">
            <span className="text-gray-500 mr-2">Email:</span> {email}
          </p>
        </div>
      </div>

      {/* Delete account section */}
      <div className="mt-8 border-t pt-6">
        <h3 className="text-red-600 font-semibold mb-2 flex items-center gap-2">
          <Trash2 className="w-5 h-5" /> Usuń konto
        </h3>
        <p className="text-gray-600 text-sm mb-5">
          Wszystkie dane, kursy i postępy zostaną{" "}
          <strong>trwale usunięte</strong>. Tej operacji nie można cofnąć.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setConfirmOpen(true)}
          className="bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md 
                     hover:shadow-lg hover:from-red-600 hover:to-rose-700 active:scale-95 transition-all"
        >
          Usuń konto
        </motion.button>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-sm text-center relative"
            >
              <button
                onClick={() => setConfirmOpen(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>

              <Trash2 className="w-10 h-10 text-red-600 mx-auto mb-3" />
              <h4 className="font-semibold text-lg mb-3">
                Potwierdź usunięcie konta
              </h4>
              <p className="text-gray-600 text-sm mb-6">
                Czy na pewno chcesz usunąć konto? Wszystkie dane zostaną trwale
                usunięte i nie będzie można ich odzyskać.
              </p>

              <div className="flex justify-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-70"
                >
                  {deleting ? "Usuwanie..." : "Tak, usuń"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfirmOpen(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Anuluj
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
