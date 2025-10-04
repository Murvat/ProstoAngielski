"use client";
import { Purchase, Course, Subscription } from "../features/types";

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
    <div>
      <h2 className="text-lg font-semibold mb-4">Płatności</h2>

      {/* ✅ Subscriptions section */}
      <div className="mb-8">
        <h3 className="text-md font-semibold mb-2">Subskrypcje</h3>

        {subscriptions.length === 0 ? (
          <p className="text-gray-500">Nie masz aktywnych subskrypcji.</p>
        ) : (
          <table className="w-full text-sm border-t border-gray-200">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2">Plan</th>
                <th className="py-2">Status</th>
                <th className="py-2">Dostawca</th>
                <th className="py-2">Rozpoczęta</th>
                <th className="py-2">Koniec okresu</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((s) => (
                <tr key={s.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2 capitalize">{s.plan}</td>
                  <td
                    className={`py-2 font-medium ${
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
                  <td className="py-2 text-gray-700">
                    {s.payment_provider ?? "—"}
                  </td>
                  <td className="py-2 text-gray-500">
                    {s.started_at
                      ? new Date(s.started_at).toLocaleDateString("pl-PL")
                      : "—"}
                  </td>
                  <td className="py-2 text-gray-500">
                    {new Date(s.period_end).toLocaleDateString("pl-PL")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ✅ Purchases section */}
      <div>
        <h3 className="text-md font-semibold mb-2">Zakupione kursy</h3>
        {purchases.length === 0 ? (
          <p className="text-gray-500">Nie masz jeszcze żadnych płatności.</p>
        ) : (
          <table className="w-full text-sm border-t border-gray-200">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2">Kurs</th>
                <th className="py-2">Status</th>
                <th className="py-2">Dostawca</th>
                <th className="py-2">Data</th>
                <th className="py-2">ID transakcji</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition">
                  <td className="py-2">{getCourseTitle(p.course)}</td>
                  <td
                    className={`py-2 font-medium ${
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
                  <td className="py-2 text-gray-700">
                    {p.payment_provider ?? "—"}
                  </td>
                  <td className="py-2 text-gray-500">
                    {p.paid_at
                      ? new Date(p.paid_at).toLocaleDateString("pl-PL")
                      : "—"}
                  </td>
                  <td className="py-2 text-gray-500">{p.payment_id ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
