"use client";

import { useState, useCallback, useEffect } from "react";
import type { FillGapsItem } from "../features/types";
import ExerciseHeader from "../components/ExerciseHeader";
import ExerciseFooter from "../components/ExerciseFooter";
import FeedbackMessage from "../components/FeedbackMessage";

export default function FillGapsExerciseContainer({
  items,
  onComplete,
  lessonId,
}: {
  items: FillGapsItem[];
  onComplete: () => void;
  lessonId: string;
}) {
  const storageKey = `exercise-progress-${lessonId}-fillgaps`;

  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [revealed, setRevealed] = useState<"none" | "hint" | "answer">("none");
  const [restored, setRestored] = useState(false); // ✅ guard against overwrite

  const total = items.length;
  const q = items[index];
  const progress = Math.round(((index + 1) / total) * 100);

  // 🔹 Restore saved progress
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.index < total) {
          setIndex(parsed.index ?? 0);
          setValue(parsed.value ?? "");
          setStatus(parsed.status ?? "idle");
          setRevealed(parsed.revealed ?? "none");
        }
      } catch {
        // fallback ignore
      }
    }
    setRestored(true);
  }, [storageKey, total]);

  // 🔹 Save after restore
  useEffect(() => {
    if (!restored) return;
    const state = { index, value, status, revealed };
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [index, value, status, revealed, storageKey, restored]);

  if (!q) return <p>No fill-gaps items.</p>;

  const normalize = (s: string) =>
    s.toLowerCase().trim().replace(/\s+/g, " ");
  const matches = (user: string, correct: string | string[]) => {
    const arr = Array.isArray(correct) ? correct : [correct];
    return arr.some((a) => normalize(a) === normalize(user));
  };

  const handleCheck = useCallback(() => {
    if (!value.trim()) return;
    if (matches(value, q.answer)) {
      setStatus("correct");
      setRevealed("none");
    } else {
      setStatus("wrong");
    }
  }, [value, q]);

  const handleNext = useCallback(() => {
    if (index + 1 < total) {
      setIndex((i) => i + 1);
      setValue("");
      setStatus("idle");
      setRevealed("none");
    } else {
      localStorage.removeItem(storageKey); // ✅ clear when finished
      onComplete();
    }
  }, [index, total, onComplete, storageKey]);

  // Allow Enter key to check/next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (status === "correct" || revealed === "answer") handleNext();
        else handleCheck();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [status, revealed, handleCheck, handleNext]);

  const handleHintOrAnswer = () => {
    if (revealed === "none") setRevealed("hint");
    else if (revealed === "hint") setRevealed("answer");
  };

  return (
    <div className="flex flex-col gap-4">
      <ExerciseHeader
        title="Fill in the blanks"
        subtitle="Complete the sentence"
        progress={progress}
        current={index + 1}
        total={total}
      />

      <p className="text-lg">{q.prompt}</p>
      <input
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={status === "correct"}
      />

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
          message={`Correct: ${
            Array.isArray(q.answer) ? q.answer.join(", ") : q.answer
          }`}
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
        rightLabel={
          status === "correct" || revealed === "answer" ? "Next" : "Check Answer"
        }
        onRightClick={
          status === "correct" || revealed === "answer"
            ? handleNext
            : handleCheck
        }
        rightDisabled={!value.trim() && revealed !== "answer" && status !== "correct"}
      />
    </div>
  );
}
