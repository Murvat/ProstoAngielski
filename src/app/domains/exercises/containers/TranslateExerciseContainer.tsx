"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { TranslateItem } from "@/types";
import ExerciseHeader from "../components/ExerciseHeader";
import ExerciseFooter from "../components/ExerciseFooter";
import FeedbackMessage from "../components/FeedbackMessage";

export default function TranslateExerciseContainer({
  items,
  onComplete,
  lessonId,
}: {
  items: TranslateItem[];
  onComplete: () => void;
  lessonId: string;
}) {
  const storageKey = `exercise-progress-${lessonId}-translate`;

  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "wrong" | "correct">("idle");
  const [revealed, setRevealed] = useState<"none" | "hint" | "answer">("none");
  const [restored, setRestored] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const total = items.length;
  const q = items[index];
  const progress = useMemo(
    () => Math.round(((index + 1) / total) * 100),
    [index, total]
  );

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

  const normalize = useCallback((s: string) => {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[“”‘’]/g, '"')
      .replace(/[^a-z0-9'\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const acceptableAnswers = useMemo(() => {
    const arr = Array.isArray(q.target) ? q.target : [q.target];
    return arr.map((a) => normalize(String(a)));
  }, [q, normalize]);

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
      setIndex(index + 1);
      setValue("");
      setStatus("idle");
      setRevealed("none");
      requestAnimationFrame(() => textareaRef.current?.focus());
    } else {
      localStorage.removeItem(storageKey);
      onComplete();
    }
  };

  const handleHintOrAnswer = () => {
    if (revealed === "none") setRevealed("hint");
    else if (revealed === "hint") setRevealed("answer");
  };

  if (!q) return <p>Brak zadań typu „tłumaczenie”.</p>;

  return (
    <div className="flex flex-col gap-4">
      <ExerciseHeader
        title="Przetłumacz zdanie"
        subtitle="Polski → Angielski"
        progress={progress}
        current={index + 1}
        total={total}
      />

      <p className="text-lg bg-gray-100 p-2 rounded font-medium text-gray-800">
        {q.source}
      </p>

      <textarea
        ref={textareaRef}
        className="w-full border border-gray-300 rounded-lg p-2 min-h-[100px] 
        focus:border-green-500 focus:ring-green-500 hover:border-green-400 transition-colors duration-200 cursor-pointer"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          if (status !== "idle") setStatus("idle");
        }}
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
          message={`✅ Poprawne odpowiedzi: ${
            Array.isArray(q.target) ? q.target.join(", ") : q.target
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
        rightLabel={status === "correct" ? "Dalej" : "Sprawdź odpowiedź"}
        onRightClick={status === "correct" ? handleNext : handleCheck}
        rightDisabled={!value.trim() && status !== "correct"}
      />
    </div>
  );
}
