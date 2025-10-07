"use client";
import { useState } from "react";

export default function LessonRegenerateButton({
  topic,
  level,
  onRegenerate,
}: {
  topic: string;
  level: string;
  onRegenerate: (markdown: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [userNote, setUserNote] = useState("");

  async function handleRegenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/lessons/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level, userNote }),
      });

      if (!res.ok) throw new Error("Failed to generate lesson");

      const data = await res.json();
      onRegenerate(data.content); // markdown string
    } catch (err) {
      console.error(err);
      alert("❌ Nie udało się wygenerować nowej wersji lekcji");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
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
      <button
        onClick={handleRegenerate}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Generuję..." : "Wygeneruj ponownie lekcję"}
      </button>
    </div>
  );
}
