// src/domains/landing/components/ComparePreview.tsx
import { CheckIcon56 } from "@/icons/CheckIcon56";

export default function ComparePreview() {
  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 lg:py-20 flex flex-col gap-8">
      <h2 className="font-sans font-semibold text-3xl md:text-4xl leading-tight text-center">
        Czym się różni nasza Applikacja?
      </h2>

      <div className="flex flex-col lg:flex-row justify-center gap-8">
        {/* Card 1 - Our Course */}
        <div className="w-full max-w-md rounded-xl bg-green-100 border border-gray-200 p-6 flex flex-col gap-6 shadow-xl">
          <h3 className="text-xl font-semibold text-center">Nasza Applikacja</h3>

          <ul className="flex flex-col gap-3">
            {[
              "Jednorazowa opłata, bez abonamentu",
              "Kurs stworzony specjalnie dla Polaków",
              "Gramatyka, słownictwo, wszystko czego potrzebujesz",
              "Praktyczne przykłady",
              "Proste, jasne wyjaśnienia",
              "Materiały PDF do pobrania",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckIcon56 className="w-6 h-6 shrink-0" />
                <p className="flex-1 leading-snug text-base">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2 - Other Courses */}
        <div className="w-full max-w-md rounded-xl bg-red-50 p-6 flex flex-col gap-6 shadow-xl">
          <h3 className="text-xl font-semibold text-center">Inne Aplikacje</h3>

          <ul className="flex flex-col gap-3">
            {[
              "Miesięczny abonament – płacisz bez końca",
              "Brak końca – nie wiesz, kiedy to skończysz",
              "Wolniejsze tempo materiału – żebyś został w systemie jak najdłużej",
              "Brak realnych efektów",
              "Reklamy, rozpraszacze",
              "Niska motywacja – nie widzisz postępów",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="w-6 h-6 flex items-center justify-center text-red-500 text-lg font-bold">
                  ×
                </span>
                <p className="flex-1 leading-snug text-base">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
