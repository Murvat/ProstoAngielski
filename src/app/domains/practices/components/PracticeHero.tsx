"use client";

import { useRouter } from "next/navigation";

export default function PracticeHero() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-100">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-24 h-72 w-72 rounded-full bg-emerald-200 blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-orange-200 blur-3xl opacity-50" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 text-center lg:flex-row lg:items-center lg:text-left">
        <div className="flex-1 space-y-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-emerald-200">
            Ćwiczysz bez logowania – testujesz realnie
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Practise Zone: darmowe zadania i fiszki, które pokazują moc PROSTOANGIELSKI
          </h1>
          <p className="text-lg text-gray-600 md:text-xl">
            Poznaj jakość kursu mobilnego bez zakładania konta. Wybierz poziom, rozwiązuj zadania, trenuj słownictwo i sprawdź wyniki.
            Po wszystkim czeka na Ciebie dynamiczny baner zachęcający do dołączenia do kursu.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start">
            <button
              onClick={() => router.push("/signup")}
              className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:from-emerald-400 hover:to-green-500 sm:w-auto"
            >
              Załóż konto i odblokuj pełną wersję
            </button>
            <button
              onClick={() => router.push("/login")}
              className="w-full rounded-full border border-emerald-500 px-8 py-3 text-base font-semibold text-emerald-600 transition hover:bg-emerald-50 sm:w-auto"
            >
              Mam już konto
            </button>
          </div>
        </div>

        <div className="flex-1 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-xl backdrop-blur">
          <h2 className="text-xl font-semibold text-emerald-700">
            Co znajdziesz w strefie praktyk?
          </h2>
          <ul className="mt-5 space-y-4 text-left text-sm text-gray-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span>
                Ćwiczenia gramatyczne typu cloze, uzupełnianie luk, multiple-choice i układanie zdań.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span>
                Fiszki z tłumaczeniami, podpowiedziami i przykładowymi zdaniami – odwróć kartę i oceń swoją pamięć.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span>
                Słownictwo tematyczne i tryb mieszany (50 pytań), aby sprawdzić, co już umiesz.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              <span>
                Wszystkie wyniki zapisują się w Twojej przeglądarce – wróć w dowolnej chwili i kontynuuj.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
