"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { SectionSummary } from "../utils/progress";

type Props = {
  levelLabel: string;
  tasks: SectionSummary;
  flashcards: SectionSummary;
  vocabulary: SectionSummary;
};

export default function PracticeShareBanner({
  levelLabel,
  tasks,
  flashcards,
  vocabulary,
}: Props) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const createShareImage = useCallback(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#10b981");
    gradient.addColorStop(0.5, "#34d399");
    gradient.addColorStop(1, "#3b82f6");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.beginPath();
    ctx.arc(canvas.width - 150, 120, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 60px 'Inter', sans-serif";
    ctx.fillText("Strefa praktyk PROSTOANGIELSKI", 60, 120);

    ctx.font = "bold 46px 'Inter', sans-serif";
    ctx.fillText(`Poziom: ${levelLabel}`, 60, 200);

    ctx.font = "400 30px 'Inter', sans-serif";
    const lines = [
      `Ćwiczenia: ${tasks.correct}/${tasks.total}`,
      `Fiszki: ${flashcards.correct}/${flashcards.total}`,
      `Słownictwo: ${vocabulary.correct}/${vocabulary.total}`,
    ];

    lines.forEach((line, index) => {
      ctx.fillText(line, 60, 280 + index * 60);
    });

    ctx.font = "bold 28px 'Inter', sans-serif";
    ctx.fillText("Sprawdź, jak wygląda pełny kurs na prostoangielski.pl", 60, 480);

    ctx.font = "24px 'Inter', sans-serif";
    ctx.fillText("Podziel się wynikiem i dołącz do naszej społeczności!", 60, 540);

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }, [flashcards.correct, flashcards.total, levelLabel, tasks.correct, tasks.total, vocabulary.correct, vocabulary.total]);

  const downloadImage = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prostoangielski-${levelLabel.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [levelLabel]);

  const handleShare = async () => {
    try {
      setGenerating(true);
      const blob = await createShareImage();
      if (!blob) throw new Error("Nie udało się wygenerować grafiki.");

      const file = new File([blob], `prostoangielski-${Date.now()}.png`, { type: "image/png" });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Moje wyniki – ${levelLabel}`,
          text: "Sprawdź mój wynik w strefie praktyk PROSTOANGIELSKI!",
          files: [file],
        });
        setCopied(true);
      } else {
        downloadImage(blob);
        setCopied(true);
      }
    } catch (error) {
      console.error("[Practices] nie udało się udostępnić grafiki:", error);
      alert("Przepraszamy! Nie udało się wygenerować grafiki. Spróbuj ponownie.");
    } finally {
      setGenerating(false);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-blue-500 p-8 text-white shadow-xl">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold">
            Podziel się wynikiem i przejdź na pełną wersję!
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/80">
            Wyniki z tego poziomu zapisaliśmy w Twojej przeglądarce. Pochwal się znajomym i zobacz, jak wygląda pełny kurs z dostępem do wszystkich modułów, planów nauki i statystyk.
          </p>
          <dl className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/15 p-4">
              <dt className="text-xs uppercase text-white/80">Ćwiczenia</dt>
              <dd className="text-xl font-semibold">
                {tasks.correct}/{tasks.total}
              </dd>
            </div>
            <div className="rounded-2xl bg-white/15 p-4">
              <dt className="text-xs uppercase text-white/80">Fiszki</dt>
              <dd className="text-xl font-semibold">
                {flashcards.correct}/{flashcards.total}
              </dd>
            </div>
            <div className="rounded-2xl bg-white/15 p-4">
              <dt className="text-xs uppercase text-white/80">Słownictwo</dt>
              <dd className="text-xl font-semibold">
                {vocabulary.correct}/{vocabulary.total}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleShare}
            disabled={generating}
            className="w-full rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-600 shadow-lg transition hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 lg:w-64"
          >
            {generating
              ? "Generuję grafikę..."
              : copied
              ? "Gotowe! Udostępnij obraz"
              : "Udostępnij wynik jako grafikę"}
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="w-full rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 lg:w-64"
          >
            Załóż konto – pełen dostęp
          </button>
        </div>
      </div>
    </section>
  );
}
