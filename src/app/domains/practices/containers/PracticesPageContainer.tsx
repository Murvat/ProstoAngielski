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

type SectionKey = "tasks" | "flashcards" | "vocabulary";

type SectionSummary = {
  total: number;
  attempted: number;
  correct: number;
};

const emptySummary: SectionSummary = { total: 0, attempted: 0, correct: 0 };

const SECTION_META: Record<SectionKey, {
  badge: string;
  title: string;
  description: string;
  badgeClass: string;
  ringClass: string;
  highlightClass: string;
  activeBgClass: string;
  hoverBorderClass: string;
}> = {
  tasks: {
    badge: "Ćwiczenia",
    title: "Ćwiczenia interaktywne",
    description: "Uzupełnianie luk, budowanie zdań i szybkie testy gramatyczne.",
    badgeClass: "text-emerald-600",
    ringClass: "ring-emerald-200",
    highlightClass: "text-emerald-600",
    activeBgClass: "bg-emerald-50/80",
    hoverBorderClass: "hover:border-emerald-300",
  },
  flashcards: {
    badge: "Fiszki",
    title: "Fiszki z podpowiedziami",
    description: "Odkryj odpowiedź, zapisz jako zapamiętane lub dodaj do powtórki.",
    badgeClass: "text-sky-600",
    ringClass: "ring-sky-200",
    highlightClass: "text-sky-600",
    activeBgClass: "bg-sky-50/80",
    hoverBorderClass: "hover:border-sky-300",
  },
  vocabulary: {
    badge: "Słownictwo",
    title: "Zestawy tematyczne",
    description: "Wybierz temat albo tryb mieszany i trenuj tłumaczenia.",
    badgeClass: "text-purple-600",
    ringClass: "ring-purple-200",
    highlightClass: "text-purple-600",
    activeBgClass: "bg-purple-50/80",
    hoverBorderClass: "hover:border-purple-300",
  },
};

const SECTION_ORDER: SectionKey[] = ["tasks", "flashcards", "vocabulary"];

export default function PracticesPageContainer() {
  const { levels, loading, error, defaultLevel } = usePracticeLevels();
  const [selectedLevel, setSelectedLevel] = useState<MobileLevel | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const [summaries, setSummaries] = useState<Record<SectionKey, SectionSummary>>({
    tasks: { ...emptySummary },
    flashcards: { ...emptySummary },
    vocabulary: { ...emptySummary },
  });

  useEffect(() => {
    if (!selectedLevel && defaultLevel) {
      setSelectedLevel(defaultLevel);
    }
  }, [defaultLevel, selectedLevel]);

  useEffect(() => {
    if (!selectedLevel) {
      setActiveSection(null);
      return;
    }
    setActiveSection((prev) => prev ?? "tasks");
  }, [selectedLevel]);

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

  // Render loading state
  if (loading) {
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
                selectedLevel={null}
                onSelect={(level) => setSelectedLevel(level)}
              />
            </header>
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-48 animate-pulse rounded-3xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          </section>
        </main>
      </>
    );
  }

  // Render main content
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

          {selectedLevel && (
            <div className="flex flex-col gap-10">
              <div className="grid gap-6 lg:grid-cols-3">
                {SECTION_ORDER.map((sectionKey) => {
                  const summary = summaries[sectionKey];
                  const meta = SECTION_META[sectionKey];
                  const isActive = activeSection === sectionKey;
                  const accuracy =
                    summary.total > 0
                      ? Math.round((summary.correct / summary.total) * 100)
                      : 0;

                  return (
                    <button
                      key={sectionKey}
                      type="button"
                      onClick={() => setActiveSection(sectionKey)}
                      className={`group flex h-full flex-col gap-4 rounded-3xl border p-6 text-left shadow-sm transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${meta.ringClass} ${
                        isActive
                          ? `border-transparent ${meta.activeBgClass} ring-2 shadow-xl`
                          : `border-slate-200 bg-white/90 hover:-translate-y-1 hover:shadow-md ${meta.hoverBorderClass}`
                      }`}
                    >
                      <span className={`text-xs font-semibold uppercase tracking-[0.24em] ${meta.badgeClass}`}>
                        {meta.badge}
                      </span>
                      <h3 className="text-2xl font-bold text-slate-900">{meta.title}</h3>
                      <p className="text-sm text-slate-600">{meta.description}</p>
                      <dl className="mt-3 grid gap-3 text-xs text-slate-500 sm:grid-cols-3">
                        <div>
                          <dt className="font-semibold uppercase tracking-wide text-slate-400">
                            Razem
                          </dt>
                          <dd className="text-lg font-semibold text-slate-900">{summary.total}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold uppercase tracking-wide text-slate-400">
                            Zaliczono
                          </dt>
                          <dd className="text-lg font-semibold text-slate-900">
                            {summary.correct}/{summary.total || 0}
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold uppercase tracking-wide text-slate-400">
                            Skuteczność
                          </dt>
                          <dd className="text-lg font-semibold text-slate-900">
                            {summary.total ? `${accuracy}%` : "—"}
                          </dd>
                        </div>
                      </dl>
                      <span
                        className={`mt-auto inline-flex items-center gap-2 text-sm font-semibold ${meta.highlightClass}`}
                      >
                        {isActive ? "Wybrana sekcja" : "Otwórz sekcję"}
                        <span aria-hidden>→</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeSection ? (
                <div className="space-y-10">
                  <div hidden={activeSection !== "tasks"} aria-hidden={activeSection !== "tasks"}>
                    <PracticeTasksSection
                      levelId={selectedLevel.id}
                      levelLabel={selectedLevel.level}
                      tasks={selectedLevel.tasks}
                      onSummaryChange={handleTaskSummary}
                    />
                  </div>
                  <div
                    hidden={activeSection !== "flashcards"}
                    aria-hidden={activeSection !== "flashcards"}
                  >
                    <PracticeFlashcardsSection
                      levelId={selectedLevel.id}
                      levelLabel={selectedLevel.level}
                      flashcards={selectedLevel.flashcards}
                      onSummaryChange={handleFlashcardSummary}
                    />
                  </div>
                  <div
                    hidden={activeSection !== "vocabulary"}
                    aria-hidden={activeSection !== "vocabulary"}
                  >
                    <PracticeVocabularySection
                      levelId={selectedLevel.id}
                      levelLabel={selectedLevel.level}
                      vocabulary={selectedLevel.vocabulary}
                      onSummaryChange={handleVocabularySummary}
                    />
                  </div>
                  <PracticeShareBanner
                    levelLabel={selectedLevel.level}
                    tasks={summaries.tasks ?? emptySummary}
                    flashcards={summaries.flashcards ?? emptySummary}
                    vocabulary={summaries.vocabulary ?? emptySummary}
                  />
                </div>
              ) : (
                <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">
                    Wybierz sekcję, aby rozpocząć naukę
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Kliknij jedną z kart powyżej, aby przejść do zadań, fiszek lub słownictwa dla
                    poziomu {selectedLevel.level}.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
