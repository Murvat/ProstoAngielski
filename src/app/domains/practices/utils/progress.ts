import type {
  MobileLevel,
  PracticeFlashcard,
  PracticeTask,
  PracticeVocabularyMap,
} from "@/types";
import type { PracticeSectionKey } from "../constants";

export type SectionSummary = {
  total: number;
  attempted: number;
  correct: number;
};

export const emptySummary: SectionSummary = { total: 0, attempted: 0, correct: 0 };

const STORAGE_PREFIX = {
  tasks: "practice-tasks",
  flashcards: "practice-flashcards",
  vocabulary: "practice-vocabulary",
} satisfies Record<PracticeSectionKey, string>;

function readFromStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn("[Practices] Failed to parse stored progress for", key, error);
    return null;
  }
}

export function calculateTasksSummary(levelId: string, tasks: PracticeTask[]): SectionSummary {
  const total = tasks.length;
  if (typeof window === "undefined") {
    return { total, attempted: 0, correct: 0 };
  }

  type StoredAnswer = {
    isCorrect?: boolean;
  };
  type TaskState = {
    answers?: Record<string, StoredAnswer>;
  };

  const stored = readFromStorage<TaskState>(`${STORAGE_PREFIX.tasks}-${levelId}`);
  const answers = stored?.answers ?? {};
  const entries = Object.values(answers);
  const attempted = entries.length;
  const correct = entries.filter((entry) => entry?.isCorrect).length;

  return { total, attempted, correct };
}

export function calculateFlashcardsSummary(
  levelId: string,
  flashcards: PracticeFlashcard[]
): SectionSummary {
  const total = flashcards.length;
  if (typeof window === "undefined") {
    return { total, attempted: 0, correct: 0 };
  }

  type ProgressEntry = {
    status?: "mastered" | "repeat";
  };
  type FlashcardState = {
    progress?: Record<number, ProgressEntry>;
  };

  const stored = readFromStorage<FlashcardState>(`${STORAGE_PREFIX.flashcards}-${levelId}`);
  const progress = stored?.progress ?? {};
  const entries = Object.values(progress);
  const attempted = entries.length;
  const correct = entries.filter((entry) => entry?.status === "mastered").length;

  return { total, attempted, correct };
}

export function calculateVocabularySummary(
  levelId: string,
  vocabulary: PracticeVocabularyMap | undefined
): SectionSummary {
  const total = Object.values(vocabulary ?? {}).reduce(
    (acc, items) => acc + (items?.length ?? 0),
    0
  );

  if (typeof window === "undefined") {
    return { total, attempted: 0, correct: 0 };
  }

  type QuestionProgress = {
    isCorrect?: boolean;
  };
  type VocabularyState = {
    answers?: Record<string, QuestionProgress>;
  };

  const stored = readFromStorage<VocabularyState>(`${STORAGE_PREFIX.vocabulary}-${levelId}`);
  const answers = stored?.answers ?? {};
  const entries = Object.values(answers);
  const attempted = entries.length;
  const correct = entries.filter((entry) => entry?.isCorrect).length;

  return { total, attempted, correct };
}

export function buildInitialSummaries(
  level: MobileLevel | null
): Record<PracticeSectionKey, SectionSummary> {
  if (!level) {
    return {
      tasks: { ...emptySummary },
      flashcards: { ...emptySummary },
      vocabulary: { ...emptySummary },
    };
  }

  return {
    tasks: { total: level.tasks.length, attempted: 0, correct: 0 },
    flashcards: { total: level.flashcards.length, attempted: 0, correct: 0 },
    vocabulary: {
      total: Object.values(level.vocabulary ?? {}).reduce(
        (acc, items) => acc + (items?.length ?? 0),
        0
      ),
      attempted: 0,
      correct: 0,
    },
  };
}

export function calculateAllSummaries(
  level: MobileLevel | null
): Record<PracticeSectionKey, SectionSummary> {
  if (!level) {
    return {
      tasks: { ...emptySummary },
      flashcards: { ...emptySummary },
      vocabulary: { ...emptySummary },
    };
  }

  return {
    tasks: calculateTasksSummary(level.id, level.tasks),
    flashcards: calculateFlashcardsSummary(level.id, level.flashcards),
    vocabulary: calculateVocabularySummary(level.id, level.vocabulary),
  };
}
