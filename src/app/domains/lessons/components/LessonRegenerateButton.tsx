"use client";
import { useState } from "react";

export default function LessonRegenerateButton({
  topic,
  level,
  userNote,
  onRegenerate,
}: {
  topic: string;
  level: string;
  userNote?: string;
  onRegenerate: (markdown: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleRegenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/lessons/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level, userNote }),
      });

      if (!res.ok) throw new Error("Failed to generate lesson");

      const data = await res.json();        // ✅ we get { content: "markdown" }
      onRegenerate(data.content);           // ✅ send markdown to parent
    } catch (err) {
      console.error(err);
      alert("❌ Nie udało się wygenerować nowej wersji lekcji");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleRegenerate}
      disabled={loading}
      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
    >
      {loading ? "Generuję..." : "Wygeneruj ponownie"}
    </button>
  );
}
