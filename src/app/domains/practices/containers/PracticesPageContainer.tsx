"use client";

import { useCallback, useEffect, useState } from "react";
import NavbarContainer from "@/app/domains/navbar/containers/NavbarContainer";
import PromoBanner from "@/app/domains/layouts/components/PromoBanner";
import PracticeHero from "../components/PracticeHero";
import PracticeLevelSelector from "../components/PracticeLevelSelector";
import PracticeTasksSection from "../components/PracticeTasksSection";
import PracticeFlashcardsSection from "../components/PracticeFlashcardsSection";
import PracticeVocabularySection from "../components/PracticeVocabularySection";
import PracticeShareBanner from "../components/PracticeShareBanner";
import { usePracticeLevels } from "../features/usePracticeLevels";
import type { MobileLevel } from "@/types";

type SectionSummary = {
  total: number;
  attempted: number;
  correct: number;
};

const emptySummary: SectionSummary = { total: 0, attempted: 0, correct: 0 };

export default function PracticesPageContainer() {
  const { levels, loading, error, defaultLevel } = usePracticeLevels();
  const [selectedLevel, setSelectedLevel] = useState<MobileLevel | null>(null);
  const [summaries, setSummaries] = useState<{
    tasks: SectionSummary;
    flashcards: SectionSummary;
    vocabulary: SectionSummary;
  }>({
    tasks: emptySummary,
    flashcards: emptySummary,
    vocabulary: emptySummary,
  });

  useEffect(() => {
    if (!selectedLevel && defaultLevel) {
      setSelectedLevel(defaultLevel);
    }
  }, [defaultLevel, selectedLevel]);

  useEffect(() => {
    if (!selectedLevel) return;
    setSummaries({
      tasks: { ...emptySummary, total: selectedLevel.tasks.length },
      flashcards: { ...emptySummary, total: selectedLevel.flashcards.length },
      vocabulary: {
        ...emptySummary,
        total: Object.values(selectedLevel.vocabulary ?? {}).reduce(
          (acc, items) => acc + (items?.length ?? 0),
          0
        ),
      },
    });
  }, [selectedLevel]);

  const handleTaskSummary = useCallback((summary: SectionSummary) => {
    setSummaries((prev) => ({ ...prev, tasks: summary }));
  }, []);

  const handleFlashcardSummary = useCallback((summary: SectionSummary) => {
    setSummaries((prev) => ({ ...prev, flashcards: summary }));
  }, []);

  const handleVocabularySummary = useCallback((summary: SectionSummary) => {
    setSummaries((prev) => ({ ...prev, vocabulary: summary }));
  }, []);

  return (
    <>
      <NavbarContainer initialUser={null} />
      <PromoBanner />

      <main className="flex flex-col gap-12 bg-slate-50 pb-20">
        <PracticeHero />

        <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6">
          <header className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Wybierz poziom kursu mobilnego
            </h2>
            <p className="text-sm text-gray-500">
              Każdy poziom zawiera pełny pakiet zadań, fiszek i słownictwa. Wyniki zapisują się w pamięci Twojej przeglądarki – możesz wrócić w dowolnym momencie.
            </p>
            <PracticeLevelSelector
              levels={levels}
              loading={loading}
              selectedLevel={selectedLevel?.level ?? null}
              onSelect={(level) => setSelectedLevel(level)}
            />
            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}
          </header>

          {loading && (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-48 animate-pulse rounded-3xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          )}

          {!loading && selectedLevel && (
            <div className="flex flex-col gap-10">
              <PracticeTasksSection
                levelId={selectedLevel.id}
                levelLabel={selectedLevel.level}
                tasks={selectedLevel.tasks}
                onSummaryChange={handleTaskSummary}
              />
              <PracticeFlashcardsSection
                levelId={selectedLevel.id}
                levelLabel={selectedLevel.level}
                flashcards={selectedLevel.flashcards}
                onSummaryChange={handleFlashcardSummary}
              />
              <PracticeVocabularySection
                levelId={selectedLevel.id}
                levelLabel={selectedLevel.level}
                vocabulary={selectedLevel.vocabulary}
                onSummaryChange={handleVocabularySummary}
              />
              <PracticeShareBanner
                levelLabel={selectedLevel.level}
                tasks={summaries.tasks ?? emptySummary}
                flashcards={summaries.flashcards ?? emptySummary}
                vocabulary={summaries.vocabulary ?? emptySummary}
              />
            </div>
          )}
        </section>
      </main>
    </>
  );
}
