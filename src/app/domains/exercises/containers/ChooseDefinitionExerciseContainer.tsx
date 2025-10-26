"use client";

import { useState, useMemo, useEffect } from "react";
import type { ChooseDefinitionItem } from "@/types";
import ExerciseHeader from "../components/ExerciseHeader";
import ExerciseFooter from "../components/ExerciseFooter";
import FeedbackMessage from "../components/FeedbackMessage";

type ChooseDefinitionExerciseContainerProps = {
  items: ChooseDefinitionItem[];
  onComplete: () => void;
  lessonId: string;
};

export default function ChooseDefinitionExerciseContainer({
  items,
  onComplete,
  lessonId,
}: ChooseDefinitionExerciseContainerProps) {
  const storageKey = `exercise-progress-${lessonId}-choose`;

  const [index, setIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [revealed, setRevealed] = useState<"none" | "hint" | "answer">("none");
  const [restored, setRestored] = useState(false);

  const total = items.length;
  const question = items[index];
  const progress = useMemo(() => Math.round(((index + 1) / total) * 100), [index, total]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          index?: number;
          selectedIndex?: number | null;
          status?: "idle" | "wrong" | "correct";
          revealed?: "none" | "hint" | "answer";
        };

        if (typeof parsed.index === "number" && parsed.index < total) {
          setIndex(parsed.index);
          setSelectedIndex(parsed.selectedIndex ?? null);
          setStatus(parsed.status ?? "idle");
          setRevealed(parsed.revealed ?? "none");
        }
      } catch (err) {
        console.error("Nie udało się wczytać zapisanego postępu ćwiczenia multiple choice.", err);
      }
    }
    setRestored(true);
  }, [storageKey, total]);

  useEffect(() => {
    if (!restored || typeof window === "undefined") return;
    const state = { index, selectedIndex, status, revealed };
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [index, selectedIndex, status, revealed, storageKey, restored]);

  const handleChoice = (choiceIndex: number) => {
    if (!question || status === "correct") return;
    setSelectedIndex(choiceIndex);
    if (choiceIndex === question.correctIndex) {
      setStatus("correct");
      setRevealed("none");
    } else {
      setStatus("wrong");
      setRevealed("none");
    }
  };

  const handleNext = () => {
    if (index + 1 < total) {
      setIndex((prev) => prev + 1);
      setSelectedIndex(null);
      setStatus("idle");
      setRevealed("none");
    } else {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(storageKey);
      }
      onComplete();
    }
  };

  const handleReveal = () => {
    if (revealed === "none") setRevealed("hint");
    else if (revealed === "hint") setRevealed("answer");
  };

  if (!question) {
    return <p className="text-sm text-gray-500">Brak pytań dla modułu „Multiple choice”.</p>;
  }

  const correctAnswer = question.options[question.correctIndex];

  return (
    <div className="flex flex-col gap-6">
      <ExerciseHeader
        title="Wybierz poprawną odpowiedź"
        subtitle="Zaznacz definicję, która najlepiej pasuje do podanego słowa."
        progress={progress}
        current={index + 1}
        total={total}
      />

      <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-5 text-center text-lg font-semibold text-emerald-700 shadow-sm md:text-xl">
        {question.word}
      </div>

      <div className="grid gap-3">
        {question.options.map((option, optionIndex) => {
          const isSelected = selectedIndex === optionIndex;
          const isCorrectPick = isSelected && status === "correct";
          const isWrongPick = isSelected && status === "wrong";
          const isRevealedCorrect = revealed === "answer" && optionIndex === question.correctIndex;

          const baseClasses =
            "group flex w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-200 md:text-base";

          const stateClasses = (() => {
            if (isCorrectPick || isRevealedCorrect) {
              return "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-inner";
            }
            if (isWrongPick) {
              return "border-red-200 bg-red-50 text-red-600";
            }
            if (isSelected) {
              return "border-emerald-300 bg-white text-emerald-700 shadow";
            }
            return "border-emerald-100 bg-white text-gray-700 hover:border-emerald-200 hover:bg-emerald-50/60";
          })();

          return (
            <button
              key={optionIndex}
              type="button"
              onClick={() => handleChoice(optionIndex)}
              className={`${baseClasses} ${stateClasses}`}
              disabled={status === "correct"}
            >
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition ${
                  isCorrectPick || isRevealedCorrect
                    ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                    : isWrongPick
                    ? "border-red-200 bg-red-100 text-red-600"
                    : "border-emerald-100 bg-emerald-50 text-emerald-600 group-hover:border-emerald-200 group-hover:bg-emerald-100"
                }`}
              >
                {String.fromCharCode(65 + optionIndex)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {status === "correct" && <FeedbackMessage type="correct" message="Brawo! Wybrałeś właściwą odpowiedź." />}

      {status === "wrong" && revealed === "none" && (
        <FeedbackMessage type="wrong" message="To nie ta odpowiedź. Przeanalizuj zdanie i spróbuj ponownie." />
      )}

      {revealed === "hint" && question.hint && (
        <FeedbackMessage type="hint" message={`Podpowiedź: ${question.hint}`} />
      )}

      {revealed === "answer" && (
        <FeedbackMessage type="hint" message={`Poprawna odpowiedź: ${correctAnswer}`} />
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
        rightLabel={status === "correct" || revealed === "answer" ? "Przejdź dalej" : "Potwierdź wybór"}
        onRightClick={status === "correct" || revealed === "answer" ? handleNext : () => undefined}
        rightDisabled={selectedIndex == null && revealed !== "answer" && status !== "correct"}
      />
    </div>
  );
}
