"use client";

import { useState, useMemo, useEffect } from "react";
import type { ChooseDefinitionItem } from "../features/types";
import ExerciseHeader from "../components/ExerciseHeader";
import ExerciseFooter from "../components/ExerciseFooter";
import FeedbackMessage from "../components/FeedbackMessage";

export default function ChooseDefinitionExerciseContainer({
  items,
  onComplete,
  lessonId,
}: {
  items: ChooseDefinitionItem[];
  onComplete: () => void;
  lessonId: string;
}) {
  const storageKey = `exercise-progress-${lessonId}-choose`;

  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [revealed, setRevealed] = useState<"none" | "hint" | "answer">("none");
  const [restored, setRestored] = useState(false);

  const total = items.length;
  const q = items[index];
  const progress = useMemo(
    () => Math.round(((index + 1) / total) * 100),
    [index, total]
  );

  // 🔹 Load saved progress
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.index < total) {
          setIndex(parsed.index ?? 0);
          setSelectedIndex(parsed.selectedIndex ?? null);
          setStatus(parsed.status ?? "idle");
          setRevealed(parsed.revealed ?? "none");
        }
      } catch {
        console.error("❌ Nie udało się wczytać postępu");
      }
    }
    setRestored(true);
  }, [storageKey, total]);

  // 🔹 Save progress
  useEffect(() => {
    if (!restored) return;
    const state = { index, selectedIndex, status, revealed };
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [index, selectedIndex, status, revealed, storageKey, restored]);

  function handleChoice(i: number) {
    if (status === "correct") return;
    setSelectedIndex(i);
    if (i === q.correctIndex) {
      setStatus("correct");
      setRevealed("none");
    } else {
      setStatus("wrong");
      setRevealed("none");
    }
  }

  function handleNext() {
    if (index + 1 < total) {
      setIndex(index + 1);
      setSelectedIndex(null);
      setStatus("idle");
      setRevealed("none");
    } else {
      localStorage.removeItem(storageKey);
      onComplete();
    }
  }

  const handleHintOrAnswer = () => {
    if (revealed === "none") setRevealed("hint");
    else if (revealed === "hint") setRevealed("answer");
  };

  if (!q) return <p>Brak pytań.</p>;

  return (
    <div className="flex flex-col gap-4">
      <ExerciseHeader
        title="Wybierz definicję"
        subtitle="Zaznacz poprawne znaczenie słowa"
        progress={progress}
        current={index + 1}
        total={total}
      />

      <h3 className="text-lg font-bold text-center text-green-800">
        {q.word}
      </h3>

      <div className="flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const picked = selectedIndex === i;

          let border = "border-green-300 bg-white hover:bg-green-50 cursor-pointer";
          if (picked && status === "correct")
            border = "border-green-600 bg-green-50";
          if (picked && status === "wrong")
            border = "border-red-500 bg-red-50";

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleChoice(i)}
              className={`p-3 border rounded-lg transition-colors duration-200 ${border}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* ✅ Poprawna odpowiedź */}
      {status === "correct" && (
        <FeedbackMessage type="correct" message="✅ Dobrze!" />
      )}

      {/* ❌ Zła odpowiedź */}
      {status === "wrong" && revealed === "none" && (
        <FeedbackMessage
          type="wrong"
          message="❌ Nie do końca. Spróbuj ponownie!"
        />
      )}

      {/* 💡 Podpowiedź */}
      {revealed === "hint" && q.hint && (
        <FeedbackMessage type="hint" message={`💡 Podpowiedź: ${q.hint}`} />
      )}

      {/* ✅ Poprawna odpowiedź ujawniona */}
      {revealed === "answer" && (
        <FeedbackMessage
          type="wrong"
          message={`✅ Poprawna odpowiedź: ${q.options[q.correctIndex]}`}
        />
      )}

      <ExerciseFooter
        leftLabel={
          revealed === "none"
            ? "Pokaż podpowiedź"
            : revealed === "hint"
            ? "Pokaż odpowiedź"
            : "Odpowiedź pokazana"
        }
        onLeftClick={handleHintOrAnswer}
        leftDisabled={revealed === "answer"}
        rightLabel={status === "correct" ? "Dalej" : "Sprawdź"}
        onRightClick={status === "correct" ? handleNext : () => {}}
        rightDisabled={selectedIndex == null && status !== "correct"}
      />
    </div>
  );
}
