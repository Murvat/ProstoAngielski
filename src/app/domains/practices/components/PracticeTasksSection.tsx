"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { seededShuffle } from "@/lib/utils/shuffle";
import type {
  PracticeTask,
  MultipleChoicePracticeTask,
  SentenceBuilderPracticeTask,
} from "@/types";

type StoredAnswer = {
  value: string | string[];
  isCorrect: boolean;
  attempts: number;
  updatedAt: string;
  kind: "text" | "choice" | "builder";
};

type TaskState = {
  currentIndex: number;
  answers: Record<string, StoredAnswer>;
  activeType: PracticeTask["type"] | "all";
};

type TaskSummary = {
  total: number;
  attempted: number;
  correct: number;
};

type Props = {
  levelId: string;
  levelLabel: string;
  tasks: PracticeTask[];
  onSummaryChange: (summary: TaskSummary) => void;
};

const STORAGE_PREFIX = "practice-tasks";
const TASK_DISPLAY_ORDER: PracticeTask["type"][] = [
  "fill_in_blank",
  "multiple_choice",
  "error_correction",
  "sentence_builder",
  "cloze_test",
];

const mapTaskTypeLabel = (type: PracticeTask["type"]) => {
  switch (type) {
    case "fill_in_blank":
      return "Fill in blank";
    case "multiple_choice":
      return "Multiple choice";
    case "error_correction":
      return "Error correction";
    case "sentence_builder":
      return "Sentence builder";
    case "cloze_test":
      return "Cloze test";
    default:
      return type;
  }
};

const createTaskKey = (task: PracticeTask) => `${task.type}-${task.id}`;

