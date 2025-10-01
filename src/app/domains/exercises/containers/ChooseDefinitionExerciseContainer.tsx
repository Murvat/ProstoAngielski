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
  const [restored, setRestored] = useState(false); // ✅ prevent overwrite before restore

  const total = items.length;
  const q = items[index];
  const progress = useMemo(
    () => Math.round(((index + 1) / total) * 100),
    [index, total]
  );

  // 🔹 Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    console.log("🔄 Loading from localStorage:", saved);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("✅ Parsed progress:", parsed);

        if (parsed.index < total) {
          setIndex(parsed.index ?? 0);
          setSelectedIndex(parsed.selectedIndex ?? null);
          setStatus(parsed.status ?? "idle");
          setRevealed(parsed.revealed ?? "none");
        }
      } catch (err) {
        console.error("❌ Failed to parse saved progress", err);
      }
    }

    setRestored(true); // mark restore complete
  }, [storageKey, total]);

  // 🔹 Save state to localStorage only after restore
  useEffect(() => {
    if (!restored) return; // don’t overwrite before restore

    const state = { index, selectedIndex, status, revealed };
    console.log("💾 Saving to localStorage:", state);
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [index, selectedIndex, status, revealed, storageKey, restored]);

  if (!q) return <p>No questions.</p>;

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
      localStorage.removeItem(storageKey); // ✅ clear progress when done
      onComplete();
    }
  }

  const handleHintOrAnswer = () => {
    if (revealed === "none") setRevealed("hint");
    else if (revealed === "hint") setRevealed("answer");
  };

  return (
    <div className="flex flex-col gap-4">
      <ExerciseHeader
        title="Choose the definition"
        subtitle="Pick the correct meaning"
        progress={progress}
        current={index + 1}
        total={total}
      />

      <h3 className="text-lg font-bold text-center">{q.word}</h3>

      <div className="flex flex-col gap-2">
        {q.options.map((opt, i) => {
          const picked = selectedIndex === i;

          let border = "border-green-300 bg-white";
          if (picked && status === "correct")
            border = "border-green-600 bg-green-50";
          if (picked && status === "wrong")
            border = "border-red-500 bg-red-50";

          return (
            <button
              key={i}
              type="button"
              onClick={() => handleChoice(i)}
              className={`p-3 border rounded-lg ${border}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* ✅ Correct */}
      {status === "correct" && (
        <FeedbackMessage type="correct" message="Correct!" />
      )}

      {/* ❌ Wrong */}
      {status === "wrong" && revealed === "none" && (
        <FeedbackMessage type="wrong" message="Not quite right. Try again!" />
      )}

      {/* 💡 Hint */}
      {revealed === "hint" && q.hint && (
        <FeedbackMessage type="hint" message={q.hint} />
      )}

      {/* ✅ Show Answer */}
      {revealed === "answer" && (
        <FeedbackMessage
          type="wrong"
          message={`Correct answer: ${q.options[q.correctIndex]}`}
        />
      )}

      <ExerciseFooter
        leftLabel={
          revealed === "none"
            ? "Show Hint"
            : revealed === "hint"
            ? "Show Answer"
            : "Answer Shown"
        }
        onLeftClick={handleHintOrAnswer}
        leftDisabled={revealed === "answer"}
        rightLabel={status === "correct" ? "Next" : "Check Answer"}
        onRightClick={status === "correct" ? handleNext : () => {}}
        rightDisabled={selectedIndex == null && status !== "correct"}
      />
    </div>
  );
}
