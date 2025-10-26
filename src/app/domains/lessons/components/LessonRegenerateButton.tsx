"use client";

import { useCallback, useEffect, useState } from "react";
import { Info, RefreshCw } from "lucide-react";

const MAX_REGENERATIONS = 3;

type Props = {
  topic: string;
  level: string;
  lessonId: string;
  course: string;
  onRegenerate: (markdown: string) => void;
  setLoading: (state: boolean) => void;
};

export default function LessonRegenerateButton({
  topic,
  level,
  lessonId,
  course,
  onRegenerate,
  setLoading,
}: Props) {
  const [userNote, setUserNote] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  const fetchRemaining = useCallback(async () => {
    try {
      const res = await fetch(`/api/lessons/progress?lesson_id=${lessonId}&course=${course}`);
      if (!res.ok) return;
      const data = await res.json();
      const used = data?.regenerate_count ?? 0;
      setRemaining(Math.max(MAX_REGENERATIONS - used, 0));
    } catch (error) {
      console.error("Nie udało się pobrać limitu regeneracji", error);
    }
  }, [course, lessonId]);

  useEffect(() => {
    fetchRemaining();
  }, [fetchRemaining]);

  const handleRegenerate = async () => {
    setLocalLoading(true);
    setLoading(true);
    try {
      const res = await fetch("/api/lessons/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level, userNote, course, lessonId }),
      });

      if (res.status === 403) {
        await fetchRemaining();
        return;
      }

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();
      onRegenerate(data.content);
      await fetchRemaining();
      setUserNote("");
    } catch (error) {
      console.error(error);
      alert("Nie udało się wygenerować nowej wersji lekcji. Spróbuj ponownie.");
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  };

  const disabled = localLoading || remaining === 0;

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white shadow-md shadow-emerald-100/40">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start md:justify-between md:gap-10 md:p-8">
        <div className="space-y-3 md:max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-500">Personalizacja</p>
          <h3 className="text-2xl font-semibold text-gray-900 md:text-3xl">Wygeneruj nową wersję lekcji</h3>
          <p className="text-sm text-gray-600 md:text-base">
            Dodaj krótką notatkę, a treść zostanie dopasowana do Twoich celów. Masz do dyspozycji trzy regeneracje na
            każdą lekcję, dzięki czemu łatwo dostosujesz materiał do swoich potrzeb.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 md:max-w-sm">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500" htmlFor="lesson-note">
            Twoje instrukcje
          </label>
          <input
            id="lesson-note"
            type="text"
            placeholder="Np. dodaj dialog, rozbuduj sekcję o czasy przeszłe..."
            value={userNote}
            onChange={(event) => setUserNote(event.target.value)}
            className="w-full rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-gray-700 shadow-inner placeholder:text-emerald-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <button
              onClick={handleRegenerate}
              disabled={disabled}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:from-emerald-400 hover:to-teal-400 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${localLoading ? "animate-spin" : ""}`} />
              {localLoading ? "Generuję treść..." : "Wygeneruj ponownie"}
            </button>

            {remaining !== null && (
              <div className="flex w-full items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-700 md:w-auto md:gap-3">
                <span className="font-medium">Pozostałe regeneracje</span>
                <span className="text-base font-semibold">
                  {remaining}/{MAX_REGENERATIONS}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {remaining !== null && remaining === 0 && (
        <div className="flex flex-col items-start gap-2 rounded-b-3xl border-t border-orange-200 bg-orange-50 px-6 py-4 text-sm text-orange-700 md:px-8">
          <div className="flex items-center gap-3 font-semibold">
            <Info className="h-5 w-5" />
            Wykorzystałeś dostępny limit regeneracji.
          </div>
          <p className="text-xs text-orange-600">
            Odśwież stronę lub wróć później, aby sprawdzić, czy limit został ponownie udostępniony.
          </p>
        </div>
      )}
    </section>
  );
}

