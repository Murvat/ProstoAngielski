"use client";

import { useRouter } from "next/navigation";
import { CheckCircle, BadgeCheck } from "lucide-react";
import { useCourse } from "../features/useCourse";

export default function PricesPreview() {
  const router = useRouter();
  const { courses, loading, error } = useCourse();

  if (loading) {
    return (
      <section className="w-full max-w-screen-xl mx-auto py-6 px-4 flex flex-col items-center text-center">
        <p>Ładowanie kursów...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-screen-xl mx-auto py-6 px-4 flex flex-col items-center text-center">
        <p className="text-red-600">Błąd: {error}</p>
      </section>
    );
  }

  return (
    <section className="w-full max-w-screen-xl mx-auto py-12 px-4 flex flex-col items-center text-center gap-12">
      <div className="max-w-2xl flex flex-col gap-4">
        <h2 className="font-sans font-semibold text-3xl md:text-4xl leading-tight tracking-tight">
          Jednorazowa, łatwa opłata.
        </h2>
        <p className="text-base md:text-lg leading-relaxed">
          Nie lubimy abonamentów. Płacisz raz, masz wszystko.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full justify-items-center">
        {courses.map((c) => (
          <div
            key={c.id}
            className={`w-full max-w-sm flex flex-col justify-between rounded-xl p-6 shadow-2xl transition-transform ${
              c.id === "intermediate"
                ? "bg-green-50 scale-105 relative z-10"
                : "bg-white"
            }`}
          >
            <div className="flex flex-col items-start gap-4 w-full">
              {c.id === "intermediate" && (
                <span className="text-xs uppercase font-bold text-green-700">
                  Najpopularniejszy
                </span>
              )}

              <h3 className="text-xl font-semibold">{c.title}</h3>
              <p
                className={`${
                  c.id === "intermediate" ? "text-3xl md:text-4xl" : "text-2xl"
                } font-bold`}
              >
                {c.price / 100} zł
              </p>

              <ul className="text-sm leading-relaxed flex flex-col gap-3 w-full">
                {c.features.map((item) => (
                  <li key={item} className="flex items-center gap-3 w-full">
                    {c.id === "intermediate" ? (
                       <BadgeCheck className="w-6 h-6 shrink-0 text-green-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 shrink-0 text-green-600" />
                    )}
                    <span className="leading-snug text-left">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => router.push("/signup")}
              className="mt-6 w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md transition-colors"
            >
              Załóż konto
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
