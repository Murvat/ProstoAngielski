"use client";

import { useState, useCallback, useEffect } from "react";
import type { FillGapsItem } from "@/types";
import ExerciseHeader from "../components/ExerciseHeader";
import ExerciseFooter from "../components/ExerciseFooter";
import FeedbackMessage from "../components/FeedbackMessage";

type FillGapsExerciseContainerProps = {
  items: FillGapsItem[];
  onComplete: () => void;
  lessonId: string;
};

export default function FillGapsExerciseContainer({
  items,
  onComplete,
  lessonId,
}: FillGapsExerciseContainerProps) {
  const storageKey = `exercise-progress-${lessonId}-fillgaps`;

  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [revealed, setRevealed] = useState<"none" | "hint" | "answer">("none");
  const [restored, setRestored] = useState(false);

  const total = items.length;
  const question = items[index];
  const progress = Math.round(((index + 1) / total) * 100);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          index?: number;
          value?: string;
          status?: "idle" | "wrong" | "correct";
          revealed?: "none" | "hint" | "answer";
        };

        if (typeof parsed.index === "number" && parsed.index < total) {
          setIndex(parsed.index);
          setValue(parsed.value ?? "");
          setStatus(parsed.status ?? "idle");
          setRevealed(parsed.revealed ?? "none");
        }
      } catch (err) {
        console.error("Nie udało się odczytać zapisanego postępu ćwiczenia fill gaps.", err);
      }
    }
    setRestored(true);
  }, [storageKey, total]);

  useEffect(() => {
    if (!restored || typeof window === "undefined") return;
    const state = { index, value, status, revealed };
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [index, value, status, revealed, storageKey, restored]);

  const normalize = (text: string) => text.trim().toLowerCase().replace(/\s+/g, " ");

  const matches = (userInput: string, correctAnswer: string | string[]) => {
    const answers = Array.isArray(correctAnswer) ? correctAnswer : [correctAnswer];
    return answers.some((answer) => normalize(answer) === normalize(userInput));
  };

  const handleCheck = useCallback(() => {
    if (!question || !value.trim()) return;
    if (matches(value, question.answer)) {
      setStatus("correct");
      setRevealed("none");
    } else {
      setStatus("wrong");
    }
  }, [question, value]);

  const handleNext = useCallback(() => {
    if (index + 1 < total) {
      setIndex((prev) => prev + 1);
      setValue("");
      setStatus("idle");
      setRevealed("none");
    } else {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey);
      }
      onComplete();
    }
  }, [index, total, onComplete, storageKey]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter") return;
      if (status === "correct" || revealed === "answer") {
        handleNext();
      } else {
        handleCheck();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status, revealed, handleCheck, handleNext]);

  const handleReveal = () => {
    if (revealed === "none") {
      setRevealed("hint");
    } else if (revealed === "hint") {
      setRevealed("answer");
    }
  };

  if (!question) {
    return <p className="text-sm text-gray-500">Brak zadań typu „Uzupełnij luki”.</p>;
  }

  const showAnswer = Array.isArray(question.answer)
    ? question.answer.join(", ")
    : question.answer;

  return (
    <div className="flex flex-col gap-6">
      <ExerciseHeader
        title="Uzupełnij luki"
        subtitle="Wpisz brakujące słowo lub frazę tak, aby zdanie było poprawne."
        progress={progress}
        current={index + 1}
        total={total}
      />

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-5 text-sm font-medium text-emerald-900 shadow-inner md:text-base">
        {question.prompt}
      </div>

      <label className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">Twoja odpowiedź</span>
        <div className="group relative">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={status === "correct"}
            placeholder="Przepisz słowo lub frazę..."
            className="w-full rounded-2xl border border-emerald-100 bg-white px-5 py-3 text-base text-gray-800 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed"
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-emerald-100/20 to-teal-100/20 opacity-0 transition group-focus-within:opacity-100" />
        </div>
      </label>

      {status === "correct" && <FeedbackMessage type="correct" message="Świetnie! To poprawna odpowiedź." />}

      {status === "wrong" && revealed === "none" && (
        <FeedbackMessage type="wrong" message="Spróbuj jeszcze raz — zwróć uwagę na kontekst zdania." />
      )}

      {revealed === "hint" && question.hint && (
        <FeedbackMessage type="hint" message={`Podpowiedź: ${question.hint}`} />
      )}

      {revealed === "answer" && (
        <FeedbackMessage type="hint" message={`Poprawna odpowiedź: ${showAnswer}`} />
      )}

      <ExerciseFooter
        leftLabel={
          revealed === "none"
            ? "Pokaż podpowiedź"
            : revealed === "hint"
            ? "Pokaż odpowiedź"
            : "Odpowiedź została pokazana"
        }
        onLeftClick={handleReveal}
        leftDisabled={revealed === "answer"}
        rightLabel={status === "correct" || revealed === "answer" ? "Przejdź dalej" : "Sprawdź odpowiedź"}
        onRightClick={status === "correct" || revealed === "answer" ? handleNext : handleCheck}
        rightDisabled={!value.trim() && revealed !== "answer" && status !== "correct"}
      />
    </div>
  );
}
