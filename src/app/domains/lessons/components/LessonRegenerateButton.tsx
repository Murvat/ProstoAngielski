"use client";
import { useState, useEffect } from "react";
import { Info } from "lucide-react"; // ✅ subtle icon

export default function LessonRegenerateButton({
  topic,
  level,
  lessonId,
  course,
  onRegenerate,
  setLoading,
}: {
  topic: string;
    level: string;
    lessonId: string;
  course: string;
  onRegenerate: (markdown: string) => void;
  setLoading: (state: boolean) => void;
}) {
  const [userNote, setUserNote] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [localLoading, setLocalLoading] = useState(false);

  // ✅ Fetch remaining regenerations
  async function fetchRemaining() {
    try {
      const res = await fetch(
        `/api/lessons/progress?lesson_id=${lessonId}&course=${course}`
      );
      if (!res.ok) return;
      const data = await res.json();
      const used = data?.regenerate_count ?? 0;
      setRemaining(Math.max(3 - used, 0));
    } catch (err) {
      console.error("Failed to load regenerate count", err);
    }
  }

  useEffect(() => {
    fetchRemaining();
  }, [topic, course]);

  // ✅ Handle regeneration
  async function handleRegenerate() {
    setLocalLoading(true);
    setLoading(true);
    try {
      const res = await fetch("/api/lessons/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level, userNote, course,lessonId }),
      });

      if (res.status === 403) {
        await fetchRemaining();
        return;
      }

      if (!res.ok) throw new Error("Failed to generate lesson");

      const data = await res.json();
      onRegenerate(data.content);
      await fetchRemaining();
    } catch (err) {
      console.error(err);
      alert("❌ Nie udało się wygenerować nowej wersji lekcji");
    } finally {
      setLocalLoading(false);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full text-center">
      {remaining !== null && remaining === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
          <Info className="w-6 h-6 text-gray-400" />
          <p className="text-gray-600 font-medium">
            Brak dostępnych regeneracji.
          </p>
          <p className="text-sm text-gray-500">
            Limit 3 prób został wykorzystany.
          </p>
        </div>
      ) : (
        <>
          <label className="text-sm font-medium text-gray-600">
            Dodaj własne instrukcje (opcjonalnie)
          </label>

          <input
            type="text"
            placeholder="Np. Dodaj więcej ćwiczeń lub dialogi..."
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />

          {remaining !== null && (
            <p className="text-sm text-gray-500">
              Pozostałe regeneracje: {remaining}
            </p>
          )}

          <button
            onClick={handleRegenerate}
            disabled={localLoading || remaining === 0}
            className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {localLoading ? "Generuję..." : "Wygeneruj ponownie lekcję"}
          </button>
        </>
      )}
    </div>
  );
}
