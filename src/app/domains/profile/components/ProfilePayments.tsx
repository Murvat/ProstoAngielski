"use client";

import { Purchase, Course, Subscription } from "../features/types";
import { motion } from "framer-motion";
import { CreditCard, Wallet, Clock, AlertCircle } from "lucide-react";

interface ProfilePaymentsProps {
  purchases: Purchase[];
  allCourses: Course[];
  subscriptions?: Subscription[];
}

export const ProfilePayments = ({
  purchases,
  allCourses,
  subscriptions = [],
}: ProfilePaymentsProps) => {
  const getCourseTitle = (
    courseRef: string | { id: string; title?: string }
  ): string => {
    const courseId = typeof courseRef === "string" ? courseRef : courseRef.id;
    const found = allCourses.find((c) => c.id === courseId);
    return found?.title || "Nieznany kurs";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-12"
    >
      {/* 🔹 Subskrypcje */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-6 h-6 text-green-600" />
          <h2 className="text-2xl font-bold text-green-800">Płatności</h2>
        </div>

        <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-600" /> Subskrypcje
        </h3>

        {subscriptions.length === 0 ? (
          <p className="text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-4">
            Nie masz aktywnych subskrypcji.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-green-50 border-b border-gray-200 text-left text-green-900">
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Dostawca</th>
                  <th className="py-3 px-4">Rozpoczęta</th>
                  <th className="py-3 px-4">Koniec okresu</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((s) => (
                  <motion.tr
                    key={s.id}
                    whileHover={{ scale: 1.01, backgroundColor: "#f0fdf4" }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-gray-100 last:border-0 cursor-pointer"
                  >
                    <td className="py-3 px-4 capitalize">{s.plan}</td>
                    <td
                      className={`py-3 px-4 font-medium ${
                        s.status === "active"
                          ? "text-green-600"
                          : s.status === "canceled"
                          ? "text-yellow-600"
                          : "text-gray-500"
                      }`}
                    >
                      {s.status === "active"
                        ? "Aktywna"
                        : s.status === "canceled"
                        ? "Anulowana"
                        : "Wygasła"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {s.payment_provider ?? "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {s.started_at
                        ? new Date(s.started_at).toLocaleDateString("pl-PL")
                        : "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(s.period_end).toLocaleDateString("pl-PL")}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 🔹 Zakupy */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-green-600" /> Zakupione kursy
        </h3>

        {purchases.length === 0 ? (
          <p className="text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-4">
            Nie masz jeszcze żadnych płatności.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
            <table className="w-full text-sm text-gray-700">
              <thead>
                <tr className="bg-green-50 border-b border-gray-200 text-left text-green-900">
                  <th className="py-3 px-4">Kurs</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Dostawca</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4">ID transakcji</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <motion.tr
                    key={p.id}
                    whileHover={{ scale: 1.01, backgroundColor: "#f0fdf4" }}
                    transition={{ duration: 0.2 }}
                    className="border-b border-gray-100 last:border-0 cursor-pointer"
                  >
                    <td className="py-3 px-4 font-medium">
                      {getCourseTitle(p.course)}
                    </td>
                    <td
                      className={`py-3 px-4 font-medium ${
                        p.payment_status === "paid"
                          ? "text-green-600"
                          : p.payment_status === "failed"
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {p.payment_status === "paid"
                        ? "Opłacono"
                        : p.payment_status === "failed"
                        ? "Nieudana"
                        : "Oczekuje"}
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {p.payment_provider ?? "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {p.paid_at
                        ? new Date(p.paid_at).toLocaleDateString("pl-PL")
                        : "—"}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {p.payment_id ?? "—"}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Info note */}
      <div className="flex items-center gap-2 text-gray-500 text-sm mt-4">
        <AlertCircle className="w-4 h-4 text-gray-400" />
        Dane płatności są aktualizowane automatycznie po każdej transakcji.
      </div>
    </motion.div>
  );
};
