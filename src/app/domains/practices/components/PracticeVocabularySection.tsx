"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { seededShuffle } from "@/lib/utils/shuffle";
import type { PracticeVocabularyItem, PracticeVocabularyMap } from "@/types";

const MIXED_TOPIC_KEY = "__mixed__";
const STORAGE_PREFIX = "practice-vocabulary";
const MIXED_LIMIT = 50;

type QuestionDescriptor = {
  key: string;
  topic: string;
  item: PracticeVocabularyItem;
};

type QuestionProgress = {
  selected: string | null;
  isCorrect: boolean;
  attempts: number;
  lastAttempt: string;
};

type VocabularyState = {
  activeTopic: string;
  currentIndex: Record<string, number>;
  answers: Record<string, QuestionProgress>;
  mixedOrder: string[];
};

type VocabularySummary = {
  total: number;
  attempted: number;
  correct: number;
};

type Props = {
  levelId: string;
  levelLabel: string;
  vocabulary: PracticeVocabularyMap;
  onSummaryChange: (summary: VocabularySummary) => void;
};

export default function PracticeVocabularySection({
  levelId,
  levelLabel,
  vocabulary,
  onSummaryChange,
}: Props) {
  const storageKey = `${STORAGE_PREFIX}-${levelId}`;
  const [state, setState] = useState<VocabularyState>({
    activeTopic: "",
    currentIndex: {},
    answers: {},
    mixedOrder: [],
  });
  const [restored, setRestored] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const topicsData = useMemo(() => {
    const entries = Object.entries(vocabulary ?? {});
    return entries.map(([topic, items]): { topic: string; questions: QuestionDescriptor[] } => {
      const questions = (items ?? []).map((item) => ({
        key: `${topic}::${item.id}`,
        topic,
        item,
      }));
      return {
        topic,
        questions: seededShuffle(questions, `${levelId}-${topic}-questions`),
      };
    });
  }, [vocabulary, levelId]);

  const questionMap = useMemo(() => {
    const map: Record<string, QuestionDescriptor> = {};
    topicsData.forEach(({ questions }) => {
      questions.forEach((descriptor) => {
        map[descriptor.key] = descriptor;
      });
    });
    return map;
  }, [topicsData]);

  const optionsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    topicsData.forEach(({ questions }) => {
      questions.forEach((descriptor) => {
        const options = descriptor.item.options ?? [];
        map[descriptor.key] = seededShuffle(
          options,
          `${levelId}-${descriptor.key}-options`
        );
      });
    });
    return map;
  }, [topicsData, levelId]);

  const topicKeys = useMemo(() => topicsData.map((topic) => topic.topic), [topicsData]);

  const allQuestionKeys = useMemo(
    () =>
      topicsData
        .flatMap((topic) => topic.questions)
        .map((descriptor) => descriptor.key),
    [topicsData]
  );

  const ensureMixedOrder = useCallback(
    (previous: string[]) => {
      if (!allQuestionKeys.length) return [];
      const shuffled = seededShuffle(allQuestionKeys, `${levelId}-mixed`);
      const next = shuffled.slice(0, Math.min(MIXED_LIMIT, shuffled.length));
      const unchanged =
        previous.length === next.length &&
        previous.every((value, index) => value === next[index]);
      return unchanged ? previous : next;
    },
    [allQuestionKeys, levelId]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as VocabularyState;
        setState({
          activeTopic: parsed.activeTopic ?? "",
          currentIndex: parsed.currentIndex ?? {},
          answers: parsed.answers ?? {},
          mixedOrder: parsed.mixedOrder ?? [],
        });
      }
    } catch (error) {
      console.error("[Practices] Nie udało się wczytać słownictwa:", error);
    } finally {
      setRestored(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!restored) return;
    setState((prev) => {
      const nextMixed = ensureMixedOrder(prev.mixedOrder);
      const nextActive =
        prev.activeTopic && (prev.activeTopic === MIXED_TOPIC_KEY || topicKeys.includes(prev.activeTopic))
          ? prev.activeTopic
          : topicKeys[0] ?? MIXED_TOPIC_KEY;
      if (
        nextMixed === prev.mixedOrder &&
        nextActive === prev.activeTopic
      ) {
        return prev;
      }
      return {
        ...prev,
        mixedOrder: nextMixed,
        activeTopic: nextActive,
      };
    });
  }, [ensureMixedOrder, restored, topicKeys]);

  useEffect(() => {
    if (!restored) return;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey, restored]);

  const topicQuestions = useMemo(() => {
    const baseTopics = topicsData.reduce<Record<string, string[]>>((acc, topic) => {
      acc[topic.topic] = topic.questions.map((question) => question.key);
      return acc;
    }, {});
    baseTopics[MIXED_TOPIC_KEY] = state.mixedOrder;
    return baseTopics;
  }, [state.mixedOrder, topicsData]);

  const activeTopic = state.activeTopic || topicKeys[0] || MIXED_TOPIC_KEY;
  const activeKeys = useMemo(() => topicQuestions[activeTopic] ?? [], [topicQuestions, activeTopic]);
  const currentIndex = state.currentIndex[activeTopic] ?? 0;
  const currentKey = activeKeys[currentIndex];
  const currentQuestion = currentKey ? questionMap[currentKey] : null;
  const progress = currentKey ? state.answers[currentKey] : undefined;

  const summary = useMemo<VocabularySummary>(() => {
    const attempted = allQuestionKeys.filter((key) => state.answers[key]?.attempts).length;
    const correct = allQuestionKeys.filter((key) => state.answers[key]?.isCorrect).length;
    return {
      total: allQuestionKeys.length,
      attempted,
      correct,
    };
  }, [allQuestionKeys, state.answers]);

  useEffect(() => {
    onSummaryChange(summary);
  }, [summary, onSummaryChange]);

  const topicSummary = useMemo(() => {
    const keys = activeKeys;
    const attempted = keys.filter((key) => state.answers[key]?.attempts).length;
    const correct = keys.filter((key) => state.answers[key]?.isCorrect).length;
    return { attempted, correct, total: keys.length };
  }, [activeKeys, state.answers]);

  const handleTopicChange = (topic: string) => {
    setShowHint(false);
    setState((prev) => {
      if (prev.activeTopic === topic) return prev;
      return {
        ...prev,
        activeTopic: topic,
      };
    });
  };

  const handleAnswer = (option: string) => {
    if (!currentQuestion) return;
    setShowHint(false);
    setState((prev) => {
      const existing = prev.answers[currentKey] ?? {
        selected: null,
        isCorrect: false,
        attempts: 0,
        lastAttempt: "",
      };
      const isCorrect = option === currentQuestion.item.correct_answer;
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentKey]: {
            selected: option,
            isCorrect,
            attempts: existing.attempts + 1,
            lastAttempt: new Date().toISOString(),
          },
        },
      };
    });
  };

  const handleMove = (direction: "next" | "prev") => {
    if (!activeKeys.length) return;
    setShowHint(false);
    setState((prev) => {
      const current = prev.currentIndex[activeTopic] ?? 0;
      const length = activeKeys.length;
      const nextIndex =
        direction === "next" ? (current + 1) % length : (current - 1 + length) % length;
      return {
        ...prev,
        currentIndex: {
          ...prev.currentIndex,
          [activeTopic]: nextIndex,
        },
      };
    });
  };

  const handleReset = () => {
    setShowHint(false);
    setState({
      activeTopic: topicKeys[0] ?? MIXED_TOPIC_KEY,
      currentIndex: {},
      answers: {},
      mixedOrder: ensureMixedOrder([]),
    });
    localStorage.removeItem(storageKey);
  };

  if (!topicsData.length) {
    return (
      <section className="rounded-3xl border border-purple-100 bg-white p-8 shadow-sm">
        <header className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">Słownictwo</h2>
          <p className="text-sm text-gray-500">
            Brak zestawów słownictwa dla poziomu {levelLabel}.
          </p>
        </header>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-purple-100 bg-white p-8 shadow-sm">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Słownictwo – poziom {levelLabel}
          </h2>
          <p className="text-sm text-gray-500">
            Trafione odpowiedzi: {summary.correct}/{summary.total} • Obecny zestaw:{" "}
            {topicSummary.correct}/{topicSummary.total}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50"
        >
          Wyczyść postęp
        </button>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        {topicKeys.map((topic) => {
          const base =
            "rounded-full border px-4 py-2 text-xs font-semibold transition";
          const variant =
            activeTopic === topic
              ? "border-purple-500 bg-purple-500 text-white shadow-lg"
              : "border-purple-200 bg-white text-purple-600 hover:border-purple-400 hover:text-purple-700";
          return (
            <button key={topic} onClick={() => handleTopicChange(topic)} className={`${base} ${variant}`}>
              {topic}
            </button>
          );
        })}
        <button
          onClick={() => handleTopicChange(MIXED_TOPIC_KEY)}
          className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
            activeTopic === MIXED_TOPIC_KEY
              ? "border-purple-500 bg-purple-500 text-white shadow-lg"
              : "border-purple-200 bg-white text-purple-600 hover:border-purple-400 hover:text-purple-700"
          }`}
        >
          Mieszany (50 pytań)
        </button>
      </div>

      {currentQuestion ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5">
            <p className="text-xs uppercase tracking-wide text-purple-500">
              Wybierz poprawne tłumaczenie
            </p>
            <h3 className="mt-2 text-2xl font-bold text-gray-900">
              {currentQuestion.item.word}
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(optionsMap[currentKey] ?? currentQuestion.item.options).map((option) => {
              const isSelected = progress?.selected === option;
              const isCorrectOption = option === currentQuestion.item.correct_answer;
              const wasChosen = isSelected && progress;
              const isCorrect = wasChosen && progress?.isCorrect;
              const isWrong = wasChosen && !progress?.isCorrect;
              const base =
                "rounded-2xl border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2";
              let variant =
                "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50 focus:ring-purple-200";
              if (isCorrect) {
                variant = "border-emerald-400 bg-emerald-50 text-emerald-700 focus:ring-emerald-200";
              } else if (isWrong) {
                variant = "border-orange-300 bg-orange-50 text-orange-700 focus:ring-orange-200";
              }
              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`${base} ${variant}`}
                >
                  {option}
                  {isCorrectOption && progress?.isCorrect && (
                    <span className="ml-2 text-xs font-semibold text-emerald-600">
                      ✔
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentQuestion.item.hint && !showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="rounded-full border border-purple-200 px-4 py-2 text-xs font-semibold text-purple-600 transition hover:border-purple-400 hover:bg-purple-50"
              >
                Podpowiedź
              </button>
            )}
            {showHint && currentQuestion.item.hint && (
              <p className="rounded-2xl bg-purple-50 px-4 py-3 text-sm text-purple-700">
                {currentQuestion.item.hint}
              </p>
            )}
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => handleMove("prev")}
                className="rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={activeKeys.length <= 1}
              >
                Poprzednie
              </button>
              <button
                onClick={() => handleMove("next")}
                className="rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={activeKeys.length <= 1}
              >
                Następne
              </button>
            </div>
          </div>

          {progress?.isCorrect ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Świetnie! To poprawne tłumaczenie.
            </div>
          ) : progress?.selected ? (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
              To nie jest poprawna odpowiedź. Spróbuj jeszcze raz!
            </div>
          ) : null}

          {topicSummary.correct === topicSummary.total && topicSummary.total > 0 && (
            <div className="rounded-3xl border border-purple-200 bg-purple-50 px-5 py-4 text-sm text-purple-700">
              Wszystkie odpowiedzi w zestawie {renderTopicLabel(activeTopic)} są poprawne. Możesz przejść do kolejnego tematu lub udostępnić wynik znajomym.
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500">
          Brak pytań w wybranym zestawie. Wybierz inny temat.
        </p>
      )}
    </section>
  );
}

function renderTopicLabel(topic: string) {
  if (topic === MIXED_TOPIC_KEY) return "Mieszany (50 pytań)";
  return topic;
}
