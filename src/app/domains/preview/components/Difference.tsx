import { BookOpenCheck } from "lucide-react";
import { ClipboardCheck } from "lucide-react";
import { MessageSquareText } from "lucide-react";

export default function DifferencePreview() {
  return (
    <section className="max-w-screen-xl mx-auto py-12 px-4 flex flex-col gap-12 items-center">
      <h2 className="font-sans font-semibold text-3xl md:text-4xl text-center leading-tight">
        Dlaczego warto uczyć się w naszej aplikacji
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 - Gramatyka */}
        <div className="w-full max-w-sm rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow">
          <h3 className="text-xl font-semibold">Gramatyka</h3>
          <ul className="flex flex-col gap-3">
            {[
              "Krótkie, zrozumiałe podsumowania lekcji",
              "Konkretne, jasne wyjaśnienia",
              "Praktyczne przykłady z życia codziennego",
              "Bez zbędnej teorii",
              "Skuteczne techniki powtórek",
              "Materiały PDF do pobrania",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <BookOpenCheck className="w-6 h-6 shrink-0" />
                <p className="flex-1 text-base leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2 - Ćwiczenia */}
        <div className="w-full max-w-sm rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow">
          <h3 className="text-xl font-semibold">Ćwiczenia</h3>
          <ul className="flex flex-col gap-3">
            {[
              "Interaktywne ćwiczenia",
              "Zadania dopasowane do poziomu",
              "Ćwiczenia oparte na codziennych sytuacjach",
              "Możliwość śledzenia postępów",
              "Zadania rozwijające wszystkie umiejętności",
              "Nauka w dowolnym miejscu (także na telefonie)",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <ClipboardCheck className="w-6 h-6 shrink-0" />
                <p className="flex-1 text-base leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 3 - Słownictwo */}
        <div className="w-full max-w-sm rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow">
          <h3 className="text-xl font-semibold">Słownictwo</h3>
          <ul className="flex flex-col gap-3">
            {[
              "Codzienne słowa i wyrażenia",
              "Idiomy i kolokacje",
              "Konkretny zakres słownictwa w każdej lekcji",
              "Materiały do samodzielnej nauki",
              "Powtórki w systemie zapamiętywania",
              "Łatwy dostęp na urządzeniach mobilnych",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <MessageSquareText className="w-6 h-6 shrink-0" />
                <p className="flex-1 text-base leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
