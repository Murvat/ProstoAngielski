"use client";

import { useEffect, useMemo, useState } from "react";
import type { PracticeFlashcard } from "@/types";

type FlashcardProgressEntry = {
  status: "mastered" | "repeat";
  timesSeen: number;
  lastSeen: string;
};

type FlashcardState = {
  currentIndex: number;
  revealed: boolean;
  progress: Record<number, FlashcardProgressEntry>;
};

type FlashcardSummary = {
  total: number;
  attempted: number;
  correct: number;
};

type Props = {
  levelId: string;
  levelLabel: string;
  flashcards: PracticeFlashcard[];
  onSummaryChange: (summary: FlashcardSummary) => void;
};

const STORAGE_PREFIX = "practice-flashcards";

export default function PracticeFlashcardsSection({
  levelId,
  levelLabel,
  flashcards,
  onSummaryChange,
}: Props) {
  const storageKey = `${STORAGE_PREFIX}-${levelId}`;
  const [state, setState] = useState<FlashcardState>({
    currentIndex: 0,
    revealed: false,
    progress: {},
  });
  const [restored, setRestored] = useState(false);

  const total = flashcards.length;
  const card = flashcards[state.currentIndex];

  const summary = useMemo<FlashcardSummary>(() => {
    const attempted = Object.keys(state.progress).length;
    const mastered = Object.values(state.progress).filter(
      (entry) => entry.status === "mastered"
    ).length;
    return { total, attempted, correct: mastered };
  }, [state.progress, total]);

  useEffect(() => {
    onSummaryChange(summary);
  }, [summary, onSummaryChange]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as FlashcardState;
        const validIndex =
          typeof parsed.currentIndex === "number" && parsed.currentIndex < total
            ? parsed.currentIndex
            : 0;
        setState({
          currentIndex: validIndex,
          revealed: Boolean(parsed.revealed),
          progress: parsed.progress ?? {},
        });
      }
    } catch (error) {
      console.error("[Practices] Nie udało się odtworzyć fiszek:", error);
    } finally {
      setRestored(true);
    }
  }, [storageKey, total]);

  useEffect(() => {
    if (!restored) return;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey, restored]);

  const handleReveal = () => {
    setState((prev) => ({ ...prev, revealed: true }));
  };

  const handleMark = (status: FlashcardProgressEntry["status"]) => {
    if (!card) return;
    setState((prev) => {
      const existing = prev.progress[card.id];
      const timesSeen = existing ? existing.timesSeen + 1 : 1;
      return {
        currentIndex:
          prev.currentIndex + 1 < total ? prev.currentIndex + 1 : 0,
        revealed: false,
        progress: {
          ...prev.progress,
          [card.id]: {
            status,
            timesSeen,
            lastSeen: new Date().toISOString(),
          },
        },
      };
    });
  };

  const handleMove = (direction: "next" | "prev") => {
    setState((prev) => {
      const newIndex =
        direction === "next"
          ? (prev.currentIndex + 1) % Math.max(total, 1)
          : (prev.currentIndex - 1 + Math.max(total, 1)) % Math.max(total, 1);
      const nextCard = flashcards[newIndex];
      const wasRevealed = nextCard ? Boolean(prev.progress[nextCard.id]) : false;
      return {
        ...prev,
        currentIndex: newIndex,
        revealed: wasRevealed,
      };
    });
  };

  const handleReset = () => {
    setState({ currentIndex: 0, revealed: false, progress: {} });
    localStorage.removeItem(storageKey);
  };

  if (!card) {
    return (
      <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
        <header className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Fiszki</h2>
          <p className="text-sm text-gray-500">
            Brak fiszek dla poziomu {levelLabel}. Skontaktuj się z zespołem.
          </p>
        </header>
      </section>
    );
  }

  const progressEntry = state.progress[card.id];

  return (
    <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Fiszki – poziom {levelLabel}
          </h2>
          <p className="text-sm text-gray-500">
            Karta {state.currentIndex + 1} z {total} • Zapamiętane: {summary.correct}/
            {total}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50"
        >
          Wyczyść postęp
        </button>
      </header>

      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6 shadow-inner transition">
          <p className="text-sm uppercase tracking-wide text-blue-500">
            Hasło po polsku
          </p>
          <h3 className="mt-2 text-2xl font-bold text-gray-900">{card.question}</h3>

          {!state.revealed ? (
            <button
              onClick={handleReveal}
              className="mt-6 w-full rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-600 sm:w-auto"
            >
              Pokaż odpowiedź
            </button>
          ) : (
            <div className="mt-6 space-y-3 rounded-2xl bg-white/80 p-5">
              <p className="text-sm uppercase tracking-wide text-emerald-500">
                Tłumaczenie
              </p>
              <p className="text-xl font-semibold text-gray-800">{card.correct_answer}</p>
              {card.example_sentence && (
                <p className="rounded-2xl bg-emerald-50/70 p-3 text-sm text-emerald-700">
                  {card.example_sentence}
                </p>
              )}
              {card.hint && (
                <p className="text-xs text-gray-500">Wskazówka: {card.hint}</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleMark("mastered")}
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
            disabled={!state.revealed}
          >
            Zapamiętane
          </button>
          <button
            onClick={() => handleMark("repeat")}
            className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!state.revealed}
          >
            Do powtórki
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => handleMove("prev")}
              className="rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={total <= 1}
            >
              Poprzednia karta
            </button>
            <button
              onClick={() => handleMove("next")}
              className="rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={total <= 1}
            >
              Następna karta
            </button>
          </div>
        </div>

        {progressEntry && (
          <p className="rounded-2xl bg-blue-50 px-4 py-3 text-xs text-blue-600">
            Ten wyraz został oznaczony jako{" "}
            <span className="font-semibold">
              {progressEntry.status === "mastered" ? "zapamiętany" : "do powtórki"}
            </span>{" "}
            ({progressEntry.timesSeen} raz/y).
          </p>
        )}

        {summary.correct === total && total > 0 && (
          <div className="rounded-3xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm text-blue-700">
            Wszystkie fiszki na poziomie {levelLabel} oznaczone jako zapamiętane! Świetna robota.
          </div>
        )}
      </div>
    </section>
  );
}
