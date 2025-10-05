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
  const [restored, setRestored] = useState(false);

  const total = items.length;
  const q = items[index];
  const progress = Math.round(((index + 1) / total) * 100);

  // 🔹 Przywróć zapisany postęp
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
        console.error("❌ Nie udało się odczytać zapisanych danych");
      }
    }
    setRestored(true);
  }, [storageKey, total]);

  // 🔹 Zapisz postęp po przywróceniu
  useEffect(() => {
    if (!restored) return;
    const state = { index, value, status, revealed };
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [index, value, status, revealed, storageKey, restored]);

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
      localStorage.removeItem(storageKey);
      onComplete();
    }
  }, [index, total, onComplete, storageKey]);

  // Enter = sprawdź / dalej
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

  if (!q) return <p>Brak zadań typu „uzupełnij luki”.</p>;

  return (
    <div className="flex flex-col gap-4">
      <ExerciseHeader
        title="Uzupełnij luki"
        subtitle="Wpisz brakujące słowo"
        progress={progress}
        current={index + 1}
        total={total}
      />

      <p className="text-lg font-medium text-gray-800">{q.prompt}</p>
      <input
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-green-500 focus:ring-green-500 
        hover:border-green-400 transition-colors duration-200 cursor-pointer"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={status === "correct"}
      />

      {/* ✅ Poprawna odpowiedź */}
      {status === "correct" && (
        <FeedbackMessage type="correct" message="✅ Dobrze!" />
      )}

      {/* ❌ Niepoprawna odpowiedź */}
      {status === "wrong" && revealed === "none" && (
        <FeedbackMessage
          type="wrong"
          message="❌ Nie do końca dobrze. Spróbuj ponownie!"
        />
      )}

      {/* 💡 Podpowiedź */}
      {revealed === "hint" && q.hint && (
        <FeedbackMessage type="hint" message={`💡 Podpowiedź: ${q.hint}`} />
      )}

      {/* ✅ Pokaż odpowiedź */}
      {revealed === "answer" && (
        <FeedbackMessage
          type="wrong"
          message={`✅ Poprawna odpowiedź: ${
            Array.isArray(q.answer) ? q.answer.join(", ") : q.answer
          }`}
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
        rightLabel={
          status === "correct" || revealed === "answer"
            ? "Dalej"
            : "Sprawdź odpowiedź"
        }
        onRightClick={
          status === "correct" || revealed === "answer"
            ? handleNext
            : handleCheck
        }
        rightDisabled={
          !value.trim() && revealed !== "answer" && status !== "correct"
        }
      />
    </div>
  );
}