export default function PracticeTasksSection({
  levelId,
  levelLabel,
  tasks,
  onSummaryChange,
}: Props) {
  const storageKey = `${STORAGE_PREFIX}-${levelId}`;

  const [state, setState] = useState<TaskState>({
    currentIndex: 0,
    answers: {},
    activeType: "all",
  });
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [hintVisible, setHintVisible] = useState(false);
  const [answerVisible, setAnswerVisible] = useState(false);
  const [restored, setRestored] = useState(false);

  const orderedKeys = useMemo(() => {
    const keys = tasks.map(createTaskKey);
    return seededShuffle(keys, `${levelId}-tasks-order`);
  }, [tasks, levelId]);

  const taskMap = useMemo(() => {
    const map = new Map<string, PracticeTask>();
    tasks.forEach((task) => map.set(createTaskKey(task), task));
    return map;
  }, [tasks]);

  const orderedTasks = useMemo(
    () => orderedKeys.map((key) => taskMap.get(key)).filter(Boolean) as PracticeTask[],
    [orderedKeys, taskMap]
  );

  const typeSet = useMemo(() => {
    const set = new Set<PracticeTask["type"]>();
    orderedTasks.forEach((task) => set.add(task.type));
    return set;
  }, [orderedTasks]);

  const filterOptions = useMemo(() => {
    const ordered = TASK_DISPLAY_ORDER.filter((type) => typeSet.has(type));
    const extras = Array.from(typeSet).filter((type) => !TASK_DISPLAY_ORDER.includes(type));
    return ["all", ...ordered, ...extras] as Array<PracticeTask["type"] | "all">;
  }, [typeSet]);

  const multipleChoiceOptions = useMemo(() => {
    const map: Record<string, string[]> = {};
    orderedTasks.forEach((task) => {
      if (task.type === "multiple_choice") {
        map[createTaskKey(task)] = seededShuffle(
          (task as MultipleChoicePracticeTask).options ?? [],
          `${levelId}-${createTaskKey(task)}-options`
        );
      }
    });
    return map;
  }, [orderedTasks, levelId]);

  const sentenceBuilderWords = useMemo(() => {
    const map: Record<string, string[]> = {};
    orderedTasks.forEach((task) => {
      if (task.type === "sentence_builder") {
        map[createTaskKey(task)] = seededShuffle(
          (task as SentenceBuilderPracticeTask).words ?? [],
          `${levelId}-${createTaskKey(task)}-words`
        );
      }
    });
    return map;
  }, [orderedTasks, levelId]);

  const filteredTasks = useMemo(() => {
    if (state.activeType === "all") return orderedTasks;
    return orderedTasks.filter((task) => task.type === state.activeType);
  }, [orderedTasks, state.activeType]);

  const safeIndex =
    filteredTasks.length > 0
      ? Math.min(state.currentIndex, filteredTasks.length - 1)
      : 0;
  const currentTask = filteredTasks[safeIndex] ?? null;
  const currentKey = currentTask ? createTaskKey(currentTask) : null;
  const totalTasks = orderedTasks.length;

  const normalizeText = useCallback((value: string) => {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9'\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const summary = useMemo<TaskSummary>(() => {
    const attempts = new Map<string, StoredAnswer>();
    orderedTasks.forEach((task) => {
      const key = createTaskKey(task);
      const stored = state.answers[key] ?? state.answers[String(task.id)];
      if (stored) attempts.set(key, stored);
    });
    let correct = 0;
    attempts.forEach((entry) => {
      if (entry.isCorrect) correct += 1;
    });
    return { total: totalTasks, attempted: attempts.size, correct };
  }, [orderedTasks, state.answers, totalTasks]);

  const categorySummary = useMemo<TaskSummary>(() => {
    const attempts = new Map<string, StoredAnswer>();
    filteredTasks.forEach((task) => {
      const key = createTaskKey(task);
      const stored = state.answers[key] ?? state.answers[String(task.id)];
      if (stored) attempts.set(key, stored);
    });
    let correct = 0;
    attempts.forEach((entry) => {
      if (entry.isCorrect) correct += 1;
    });
    return { total: filteredTasks.length, attempted: attempts.size, correct };
  }, [filteredTasks, state.answers]);

  useEffect(() => {
    onSummaryChange(summary);
  }, [summary, onSummaryChange]);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (!raw) {
        setRestored(true);
        return;
      }
      const parsed = JSON.parse(raw) as Partial<TaskState> | null;
      if (!parsed) {
        setRestored(true);
        return;
      }
      const answers =
        parsed.answers && typeof parsed.answers === "object"
          ? (parsed.answers as Record<string, StoredAnswer>)
          : {};
      setState({
        currentIndex:
          typeof parsed.currentIndex === "number" && parsed.currentIndex >= 0
            ? parsed.currentIndex
            : 0,
        answers,
        activeType:
          parsed.activeType && parsed.activeType !== "all"
            ? (parsed.activeType as PracticeTask["type"])
            : "all",
      });
    } catch (error) {
      console.error("[Practices] Nie udało się przywrócić postępu zadań:", error);
    } finally {
      setRestored(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!restored) return;
    const payload: TaskState = {
      currentIndex: safeIndex,
      answers: state.answers,
      activeType: state.activeType,
    };
    localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [state.answers, state.activeType, safeIndex, storageKey, restored]);

  useEffect(() => {
    if (state.currentIndex !== safeIndex) {
      setState((prev) => ({ ...prev, currentIndex: safeIndex }));
    }
  }, [safeIndex, state.currentIndex]);

  useEffect(() => {
    if (state.activeType !== "all" && !typeSet.has(state.activeType)) {
      setState((prev) => ({ ...prev, activeType: "all", currentIndex: 0 }));
    }
  }, [state.activeType, typeSet]);

  const resetInputsForTask = useCallback(
    (task: PracticeTask | null) => {
      if (!task) {
        setInputValue("");
        setSelectedOption("");
        setSelectedWords([]);
        setStatus("idle");
        setHintVisible(false);
        setAnswerVisible(false);
        return;
      }
      const key = createTaskKey(task);
      const stored =
        state.answers[key] ?? state.answers[String(task.id)] ?? null;

      if (stored) {
        if (stored.kind === "text" && typeof stored.value === "string") {
          setInputValue(stored.value);
        } else if (stored.kind === "choice" && typeof stored.value === "string") {
          setSelectedOption(stored.value);
        } else if (stored.kind === "builder" && Array.isArray(stored.value)) {
          setSelectedWords(stored.value);
        }
        setStatus(stored.isCorrect ? "correct" : "idle");
      } else {
        setInputValue("");
        setSelectedOption("");
        setSelectedWords([]);
        setStatus("idle");
      }
      setHintVisible(false);
      setAnswerVisible(false);
    },
    [state.answers]
  );

  useEffect(() => {
    resetInputsForTask(currentTask);
  }, [currentTask, resetInputsForTask]);

  const currentOptions =
    currentKey && currentTask?.type === "multiple_choice"
      ? multipleChoiceOptions[currentKey] ?? (currentTask as MultipleChoicePracticeTask).options
      : undefined;

  const currentSentenceWords =
    currentKey && currentTask?.type === "sentence_builder"
      ? sentenceBuilderWords[currentKey] ??
        (currentTask as SentenceBuilderPracticeTask).words
      : undefined;

  const acceptableAnswers = useMemo(() => {
    if (!currentTask) return [];
    return currentTask.answers.map((answer) => normalizeText(String(answer)));
  }, [currentTask, normalizeText]);

  const currentInputSnapshot = useMemo(() => {
    if (!currentTask) return "";
    if (currentTask.type === "multiple_choice") return selectedOption;
    if (currentTask.type === "sentence_builder") return selectedWords.join(" ");
    return inputValue;
  }, [currentTask, inputValue, selectedOption, selectedWords]);

  const setActiveType = (type: PracticeTask["type"] | "all") => {
    setState((prev) => ({ ...prev, activeType: type, currentIndex: 0 }));
  };

  const handleTypeChange = (type: PracticeTask["type"] | "all") => {
    setActiveType(type);
    setInputValue("");
    setSelectedOption("");
    setSelectedWords([]);
    setStatus("idle");
    setHintVisible(false);
    setAnswerVisible(false);
  };

  const handleReset = () => {
    setState({ currentIndex: 0, answers: {}, activeType: "all" });
    setInputValue("");
    setSelectedOption("");
    setSelectedWords([]);
    setStatus("idle");
    setHintVisible(false);
    setAnswerVisible(false);
    localStorage.removeItem(storageKey);
  };

  const handleSentenceWordToggle = (word: string) => {
    setSelectedWords((prev) => {
      if (!prev.includes(word)) return [...prev, word];
      const next = [...prev];
      const lastIndex = next.lastIndexOf(word);
      if (lastIndex >= 0) next.splice(lastIndex, 1);
      return next;
    });
    if (status !== "idle") setStatus("idle");
  };

  const handleUndoLastWord = () => {
    setSelectedWords((prev) => prev.slice(0, -1));
    if (status !== "idle") setStatus("idle");
  };

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    if (status !== "idle") setStatus("idle");
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    if (status !== "idle") setStatus("idle");
  };

  const goToIndex = (index: number) => {
    if (filteredTasks.length === 0) return;
    const nextIndex = Math.max(0, Math.min(index, filteredTasks.length - 1));
    setState((prev) => ({ ...prev, currentIndex: nextIndex }));
  };

  const handleNext = () => {
    if (filteredTasks.length === 0) return;
    if (safeIndex + 1 < filteredTasks.length) {
      goToIndex(safeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (filteredTasks.length === 0) return;
    if (safeIndex - 1 >= 0) {
      goToIndex(safeIndex - 1);
    }
  };

  const handleCheck = () => {
    if (!currentTask) return;
    if (!currentInputSnapshot.trim()) return;

    const normalized = normalizeText(currentInputSnapshot);
    const isCorrect = acceptableAnswers.includes(normalized);
    setStatus(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
      setHintVisible(false);
    } else if (currentTask.hint) {
      setHintVisible(true);
    }

    const kind: StoredAnswer["kind"] =
      currentTask.type === "multiple_choice"
        ? "choice"
        : currentTask.type === "sentence_builder"
        ? "builder"
        : "text";

    if (!currentKey) return;

    setState((prev) => {
      const fallback = prev.answers[String(currentTask.id)];
      const existing = prev.answers[currentKey] ?? fallback;
      const attempts = existing ? existing.attempts + 1 : 1;
      const nextAnswers: Record<string, StoredAnswer> = {
        ...prev.answers,
        [currentKey]: {
          value:
            kind === "builder"
              ? [...selectedWords]
              : kind === "choice"
              ? selectedOption
              : inputValue,
          isCorrect,
          attempts,
          updatedAt: new Date().toISOString(),
          kind,
        },
      };
      if (fallback && currentKey !== String(currentTask.id)) {
        delete nextAnswers[String(currentTask.id)];
      }
      return { ...prev, answers: nextAnswers };
    });
  };

  const currentStored =
    currentKey && currentTask
      ? state.answers[currentKey] ?? state.answers[String(currentTask.id)]
      : undefined;

  if (!tasks.length) {
    return (
      <section className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900">Ćwiczenia</h2>
        <p className="text-sm text-gray-500 mt-2">
          Brak zadań do wyświetlenia dla poziomu {levelLabel}.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-8 shadow-sm">
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Ćwiczenia gramatyczne – poziom {levelLabel}
          </h2>
          <p className="text-sm text-gray-500">
            Zadanie {filteredTasks.length ? safeIndex + 1 : 0} z {filteredTasks.length} • Próby:{" "}
            {currentStored?.attempts ?? 0} • Trafienia (kategoria): {categorySummary.correct}/{categorySummary.total} • Łącznie:{" "}
            {summary.correct}/{summary.total}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50"
        >
          Wyczyść postęp
        </button>
      </header>

      <div className="mb-6 flex flex-wrap gap-2">
        {filterOptions.map((type) => {
          const isActive = state.activeType === type;
          const label =
            type === "all" ? "Wszystkie zadania" : mapTaskTypeLabel(type as PracticeTask["type"]);
          return (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                isActive
                  ? "border-emerald-500 bg-emerald-500 text-white shadow-lg"
                  : "border-emerald-200 bg-white text-emerald-600 hover:border-emerald-400 hover:text-emerald-700"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {!currentTask ? (
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-6 text-sm text-emerald-700">
          Brak zadań w wybranej kategorii. Wybierz inny typ, aby kontynuować.
        </div>
      ) : (
        <article className="space-y-6">
          <div>
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {mapTaskTypeLabel(currentTask.type)}
            </span>
            <p className="mt-4 text-lg font-medium text-gray-900">{currentTask.question}</p>
          </div>

          {renderTaskInput(currentTask, {
            inputValue,
            setInputValue: handleInputChange,
            selectedOption,
            setSelectedOption: handleOptionSelect,
            selectedWords,
            onToggleWord: handleSentenceWordToggle,
            onUndoLastWord: handleUndoLastWord,
            status,
            optionsOverride: currentOptions,
            sentenceWords: currentSentenceWords,
          })}

          <div className="flex flex-wrap items-center gap-4">
            {currentTask.hint && !hintVisible && (
              <button
                onClick={() => setHintVisible(true)}
                className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50"
              >
                Pokaż podpowiedź
              </button>
            )}
            {hintVisible && currentTask.hint && (
              <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Podpowiedź: {currentTask.hint}
              </p>
            )}
          </div>

          {status === "wrong" && (
            <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700">
              Niepoprawnie, sprobuj ponownie.
              {currentTask.errors?.length ? (
                <span className="ml-1 font-medium">
                  Najczestsze bledy: {currentTask.errors.join(", ")}.
                </span>
              ) : null}
              {currentTask.hint ? (
                <span className="mt-2 block text-orange-600/80">
                  Podpowiedz zostala wyswietlona powyzej - wykorzystaj ja, aby poprawic odpowiedz.
                </span>
              ) : null}
            </div>
          )}

          {status === "correct" && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Świetnie! Zadanie rozwiązane poprawnie.
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCheck}
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
              disabled={!currentInputSnapshot.trim()}
            >
              Sprawdź odpowiedź
            </button>
            <button
              onClick={() => setAnswerVisible((prev) => !prev)}
              className="rounded-full border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-600 transition hover:border-emerald-400 hover:bg-emerald-50"
            >
              {answerVisible ? "Ukryj rozwiązanie" : "Wyjaśnienie"}
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={safeIndex === 0}
              >
                Poprzednie
              </button>
              <button
                onClick={handleNext}
                className="rounded-full border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={safeIndex >= filteredTasks.length - 1}
              >
                Następne
              </button>
            </div>
          </div>

          {answerVisible && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
              <p className="font-semibold">Prawidłowe odpowiedzi:</p>
              <ul className="mt-2 list-disc pl-5">
                {currentTask.answers.map((answer, idx) => (
                  <li key={idx}>{answer}</li>
                ))}
              </ul>
              {currentTask.answer_key && (
                <p className="mt-3 text-xs text-emerald-700">{currentTask.answer_key}</p>
              )}
            </div>
          )}

          {summary.correct === totalTasks && totalTasks > 0 && (
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              Gratulacje! Wszystkie zadania na poziomie {levelLabel} zostały zaliczone. Udostępnij wynik i pochwal się znajomym.
            </div>
          )}
        </article>
      )}
    </section>
  );
}

type RenderInputParams = {
  inputValue: string;
  setInputValue: (value: string) => void;
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  selectedWords: string[];
  onToggleWord: (word: string) => void;
  onUndoLastWord: () => void;
  status: "idle" | "correct" | "wrong";
  optionsOverride?: string[];
  sentenceWords?: string[];
};

function renderTaskInput(task: PracticeTask, params: RenderInputParams) {
  switch (task.type) {
    case "multiple_choice":
      return renderMultipleChoice(task as MultipleChoicePracticeTask, params);
    case "sentence_builder":
      return renderSentenceBuilder(task as SentenceBuilderPracticeTask, params);
    default:
      return renderTextInput(task, params);
  }
}

function renderTextInput(
  task: PracticeTask,
  { inputValue, setInputValue, status }: RenderInputParams
) {
  const base =
    "w-full rounded-2xl border px-4 py-3 text-base transition focus:outline-none focus:ring-2";
  const variant =
    status === "wrong"
      ? "border-orange-300 focus:border-orange-500 focus:ring-orange-200"
      : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-100";

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Wpisz odpowiedź..."
        className={`${base} ${variant}`}
      />
      <p className="text-xs text-gray-400">
        Wskazówka: wielkość liter nie ma znaczenia. Liczy się poprawna forma.
      </p>
    </div>
  );
}

function renderMultipleChoice(
  task: MultipleChoicePracticeTask,
  { selectedOption, setSelectedOption, optionsOverride }: RenderInputParams
) {
  const options = optionsOverride ?? task.options ?? [];
  const base =
    "rounded-2xl border px-4 py-3 text-left text-sm transition focus:outline-none focus:ring-2";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const isSelected = selectedOption === option;
        const variant = isSelected
          ? "border-emerald-500 bg-emerald-50 text-emerald-700 focus:ring-emerald-200"
          : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 focus:ring-emerald-200";
        return (
          <button
            key={option}
            type="button"
            onClick={() => setSelectedOption(option)}
            className={`${base} ${variant}`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function renderSentenceBuilder(
  task: SentenceBuilderPracticeTask,
  { selectedWords, onToggleWord, onUndoLastWord, sentenceWords }: RenderInputParams
) {
  const words = sentenceWords ?? task.words ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {words.map((word, index) => {
          const active = selectedWords.includes(word);
          const variant = active
            ? "border-emerald-400 bg-emerald-50 text-emerald-700"
            : "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50";
          return (
            <button
              key={`${word}-${index}`}
              onClick={() => onToggleWord(word)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${variant}`}
            >
              {word}
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-700">
        {selectedWords.length > 0 ? selectedWords.join(" ") : "Klikaj w słowa, aby zbudować zdanie."}
      </div>
      {selectedWords.length > 0 && (
        <button
          onClick={onUndoLastWord}
          className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
        >
          Cofnij ostatnie słowo
        </button>
      )}
    </div>
  );
}
