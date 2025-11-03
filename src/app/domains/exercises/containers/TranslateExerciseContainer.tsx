"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { TranslateItem } from "@/types";
import ExerciseHeader from "../components/ExerciseHeader";
import ExerciseFooter from "../components/ExerciseFooter";
import FeedbackMessage from "../components/FeedbackMessage";

type TranslateExerciseContainerProps = {
  items: TranslateItem[];
  onComplete: () => void;
  lessonId: string;
};

export default function TranslateExerciseContainer({
  items,
  onComplete,
  lessonId,
}: TranslateExerciseContainerProps) {
  const storageKey = `exercise-progress-${lessonId}-translate`;

  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [revealed, setRevealed] = useState<"none" | "hint" | "answer">("none");
  const [restored, setRestored] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
        console.error("Nie udało się odczytać zapisanego postępu ćwiczenia tłumaczeniowego.", err);
      }
    }
    setRestored(true);
  }, [storageKey, total]);

  useEffect(() => {
    if (!restored || typeof window === "undefined") return;
    const state = { index, value, status, revealed };
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [index, value, status, revealed, storageKey, restored]);

  const normalize = useCallback((text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9'’\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const acceptableAnswers = useMemo(() => {
    const answers = Array.isArray(question.target) ? question.target : [question.target];
    return answers.map((answer) => normalize(String(answer)));
  }, [question, normalize]);

  const handleCheck = () => {
    if (!value.trim()) return;
    if (acceptableAnswers.includes(normalize(value))) {
      setStatus("correct");
      setRevealed("none");
    } else {
      setStatus("wrong");
    }
  };

  const handleNext = () => {
    if (index + 1 < total) {
      setIndex((prev) => prev + 1);
      setValue("");
      setStatus("idle");
      setRevealed("none");
      requestAnimationFrame(() => textareaRef.current?.focus());
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
    return <p className="text-sm text-gray-500">Brak ćwiczeń tłumaczeniowych dla tej lekcji.</p>;
  }

  const formattedAnswers = Array.isArray(question.target) ? question.target.join(", ") : question.target;

  return (
    <div className="flex flex-col gap-6">
      <ExerciseHeader
        title="Przetłumacz zdanie"
        subtitle="Napisz naturalne tłumaczenie na język angielski."
        progress={progress}
        current={index + 1}
        total={total}
      />

      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-5 text-base font-medium text-emerald-900 shadow-inner md:text-lg">
        {question.source}
      </div>

      <label className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">Twoje tłumaczenie</span>
        <div className="group relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              if (status !== "idle") setStatus("idle");
            }}
            placeholder="Zapisz pełne zdanie po angielsku..."
            className="min-h-[150px] w-full rounded-2xl border border-emerald-100 bg-white px-5 py-3 text-base text-gray-800 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-emerald-100/20 to-teal-100/20 opacity-0 transition group-focus-within:opacity-100" />
        </div>
      </label>

      {status === "correct" && (
        <FeedbackMessage type="correct" message="Świetnie! Twoje tłumaczenie brzmi naturalnie." />
      )}

      {status === "wrong" && revealed === "none" && (
        <FeedbackMessage type="wrong" message="Jeszcze chwila! Sprawdź szyk zdania i użyte słownictwo." />
      )}

      {revealed === "hint" && question.hint && (
        <FeedbackMessage type="hint" message={`Podpowiedź: ${question.hint}`} />
      )}

      {revealed === "answer" && (
        <FeedbackMessage type="hint" message={`Poprawne odpowiedzi: ${formattedAnswers}`} />
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
